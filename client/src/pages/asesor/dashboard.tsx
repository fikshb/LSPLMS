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
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Award,
  Calendar,
  ClipboardCheck,
  FileText,
  Settings,
  ClipboardList,
  LogOut,
  Home,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSearch,
} from "lucide-react";
import { LSPLogo } from "@/assets/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AsesorDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch assessments assigned to this asesor
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery<any[]>({
    queryKey: ["/api/asesor/assessments"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesor",
  });

  // Fetch certification schemes
  const { data: schemes = [], isLoading: isLoadingSchemes } = useQuery<any[]>({
    queryKey: ["/api/schemes"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch forms
  const { data: forms = [], isLoading: isLoadingForms } = useQuery<any[]>({
    queryKey: ["/api/asesor/forms"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesor",
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <LSPLogo className="h-8 w-8 mr-2" />
            <div>
              <div className="font-semibold text-sm">LSP Asesor</div>
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
              <ClipboardList className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "assessments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assessments")}
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
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
              variant={activeTab === "participants" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("participants")}
            >
              <Users className="mr-2 h-5 w-5" />
              Peserta
            </Button>
            <Button
              variant={activeTab === "forms" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("forms")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Formulir
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
                {user?.fullName || user?.username || "Asesor"}
              </div>
              <div className="text-xs text-muted-foreground">Asesor</div>
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
          <h1 className="text-xl font-bold">Dashboard Asesor</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <TabsContent value="overview" className={activeTab === "overview" ? "block" : "hidden"}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Asesmen Tertunda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Peserta yang menunggu asesmen</p>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      Jadwal asesmen berikutnya
                    </div>
                    <div className="text-sm font-medium">21 Mei 2025</div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Asesmen
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status Asesmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Menunggu Asesmen</span>
                      <Badge className="bg-amber-500">5</Badge>
                    </div>
                    <Progress value={25} className="h-2 bg-amber-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sedang Diases</span>
                      <Badge className="bg-blue-500">10</Badge>
                    </div>
                    <Progress value={50} className="h-2 bg-blue-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Selesai</span>
                      <Badge className="bg-green-500">15</Badge>
                    </div>
                    <Progress value={75} className="h-2 bg-green-100" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Laporan
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Skema yang Diases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingSchemes ? (
                      <div className="text-center py-2">Loading...</div>
                    ) : schemes && schemes.length > 0 ? (
                      schemes.slice(0, 3).map((scheme: any) => (
                        <div key={scheme.id} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[#79A84B] mr-2"></div>
                          <span className="text-sm">{scheme.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-muted-foreground">
                        Belum ada skema
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Semua Skema
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-8">
              <Card className="md:col-span-5">
                <CardHeader>
                  <CardTitle>Asesmen Mendatang</CardTitle>
                  <CardDescription>
                    Jadwal asesmen yang telah dialokasikan kepada Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAssessments ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-md">
                        <div className="flex items-center justify-between p-4 border-b bg-muted">
                          <div className="font-medium">Peserta</div>
                          <div className="font-medium">Skema</div>
                          <div className="font-medium">Tanggal</div>
                          <div className="font-medium">Status</div>
                        </div>
                        <div className="divide-y">
                          <div className="flex items-center justify-between p-4">
                            <div>Budi Santoso</div>
                            <div className="text-sm">Digital Marketing</div>
                            <div className="text-sm">21 Mei 2025</div>
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4">
                            <div>Sarah Amelia</div>
                            <div className="text-sm">Web Developer</div>
                            <div className="text-sm">22 Mei 2025</div>
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4">
                            <div>Ahmad Hidayat</div>
                            <div className="text-sm">UI/UX Designer</div>
                            <div className="text-sm">25 Mei 2025</div>
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Lihat Semua Jadwal
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Formulir Asesmen</CardTitle>
                  <CardDescription>
                    Formulir yang perlu diisi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 mr-2 text-[#79A84B]" />
                      <div>
                        <div className="text-sm font-medium">FR.AK.01</div>
                        <div className="text-xs text-muted-foreground">Observasi Aktivitas di Tempat Kerja</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 mr-2 text-[#79A84B]" />
                      <div>
                        <div className="text-sm font-medium">FR.AK.02</div>
                        <div className="text-xs text-muted-foreground">Pertanyaan untuk Mendukung Observasi</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 mr-2 text-[#79A84B]" />
                      <div>
                        <div className="text-sm font-medium">FR.IA.01</div>
                        <div className="text-xs text-muted-foreground">Pertanyaan Tertulis Pilihan Ganda</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 mr-2 text-[#79A84B]" />
                      <div>
                        <div className="text-sm font-medium">FR.IA.03</div>
                        <div className="text-xs text-muted-foreground">Daftar Pertanyaan Wawancara</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Lihat Semua Formulir
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className={activeTab === "assessments" ? "block" : "hidden"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manajemen Asesmen</CardTitle>
                  <CardDescription>
                    Kelola proses asesmen yang menjadi tanggung jawab Anda
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Akan Datang</TabsTrigger>
                    <TabsTrigger value="ongoing">Sedang Berjalan</TabsTrigger>
                    <TabsTrigger value="completed">Selesai</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming">
                    <div className="border rounded-md">
                      <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                        <div className="col-span-3">Peserta</div>
                        <div className="col-span-3">Skema Sertifikasi</div>
                        <div className="col-span-2">Tanggal</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Aksi</div>
                      </div>
                      <div className="divide-y">
                        <div className="grid grid-cols-12 gap-4 p-4 items-center">
                          <div className="col-span-3">
                            <div className="font-medium">Budi Santoso</div>
                            <div className="text-xs text-muted-foreground">ID: BSA-2025-001</div>
                          </div>
                          <div className="col-span-3">Digital Marketing</div>
                          <div className="col-span-2">21 Mei 2025</div>
                          <div className="col-span-2">
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                          <div className="col-span-2">
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 p-4 items-center">
                          <div className="col-span-3">
                            <div className="font-medium">Sarah Amelia</div>
                            <div className="text-xs text-muted-foreground">ID: SAM-2025-002</div>
                          </div>
                          <div className="col-span-3">Web Developer</div>
                          <div className="col-span-2">22 Mei 2025</div>
                          <div className="col-span-2">
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                          <div className="col-span-2">
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 p-4 items-center">
                          <div className="col-span-3">
                            <div className="font-medium">Ahmad Hidayat</div>
                            <div className="text-xs text-muted-foreground">ID: AHI-2025-003</div>
                          </div>
                          <div className="col-span-3">UI/UX Designer</div>
                          <div className="col-span-2">25 Mei 2025</div>
                          <div className="col-span-2">
                            <Badge className="bg-amber-500">Menunggu</Badge>
                          </div>
                          <div className="col-span-2">
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ongoing">
                    <div className="text-center py-10 text-muted-foreground">
                      Tidak ada asesmen yang sedang berlangsung saat ini.
                    </div>
                  </TabsContent>
                  <TabsContent value="completed">
                    <div className="text-center py-10 text-muted-foreground">
                      Tidak ada asesmen yang telah selesai.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className={activeTab === "forms" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Formulir Asesmen</CardTitle>
                <CardDescription>
                  Formulir yang digunakan untuk proses asesmen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="assessment">
                  <TabsList className="mb-4">
                    <TabsTrigger value="assessment">Asesmen</TabsTrigger>
                    <TabsTrigger value="instrument">Instrumen</TabsTrigger>
                    <TabsTrigger value="decision">Keputusan</TabsTrigger>
                    <TabsTrigger value="report">Laporan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="assessment">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">FR.AK.01</CardTitle>
                          <CardDescription>Observasi Aktivitas di Tempat Kerja</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            Formulir untuk mencatat hasil observasi kinerja peserta di tempat kerja atau situasi kerja yang disimulasikan
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <FileSearch className="h-4 w-4 mr-2" />
                            Lihat Formulir
                          </Button>
                          <Button size="sm" className="bg-[#79A84B]">
                            Unduh
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">FR.AK.02</CardTitle>
                          <CardDescription>Pertanyaan untuk Mendukung Observasi</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            Formulir untuk mencatat pertanyaan pendalaman saat observasi
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <FileSearch className="h-4 w-4 mr-2" />
                            Lihat Formulir
                          </Button>
                          <Button size="sm" className="bg-[#79A84B]">
                            Unduh
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="instrument">
                    <div className="text-center py-10 text-muted-foreground">
                      Formulir instrumen asesmen sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                  <TabsContent value="decision">
                    <div className="text-center py-10 text-muted-foreground">
                      Formulir keputusan asesmen sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                  <TabsContent value="report">
                    <div className="text-center py-10 text-muted-foreground">
                      Formulir laporan asesmen sedang dalam pengembangan.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className={activeTab === "schedule" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Asesmen</CardTitle>
                <CardDescription>
                  Jadwal asesmen yang akan Anda lakukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur jadwal asesmen sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className={activeTab === "participants" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Daftar Peserta</CardTitle>
                <CardDescription>
                  Peserta yang akan Anda nilai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur daftar peserta sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className={activeTab === "settings" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>
                  Pengaturan akun dan preferensi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur pengaturan sedang dalam pengembangan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </div>
    </div>
  );
}