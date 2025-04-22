import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Plus, Eye, Play, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";

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

export default function ExaminationsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newExamination, setNewExamination] = useState({
    templateId: "",
    applicationId: "",
  });

  // Fetch all examinations
  const { 
    data: examinations,
    isLoading: isLoadingExaminations,
    error: examinationsError,
  } = useQuery<Examination[]>({
    queryKey: ["/api/examinations", { random: Math.random() }],
    retry: false,
  });

  // Fetch templates for creating new examinations
  const {
    data: templates,
    isLoading: isLoadingTemplates,
  } = useQuery<ExaminationTemplate[]>({
    queryKey: ["/api/examination-templates"],
    retry: false,
  });
  
  // Fetch applications for creating new examinations
  const {
    data: applications,
    isLoading: isLoadingApplications,
  } = useQuery<CertificationApplication[]>({
    queryKey: ["/api/applications"],
    retry: false,
  });

  // Create examination mutation
  const createExaminationMutation = useMutation({
    mutationFn: async (data: { templateId: number, applicationId: number }) => {
      const res = await apiRequest("POST", "/api/examinations", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Ujian baru berhasil dibuat",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Gagal membuat ujian baru: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Evaluate examination mutation
  const evaluateExaminationMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/examinations/${id}/evaluate`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Ujian berhasil dievaluasi",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Gagal mengevaluasi ujian: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Start examination mutation
  const startExaminationMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/examinations/${id}/start`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Ujian berhasil dimulai",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Gagal memulai ujian: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateExamination = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExamination.templateId || !newExamination.applicationId) {
      toast({
        title: "Validasi Gagal",
        description: "Semua field wajib diisi",
        variant: "destructive",
      });
      return;
    }

    createExaminationMutation.mutate({
      templateId: parseInt(newExamination.templateId),
      applicationId: parseInt(newExamination.applicationId),
    });
  };

  const handleStartExamination = (id: number) => {
    startExaminationMutation.mutate(id);
  };

  const handleEvaluateExamination = (id: number) => {
    evaluateExaminationMutation.mutate(id);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Belum Dimulai</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Sedang Berlangsung</Badge>;
      case "completed":
        return <Badge>Selesai (Belum Dievaluasi)</Badge>;
      case "evaluated":
        return <Badge variant="success">Dievaluasi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredExaminations = examinations
    ? examinations.filter((examination) => {
        const matchesSearch =
          examination.template?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          examination.application?.asesi?.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(examination.id).includes(searchTerm);
          
        const matchesStatus = selectedStatus === "all" || examination.status === selectedStatus;
        
        return matchesSearch && matchesStatus;
      })
    : [];

  if (isLoadingExaminations) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (examinationsError) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Ujian</h2>
          <p className="text-destructive mt-4">
            Terjadi kesalahan saat memuat data ujian. Silakan coba lagi nanti.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manajemen Ujian</h2>
            <p className="text-muted-foreground">
              Kelola ujian sertifikasi untuk semua peserta
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buat Ujian Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Ujian Baru</DialogTitle>
                <DialogDescription>
                  Pilih template ujian dan peserta untuk membuat ujian baru.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateExamination}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="templateId" className="text-sm font-medium">
                      Template Ujian
                    </label>
                    <Select
                      value={newExamination.templateId}
                      onValueChange={(value) => 
                        setNewExamination({...newExamination, templateId: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih template ujian" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingTemplates ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : templates?.length === 0 ? (
                          <SelectItem value="no-templates" disabled>
                            Tidak ada template tersedia
                          </SelectItem>
                        ) : (
                          templates?.map((template: ExaminationTemplate) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="applicationId" className="text-sm font-medium">
                      Aplikasi Sertifikasi
                    </label>
                    <Select
                      value={newExamination.applicationId}
                      onValueChange={(value) => 
                        setNewExamination({...newExamination, applicationId: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih aplikasi sertifikasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingApplications ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : applications?.length === 0 ? (
                          <SelectItem value="no-applications" disabled>
                            Tidak ada aplikasi tersedia
                          </SelectItem>
                        ) : (
                          applications?.map((application: CertificationApplication) => (
                            <SelectItem key={application.id} value={application.id.toString()}>
                              {application.asesi?.user?.fullName || `Aplikasi #${application.id}`} - {application.scheme?.name || 'N/A'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={createExaminationMutation.isPending}>
                    {createExaminationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Membuat...
                      </>
                    ) : (
                      "Buat Ujian"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Daftar Ujian</CardTitle>
            <CardDescription>
              Kelola semua ujian sertifikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama, nomor, dll..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Belum Dimulai</SelectItem>
                  <SelectItem value="in_progress">Sedang Berlangsung</SelectItem>
                  <SelectItem value="completed">Selesai (Menunggu Evaluasi)</SelectItem>
                  <SelectItem value="evaluated">Dievaluasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredExaminations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada data ujian yang ditemukan.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Template Ujian</TableHead>
                      <TableHead>Peserta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Dibuat</TableHead>
                      <TableHead>Nilai</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExaminations.map((examination: Examination) => (
                      <TableRow key={examination.id}>
                        <TableCell className="font-medium">{examination.id}</TableCell>
                        <TableCell>{examination.template?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {examination.application?.asesi?.user?.fullName || `Peserta #${examination.applicationId}`}
                        </TableCell>
                        <TableCell>{getStatusBadge(examination.status)}</TableCell>
                        <TableCell>{formatDate(examination.createdAt)}</TableCell>
                        <TableCell>
                          {examination.score !== null ? `${examination.score}%` : "-"}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setLocation(`/admin/examinations/${examination.id}`)}
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {examination.status === "pending" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStartExamination(examination.id)}
                              title="Mulai Ujian"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {examination.status === "completed" && (
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handleEvaluateExamination(examination.id)}
                              title="Evaluasi Ujian"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}