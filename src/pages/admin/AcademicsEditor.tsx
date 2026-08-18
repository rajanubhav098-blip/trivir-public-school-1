import { useSingletonEditor } from "../../lib/useEditor";

export function AcademicsEditor() {
  const { data, setData, loading, saving, save, message } = useSingletonEditor("/admin/academics", {
    approach: "", classes: "", methodology: "", curriculum: "", examination: ""
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Academics Information</h1>
        <button onClick={save} disabled={saving} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {message && <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Academic Approach</label>
          <textarea rows={3} value={data.approach || ""} onChange={e => setData({...data, approach: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Classes & Levels</label>
          <textarea rows={3} value={data.classes || ""} onChange={e => setData({...data, classes: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teaching Methodology</label>
          <textarea rows={3} value={data.methodology || ""} onChange={e => setData({...data, methodology: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Curriculum</label>
          <textarea rows={3} value={data.curriculum || ""} onChange={e => setData({...data, curriculum: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Examination System</label>
          <textarea rows={3} value={data.examination || ""} onChange={e => setData({...data, examination: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
      </div>
    </div>
  );
}
