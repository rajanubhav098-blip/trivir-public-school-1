import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { Users, Image as ImageIcon, Calendar, Bell, Video, FileText } from "lucide-react";

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/admin/dashboard-stats")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Failed to load data</div>;

  const statCards = [
    { label: "Teachers", value: data.stats.teachers, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Gallery", value: data.stats.galleryImages, icon: ImageIcon, color: "bg-purple-100 text-purple-600" },
    { label: "Events", value: data.stats.events, icon: Calendar, color: "bg-green-100 text-green-600" },
    { label: "Notices", value: data.stats.notices, icon: Bell, color: "bg-yellow-100 text-yellow-600" },
    { label: "Videos", value: data.stats.videos, icon: Video, color: "bg-red-100 text-red-600" },
    { label: "Enquiries", value: data.stats.admissionEnquiries, icon: FileText, color: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Recent Enquiries</h2>
          {data.recentEnquiries.length > 0 ? (
            <div className="space-y-4">
              {data.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900">{enq.studentName}</p>
                  <p className="text-sm text-gray-500">Class: {enq.applyingClass} | {enq.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent enquiries.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Recent Notices</h2>
          {data.recentNotices.length > 0 ? (
            <div className="space-y-4">
              {data.recentNotices.map((notice: any) => (
                <div key={notice.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900">{notice.title}</p>
                  <p className="text-sm text-gray-500">{notice.publishDate}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent notices.</p>
          )}
        </div>
      </div>
    </div>
  );
}
