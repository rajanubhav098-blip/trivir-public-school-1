import { useSingletonEditor } from "../../lib/useEditor";
import { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";

export function AdmissionsEditor() {
  const { data, setData, loading, saving, save, message } = useSingletonEditor("/admin/admission-info", {
    process: "", documentsRequired: "", instructions: ""
  });

  const [enquiries, setEnquiries] = useState<any[]>([]);

  const loadEnquiries = () => {
    fetchApi("/admin/enquiries").then(setEnquiries).catch(console.error);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const deleteEnquiry = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetchApi(`/admin/enquiries/${id}`, { method: "DELETE" });
      loadEnquiries();
    } catch (err) {
      alert("Error deleting");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Admission Information</h1>
          <button onClick={save} disabled={saving} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {message && <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">{message}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admission Process</label>
            <textarea rows={3} value={data.process || ""} onChange={e => setData({...data, process: e.target.value})} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Documents Required</label>
            <textarea rows={3} value={data.documentsRequired || ""} onChange={e => setData({...data, documentsRequired: e.target.value})} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Important Instructions</label>
            <textarea rows={3} value={data.instructions || ""} onChange={e => setData({...data, instructions: e.target.value})} className="w-full border rounded-md p-2" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Admission Enquiries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 font-semibold text-sm text-gray-600">Date</th>
                <th className="p-3 font-semibold text-sm text-gray-600">Student</th>
                <th className="p-3 font-semibold text-sm text-gray-600">Parent</th>
                <th className="p-3 font-semibold text-sm text-gray-600">Class</th>
                <th className="p-3 font-semibold text-sm text-gray-600">Contact</th>
                <th className="p-3 font-semibold text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 text-sm">{new Date(enq.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">{enq.studentName}</td>
                  <td className="p-3">{enq.parentName}</td>
                  <td className="p-3">{enq.applyingClass}</td>
                  <td className="p-3 text-sm">
                    {enq.phone}<br/>{enq.email}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => deleteEnquiry(enq.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">No enquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
