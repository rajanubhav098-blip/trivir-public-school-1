import { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";
import { Trash2, Phone, Mail, Clock } from "lucide-react";

export function EnquiriesViewer() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const data = await fetchApi("/admin/enquiries");
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await fetchApi(`/admin/enquiries/${id}`, { method: "DELETE" });
      loadEnquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to delete enquiry");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading enquiries...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admission Enquiries</h1>
          <p className="text-slate-600 mt-1">View and manage admission requests from the website.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-4 font-medium">Student / Parent</th>
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Message</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-medium text-slate-900">{enq.studentName}</div>
                      <div className="text-sm text-slate-500">Parent: {enq.parentName}</div>
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {enq.applyingClass}
                      </span>
                    </td>
                    <td className="p-4 align-top space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${enq.phone}`} className="hover:text-emerald-600">{enq.phone}</a>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${enq.email}`} className="hover:text-emerald-600">{enq.email}</a>
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top max-w-xs">
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{enq.message || "-"}</p>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 align-top text-right">
                      <button 
                        onClick={() => handleDelete(enq.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
