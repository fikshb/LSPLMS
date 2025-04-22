import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, Users, Clock, Award, BookOpen, CheckCircle, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Type definitions
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

type Scheme = {
  id: number;
  name: string;
  slug: string;
};

export default function ExaminationsPage() {
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Query to fetch all examinations
  const { data: examinations = [], isLoading: isLoadingExaminations } = useQuery({
    queryKey: ["/api/examinations", selectedSchemeId, selectedStatus],
    queryFn: () => {
      let url = "/api/examinations";
      const params = new URLSearchParams();
      
      if (selectedSchemeId) {
        params.append("schemeId", selectedSchemeId.toString());
      }
      
      if (selectedStatus) {
        params.append("status", selectedStatus);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return apiRequest("GET", url).then(res => res.json());
    },
  });

  // Query to fetch all certification schemes
  const { data: schemes = [] } = useQuery({
    queryKey: ["/api/schemes"],
    queryFn: () => apiRequest("GET", "/api/schemes").then(res => res.json()),
  });

  // Helper function to get status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">Belum Dimulai</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sedang Berlangsung</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Menunggu Evaluasi</Badge>;
      case "evaluated":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Selesai Dievaluasi</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  // Group examinations by status
  const pendingExams = examinations.filter((exam: Examination) => exam.status === "pending");
  const activeExams = examinations.filter((exam: Examination) => exam.status === "in_progress");
  const completedExams = examinations.filter((exam: Examination) => exam.status === "completed");
  const evaluatedExams = examinations.filter((exam: Examination) => exam.status === "evaluated");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manajemen Ujian</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Select
          value={selectedSchemeId?.toString() || "all"}
          onValueChange={(value) => setSelectedSchemeId(value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter berdasarkan Skema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Skema</SelectItem>
            {schemes?.map((scheme: Scheme) => (
              <SelectItem key={scheme.id} value={scheme.id.toString()}>
                {scheme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            <SelectItem value="evaluated">Selesai Dievaluasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingExaminations ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Semua ({examinations.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Belum Dimulai ({pendingExams.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Sedang Berlangsung ({activeExams.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Menunggu Evaluasi ({completedExams.length})
            </TabsTrigger>
            <TabsTrigger value="evaluated">
              Selesai Dievaluasi ({evaluatedExams.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {renderExaminationCards(examinations)}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {renderExaminationCards(pendingExams)}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {renderExaminationCards(activeExams)}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {renderExaminationCards(completedExams)}
          </TabsContent>
          
          <TabsContent value="evaluated" className="space-y-4">
            {renderExaminationCards(evaluatedExams)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  // Helper function to render examination cards
  function renderExaminationCards(exams: Examination[]) {
    if (exams.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <BookOpen className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Tidak ada ujian</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tidak ada ujian yang ditemukan dengan filter yang dipilih
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam: Examination) => (
          <Card key={exam.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {exam.template?.name || "Ujian"}
                  </CardTitle>
                  <CardDescription>
                    {exam.template?.scheme?.name || "Skema Sertifikasi"}
                  </CardDescription>
                </div>
                {getStatusBadge(exam.status)}
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Peserta: {exam.application?.asesi?.user?.fullName || "Unknown"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Mulai: {formatDate(exam.startTime)}</span>
                </div>
                
                {exam.endTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Selesai: {formatDate(exam.endTime)}</span>
                  </div>
                )}
                
                {exam.status === "evaluated" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span>
                        Nilai: {exam.score !== null ? `${exam.score}% (${exam.passed ? 'Lulus' : 'Tidak Lulus'})` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span>
                        Jawaban Benar: {exam.correctAnswers !== null ? `${exam.correctAnswers}/${exam.totalQuestions}` : '-'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`/admin/examinations/${exam.id}`}>
                  <Eye className="h-4 w-4 mr-2" /> 
                  {exam.status === "completed" ? "Evaluasi Ujian" : "Lihat Detail"}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
}