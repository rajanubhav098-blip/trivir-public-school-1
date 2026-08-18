import { useEffect, useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { getAuthToken, logout } from "../../lib/api";
import { Inbox, LayoutDashboard, Building, Home, Users, BookOpen, GraduationCap, Trophy, Calendar, Bell, Image as ImageIcon, Video, FileText, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/school-info", icon: Building, label: "School Information" },
  { path: "/admin/homepage", icon: Home, label: "Homepage" },
  { path: "/admin/management", icon: Users, label: "Management" },
  { path: "/admin/teachers", icon: GraduationCap, label: "Teachers" },
  { path: "/admin/academics", icon: BookOpen, label: "Academics" },
  { path: "/admin/facilities", icon: Building, label: "Facilities" },
  { path: "/admin/achievements", icon: Trophy, label: "Achievements" },
  { path: "/admin/events", icon: Calendar, label: "Events" },
  { path: "/admin/notices", icon: Bell, label: "Notices" },
  { path: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/admin/videos", icon: Video, label: "Videos" },
  { path: "/admin/admissions", icon: FileText, label: "Admissions" },
  { path: "/admin/enquiries", icon: Inbox, label: "Enquiries" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden bg-green-800 text-white p-4 flex justify-between items-center z-20">
        <span className="font-bold text-lg">Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-green-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col absolute md:relative z-10 transition-transform duration-300 min-h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 md:p-6 hidden md:block">
          <h2 className="text-xl font-bold">Trivir Admin</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive ? "bg-green-700 text-white font-medium" : "text-green-100 hover:bg-green-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-green-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-green-100 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
