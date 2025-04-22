import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon, EditIcon, ListIcon, ClipboardCheckIcon, UserIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
// Impor AdminLayout yang sudah dibuat
import AdminLayout from "@/components/admin-layout";

// Type definitions
type Examination = {
  id: number;
  templateId: number;
  applicationId: number;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  totalQuestions: number;
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
    schemeId: number;
  };
  application?: {
    id: number;
    asesiId: number;
    asesi?: {
      userId: number;
      user?: {
        fullName: string;
      };
    };
  };
};

type ExaminationTemplate = {
  id: number;
  name: string;
  schemeId: number;
  scheme?: {
    name: string;
  };
};

type CertificationApplication = {
  id: number;
  asesiId: number;
  schemeId: number;
  status: string;
  asesi?: {
    userId: number;
    user?: {
      fullName: string;
    };
  };
  scheme?: {
    name: string;
  };
};

// Schema for examination form validation
const examinationFormSchema = z.object({
  templateId: z.coerce.number().min(1, "Template ujian harus dipilih"),
  applicationId: z.coerce.number().min(1, "Aplikasi sertifikasi harus dipilih"),
});

export default function ExaminationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Form setup for adding examinations
  const form = useForm<z.infer<typeof examinationFormSchema>>({
    resolver: zodResolver(examinationFormSchema),
    defaultValues: {
      templateId: 0,
      applicationId: 0,
    },
  });

  // Query to fetch all examinations
  const { data: examinations = [], isLoading: isLoadingExaminations } = useQuery({
    queryKey: ["/api/examinations", selectedStatus],
    queryFn: () => {
      let url = "/api/examinations";
      if (selectedStatus) {
        url += `?status=${selectedStatus}`;
      }
      return apiRequest("GET", url).then(res => res.json());
    },
  });

  // Query to fetch all examination templates
  const { data: templates = [] } = useQuery({
    queryKey: ["/api/examination-templates"],
    queryFn: () => apiRequest("GET", "/api/examination-templates").then(res => res.json()),
  });

  // Query to fetch eligible certification applications
  const { data: applications = [] } = useQuery({
    queryKey: ["/api/certification-applications/eligible"],
    queryFn: () => apiRequest("GET", "/api/certification-applications/eligible").then(res => res.json()),
  });

  // Mutation to create a new examination
  const createExaminationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof examinationFormSchema>) => {
      return apiRequest("POST", "/api/examinations", values).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Ujian berhasil dibuat",
        description: "Ujian baru telah berhasil dibuat dan siap digunakan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membuat ujian",
        description: error.message || "Terjadi kesalahan saat membuat ujian",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission for adding an examination
  const onSubmitAdd = (values: z.infer<typeof examinationFormSchema>) => {
    createExaminationMutation.mutate(values);
  };

  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">Belum dimulai</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sedang berlangsung</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Menunggu evaluasi</Badge>;
      case "evaluated":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render the page
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manajemen Ujian</h1>
          <Button onClick={() => {
            form.reset();
            setIsAddDialogOpen(true);
          }}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Buat Ujian Baru
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) => setSelectedStatus(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter berdasarkan Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Belum Dimulai</SelectItem>
              <SelectItem value="in_progress">Sedang Berlangsung</SelectItem>
              <SelectItem value="completed">Menunggu Evaluasi</SelectItem>
              <SelectItem value="evaluated">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoadingExaminations ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peserta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Mulai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Selesai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {examinations?.length > 0 ? (
                    examinations.map((examination: Examination) => (
                      <tr key={examination.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{examination.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {examination.application?.asesi?.user?.fullName || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {examination.template?.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(examination.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(examination.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(examination.endTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {examination.score !== null ? `${examination.score}%` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={examination.status !== "completed"}
                            >
                              <ClipboardCheckIcon className="h-4 w-4 mr-1" />
                              Evaluasi
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <ListIcon className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        Tidak ada ujian yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dialog for adding a new examination */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Ujian Baru</DialogTitle>
              <DialogDescription>
                Pilih template ujian dan peserta untuk membuat ujian baru.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Ujian</FormLabel>
                      <Select
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Template Ujian" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates?.map((template: ExaminationTemplate) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name} ({template.scheme?.name || ""})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Template berisi konfigurasi ujian yang akan digunakan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aplikasi Sertifikasi</FormLabel>
                      <Select
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Aplikasi Sertifikasi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {applications?.map((application: CertificationApplication) => (
                            <SelectItem key={application.id} value={application.id.toString()}>
                              {application.asesi?.user?.fullName || "Unnamed"} - {application.scheme?.name || ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih peserta yang akan mengikuti ujian ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createExaminationMutation.isPending}
                  >
                    {createExaminationMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Buat Ujian
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}