import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
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
  Clock,
  Download,
  Upload,
  LayoutDashboard,
  FilePlus2,
  FileCheck,
  Info,
  ClipboardList,
  PlusCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function AsesiDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch user profile and completeness
  const { data: profile, isLoading: isLoadingProfile } = useQuery<any>({
    queryKey: ["/api/asesi/profile"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesi",
    placeholderData: {
      completeness: 80,
      missingFields: ["alamat", "phoneNumber"],
      isVerified: true,
    }
  });

  // Fetch user's applications
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<any[]>({
    queryKey: ["/api/asesi/applications"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesi",
    placeholderData: [
      {
        id: 1,
        schemeId: 2,
        schemeName: "Pelaksana Penjamah Makanan",
        status: "pending",
        date: "2024-04-15",
        progress: 25
      }
    ]
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
  
  // Fetch user's assessments
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery<any[]>({
    queryKey: ["/api/asesi/assessments"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesi",
    placeholderData: []
  });
  
  // Fetch user's certificates
  const { data: certificates = [], isLoading: isLoadingCertificates } = useQuery<any[]>({
    queryKey: ["/api/asesi/certificates"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesi",
    placeholderData: []
  });
  
  // Get counts for badges
  const pendingCount = applications.filter(app => app.status === "pending").length;
  const inProgressCount = applications.filter(app => app.status === "in_progress").length;
  const completedCount = applications.filter(app => app.status === "completed").length;
  
  // Handle apply for certification
  const handleApplyForCertification = () => {
    if (profile?.completeness < 100) {
      toast({
        title: "Profil belum lengkap",
        description: "Lengkapi profil Anda terlebih dahulu sebelum mendaftar sertifikasi.",
        variant: "destructive",
      });
      setActiveTab("profile");
    } else {
      navigate("/formulir-sertifikasi");
    }
  };

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
            {/* Notifikasi selamat datang */}
            <Alert className="mb-6 border-[#79A84B]/30 bg-[#79A84B]/10">
              <Info className="h-4 w-4 text-[#79A84B]" />
              <AlertTitle>Selamat Datang di Portal Asesi LSP WKN</AlertTitle>
              <AlertDescription>
                Platform ini akan membantu Anda dalam proses sertifikasi kompetensi. Lengkapi profil dan mulai daftar untuk mendapatkan sertifikasi.
              </AlertDescription>
            </Alert>
            
            {/* Summary cards */}
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
                      <span className="text-xs">{profile?.completeness || 0}%</span>
                    </div>
                    <Progress value={profile?.completeness || 0} className="h-2" />
                    
                    {profile?.completeness < 100 && (
                      <div className="text-xs text-amber-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Lengkapi data pribadi untuk aplikasi sertifikasi
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Lihat Profil
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aplikasi Sertifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Aplikasi Tertunda</div>
                      <Badge className="bg-amber-500">{pendingCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Dalam Proses</div>
                      <Badge className="bg-blue-500">{inProgressCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Selesai</div>
                      <Badge className="bg-green-500">{completedCount}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab("applications")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Jadwal Asesmen</CardTitle>
                </CardHeader>
                <CardContent>
                  {schedules && schedules.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm">Jadwal terdekat:</div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="font-medium text-sm">{schedules[0].title || "Jadwal Asesmen"}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {schedules[0].startDate ? new Date(schedules[0].startDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : ""}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <div className="text-sm font-medium mt-2">Belum Ada Jadwal</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Anda belum memiliki jadwal asesmen
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab("schedules")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Lihat Jadwal
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
                <CardFooter>
                  <Button onClick={handleApplyForCertification}>
                    <FilePlus2 className="h-4 w-4 mr-2" />
                    Daftar Sertifikasi Baru
                  </Button>
                </CardFooter>
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
                        .slice(0, 3)
                        .map((scheme: any) => (
                          <div
                            key={scheme.id}
                            className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <div className="bg-[#79A84B]/10 rounded-md p-2">
                              <Book className="h-5 w-5 text-[#79A84B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{scheme.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {scheme.category || "Umum"}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Tidak ada skema tersedia
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/skema">
                    <Button variant="outline" size="sm" className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      Lihat Semua Skema
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Aplikasi Saya */}
          <TabsContent value="applications" className={activeTab === "applications" ? "block" : "hidden"}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Aplikasi Sertifikasi Saya</h2>
                <p className="text-muted-foreground">Daftar aplikasi sertifikasi yang Anda ajukan</p>
              </div>
              <Button onClick={handleApplyForCertification}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajukan Aplikasi Baru
              </Button>
            </div>
            
            {isLoadingApplications ? (
              <div className="text-center py-8">Loading...</div>
            ) : applications && applications.length > 0 ? (
              <div className="grid gap-4">
                {applications.map((app: any) => (
                  <Card key={app.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{app.schemeName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Diajukan pada: {new Date(app.date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <Badge 
                            className={
                              app.status === "pending" ? "bg-amber-500" : 
                              app.status === "in_progress" ? "bg-blue-500" : 
                              app.status === "completed" ? "bg-green-500" : "bg-gray-500"
                            }
                          >
                            {app.status === "pending" ? "Menunggu" : 
                             app.status === "in_progress" ? "Dalam Proses" : 
                             app.status === "completed" ? "Selesai" : "Tidak Diketahui"}
                          </Badge>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Progress</span>
                            <span className="text-xs">{app.progress}%</span>
                          </div>
                          <Progress value={app.progress} className="h-2" />
                        </div>
                        
                        <div className="mt-6 flex gap-3">
                          <Button size="sm" variant="secondary">
                            <FileCheck className="h-4 w-4 mr-2" />
                            Lanjutkan
                          </Button>
                          <Button size="sm" variant="outline">
                            <Info className="h-4 w-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 w-full md:w-64 border-t md:border-l md:border-t-0 border-dashed">
                        <h4 className="font-medium text-sm mb-4">Langkah Berikutnya</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">APL-02</p>
                              <p className="text-xs text-muted-foreground">Isi form asesmen mandiri</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Upload className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Dokumen</p>
                              <p className="text-xs text-muted-foreground">Upload bukti pendukung</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileText className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Belum Ada Aplikasi</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Anda belum mengajukan aplikasi sertifikasi. Pilih skema sertifikasi dan mulai proses pendaftaran sekarang.
                  </p>
                  <Button onClick={handleApplyForCertification}>
                    <FilePlus2 className="h-4 w-4 mr-2" />
                    Daftar Sertifikasi Baru
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Tab Asesmen */}
          <TabsContent value="assessments" className={activeTab === "assessments" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Asesmen Saya</h2>
              <p className="text-muted-foreground">Jadwal dan hasil asesmen kompetensi Anda</p>
            </div>
            
            {isLoadingAssessments ? (
              <div className="text-center py-8">Loading...</div>
            ) : assessments && assessments.length > 0 ? (
              <div className="space-y-6">
                {assessments.map((assessment: any) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assessment.scheme?.name || "Skema Sertifikasi"}</CardTitle>
                          <CardDescription>
                            Tanggal Asesmen: {assessment.date ? new Date(assessment.date).toLocaleDateString('id-ID') : "Belum terjadwal"}
                          </CardDescription>
                        </div>
                        <Badge 
                          className={
                            assessment.status === "pending" ? "bg-amber-500" : 
                            assessment.status === "in_progress" ? "bg-blue-500" : 
                            assessment.status === "completed" ? "bg-green-500" : "bg-gray-500"
                          }
                        >
                          {assessment.status === "pending" ? "Menunggu" : 
                           assessment.status === "in_progress" ? "Sedang Berlangsung" : 
                           assessment.status === "completed" ? "Selesai" : "Tidak Diketahui"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Detail Asesmen</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <User className="h-4 w-4 mr-2" />
                              Asesor: {assessment.assessor || "Belum ditentukan"}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              Waktu: {assessment.time || "Belum ditentukan"}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Home className="h-4 w-4 mr-2" />
                              Lokasi: {assessment.location || "Belum ditentukan"}
                            </div>
                          </div>
                        </div>
                        
                        {assessment.status === "completed" && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Hasil Asesmen</h4>
                            <div className="p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">Hasil</span>
                                <Badge className={assessment.result === "K" ? "bg-green-500" : "bg-red-500"}>
                                  {assessment.result === "K" ? "Kompeten" : "Belum Kompeten"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {assessment.feedback || "Belum ada catatan"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline">
                          <Info className="h-4 w-4 mr-2" />
                          Detail Asesmen
                        </Button>
                        {assessment.status === "completed" && assessment.result === "K" && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Hasil Asesmen
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ListChecks className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Belum Ada Asesmen</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Anda belum memiliki jadwal asesmen. Selesaikan proses pendaftaran dan pengajuan aplikasi sertifikasi terlebih dahulu.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("applications")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Aplikasi Saya
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Tab Jadwal */}
          <TabsContent value="schedules" className={activeTab === "schedules" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Jadwal</h2>
              <p className="text-muted-foreground">Jadwal asesmen dan kegiatan terkait sertifikasi</p>
            </div>
            
            {isLoadingSchedules ? (
              <div className="text-center py-8">Loading...</div>
            ) : schedules && schedules.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jadwal Mendatang</CardTitle>
                    <CardDescription>Jadwal asesmen yang akan datang</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schedules.map((schedule: any) => (
                        <div key={schedule.id} className="flex items-start space-x-4 p-4 rounded-md border">
                          <div className="w-14 h-14 bg-[#79A84B]/10 rounded-md flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-[#79A84B]">
                              {schedule.startDate ? new Date(schedule.startDate).getDate() : "--"}
                            </span>
                            <span className="text-xs text-[#79A84B]">
                              {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('id-ID', { month: 'short' }) : "--"}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{schedule.title || "Jadwal Asesmen"}</h4>
                            <p className="text-sm text-muted-foreground">{schedule.description || "Tidak ada deskripsi"}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {schedule.startDate ? new Date(schedule.startDate).toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : "--"}
                              {schedule.endDate ? " - " + new Date(schedule.endDate).toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : ""}
                            </div>
                          </div>
                          
                          <Badge className="bg-blue-500">Terjadwal</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Calendar className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Belum Ada Jadwal Tersedia</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Saat ini belum ada jadwal asesmen yang tersedia. Silakan periksa kembali nanti.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Tab Sertifikat */}
          <TabsContent value="certificates" className={activeTab === "certificates" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Sertifikat Saya</h2>
              <p className="text-muted-foreground">Sertifikat kompetensi yang Anda peroleh</p>
            </div>
            
            {isLoadingCertificates ? (
              <div className="text-center py-8">Loading...</div>
            ) : certificates && certificates.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {certificates.map((certificate: any) => (
                  <Card key={certificate.id} className="overflow-hidden">
                    <div className="p-2 bg-[#79A84B]/10 border-b">
                      <div className="flex justify-center">
                        <LSPLogo className="h-12 w-12" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-center">{certificate.schemeName || "Sertifikat Kompetensi"}</CardTitle>
                      <CardDescription className="text-center">
                        Nomor: {certificate.number || "xxxxxx"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Nama</p>
                            <p className="font-medium">{user?.fullName || user?.username}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tanggal Terbit</p>
                            <p className="font-medium">{certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString('id-ID') : "--"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tanggal Berlaku</p>
                            <p className="font-medium">{certificate.validUntil ? new Date(certificate.validUntil).toLocaleDateString('id-ID') : "--"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge className="bg-green-500">Aktif</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Unduh Sertifikat
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Award className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Belum Ada Sertifikat</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Anda belum memiliki sertifikat kompetensi. Selesaikan proses asesmen untuk mendapatkan sertifikat.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("applications")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Aplikasi Saya
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Tab Pembayaran */}
          <TabsContent value="payments" className={activeTab === "payments" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Pembayaran</h2>
              <p className="text-muted-foreground">Riwayat pembayaran dan transaksi</p>
            </div>
            
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <CreditCard className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Belum Ada Pembayaran</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Anda belum memiliki riwayat pembayaran. Pembayaran diperlukan setelah Anda mendaftar sertifikasi.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("applications")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Aplikasi Saya
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Profil */}
          <TabsContent value="profile" className={activeTab === "profile" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Profil Saya</h2>
              <p className="text-muted-foreground">Informasi dan data diri Anda</p>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback className="text-2xl bg-[#79A84B]">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold">{user?.fullName || user?.username}</h3>
                    <p className="text-muted-foreground">{user?.email || "Email belum diatur"}</p>
                    
                    <div className="mt-4 flex gap-3 justify-center md:justify-start">
                      <Button size="sm">Edit Profil</Button>
                      <Button size="sm" variant="outline">Ubah Kata Sandi</Button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium mb-1">Kelengkapan Profil</div>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Status</span>
                        <span className="font-medium">{profile?.completeness || 0}% Lengkap</span>
                      </div>
                      <Progress value={profile?.completeness || 0} className="h-2 mb-3" />
                      
                      {profile?.missingFields && profile.missingFields.length > 0 && (
                        <div className="text-xs text-amber-600">
                          <p>Data yang perlu dilengkapi:</p>
                          <ul className="list-disc list-inside">
                            {profile.missingFields.map((field: string, index: number) => (
                              <li key={index}>{field}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Pribadi</CardTitle>
                  <CardDescription>Informasi data diri Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Nama Lengkap</dt>
                      <dd className="text-sm">{user?.fullName || "-"}</dd>
                    </div>
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Email</dt>
                      <dd className="text-sm">{user?.email || "-"}</dd>
                    </div>
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">No. Telepon</dt>
                      <dd className="text-sm">{user?.phoneNumber || "-"}</dd>
                    </div>
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Alamat</dt>
                      <dd className="text-sm">{user?.address || "-"}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Edit Data Pribadi
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Pekerjaan</CardTitle>
                  <CardDescription>Informasi pekerjaan & perusahaan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Data pekerjaan belum diisi. Silakan lengkapi data pekerjaan Anda.
                    </p>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Tambah Data Pekerjaan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Pengaturan */}
          <TabsContent value="settings" className={activeTab === "settings" ? "block" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Pengaturan</h2>
              <p className="text-muted-foreground">Pengaturan akun dan preferensi</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan Akun</CardTitle>
                  <CardDescription>Pengaturan untuk keamanan akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Kata Sandi</div>
                      <div className="text-xs text-muted-foreground">Terakhir diubah: Belum pernah</div>
                    </div>
                    <Button size="sm" variant="outline">Ubah</Button>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Email Verifikasi</div>
                      <div className="text-xs text-muted-foreground">Gunakan untuk verifikasi dan notifikasi</div>
                    </div>
                    <Button size="sm" variant="outline">Verifikasi</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notifikasi</CardTitle>
                  <CardDescription>Pengaturan notifikasi dan pemberitahuan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Email Notifikasi</div>
                      <div className="text-xs text-muted-foreground">Terima notifikasi via email</div>
                    </div>
                    <Button size="sm" variant="outline">Aktifkan</Button>
                  </div>
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Notifikasi Aplikasi</div>
                      <div className="text-xs text-muted-foreground">Notifikasi dalam aplikasi</div>
                    </div>
                    <Button size="sm" variant="outline">Atur</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </main>
      </div>
    </div>
  );
}