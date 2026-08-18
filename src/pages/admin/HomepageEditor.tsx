import React from "react";
import { useSingletonEditor } from "../../lib/useEditor";
import { uploadFile } from "../../lib/api";

export function HomepageEditor() {
  const { data, setData, loading, saving, save, message } = useSingletonEditor("/admin/homepage", {
    heroTitle: "", heroSubtitle: "", heroImageUrl: "", aboutText: ""
  });

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  if (loading) return <div>Loading...</div>;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadProgress(0);
        const url = await uploadFile(e.target.files[0], setUploadProgress);
        setData({ ...data, heroImageUrl: url });
      } catch (err: any) {
        alert(err.message || "Upload failed");
      } finally {
        setUploadProgress(null);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Homepage Content</h1>
        <button onClick={save} disabled={saving} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {message && <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">{message}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hero Title</label>
          <input type="text" value={data.heroTitle || ""} onChange={e => setData({...data, heroTitle: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
          <input type="text" value={data.heroSubtitle || ""} onChange={e => setData({...data, heroSubtitle: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hero Background Image</label>
          <div className="flex flex-col gap-4">
            {data.heroImageUrl && <img src={data.heroImageUrl} alt="Hero" className="h-32 object-cover rounded-md" />}
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
            {uploadProgress !== null && <span className="text-sm text-blue-600 font-bold ml-2">Uploading {uploadProgress}%...</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">About Text</label>
          <textarea rows={5} value={data.aboutText || ""} onChange={e => setData({...data, aboutText: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
      </div>
    </div>
  );
}
