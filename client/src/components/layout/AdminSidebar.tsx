import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  Award,
  Calendar,
  Settings,
  LogOut,
  FileQuestion,
  Trophy,
  FileCheck,
} from "lucide-react";

const AdminSidebar = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      link: "/admin/dashboard",
    },
    {
      title: "Manajemen Asesor",
      icon: <Users className="h-5 w-5" />,
      link: "/admin/asesors",
    },
    {
      title: "Skema Sertifikasi",
      icon: <Award className="h-5 w-5" />,
      link: "/admin/schemes",
    },
    {
      title: "Jadwal Asesmen",
      icon: <Calendar className="h-5 w-5" />,
      link: "/admin/schedules",
    },
    {
      title: "Bank Soal",
      icon: <FileQuestion className="h-5 w-5" />,
      link: "/admin/questions",
    },
    {
      title: "Template Ujian",
      icon: <FileText className="h-5 w-5" />,
      link: "/admin/examination-templates",
    },
    {
      title: "Manajemen Ujian",
      icon: <GraduationCap className="h-5 w-5" />,
      link: "/admin/examinations",
    },
    {
      title: "Sertifikat",
      icon: <Trophy className="h-5 w-5" />,
      link: "/admin/certificates",
    },
    {
      title: "Laporan",
      icon: <FileCheck className="h-5 w-5" />,
      link: "/admin/reports",
    },
    {
      title: "Pengaturan",
      icon: <Settings className="h-5 w-5" />,
      link: "/admin/settings",
    },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="text-xl font-bold text-primary">LSP WKN</div>
        <div className="text-sm text-gray-500">Panel Admin</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100",
                isActive(item.link) && "bg-primary/10 text-primary font-medium"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary uppercase font-semibold">
            {user?.fullName ? user.fullName[0] : user?.username?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
              {user?.fullName || user?.username || "Admin"}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;