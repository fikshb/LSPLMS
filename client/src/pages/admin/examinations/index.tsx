import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
// Tidak perlu import AdminLayout karena sudah ada protected route di App.tsx
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  Check,
  Clock,
  File,
  FilePlus,
  FileText,
  Filter,
  GraduationCap,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

// Definisi tipe data ujian
type Examination = {
  id: number;
  templateId: number;
  applicationId: number;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  totalQuestions: number | null;
  correctAnswers: number | null;
  score: number | null;
  passed: boolean | null;
  status: "pending" | "in_progress" | "completed" | "evaluated";
  createdAt: string;
  updatedAt: string;
  evaluatedBy: number | null;
  evaluatedAt: string | null;
  template?: {
    name: string;
    scheme?: {
      name: string;
    };
  };
  application?: {
    asesi?: {
      user?: {
        fullName: string;
      };
    };
  };
};

// Definisi form untuk membuat ujian baru
const createExamSchema = z.object({
  templateId: z.string().min(1, "Template ujian harus dipilih"),
  applicationId: z.string().min(1, "Asesi harus dipilih"),
});

type CreateExamFormValues = z.infer<typeof createExamSchema>;

// Definisi tipe skema sertifikasi untuk filter
type Scheme = {
  id: number;
  name: string;
  slug: string;
};

export default function ExaminationsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<string>("all");
  const { toast } = useToast();

  // Form untuk membuat ujian baru
  const createExamForm = useForm<CreateExamFormValues>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      templateId: "",
      applicationId: "",
    },
  });

  // Fetch data ujian
  const { data: examinations = [], isLoading: isLoadingExams } = useQuery<Examination[]>({
    queryKey: ["/api/examinations"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch data template ujian untuk form
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<any[]>({
    queryKey: ["/api/examination-templates"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch daftar pendaftar (applications) untuk form
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<any[]>({
    queryKey: ["/api/applications"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch daftar skema sertifikasi untuk filter
  const { data: schemes = [], isLoading: isLoadingSchemes } = useQuery<Scheme[]>({
    queryKey: ["/api/schemes"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Mutation untuk membuat ujian baru
  const createExamMutation = useMutation({
    mutationFn: async (data: CreateExamFormValues) => {
      const res = await apiRequest("POST", `/api/examinations?nocache=${Date.now()}`, {
        templateId: parseInt(data.templateId),
        applicationId: parseInt(data.applicationId),
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ujian berhasil dibuat",
        description: "Ujian baru telah berhasil dibuat dan menunggu diambil oleh asesi.",
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
      createExamForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat ujian",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mengelompokkan ujian berdasarkan status
  const pendingExams = examinations.filter((exam: Examination) => exam.status === "pending");
  const activeExams = examinations.filter((exam: Examination) => exam.status === "in_progress");
  const completedExams = examinations.filter((exam: Examination) => exam.status === "completed");
  const evaluatedExams = examinations.filter((exam: Examination) => exam.status === "evaluated");

  // Handler untuk form submit
  const onSubmitCreate = (data: CreateExamFormValues) => {
    createExamMutation.mutate(data);
  };

  // Filter ujian berdasarkan skema yang dipilih
  const filterExamsByScheme = (exams: Examination[]) => {
    if (selectedScheme === "all") return exams;
    
    return exams.filter(exam => 
      exam.template?.scheme?.name && 
      exam.template.scheme.name === selectedScheme
    );
  };

  // Format tanggal
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Ujian</h1>
            <p className="text-muted-foreground">
              Mengelola ujian sertifikasi untuk semua asesi
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#79A84B]"
          >
            <FilePlus className="h-4 w-4 mr-2" /> 
            Buat Ujian Baru
          </Button>
        </div>

        {/* Filter dan pencarian */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="flex gap-2">
              <Select 
                value={selectedScheme} 
                onValueChange={setSelectedScheme}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Filter berdasarkan skema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Skema</SelectItem>
                  {schemes?.map((scheme: Scheme) => (
                    <SelectItem key={scheme.id} value={scheme.name}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative flex-1 md:max-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama asesi..." 
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs ujian berdasarkan status */}
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="flex gap-2">
              Menunggu
              <Badge variant="secondary" className="ml-1">
                {pendingExams.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex gap-2">
              Berlangsung
              <Badge variant="secondary" className="ml-1">
                {activeExams.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex gap-2">
              Selesai
              <Badge variant="secondary" className="ml-1">
                {completedExams.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="evaluated" className="flex gap-2">
              Dinilai
              <Badge variant="secondary" className="ml-1">
                {evaluatedExams.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Konten tab untuk ujian menunggu */}
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingExams ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filterExamsByScheme(pendingExams).length === 0 ? (
                <div className="col-span-full bg-muted/20 rounded-lg p-8 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada ujian menunggu</h3>
                  <p className="text-muted-foreground text-sm">
                    Tidak ada ujian yang menunggu untuk diambil oleh asesi
                  </p>
                </div>
              ) : (
                renderExaminationCards(filterExamsByScheme(pendingExams))
              )}
            </div>
          </TabsContent>

          {/* Konten tab untuk ujian berlangsung */}
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingExams ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filterExamsByScheme(activeExams).length === 0 ? (
                <div className="col-span-full bg-muted/20 rounded-lg p-8 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada ujian berlangsung</h3>
                  <p className="text-muted-foreground text-sm">
                    Tidak ada ujian yang sedang berlangsung saat ini
                  </p>
                </div>
              ) : (
                renderExaminationCards(filterExamsByScheme(activeExams))
              )}
            </div>
          </TabsContent>

          {/* Konten tab untuk ujian selesai */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingExams ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filterExamsByScheme(completedExams).length === 0 ? (
                <div className="col-span-full bg-muted/20 rounded-lg p-8 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada ujian selesai</h3>
                  <p className="text-muted-foreground text-sm">
                    Tidak ada ujian yang telah selesai namun belum dinilai
                  </p>
                </div>
              ) : (
                renderExaminationCards(filterExamsByScheme(completedExams))
              )}
            </div>
          </TabsContent>

          {/* Konten tab untuk ujian dinilai */}
          <TabsContent value="evaluated">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingExams ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filterExamsByScheme(evaluatedExams).length === 0 ? (
                <div className="col-span-full bg-muted/20 rounded-lg p-8 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada ujian dinilai</h3>
                  <p className="text-muted-foreground text-sm">
                    Tidak ada ujian yang telah dinilai
                  </p>
                </div>
              ) : (
                renderExaminationCards(filterExamsByScheme(evaluatedExams))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog untuk membuat ujian baru */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Ujian Baru</DialogTitle>
            <DialogDescription>
              Buat ujian baru untuk asesi dengan mengisi form di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <Form {...createExamForm}>
            <form onSubmit={createExamForm.handleSubmit(onSubmitCreate)} className="space-y-4">
              {/* Template Ujian */}
              <FormField
                control={createExamForm.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Ujian</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih template ujian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name} - {template.scheme?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Template menentukan skema dan jenis soal ujian
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asesi (Pendaftar) */}
              <FormField
                control={createExamForm.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asesi</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih asesi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {applications.map((application) => (
                          <SelectItem 
                            key={application.id} 
                            value={application.id.toString()}
                          >
                            {application.asesi?.user?.fullName || "Asesi #" + application.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pilih asesi yang akan mengikuti ujian ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowCreateDialog(false);
                    createExamForm.reset();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#79A84B]"
                  disabled={createExamMutation.isPending}
                >
                  {createExamMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Buat Ujian
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );

  // Fungsi helper untuk menampilkan kartu ujian
  function renderExaminationCards(exams: Examination[]) {
    return (
      <>
        {exams.map((exam: Examination) => (
          <Card key={exam.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="truncate">
                  {exam.application?.asesi?.user?.fullName || "Asesi #" + exam.applicationId}
                </span>
                {exam.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Menunggu</Badge>
                )}
                {exam.status === "in_progress" && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Berlangsung</Badge>
                )}
                {exam.status === "completed" && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Selesai</Badge>
                )}
                {exam.status === "evaluated" && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Dinilai</Badge>
                )}
              </CardTitle>
              <CardDescription className="truncate">
                {exam.template?.name || "Template #" + exam.templateId}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1.5">
                <p className="text-sm flex items-center">
                  <GraduationCap className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Skema:</span>
                  <span className="ml-1 font-medium">
                    {exam.template?.scheme?.name || "-"}
                  </span>
                </p>
                <p className="text-sm flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Mulai:</span>
                  <span className="ml-1 font-medium">
                    {formatDate(exam.startTime)}
                  </span>
                </p>
                {exam.endTime && (
                  <p className="text-sm flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Selesai:</span>
                    <span className="ml-1 font-medium">
                      {formatDate(exam.endTime)}
                    </span>
                  </p>
                )}
                {exam.status === "evaluated" && (
                  <div className="text-sm flex items-center mt-2">
                    <span className="text-muted-foreground">Hasil:</span>
                    <span className="ml-1 font-medium">
                      {exam.score !== null ? `${exam.score}%` : "-"}
                    </span>
                    {exam.passed !== null && (
                      <Badge 
                        variant="outline" 
                        className={exam.passed ? "ml-2 text-green-600 border-green-200 bg-green-50" : "ml-2 text-red-600 border-red-200 bg-red-50"}
                      >
                        {exam.passed ? "Lulus" : "Tidak Lulus"}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Link 
                href={`/admin/examinations/${exam.id}`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {exam.status === "completed" ? "Nilai Ujian" : "Lihat Detail"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </>
    );
  }
}