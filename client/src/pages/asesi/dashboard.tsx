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
  Calendar,
  FileText,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  CreditCard,
  Award,
  Book,
  CheckCircle,
  ListChecks,
  User,
  AlertCircle,
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

export default function AsesiDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's applications
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<any[]>({
    queryKey: ["/api/asesi/applications"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesi",
  });

  // Fetch certification schemes for recommendations
  const { data: schemes = [], isLoading: isLoadingSchemes } = useQuery<any[]>({
    queryKey: ["/api/schemes"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch upcoming schedules
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
              <div className="font-semibold text-sm">LSP WKN</div>
              <div className="text-xs text-muted-foreground">
                Portal Peserta
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
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "applications" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("applications")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Aplikasi Saya
            </Button>
            <Button
              variant={activeTab === "assessments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assessments")}
            >
              <ListChecks className="mr-2 h-5 w-5" />
              Asesmen
            </Button>
            <Button
              variant={activeTab === "schedules" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("schedules")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Jadwal
            </Button>
            <Button
              variant={activeTab === "certificates" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("certificates")}
            >
              <Award className="mr-2 h-5 w-5" />
              Sertifikat
            </Button>
            <Button
              variant={activeTab === "payments" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Pembayaran
            </Button>
            <Button
              variant={activeTab === "profile" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profil
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
                {user?.fullName || user?.username || "Peserta"}
              </div>
              <div className="text-xs text-muted-foreground">Peserta Asesmen</div>
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
          <h1 className="text-xl font-bold">Selamat Datang, {user?.fullName || user?.username || "Peserta"}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <TabsContent value="overview" className={activeTab === "overview" ? "block" : "hidden"}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status Aplikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#79A84B]">
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-6 w-6" />
                      Aktif
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Akun Anda telah terverifikasi</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kelengkapan Profil</span>
                      <span className="text-xs">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    
                    <div className="text-xs text-amber-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Lengkapi data pribadi untuk aplikasi sertifikasi
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aplikasi Sertifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Aplikasi Tertunda</div>
                      <Badge className="bg-amber-500">1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Dalam Proses</div>
                      <Badge className="bg-blue-500">0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Selesai</div>
                      <Badge className="bg-green-500">0</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Jadwal Asesmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm font-medium mt-2">Belum Ada Jadwal</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Anda belum memiliki jadwal asesmen
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Jadwal Tersedia
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-8">
              <Card className="md:col-span-5">
                <CardHeader>
                  <CardTitle>Langkah Sertifikasi</CardTitle>
                  <CardDescription>
                    Langkah-langkah yang perlu Anda selesaikan untuk mendapatkan sertifikasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 pb-1 pt-2">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-muted ml-3.5 mt-5"></div>
                    
                    <div className="flex gap-3 relative z-10">
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                        1
                      </div>
                      <div className="grid gap-1.5">
                        <div className="font-medium">Pendaftaran</div>
                        <div className="text-sm text-muted-foreground">
                          Lengkapi profil dan data pribadi
                        </div>
                        <div className="flex items-center text-xs text-green-600 font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selesai
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 relative z-10">
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                        2
                      </div>
                      <div className="grid gap-1.5">
                        <div className="font-medium">Aplikasi Sertifikasi</div>
                        <div className="text-sm text-muted-foreground">
                          Pilih skema sertifikasi dan isi formulir aplikasi (FR.APL.01 dan FR.APL.02)
                        </div>
                        <div className="flex items-center text-xs text-amber-600 font-medium">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Dalam Proses
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 relative z-10">
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted text-muted-foreground">
                        3
                      </div>
                      <div className="grid gap-1.5">
                        <div className="font-medium">Penilaian Portofolio</div>
                        <div className="text-sm text-muted-foreground">
                          Upload dokumen dan bukti pendukung
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                          Belum dimulai
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 relative z-10">
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted text-muted-foreground">
                        4
                      </div>
                      <div className="grid gap-1.5">
                        <div className="font-medium">Asesmen</div>
                        <div className="text-sm text-muted-foreground">
                          Ikuti proses asesmen sesuai jadwal
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                          Belum dimulai
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 relative z-10">
                      <div className="rounded-full w-7 h-7 flex items-center justify-center bg-muted text-muted-foreground">
                        5
                      </div>
                      <div className="grid gap-1.5">
                        <div className="font-medium">Sertifikasi</div>
                        <div className="text-sm text-muted-foreground">
                          Terima hasil asesmen dan sertifikat
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                          Belum dimulai
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Skema Sertifikasi Populer</CardTitle>
                  <CardDescription>
                    Skema sertifikasi yang mungkin sesuai dengan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSchemes ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : schemes && schemes.length > 0 ? (
                    <div className="space-y-4">
                      {schemes
                        .sort((a: any, b: any) => b.popular - a.popular)
                        .slice(0, 3)
                        .map((scheme: any) => (
                          <div
                            key={scheme.id}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                          >
                            <div>
                              <div className="font-medium">{scheme.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {scheme.category || 'Kategori Umum'}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Daftar
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Belum ada data skema
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Semua Skema
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className={activeTab === "applications" ? "block" : "hidden"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Aplikasi Sertifikasi Saya</CardTitle>
                  <CardDescription>
                    Kelola aplikasi sertifikasi yang Anda ajukan
                  </CardDescription>
                </div>
                <Button className="bg-[#79A84B]">
                  Aplikasi Baru
                </Button>
              </CardHeader>
              <CardContent>
                {true ? (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Belum Ada Aplikasi</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                      Anda belum mengajukan aplikasi sertifikasi. Klik tombol "Aplikasi Baru" untuk memulai proses sertifikasi.
                    </p>
                    <Button className="bg-[#79A84B]">
                      Ajukan Aplikasi Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                      <div className="col-span-1">#</div>
                      <div className="col-span-3">Nomor Aplikasi</div>
                      <div className="col-span-3">Skema</div>
                      <div className="col-span-2">Tanggal Aplikasi</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1">Aksi</div>
                    </div>
                    <div className="p-8 text-center text-muted-foreground">
                      Belum ada aplikasi sertifikasi
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className={activeTab === "assessments" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Asesmen Saya</CardTitle>
                <CardDescription>
                  Status dan jadwal asesmen untuk aplikasi sertifikasi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <ListChecks className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak Ada Asesmen</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Anda belum memiliki jadwal asesmen. Asesmen akan dijadwalkan setelah aplikasi sertifikasi Anda disetujui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className={activeTab === "schedules" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Asesmen</CardTitle>
                <CardDescription>
                  Jadwal asesmen yang tersedia dan jadwal Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="available">
                  <TabsList className="mb-4">
                    <TabsTrigger value="available">Jadwal Tersedia</TabsTrigger>
                    <TabsTrigger value="my-schedules">Jadwal Saya</TabsTrigger>
                  </TabsList>
                  <TabsContent value="available">
                    {isLoadingSchedules ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : schedules && schedules.length > 0 ? (
                      <div className="border rounded-md">
                        <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                          <div className="col-span-1">#</div>
                          <div className="col-span-3">Tanggal</div>
                          <div className="col-span-3">Lokasi</div>
                          <div className="col-span-2">Kuota</div>
                          <div className="col-span-3">Aksi</div>
                        </div>
                        {schedules.map((schedule: any, index: number) => (
                          <div
                            key={schedule.id}
                            className="grid grid-cols-12 gap-4 p-4 border-t items-center"
                          >
                            <div className="col-span-1">{index + 1}</div>
                            <div className="col-span-3">
                              {new Date(schedule.startDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="col-span-3">
                              {schedule.location || 'Belum ditentukan'}
                            </div>
                            <div className="col-span-2">
                              {schedule.quota || 'Tidak terbatas'}
                            </div>
                            <div className="col-span-3">
                              <Button variant="outline" size="sm" className="w-full">
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Belum ada jadwal asesmen yang tersedia.
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="my-schedules">
                    <div className="text-center py-10 text-muted-foreground">
                      Anda belum memiliki jadwal asesmen.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className={activeTab === "certificates" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Sertifikat Saya</CardTitle>
                <CardDescription>
                  Sertifikat kompetensi yang telah Anda peroleh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum Ada Sertifikat</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Anda belum memiliki sertifikat kompetensi. Sertifikat akan diterbitkan setelah Anda dinyatakan kompeten dalam proses asesmen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className={activeTab === "payments" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Pembayaran</CardTitle>
                <CardDescription>
                  Riwayat dan status pembayaran untuk aplikasi sertifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak Ada Pembayaran</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Anda belum memiliki riwayat pembayaran. Pembayaran akan muncul setelah Anda mengajukan aplikasi sertifikasi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className={activeTab === "profile" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Profil Saya</CardTitle>
                <CardDescription>
                  Informasi pribadi dan data diri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Fitur profil sedang dalam pengembangan.
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