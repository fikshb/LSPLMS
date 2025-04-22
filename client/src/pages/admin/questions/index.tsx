import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon, EditIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Type definitions
type Question = {
  id: number;
  schemeId: number;
  unitId: number | null;
  question: string;
  questionType: "pilihan_ganda" | "benar_salah" | "essay";
  options: { value: string; text: string }[] | null;
  correctAnswer: string;
  explanation: string | null;
  difficultyLevel: "mudah" | "sedang" | "sulit";
  tags: string | null;
  points: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
};

type Scheme = {
  id: number;
  name: string;
  slug: string;
};

type CompetencyUnit = {
  id: number;
  code: string;
  title: string;
};

// Schema for question form validation
const questionFormSchema = z.object({
  schemeId: z.coerce.number().min(1, "Skema sertifikasi harus dipilih"),
  unitId: z.coerce.number().optional().nullable(),
  question: z.string().min(10, "Pertanyaan harus minimal 10 karakter"),
  questionType: z.enum(["pilihan_ganda", "benar_salah", "essay"]),
  options: z.array(
    z.object({
      value: z.string().min(1, "Nilai opsi harus diisi"),
      text: z.string().min(1, "Teks opsi harus diisi"),
    })
  ).optional().nullable(),
  correctAnswer: z.string().min(1, "Jawaban benar harus diisi"),
  explanation: z.string().optional().nullable(),
  difficultyLevel: z.enum(["mudah", "sedang", "sulit"]).default("sedang"),
  tags: z.string().optional().nullable(),
  points: z.coerce.number().min(1, "Poin minimal 1").default(1),
  active: z.boolean().default(true),
});

export default function QuestionsManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | undefined>(undefined);
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  // Form setup for adding/editing questions
  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      schemeId: 0,
      unitId: null,
      question: "",
      questionType: "pilihan_ganda",
      options: [
        { value: "A", text: "" },
        { value: "B", text: "" },
        { value: "C", text: "" },
        { value: "D", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
      difficultyLevel: "sedang",
      tags: "",
      points: 1,
      active: true,
    },
  });

  // Query to fetch all questions
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["/api/questions", selectedSchemeId, selectedUnitId],
    queryFn: () => {
      let url = "/api/questions";
      const params = new URLSearchParams();
      
      if (selectedSchemeId) {
        params.append("schemeId", selectedSchemeId.toString());
      }
      
      if (selectedUnitId) {
        params.append("unitId", selectedUnitId.toString());
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

  // Query to fetch competency units for selected scheme
  const { data: competencyUnits = [] } = useQuery({
    queryKey: ["/api/schemes", selectedSchemeId, "units"],
    queryFn: () => apiRequest("GET", `/api/schemes/${selectedSchemeId}/units`).then(res => res.json()),
    enabled: !!selectedSchemeId,
  });

  // Mutation to create a new question
  const createQuestionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof questionFormSchema>) => {
      return apiRequest("POST", "/api/questions", values).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Soal berhasil ditambahkan",
        description: "Soal baru telah berhasil ditambahkan ke bank soal",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menambahkan soal",
        description: error.message || "Terjadi kesalahan saat menambahkan soal",
        variant: "destructive",
      });
    },
  });

  // Mutation to update an existing question
  const updateQuestionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof questionFormSchema> & { id: number }) => {
      const { id, ...data } = values;
      return apiRequest("PATCH", `/api/questions/${id}`, data).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Soal berhasil diperbarui",
        description: "Perubahan pada soal telah berhasil disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      setIsEditDialogOpen(false);
      setCurrentQuestion(null);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal memperbarui soal",
        description: error.message || "Terjadi kesalahan saat memperbarui soal",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Soal berhasil dihapus",
        description: "Soal telah berhasil dihapus dari bank soal",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menghapus soal",
        description: error.message || "Terjadi kesalahan saat menghapus soal",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission for adding a question
  const onSubmitAdd = (values: z.infer<typeof questionFormSchema>) => {
    createQuestionMutation.mutate(values);
  };

  // Function to handle form submission for editing a question
  const onSubmitEdit = (values: z.infer<typeof questionFormSchema>) => {
    if (currentQuestion) {
      updateQuestionMutation.mutate({ ...values, id: currentQuestion.id });
    }
  };

  // Function to handle editing a question
  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    form.reset({
      schemeId: question.schemeId,
      unitId: question.unitId,
      question: question.question,
      questionType: question.questionType,
      options: question.options || [
        { value: "A", text: "" },
        { value: "B", text: "" },
        { value: "C", text: "" },
        { value: "D", text: "" },
      ],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficultyLevel: question.difficultyLevel,
      tags: question.tags,
      points: question.points,
      active: question.active,
    });
    setIsEditDialogOpen(true);
  };

  // Function to add/remove options for multiple choice questions
  const handleOptionsChange = (index: number, field: "value" | "text", value: string) => {
    const currentOptions = form.getValues("options") || [];
    const newOptions = [...currentOptions];
    
    if (!newOptions[index]) {
      newOptions[index] = { value: "", text: "" };
    }
    
    newOptions[index][field] = value;
    form.setValue("options", newOptions, { shouldValidate: true });
  };

  const addOption = () => {
    const currentOptions = form.getValues("options") || [];
    const newValue = String.fromCharCode(65 + currentOptions.length); // A, B, C, ...
    form.setValue("options", [...currentOptions, { value: newValue, text: "" }], { shouldValidate: true });
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options") || [];
    form.setValue("options", currentOptions.filter((_, i) => i !== index), { shouldValidate: true });
  };

  // Watch for changes to questionType to conditionally render form fields
  const watchQuestionType = form.watch("questionType");

  // Render the page
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manajemen Bank Soal</h1>
        <Button onClick={() => {
          form.reset();
          setIsAddDialogOpen(true);
        }}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Tambah Soal
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Select
          value={selectedSchemeId?.toString() || ""}
          onValueChange={(value) => {
            setSelectedSchemeId(value ? parseInt(value) : undefined);
            setSelectedUnitId(undefined);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih Skema Sertifikasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Skema</SelectItem>
            {schemes?.map((scheme: Scheme) => (
              <SelectItem key={scheme.id} value={scheme.id.toString()}>
                {scheme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedUnitId?.toString() || ""}
          onValueChange={(value) => setSelectedUnitId(value ? parseInt(value) : undefined)}
          disabled={!selectedSchemeId}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih Unit Kompetensi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Unit</SelectItem>
            {competencyUnits?.map((unit: CompetencyUnit) => (
              <SelectItem key={unit.id} value={unit.id.toString()}>
                {unit.code} - {unit.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoadingQuestions ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Soal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions?.length > 0 ? (
                questions.map((question: Question, index: number) => (
                  <TableRow key={question.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate">{question.question}</div>
                    </TableCell>
                    <TableCell>
                      {question.questionType === "pilihan_ganda" 
                        ? "Pilihan Ganda" 
                        : question.questionType === "benar_salah" 
                          ? "Benar/Salah" 
                          : "Essay"}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          question.difficultyLevel === "mudah" 
                            ? "bg-green-100 text-green-800" 
                            : question.difficultyLevel === "sedang" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.difficultyLevel}
                      </span>
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditQuestion(question)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => deleteQuestionMutation.mutate(question.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada soal yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog for adding a new question */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Soal Baru</DialogTitle>
            <DialogDescription>
              Isi formulir berikut untuk menambahkan soal baru ke bank soal.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schemeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skema Sertifikasi</FormLabel>
                      <Select
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Skema Sertifikasi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schemes?.map((scheme: Scheme) => (
                            <SelectItem key={scheme.id} value={scheme.id.toString()}>
                              {scheme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Kompetensi</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        disabled={!form.getValues("schemeId")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Unit Kompetensi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Tidak terkait unit</SelectItem>
                          {competencyUnits?.map((unit: CompetencyUnit) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              {unit.code} - {unit.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pertanyaan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan pertanyaan..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Soal</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tipe Soal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pilihan_ganda">Pilihan Ganda</SelectItem>
                          <SelectItem value="benar_salah">Benar/Salah</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tingkat Kesulitan</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tingkat Kesulitan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mudah">Mudah</SelectItem>
                          <SelectItem value="sedang">Sedang</SelectItem>
                          <SelectItem value="sulit">Sulit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poin</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watchQuestionType === "pilihan_ganda" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Opsi Jawaban</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addOption}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" /> Tambah Opsi
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {form.getValues("options")?.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16">
                          <Input 
                            value={option.value}
                            onChange={(e) => handleOptionsChange(index, "value", e.target.value)}
                            placeholder="A"
                          />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={option.text}
                            onChange={(e) => handleOptionsChange(index, "text", e.target.value)}
                            placeholder="Teks opsi jawaban"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => removeOption(index)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jawaban Benar</FormLabel>
                    {watchQuestionType === "pilihan_ganda" ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jawaban Benar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.getValues("options")?.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.value} - {option.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : watchQuestionType === "benar_salah" ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jawaban Benar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="benar">Benar</SelectItem>
                          <SelectItem value="salah">Salah</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan kunci jawaban essay..." 
                          {...field} 
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penjelasan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan penjelasan dari jawaban benar..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Penjelasan ini dapat ditampilkan setelah ujian selesai untuk membantu peserta belajar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan tag, dipisahkan dengan koma..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Contoh: teknik, fundamental, praktis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Aktifkan soal</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createQuestionMutation.isPending}>
                  {createQuestionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Soal
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a question */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Soal</DialogTitle>
            <DialogDescription>
              Edit informasi soal yang dipilih.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-6">
              {/* Form fields for editing - identical to the add form */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schemeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skema Sertifikasi</FormLabel>
                      <Select
                        value={field.value?.toString() || "0"}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Skema Sertifikasi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schemes?.map((scheme: Scheme) => (
                            <SelectItem key={scheme.id} value={scheme.id.toString()}>
                              {scheme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Kompetensi</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        disabled={!form.getValues("schemeId")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Unit Kompetensi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Tidak terkait unit</SelectItem>
                          {competencyUnits?.map((unit: CompetencyUnit) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              {unit.code} - {unit.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pertanyaan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan pertanyaan..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Soal</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tipe Soal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pilihan_ganda">Pilihan Ganda</SelectItem>
                          <SelectItem value="benar_salah">Benar/Salah</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tingkat Kesulitan</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tingkat Kesulitan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mudah">Mudah</SelectItem>
                          <SelectItem value="sedang">Sedang</SelectItem>
                          <SelectItem value="sulit">Sulit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poin</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watchQuestionType === "pilihan_ganda" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Opsi Jawaban</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addOption}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" /> Tambah Opsi
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {form.getValues("options")?.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16">
                          <Input 
                            value={option.value}
                            onChange={(e) => handleOptionsChange(index, "value", e.target.value)}
                            placeholder="A"
                          />
                        </div>
                        <div className="flex-1">
                          <Input 
                            value={option.text}
                            onChange={(e) => handleOptionsChange(index, "text", e.target.value)}
                            placeholder="Teks opsi jawaban"
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => removeOption(index)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jawaban Benar</FormLabel>
                    {watchQuestionType === "pilihan_ganda" ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jawaban Benar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.getValues("options")?.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.value} - {option.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : watchQuestionType === "benar_salah" ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jawaban Benar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="benar">Benar</SelectItem>
                          <SelectItem value="salah">Salah</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan kunci jawaban essay..." 
                          {...field} 
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penjelasan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan penjelasan dari jawaban benar..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Penjelasan ini dapat ditampilkan setelah ujian selesai untuk membantu peserta belajar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan tag, dipisahkan dengan koma..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Contoh: teknik, fundamental, praktis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Aktifkan soal</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={updateQuestionMutation.isPending}>
                  {updateQuestionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}