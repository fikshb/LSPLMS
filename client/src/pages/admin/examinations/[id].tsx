import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Check, X, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const [isEvaluateDialogOpen, setIsEvaluateDialogOpen] = useState(false);

  // Query to fetch examination details
  const { data: examination, isLoading, error } = useQuery({
    queryKey: [`/api/examinations/${id}`],
    queryFn: () => apiRequest("GET", `/api/examinations/${id}`).then(res => res.json()),
    enabled: id > 0,
  });

  // Mutation to evaluate an examination
  const evaluateExaminationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/examinations/${id}/evaluate`).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Evaluasi berhasil",
        description: "Ujian telah berhasil dievaluasi",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/examinations/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
      setIsEvaluateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Evaluasi gagal",
        description: error.message || "Terjadi kesalahan saat mengevaluasi ujian",
        variant: "destructive",
      });
    },
  });

  // Format date
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

  // Calculate duration in minutes
  const calculateDuration = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return "-";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    return `${durationMinutes} menit`;
  };

  // Get status badge color
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

  // Render answer status icon
  const renderAnswerStatus = (isCorrect: boolean | null) => {
    if (isCorrect === null) return <HelpCircle className="h-4 w-4 text-gray-400" />;
    return isCorrect ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !examination) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Detail Ujian</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Ujian tidak ditemukan atau terjadi kesalahan saat memuat data.</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Detail Ujian</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Basic information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Ujian #{examination.id}</CardTitle>
            <CardDescription>Informasi dasar mengenai ujian ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">{getStatusBadge(examination.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Peserta</h3>
                  <p className="mt-1 text-sm">
                    {examination.application?.asesi?.user?.fullName || "Tidak diketahui"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {examination.application?.asesi?.user?.email || ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Template Ujian</h3>
                  <p className="mt-1 text-sm">{examination.template?.name || "Tidak diketahui"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Skema Sertifikasi</h3>
                  <p className="mt-1 text-sm">{examination.template?.scheme?.name || "Tidak diketahui"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Waktu Mulai</h3>
                  <p className="mt-1 text-sm">{formatDate(examination.startTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Waktu Selesai</h3>
                  <p className="mt-1 text-sm">{formatDate(examination.endTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Durasi Ujian</h3>
                  <p className="mt-1 text-sm">
                    {calculateDuration(examination.startTime, examination.endTime)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hasil</h3>
                  <p className="mt-1 text-sm">
                    {examination.score !== null 
                      ? `${examination.score}% (${examination.passed ? 'Lulus' : 'Tidak Lulus'})` 
                      : 'Belum dievaluasi'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Questions and Results */}
        <Tabs defaultValue="jawaban" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="jawaban">Jawaban Peserta</TabsTrigger>
            <TabsTrigger value="penilaian">Hasil Penilaian</TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="jawaban">
            <Card>
              <CardHeader>
                <CardTitle>Soal dan Jawaban</CardTitle>
                <CardDescription>
                  Detail soal dan jawaban yang diberikan oleh peserta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {examination.questions && examination.questions.length > 0 ? (
                  <div className="space-y-6">
                    {examination.questions.map((q, index) => (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Soal #{index + 1}</h3>
                          <div className="flex items-center">
                            {renderAnswerStatus(q.isCorrect)}
                          </div>
                        </div>
                        <p className="mb-4">{q.question?.text || "Pertanyaan tidak tersedia"}</p>
                        
                        {q.question?.options && (
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-medium text-gray-500">Pilihan Jawaban:</h4>
                            <ul className="space-y-1 text-sm">
                              {q.question.options.map((option, i) => (
                                <li key={i} className="flex items-center">
                                  <span className={`inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full border ${
                                    q.userAnswer === option 
                                      ? 'bg-primary text-white border-primary' 
                                      : 'bg-white text-gray-500 border-gray-300'
                                  }`}>
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span className={
                                    q.question?.correctAnswer === option 
                                      ? 'font-medium text-green-600' 
                                      : ''
                                  }>
                                    {option}
                                    {q.question?.correctAnswer === option && 
                                      ' (Jawaban benar)'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Jawaban Peserta:</h4>
                          <p className="text-sm mt-1">
                            {q.userAnswer || "Tidak menjawab"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Belum ada soal atau jawaban</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="penilaian">
            <Card>
              <CardHeader>
                <CardTitle>Hasil Penilaian</CardTitle>
                <CardDescription>
                  Ringkasan hasil penilaian ujian
                </CardDescription>
              </CardHeader>
              <CardContent>
                {examination.status === "evaluated" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Soal</h3>
                        <p className="text-xl font-semibold">{examination.totalQuestions}</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Jawaban Benar</h3>
                        <p className="text-xl font-semibold">{examination.correctAnswers}</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nilai Akhir</h3>
                        <p className="text-xl font-semibold">{examination.score}%</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status Kelulusan</h3>
                        <p className={`text-lg font-semibold ${
                          examination.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {examination.passed ? 'LULUS' : 'TIDAK LULUS'}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={examination.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      >
                        {examination.passed ? 'LULUS' : 'TIDAK LULUS'}
                      </Badge>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Dievaluasi Oleh</h3>
                      <p className="text-sm">Asesor ID: {examination.evaluatedBy || 'Tidak diketahui'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pada {formatDate(examination.evaluatedAt)}
                      </p>
                    </div>
                  </div>
                ) : examination.status === "completed" ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      Ujian sudah selesai namun belum dievaluasi. Klik tombol di bawah untuk mengevaluasi ujian ini.
                    </p>
                    <Button 
                      onClick={() => setIsEvaluateDialogOpen(true)}
                      disabled={evaluateExaminationMutation.isPending}
                    >
                      {evaluateExaminationMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Evaluasi Ujian
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      Ujian belum selesai. Penilaian akan tersedia setelah ujian selesai.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Evaluate confirmation dialog */}
      <Dialog open={isEvaluateDialogOpen} onOpenChange={setIsEvaluateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evaluasi Ujian</DialogTitle>
            <DialogDescription>
              Ujian akan dievaluasi secara otomatis berdasarkan jawaban yang benar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Setelah dievaluasi, hasil ujian akan ditetapkan dan tidak dapat diubah lagi.
              Apakah Anda yakin ingin melanjutkan?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsEvaluateDialogOpen(false)}
              disabled={evaluateExaminationMutation.isPending}
            >
              Batal
            </Button>
            <Button 
              onClick={() => evaluateExaminationMutation.mutate()}
              disabled={evaluateExaminationMutation.isPending}
            >
              {evaluateExaminationMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Ya, Evaluasi Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}