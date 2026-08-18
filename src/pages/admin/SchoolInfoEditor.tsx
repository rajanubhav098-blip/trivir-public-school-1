import React from "react";
import { useSingletonEditor } from "../../lib/useEditor";
import { uploadFile } from "../../lib/api";

export function SchoolInfoEditor() {
  const { data, setData, loading, saving, save, message } = useSingletonEditor("/admin/school-info", {
    name: "", logoUrl: "", introduction: "", mission: "", vision: "", coreValues: "",
    address: "", phone: "", email: "", timings: "", mapLocation: "", facebookUrl: "", twitterUrl: "", instagramUrl: "", youtubeUrl: "",
    principalName: "", principalMessage: "", principalPhotoUrl: "", affiliationInfo: ""
  });

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  if (loading) return <div>Loading...</div>;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string = "logoUrl") => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadProgress(0);
        const url = await uploadFile(e.target.files[0], setUploadProgress);
        setData({ ...data, [field]: url });
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
        <h1 className="text-xl font-bold text-gray-900">School Information</h1>
        <button onClick={save} disabled={saving} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {message && <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">School Name</label>
          <input type="text" value={data.name || ""} onChange={e => setData({...data, name: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <div className="flex items-center gap-4">
            {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-10 object-contain" />}
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
            {uploadProgress !== null && <span className="text-sm text-blue-600 font-bold ml-2">Uploading {uploadProgress}%...</span>}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Introduction</label>
          <textarea rows={3} value={data.introduction || ""} onChange={e => setData({...data, introduction: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mission</label>
          <textarea rows={3} value={data.mission || ""} onChange={e => setData({...data, mission: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vision</label>
          <textarea rows={3} value={data.vision || ""} onChange={e => setData({...data, vision: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Core Values</label>
          <input type="text" value={data.coreValues || ""} onChange={e => setData({...data, coreValues: e.target.value})} className="w-full border rounded-md p-2" />
        </div>

        {/* Contact info */}
        <div><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={data.address || ""} onChange={e => setData({...data, address: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Email</label><input type="text" value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Timings</label><input type="text" value={data.timings || ""} onChange={e => setData({...data, timings: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Google Maps Embed URL</label><input type="text" value={data.mapLocation || ""} onChange={e => setData({...data, mapLocation: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Facebook URL</label><input type="text" value={data.facebookUrl || ""} onChange={e => setData({...data, facebookUrl: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Twitter URL</label><input type="text" value={data.twitterUrl || ""} onChange={e => setData({...data, twitterUrl: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Instagram URL</label><input type="text" value={data.instagramUrl || ""} onChange={e => setData({...data, instagramUrl: e.target.value})} className="w-full border rounded-md p-2" /></div>
        <div><label className="block text-sm font-medium mb-1">YouTube URL</label><input type="text" value={data.youtubeUrl || ""} onChange={e => setData({...data, youtubeUrl: e.target.value})} className="w-full border rounded-md p-2" /></div>
        
        <div className="md:col-span-2 mt-6 mb-2 border-b pb-2"><h3 className="text-lg font-bold text-gray-800">Additional Details</h3></div>
        <div><label className="block text-sm font-medium mb-1">Affiliation Information</label><input type="text" value={data.affiliationInfo || ""} onChange={e => setData({...data, affiliationInfo: e.target.value})} className="w-full border rounded-md p-2" placeholder="e.g. CBSE Affiliation No. 123456" /></div>
        <div>
          <label className="block text-sm font-medium mb-1">Principal's Name</label>
          <input type="text" value={data.principalName || ""} onChange={e => setData({...data, principalName: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Principal's Message</label>
          <textarea rows={4} value={data.principalMessage || ""} onChange={e => setData({...data, principalMessage: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Principal's Photo</label>
          <div className="flex items-center gap-4">
            {data.principalPhotoUrl && <img src={data.principalPhotoUrl} alt="Principal" className="h-16 object-contain" />}
            <input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                try {
                  setUploadProgress(0);
                  const url = await uploadFile(e.target.files[0], setUploadProgress);
                  setData({ ...data, principalPhotoUrl: url });
                } catch (err: any) {
                  alert(err.message || "Upload failed");
                } finally {
                  setUploadProgress(null);
                }
              }
            }} className="text-sm" />
            {uploadProgress !== null && <span className="text-sm text-blue-600 font-bold ml-2">Uploading {uploadProgress}%...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
