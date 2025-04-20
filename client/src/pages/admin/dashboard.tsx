import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Award,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  ClipboardList,
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { LSPLogo } from "@/assets/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-secondary/20 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`mt-2 flex items-center text-xs ${
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {trend === "up" ? (
              <ChevronRight className="h-4 w-4 rotate-90" />
            ) : trend === "down" ? (
              <ChevronRight className="h-4 w-4 -rotate-90" />
            ) : (
              <ChevronRight className="h-4 w-4 rotate-180" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Define type for dashboard stats
  interface DashboardCounts {
    usersCount: number;
    activeAssessmentsCount: number;
    schemesCount: number;
    asesorsCount: number;
  }

  // Fetch counts for the dashboard
  const { data: counts = { 
    usersCount: 0, 
    activeAssessmentsCount: 0, 
    schemesCount: 0, 
    asesorsCount: 0 
  }, isLoading: isLoadingCounts } = useQuery<DashboardCounts>({
    queryKey: ["/api/admin/counts"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "admin",
  });

  // Fetch certification schemes
  const { data: schemes = [], isLoading: isLoadingSchemes } = useQuery<any[]>({
    queryKey: ["/api/schemes"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch upcoming assessments
  const { data: schedules = [], isLoading: isLoadingSchedules } = useQuery<any[]>({
    queryKey: ["/api/schedules"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <LSPLogo className="h-8 w-8 mr-2" />
            <div>
              <div className="font-semibold text-sm">LSP Admin</div>
              <div className="text-xs text-muted-foreground">
                Wirausaha Kompeten Nusantara
              </div>
            </div>
          </Link>
        </div>
        <div className="flex-1 py-4 overflow-auto">
          <nav className="px-2 space-y-1">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "schemes" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("schemes")}
            >
              <Award className="mr-2 h-5 w-5" />
              Skema Sertifikasi
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-5 w-5" />
              Pengguna
            </Button>
            <Button
              variant={activeTab === "assessments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assessments")}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              Asesmen
            </Button>
            <Button
              variant={activeTab === "schedule" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Jadwal
            </Button>
            <Button
              variant={activeTab === "reports" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Laporan
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Pengaturan
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#79A84B] text-white flex items-center justify-center mr-2">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.fullName || user?.username || "Admin"}
              </div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" /> Beranda
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Peserta"
                value={counts?.usersCount || 0}
                description="Total peserta terdaftar"
                icon={<Users className="h-4 w-4" />}
                trend="up"
                trendValue="12% dari bulan lalu"
              />
              <StatCard
                title="Asesmen Aktif"
                value={counts?.activeAssessmentsCount || 0}
                description="Asesmen yang sedang berlangsung"
                icon={<ClipboardList className="h-4 w-4" />}
                trend="up"
                trendValue="5% dari bulan lalu"
              />
              <StatCard
                title="Skema Sertifikasi"
                value={counts?.schemesCount || 0}
                description="Total skema yang tersedia"
                icon={<Award className="h-4 w-4" />}
                trend="neutral"
                trendValue="Sama dengan bulan lalu"
              />
              <StatCard
                title="Asesor"
                value={counts?.asesorsCount || 0}
                description="Total asesor aktif"
                icon={<Users className="h-4 w-4" />}
                trend="up"
                trendValue="2 asesor baru bulan ini"
              />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jadwal Asesmen Mendatang</CardTitle>
                  <CardDescription>
                    Jadwal asesmen yang akan datang dalam 30 hari ke depan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSchedules ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : schedules && schedules.length > 0 ? (
                    <div className="space-y-4">
                      {schedules.slice(0, 5).map((schedule: any) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                          <div>
                            <div className="font-medium">{schedule.label || `Jadwal #${schedule.id}`}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(schedule.startDate).toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.location || 'Lokasi belum ditentukan'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Tidak ada jadwal asesmen mendatang
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skema Populer</CardTitle>
                  <CardDescription>
                    Skema sertifikasi yang paling banyak dipilih
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSchemes ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : schemes && schemes.length > 0 ? (
                    <div className="space-y-4">
                      {schemes
                        .sort((a: any, b: any) => b.popular - a.popular)
                        .slice(0, 5)
                        .map((scheme: any) => (
                          <div
                            key={scheme.id}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                          >
                            <div>
                              <div className="font-medium">{scheme.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {scheme.category || 'Kategori Umum'}
                              </div>
                            </div>
                            <div className="bg-secondary px-2 py-1 rounded text-xs">
                              {scheme.popular} Pendaftar
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Belum ada data skema
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schemes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manajemen Skema Sertifikasi</CardTitle>
                  <CardDescription>
                    Kelola skema sertifikasi yang tersedia
                  </CardDescription>
                </div>
                <Button className="bg-[#79A84B]">Tambah Skema Baru</Button>
              </CardHeader>
              <CardContent>
                {isLoadingSchemes ? (
                  <div className="text-center py-4">Loading...</div>
                ) : schemes && schemes.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                      <div className="col-span-1">#</div>
                      <div className="col-span-3">Nama Skema</div>
                      <div className="col-span-2">Kode</div>
                      <div className="col-span-2">Kategori</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Aksi</div>
                    </div>
                    {schemes.map((scheme: any, index: number) => (
                      <div
                        key={scheme.id}
                        className="grid grid-cols-12 gap-4 p-4 border-t items-center"
                      >
                        <div className="col-span-1">{index + 1}</div>
                        <div className="col-span-3 font-medium">
                          {scheme.name}
                        </div>
                        <div className="col-span-2 text-muted-foreground">
                          {scheme.code || '-'}
                        </div>
                        <div className="col-span-2">
                          {scheme.category || 'Umum'}
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              scheme.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {scheme.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Belum ada skema sertifikasi. Tambahkan skema baru.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>
                  Kelola pengguna, asesor, dan admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="asesi">
                  <TabsList className="mb-4">
                    <TabsTrigger value="asesi">Peserta Asesmen</TabsTrigger>
                    <TabsTrigger value="asesor">Asesor</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>
                  <TabsContent value="asesi">
                    <div className="text-center py-10 text-muted-foreground">
                      Fitur manajemen peserta asesmen sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                  <TabsContent value="asesor">
                    <div className="text-center py-10 text-muted-foreground">
                      Fitur manajemen asesor sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                  <TabsContent value="admin">
                    <div className="text-center py-10 text-muted-foreground">
                      Fitur manajemen admin sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Asesmen</CardTitle>
                <CardDescription>
                  Kelola proses asesmen dan sertifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur manajemen asesmen sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Jadwal Asesmen</CardTitle>
                  <CardDescription>
                    Kelola jadwal asesmen yang tersedia
                  </CardDescription>
                </div>
                <Button className="bg-[#79A84B]">Tambah Jadwal</Button>
              </CardHeader>
              <CardContent>
                {isLoadingSchedules ? (
                  <div className="text-center py-4">Loading...</div>
                ) : schedules && schedules.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                      <div className="col-span-1">#</div>
                      <div className="col-span-2">Tanggal Mulai</div>
                      <div className="col-span-2">Tanggal Selesai</div>
                      <div className="col-span-3">Lokasi</div>
                      <div className="col-span-2">Kuota</div>
                      <div className="col-span-2">Aksi</div>
                    </div>
                    {schedules.map((schedule: any, index: number) => (
                      <div
                        key={schedule.id}
                        className="grid grid-cols-12 gap-4 p-4 border-t items-center"
                      >
                        <div className="col-span-1">{index + 1}</div>
                        <div className="col-span-2">
                          {new Date(schedule.startDate).toLocaleDateString()}
                        </div>
                        <div className="col-span-2">
                          {new Date(schedule.endDate).toLocaleDateString()}
                        </div>
                        <div className="col-span-3">
                          {schedule.location || 'Belum ditentukan'}
                        </div>
                        <div className="col-span-2">
                          {schedule.quota || 'Tidak terbatas'}
                        </div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Belum ada jadwal asesmen. Tambahkan jadwal baru.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Laporan</CardTitle>
                <CardDescription>
                  Laporan dan statistik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur laporan sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>
                  Konfigurasi sistem LSP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur pengaturan sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}