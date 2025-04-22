import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
    scheme?: {
      name: string;
    };
  };
  application?: {
    id: number;
    asesiId: number;
    asesi?: {
      userId: number;
      user?: {
        fullName: string;
        email: string;
      };
    };
  };
  questions?: Array<{
    id: number;
    questionId: number;
    question?: {
      text: string;
      options: string[];
      correctAnswer: string;
    };
    userAnswer: string | null;
    isCorrect: boolean | null;
  }>;
};

export default function ExaminationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);

  const { 
    data: examination,
    isLoading,
    error
  } = useQuery<Examination>({
    queryKey: [`/api/examinations/${id}`],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Belum Dimulai</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Sedang Berlangsung</Badge>;
      case "completed":
        return <Badge variant="default">Selesai (Belum Dievaluasi)</Badge>;
      case "evaluated":
        return <Badge variant="success">Dievaluasi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getElapsedTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return "N/A";
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours > 0 ? `${hours} jam ` : ""}${minutes} menit`;
  };

  const handleStartExam = async () => {
    try {
      const response = await fetch(`/api/examinations/${id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Gagal memulai ujian");
      
      toast({
        title: "Ujian dimulai",
        description: "Ujian berhasil dimulai.",
      });
      
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memulai ujian. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleEvaluateExam = async () => {
    try {
      const response = await fetch(`/api/examinations/${id}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Gagal evaluasi ujian");
      
      toast({
        title: "Ujian dievaluasi",
        description: "Ujian berhasil dievaluasi.",
      });
      
      setEvaluateDialogOpen(false);
      
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal evaluasi ujian. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !examination) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold text-destructive mb-2">Data Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Detail ujian tidak dapat ditemukan atau terjadi kesalahan.
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
            <h2 className="text-3xl font-bold tracking-tight">Detail Ujian</h2>
            <p className="text-muted-foreground">
              Informasi detail dan evaluasi untuk ujian #{examination.id}
            </p>
          </div>
          
          {examination.status === "pending" && (
            <Button onClick={handleStartExam}>Mulai Ujian</Button>
          )}
          
          {examination.status === "completed" && (
            <Dialog open={evaluateDialogOpen} onOpenChange={setEvaluateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Evaluasi Ujian</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Konfirmasi Evaluasi Ujian</DialogTitle>
                  <DialogDescription>
                    Tindakan ini akan mengevaluasi jawaban ujian secara otomatis. Pastikan semua data sudah benar.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEvaluateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleEvaluateExam}>
                    Evaluasi Ujian
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Ujian</CardTitle>
              <CardDescription>Detail ujian dan status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="mt-1">{getStatusBadge(examination.status)}</div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Template Ujian</p>
                <p className="text-sm">{examination.template?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Skema Sertifikasi</p>
                <p className="text-sm">{examination.template?.scheme?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Durasi Ujian</p>
                <p className="text-sm">{examination.duration} menit</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Total Pertanyaan</p>
                <p className="text-sm">{examination.totalQuestions}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Dibuat Pada</p>
                <p className="text-sm">{formatDate(examination.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Peserta</CardTitle>
              <CardDescription>Informasi peserta ujian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Nama Peserta</p>
                <p className="text-sm">{examination.application?.asesi?.user?.fullName || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{examination.application?.asesi?.user?.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">ID Aplikasi</p>
                <p className="text-sm">{examination.applicationId}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pelaksanaan</CardTitle>
              <CardDescription>Waktu dan hasil ujian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Waktu Mulai</p>
                <p className="text-sm">{formatDate(examination.startTime || "")}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Waktu Selesai</p>
                <p className="text-sm">{formatDate(examination.endTime || "")}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Durasi Pengerjaan</p>
                <p className="text-sm">
                  {examination.startTime 
                    ? getElapsedTime(examination.startTime, examination.endTime)
                    : 'Belum dimulai'
                  }
                </p>
              </div>
              
              {examination.status === "evaluated" && (
                <>
                  <div>
                    <p className="text-sm font-medium">Jawaban Benar</p>
                    <p className="text-sm">
                      {examination.correctAnswers} dari {examination.totalQuestions}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Nilai</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{examination.score}</p>
                      <Progress 
                        value={examination.score || 0} 
                        className="h-2 w-24" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Status Kelulusan</p>
                    {examination.passed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Lulus</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Tidak Lulus</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {(examination.status === "completed" || examination.status === "evaluated") && (
          <>
            <h3 className="text-xl font-bold mt-8 mb-4">Hasil Ujian</h3>
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                <TabsTrigger value="questions">Pertanyaan & Jawaban</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Hasil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {examination.status === "evaluated" ? (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Total Pertanyaan</p>
                            <p className="text-3xl font-bold">{examination.totalQuestions}</p>
                          </div>
                          
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Jawaban Benar</p>
                            <p className="text-3xl font-bold text-green-600">{examination.correctAnswers}</p>
                          </div>
                          
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Nilai</p>
                            <p className="text-3xl font-bold">{examination.score}%</p>
                          </div>
                          
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Status</p>
                            {examination.passed ? (
                              <p className="text-xl font-bold text-green-600">LULUS</p>
                            ) : (
                              <p className="text-xl font-bold text-red-600">TIDAK LULUS</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Evaluasi Jawaban</p>
                          <Progress 
                            value={
                              examination.correctAnswers 
                                ? (examination.correctAnswers / examination.totalQuestions) * 100
                                : 0
                            } 
                            className="h-4" 
                          />
                          <div className="flex justify-between text-sm mt-1">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Ujian belum dievaluasi. Klik tombol "Evaluasi Ujian" untuk mengevaluasi jawaban.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle>Pertanyaan & Jawaban</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {examination.questions?.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">No.</TableHead>
                            <TableHead>Pertanyaan</TableHead>
                            <TableHead>Jawaban Peserta</TableHead>
                            <TableHead>Jawaban Benar</TableHead>
                            <TableHead className="w-24 text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examination.questions.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell>{item.question?.text || 'N/A'}</TableCell>
                              <TableCell>{item.userAnswer || 'Tidak Menjawab'}</TableCell>
                              <TableCell>{item.question?.correctAnswer || 'N/A'}</TableCell>
                              <TableCell className="text-center">
                                {item.isCorrect === true ? (
                                  <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                                ) : item.isCorrect === false ? (
                                  <XCircle className="h-5 w-5 mx-auto text-red-600" />
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {examination.status === "evaluated" 
                            ? "Tidak ada data pertanyaan yang tersedia."
                            : "Ujian belum dievaluasi. Klik tombol 'Evaluasi Ujian' untuk melihat pertanyaan dan jawaban."
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
}