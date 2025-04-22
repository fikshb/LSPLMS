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
  Search,
  Download,
  Upload,
  Edit,
  CheckSquare,
  User,
  Filter,
  MoreHorizontal,
  Info,
  ThumbsUp,
  ThumbsDown,
  FileClock,
  File,
  PlusCircle
} from "lucide-react";
import { LSPLogo } from "@/assets/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AsesorDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState("all");
  const [assessmentFilters, setAssessmentFilters] = useState({
    status: "all",
    searchTerm: "",
  });

  // Fetch assessments assigned to this asesor
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery<any[]>({
    queryKey: ["/api/asesor/assessments"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesor",
    placeholderData: [
      {
        id: 1,
        asesi: {
          id: 101,
          name: "Budi Santoso",
          profilePic: null
        },
        scheme: {
          id: 1,
          name: "Digital Marketing"
        },
        date: "2025-05-21",
        status: "pending",
        completedSteps: 0
      },
      {
        id: 2,
        asesi: {
          id: 102,
          name: "Sarah Amelia",
          profilePic: null
        },
        scheme: {
          id: 2,
          name: "Web Developer"
        },
        date: "2025-05-22",
        status: "pending",
        completedSteps: 0
      },
      {
        id: 3,
        asesi: {
          id: 103,
          name: "Ahmad Hidayat",
          profilePic: null
        },
        scheme: {
          id: 3,
          name: "UI/UX Designer"
        },
        date: "2025-05-25",
        status: "pending",
        completedSteps: 0
      },
      {
        id: 4,
        asesi: {
          id: 104,
          name: "Dewi Putri",
          profilePic: null
        },
        scheme: {
          id: 1,
          name: "Digital Marketing"
        },
        date: "2025-05-15",
        status: "in_progress",
        completedSteps: 2
      },
      {
        id: 5,
        asesi: {
          id: 105,
          name: "Rudi Hartono",
          profilePic: null
        },
        scheme: {
          id: 4,
          name: "Android Developer"
        },
        date: "2025-05-10",
        status: "completed",
        result: "kompeten",
        completedSteps: 5
      }
    ]
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
    placeholderData: [
      { id: 1, code: "FR.AK.01", name: "Observasi Aktivitas di Tempat Kerja", type: "assessment" },
      { id: 2, code: "FR.AK.02", name: "Pertanyaan untuk Mendukung Observasi", type: "assessment" },
      { id: 3, code: "FR.IA.01", name: "Pertanyaan Tertulis Pilihan Ganda", type: "assessment" },
      { id: 4, code: "FR.IA.03", name: "Daftar Pertanyaan Wawancara", type: "assessment" },
      { id: 5, code: "FR.AK.03", name: "Formulir Umpan Balik ke Peserta", type: "feedback" },
      { id: 6, code: "FR.AK.05", name: "Laporan Asesmen", type: "report" }
    ]
  });
  
  // Fetch schedules
  const { data: schedules = [], isLoading: isLoadingSchedules } = useQuery<any[]>({
    queryKey: ["/api/schedules"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Fetch participants (asesis)
  const { data: participants = [], isLoading: isLoadingParticipants } = useQuery<any[]>({
    queryKey: ["/api/asesor/participants"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === "asesor",
    placeholderData: [
      { id: 101, name: "Budi Santoso", applicationCount: 1, email: "budi@example.com", status: "active" },
      { id: 102, name: "Sarah Amelia", applicationCount: 1, email: "sarah@example.com", status: "active" },
      { id: 103, name: "Ahmad Hidayat", applicationCount: 1, email: "ahmad@example.com", status: "active" },
      { id: 104, name: "Dewi Putri", applicationCount: 1, email: "dewi@example.com", status: "active" },
      { id: 105, name: "Rudi Hartono", applicationCount: 1, email: "rudi@example.com", status: "active" }
    ]
  });

  // Calculate statistics
  const pendingCount = assessments.filter(a => a.status === "pending").length;
  const inProgressCount = assessments.filter(a => a.status === "in_progress").length;
  const completedCount = assessments.filter(a => a.status === "completed").length;
  const totalCount = assessments.length;

  // Filter assessments based on selected status and search term
  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      const matchesStatus = assessmentFilters.status === "all" || assessment.status === assessmentFilters.status;
      const matchesSearch = assessmentFilters.searchTerm === "" || 
        assessment.asesi.name.toLowerCase().includes(assessmentFilters.searchTerm.toLowerCase()) ||
        assessment.scheme.name.toLowerCase().includes(assessmentFilters.searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };

  // Handle file download demonstration (this would need to be replaced with actual file download)
  const handleDownloadFile = (fileType: string, id: number) => {
    toast({
      title: "Mengunduh file",
      description: `File ${fileType} (ID: ${id}) sedang diunduh.`,
    });
  };

  // Handle assessment navigation
  const handleAssessmentDetails = (id: number) => {
    toast({
      title: "Fungsi dalam pengembangan",
      description: `Detail asesmen (ID: ${id}) akan tersedia segera.`,
    });
    // In the future: navigate(`/asesor/assessment/${id}`);
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
                Portal Asesor
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
          <h1 className="text-xl font-bold">Selamat Datang, {user?.fullName || user?.username || "Asesor"}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview">
              <Alert className="mb-6 border-[#79A84B]/30 bg-[#79A84B]/10">
                <Info className="h-4 w-4 text-[#79A84B]" />
                <AlertTitle>Portal Asesor LSP WKN</AlertTitle>
                <AlertDescription>
                  Selamat datang di panel asesor. Di sini Anda dapat mengelola dan melakukan penilaian terhadap peserta asesmen.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Asesmen Tertunda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <p className="text-xs text-muted-foreground">Peserta yang menunggu asesmen</p>
                    {schedules && schedules.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          Jadwal asesmen berikutnya
                        </div>
                        <div className="text-sm font-medium">
                          {new Date(schedules[0].startDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("assessments")}>
                      <ClipboardCheck className="h-4 w-4 mr-2" />
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
                        <Badge className="bg-amber-500">{pendingCount}</Badge>
                      </div>
                      <Progress 
                        value={totalCount ? (pendingCount / totalCount) * 100 : 0} 
                        className="h-2 bg-amber-100" 
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sedang Diases</span>
                        <Badge className="bg-blue-500">{inProgressCount}</Badge>
                      </div>
                      <Progress 
                        value={totalCount ? (inProgressCount / totalCount) * 100 : 0} 
                        className="h-2 bg-blue-100" 
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Selesai</span>
                        <Badge className="bg-green-500">{completedCount}</Badge>
                      </div>
                      <Progress 
                        value={totalCount ? (completedCount / totalCount) * 100 : 0} 
                        className="h-2 bg-green-100" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("assessments")}>
                      <FileText className="h-4 w-4 mr-2" />
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
                      <Award className="h-4 w-4 mr-2" />
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
                    ) : assessments && assessments.filter(a => a.status === "pending").length > 0 ? (
                      <div className="space-y-4">
                        <div className="border rounded-md">
                          <div className="flex items-center justify-between p-4 border-b bg-muted">
                            <div className="font-medium">Peserta</div>
                            <div className="font-medium">Skema</div>
                            <div className="font-medium">Tanggal</div>
                            <div className="font-medium">Status</div>
                          </div>
                          <div className="divide-y">
                            {assessments.filter(a => a.status === "pending").map((assessment: any) => (
                              <div 
                                key={assessment.id} 
                                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleAssessmentDetails(assessment.id)}
                              >
                                <div>{assessment.asesi.name}</div>
                                <div className="text-sm">{assessment.scheme.name}</div>
                                <div className="text-sm">
                                  {new Date(assessment.date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                                <Badge className="bg-amber-500">Menunggu</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Tidak ada asesmen yang tertunda saat ini
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("schedule")}>
                      <Calendar className="h-4 w-4 mr-2" />
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
                      {isLoadingForms ? (
                        <div className="text-center py-4">Loading...</div>
                      ) : forms && forms.length > 0 ? (
                        forms.slice(0, 4).map((form: any) => (
                          <div key={form.id} className="flex items-center">
                            <FileSearch className="h-5 w-5 mr-2 text-[#79A84B]" />
                            <div>
                              <div className="text-sm font-medium">{form.code}</div>
                              <div className="text-xs text-muted-foreground">{form.name}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Tidak ada formulir tersedia
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("forms")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Lihat Semua Formulir
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Manajemen Asesmen</h2>
                <p className="text-muted-foreground">Kelola dan nilai proses asesmen kompetensi peserta</p>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Daftar Asesmen</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Cari peserta atau skema..."
                          className="pl-8 w-full sm:w-[250px]"
                          value={assessmentFilters.searchTerm}
                          onChange={(e) => setAssessmentFilters({
                            ...assessmentFilters,
                            searchTerm: e.target.value
                          })}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem 
                            className={assessmentFilters.status === "all" ? "bg-muted" : ""}
                            onClick={() => setAssessmentFilters({...assessmentFilters, status: "all"})}
                          >
                            Semua Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={assessmentFilters.status === "pending" ? "bg-muted" : ""}
                            onClick={() => setAssessmentFilters({...assessmentFilters, status: "pending"})}
                          >
                            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                            Menunggu
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={assessmentFilters.status === "in_progress" ? "bg-muted" : ""}
                            onClick={() => setAssessmentFilters({...assessmentFilters, status: "in_progress"})}
                          >
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            Dalam Proses
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={assessmentFilters.status === "completed" ? "bg-muted" : ""}
                            onClick={() => setAssessmentFilters({...assessmentFilters, status: "completed"})}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Selesai
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingAssessments ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : getFilteredAssessments().length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Peserta</TableHead>
                            <TableHead>Skema Sertifikasi</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredAssessments().map((assessment) => (
                            <TableRow key={assessment.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={assessment.asesi.profilePic} alt={assessment.asesi.name} />
                                    <AvatarFallback className="bg-[#79A84B] text-white">
                                      {assessment.asesi.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{assessment.asesi.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>{assessment.scheme.name}</TableCell>
                              <TableCell>
                                {new Date(assessment.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </TableCell>
                              <TableCell>
                                {assessment.status === "pending" && (
                                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Menunggu
                                  </Badge>
                                )}
                                {assessment.status === "in_progress" && (
                                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Dalam Proses
                                  </Badge>
                                )}
                                {assessment.status === "completed" && (
                                  <Badge variant="outline" className="border-green-500 text-green-500">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Selesai
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {assessment.status === "pending" && (
                                  <Button variant="outline" size="sm" onClick={() => handleAssessmentDetails(assessment.id)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Review APL
                                  </Button>
                                )}
                                {assessment.status === "in_progress" && (
                                  <Button variant="outline" size="sm" onClick={() => handleAssessmentDetails(assessment.id)}>
                                    <ClipboardCheck className="h-4 w-4 mr-2" />
                                    Lanjutkan Asesmen
                                  </Button>
                                )}
                                {assessment.status === "completed" && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleAssessmentDetails(assessment.id)}>
                                        <Info className="h-4 w-4 mr-2" />
                                        Lihat Detail
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDownloadFile("report", assessment.id)}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Unduh Laporan
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Tidak ada asesmen yang ditemukan dengan filter yang dipilih
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Proses Asesmen</CardTitle>
                    <CardDescription>Petunjuk langkah-langkah asesmen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-4 pb-1 pt-2">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-muted ml-3.5 mt-5"></div>
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                          1
                        </div>
                        <div className="grid gap-1.5">
                          <div className="font-medium">Verifikasi Kelengkapan Dokumen</div>
                          <div className="text-sm text-muted-foreground">
                            Periksa dokumen APL-01 dan APL-02 dari peserta
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                          2
                        </div>
                        <div className="grid gap-1.5">
                          <div className="font-medium">Penilaian Portofolio</div>
                          <div className="text-sm text-muted-foreground">
                            Evaluasi dokumen pendukung yang diunggah peserta
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                          3
                        </div>
                        <div className="grid gap-1.5">
                          <div className="font-medium">Wawancara/Observasi</div>
                          <div className="text-sm text-muted-foreground">
                            Lakukan sesi tanya jawab dan/atau observasi kinerja
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                          4
                        </div>
                        <div className="grid gap-1.5">
                          <div className="font-medium">Pengambilan Keputusan</div>
                          <div className="text-sm text-muted-foreground">
                            Tentukan hasil asesmen (Kompeten atau Belum Kompeten)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center bg-primary text-white">
                          5
                        </div>
                        <div className="grid gap-1.5">
                          <div className="font-medium">Umpan Balik & Laporan</div>
                          <div className="text-sm text-muted-foreground">
                            Berikan umpan balik dan buat laporan hasil asesmen
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Template Penilaian</CardTitle>
                    <CardDescription>Dokumen yang digunakan untuk asesmen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-3 text-[#79A84B]" />
                          <div>
                            <div className="font-medium">Template FR.IA.01</div>
                            <div className="text-xs text-muted-foreground">Pertanyaan Tertulis</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadFile("template", 1)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-3 text-[#79A84B]" />
                          <div>
                            <div className="font-medium">Template FR.IA.03</div>
                            <div className="text-xs text-muted-foreground">Daftar Pertanyaan Wawancara</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadFile("template", 2)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-3 text-[#79A84B]" />
                          <div>
                            <div className="font-medium">Template FR.AK.03</div>
                            <div className="text-xs text-muted-foreground">Formulir Umpan Balik</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadFile("template", 3)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-3 text-[#79A84B]" />
                          <div>
                            <div className="font-medium">Template FR.AK.05</div>
                            <div className="text-xs text-muted-foreground">Laporan Hasil Asesmen</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadFile("template", 4)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("forms")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Lihat Semua Template
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Jadwal Asesmen</h2>
                <p className="text-muted-foreground">Jadwal asesmen yang telah dialokasikan kepada Anda</p>
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Kalender Asesmen</CardTitle>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem>
                            Semua Jadwal
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Minggu Ini
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Bulan Ini
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            3 Bulan Ke Depan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingSchedules ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : schedules && schedules.length > 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-md border divide-y">
                        {schedules.slice(0, 5).map((schedule: any, index: number) => (
                          <div
                            key={schedule.id || index}
                            className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-gray-50"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-[#79A84B]/10 flex flex-col items-center justify-center">
                              <span className="text-lg font-bold text-[#79A84B]">
                                {new Date(schedule.startDate).getDate()}
                              </span>
                              <span className="text-xs text-[#79A84B]">
                                {new Date(schedule.startDate).toLocaleDateString('id-ID', { month: 'short' })}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium">{schedule.title || "Jadwal Asesmen"}</h4>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
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
                            
                            <div className="flex items-center gap-2 ml-auto mt-2 md:mt-0">
                              <Badge variant="outline" className="border-blue-500 text-blue-500">
                                {schedule.participantCount || (Math.floor(Math.random() * 5) + 1)} Peserta
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Tidak ada jadwal asesmen yang tersedia
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Participants Tab */}
            <TabsContent value="participants">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Peserta Asesmen</h2>
                <p className="text-muted-foreground">Peserta yang terdaftar untuk asesmen dengan Anda</p>
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Daftar Peserta</CardTitle>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Cari peserta..."
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingParticipants ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : participants && participants.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Jumlah Aplikasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {participants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#79A84B] text-white">
                                      {participant.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{participant.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>{participant.email}</TableCell>
                              <TableCell>{participant.applicationCount}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  {participant.status === "active" ? "Aktif" : "Tidak Aktif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  <Info className="h-4 w-4 mr-2" />
                                  Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada peserta yang terdaftar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Forms Tab */}
            <TabsContent value="forms">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Manajemen Formulir</h2>
                <p className="text-muted-foreground">Kelola dan akses formulir untuk pelaksanaan asesmen</p>
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Formulir Asesmen</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Cari formulir..."
                          className="pl-8 w-full sm:w-[250px]"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem>Semua Formulir</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Formulir Asesmen</DropdownMenuItem>
                          <DropdownMenuItem>Formulir Umpan Balik</DropdownMenuItem>
                          <DropdownMenuItem>Laporan Asesmen</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingForms ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : forms && forms.length > 0 ? (
                    <div className="rounded-md border divide-y">
                      {forms.map((form: any) => (
                        <div 
                          key={form.id} 
                          className="flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            {form.type === "assessment" && <ClipboardCheck className="h-5 w-5 mr-3 text-blue-500" />}
                            {form.type === "feedback" && <ThumbsUp className="h-5 w-5 mr-3 text-amber-500" />}
                            {form.type === "report" && <FileClock className="h-5 w-5 mr-3 text-green-500" />}
                            <div>
                              <div className="font-medium">{form.code}</div>
                              <div className="text-xs text-muted-foreground">{form.name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleDownloadFile("template", form.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Tidak ada formulir yang tersedia
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Panduan Penggunaan Formulir</CardTitle>
                    <CardDescription>Instruksi dan petunjuk untuk mengisi formulir asesmen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-[#79A84B]/10">
                      <h3 className="text-sm font-medium mb-2">Formulir FR.APL.01 dan FR.APL.02</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diisi oleh peserta sertifikasi. Asesor bertugas untuk memeriksa kelengkapan
                        dan kesesuaian dokumen dengan standar kompetensi.
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Panduan Verifikasi APL
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md bg-blue-500/10">
                      <h3 className="text-sm font-medium mb-2">Formulir Asesmen (FR.IA dan FR.AK)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diisi oleh asesor saat melakukan proses asesmen. Berisi kriteria unjuk kerja, pertanyaan,
                        dan rubrik penilaian.
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Panduan Pengisian
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md bg-green-500/10">
                      <h3 className="text-sm font-medium mb-2">Laporan Asesmen (FR.AK.05)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diisi oleh asesor setelah proses asesmen selesai. Berisi rekomendasi dan keputusan
                        hasil asesmen.
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Panduan Pelaporan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Profil Asesor</h2>
                <p className="text-muted-foreground">Kelola profil dan informasi asesor Anda</p>
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
                      <p className="text-muted-foreground">{user?.email}</p>
                      <Badge className="mt-2 bg-[#79A84B]">Asesor Tersertifikasi BNSP</Badge>
                      
                      <div className="mt-4 flex gap-3 justify-center md:justify-start">
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profil
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Foto
                        </Button>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto flex flex-col gap-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium mb-1">No. Lisensi</div>
                        <div className="text-sm">BNSP-ASR-123/IV/2023</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium mb-1">Masa Berlaku</div>
                        <div className="text-sm">12 April 2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Kompetensi</CardTitle>
                    <CardDescription>Informasi kompetensi dan spesialisasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Bidang Kompetensi</dt>
                        <dd className="text-sm">Teknologi Informasi dan Komunikasi</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Spesialisasi</dt>
                        <dd className="text-sm">Pengembangan Web, Digital Marketing</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Pengalaman</dt>
                        <dd className="text-sm">5 Tahun</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Sertifikasi</dt>
                        <dd className="text-sm">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Asesor Kompetensi BNSP</li>
                            <li>Master Trainer TOT</li>
                            <li>Digital Marketing Specialist</li>
                          </ul>
                        </dd>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Data Kompetensi
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Asesmen</CardTitle>
                    <CardDescription>Riwayat kegiatan asesmen yang telah dilakukan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Total Asesmen</dt>
                        <dd className="text-sm font-medium">30</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Peserta Kompeten</dt>
                        <dd className="text-sm font-medium text-green-600">25</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Peserta Belum Kompeten</dt>
                        <dd className="text-sm font-medium text-red-600">5</dd>
                      </div>
                      <Separator />
                      
                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-muted-foreground sm:w-[180px]">Asesmen Bulan Ini</dt>
                        <dd className="text-sm font-medium">3</dd>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Tingkat Kelulusan</div>
                      <Progress value={83} className="h-2" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">83% Kompeten</span>
                        <span className="text-xs text-muted-foreground">17% Belum Kompeten</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Lihat Laporan Lengkap
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Pengaturan</h2>
                <p className="text-muted-foreground">Kelola pengaturan akun dan preferensi</p>
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
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Autentikasi Dua Faktor</div>
                        <div className="text-xs text-muted-foreground">Tingkatkan keamanan akun Anda</div>
                      </div>
                      <Button size="sm" variant="outline">Aktifkan</Button>
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
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Pengingat Jadwal</div>
                        <div className="text-xs text-muted-foreground">Dapatkan pengingat jadwal asesmen</div>
                      </div>
                      <Button size="sm" variant="outline">Aktifkan</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Preferensi Asesmen</CardTitle>
                    <CardDescription>Pengaturan untuk pelaksanaan asesmen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Template Laporan Default</div>
                        <div className="text-xs text-muted-foreground">Template yang digunakan untuk laporan asesmen</div>
                      </div>
                      <Button size="sm" variant="outline">Pilih Template</Button>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Format Umpan Balik</div>
                        <div className="text-xs text-muted-foreground">Format umpan balik untuk peserta</div>
                      </div>
                      <Button size="sm" variant="outline">Atur Format</Button>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Jumlah Asesmen per Hari</div>
                        <div className="text-xs text-muted-foreground">Batas maksimum asesmen yang dilakukan per hari</div>
                      </div>
                      <Button size="sm" variant="outline">Atur Batas</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}