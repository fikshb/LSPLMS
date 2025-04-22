import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  HomeIcon,
  LogOutIcon,
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  FileTextIcon,
  BarChart3Icon,
  Settings2Icon,
  MenuIcon,
  XIcon,
  AwardIcon,
  ClipboardListIcon,
  LayersIcon,
  FileIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define the navigation items for the sidebar
type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

// Group navigation items
type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: <HomeIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Manajemen",
    items: [
      {
        title: "Asesor",
        href: "/admin/asesors",
        icon: <UsersIcon className="h-5 w-5" />,
      },
      {
        title: "Skema Sertifikasi",
        href: "/admin/schemes",
        icon: <BookOpenIcon className="h-5 w-5" />,
      },
      {
        title: "Jadwal",
        href: "/admin/schedules",
        icon: <CalendarIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Ujian",
    items: [
      {
        title: "Bank Soal",
        href: "/admin/questions",
        icon: <ClipboardListIcon className="h-5 w-5" />,
      },
      {
        title: "Template Ujian",
        href: "/admin/examination-templates",
        icon: <LayersIcon className="h-5 w-5" />,
      },
      {
        title: "Ujian",
        href: "/admin/examinations",
        icon: <FileIcon className="h-5 w-5" />,
      },
    ]
  },
  {
    title: "Laporan",
    items: [
      {
        title: "Statistik",
        href: "/admin/statistics",
        icon: <BarChart3Icon className="h-5 w-5" />,
      },
      {
        title: "Sertifikat",
        href: "/admin/certificates",
        icon: <AwardIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: <Settings2Icon className="h-5 w-5" />,
      },
    ],
  },
];

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white"
        >
          {isSidebarOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#79A84B] rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LSP</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">LSP WKN</h2>
                  <p className="text-xs text-gray-500">Panel Admin</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link href={item.href}>
                        <div
                          className={cn(
                            "flex items-center px-4 py-2 text-sm rounded-md cursor-pointer",
                            location === item.href
                              ? "bg-[#79A84B] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-[#8C3C18] text-white">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.fullName || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        )}
      >
        {/* Content area */}
        <main className="min-h-screen p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}