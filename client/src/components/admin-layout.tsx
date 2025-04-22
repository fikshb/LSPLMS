import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart3,
  Users,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  User,
  BookOpen,
  FileQuestion,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Asesor",
      href: "/admin/asesors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Skema Sertifikasi",
      href: "/admin/schemes",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Bank Soal",
      href: "/admin/questions",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Template Ujian",
      href: "/admin/examination-templates",
      icon: <FileQuestion className="h-5 w-5" />,
    },
    {
      title: "Ujian",
      href: "/admin/examinations",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Jadwal",
      href: "/admin/schedules",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link href="/admin">
              <a className="flex items-center">
                <img
                  src="/logo.png"
                  alt="LSP WKN"
                  className="h-8 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/80x40?text=LSP';
                  }}
                />
                <span className="ml-2 text-lg font-semibold">LSP WKN</span>
              </a>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </a>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture || ""} />
                <AvatarFallback>{getInitials(user?.fullName || user?.username || "")}</AvatarFallback>
              </Avatar>
              <div className="ml-2 flex-1">
                <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" /> Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm border-b h-14 flex items-center px-4 md:hidden">
          <Link href="/admin">
            <a className="flex items-center">
              <img
                src="/logo.png"
                alt="LSP WKN"
                className="h-8 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/80x40?text=LSP';
                }}
              />
              <span className="ml-2 text-lg font-semibold">LSP WKN</span>
            </a>
          </Link>
        </header>

        {/* Main content container */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}