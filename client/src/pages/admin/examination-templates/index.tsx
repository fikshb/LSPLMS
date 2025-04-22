import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon, EditIcon, ListIcon } from "lucide-react";
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

// Type definitions
type ExaminationTemplate = {
  id: number;
  schemeId: number;
  name: string;
  description: string | null;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  randomizeQuestions: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  scheme?: {
    name: string;
  };
};

type Scheme = {
  id: number;
  name: string;
  slug: string;
};

// Schema for template form validation
const templateFormSchema = z.object({
  schemeId: z.coerce.number().min(1, "Skema sertifikasi harus dipilih"),
  name: z.string().min(3, "Nama template harus minimal 3 karakter"),
  description: z.string().optional().nullable(),
  duration: z.coerce.number().min(5, "Durasi minimal 5 menit").default(60),
  totalQuestions: z.coerce.number().min(1, "Jumlah soal minimal 1").default(20),
  passingScore: z.coerce.number().min(1, "Nilai kelulusan minimal 1").max(100, "Nilai kelulusan maksimal 100").default(70),
  randomizeQuestions: z.boolean().default(true),
  active: z.boolean().default(true),
});

export default function ExaminationTemplatesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ExaminationTemplate | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  // Form setup for adding/editing templates
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      schemeId: 0,
      name: "",
      description: "",
      duration: 60,
      totalQuestions: 20,
      passingScore: 70,
      randomizeQuestions: true,
      active: true,
    },
  });

  // Query to fetch all templates
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/examination-templates", selectedSchemeId],
    queryFn: () => {
      let url = "/api/examination-templates";
      if (selectedSchemeId) {
        url += `?schemeId=${selectedSchemeId}`;
      }
      return apiRequest("GET", url).then(res => res.json());
    },
  });

  // Query to fetch all certification schemes
  const { data: schemes = [] } = useQuery({
    queryKey: ["/api/schemes"],
    queryFn: () => apiRequest("GET", "/api/schemes").then(res => res.json()),
  });

  // Mutation to create a new template
  const createTemplateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof templateFormSchema>) => {
      return apiRequest("POST", "/api/examination-templates", values).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Template berhasil ditambahkan",
        description: "Template ujian baru telah berhasil dibuat",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examination-templates"] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menambahkan template",
        description: error.message || "Terjadi kesalahan saat membuat template ujian",
        variant: "destructive",
      });
    },
  });

  // Mutation to update an existing template
  const updateTemplateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof templateFormSchema> & { id: number }) => {
      const { id, ...data } = values;
      return apiRequest("PATCH", `/api/examination-templates/${id}`, data).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Template berhasil diperbarui",
        description: "Perubahan pada template ujian telah berhasil disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examination-templates"] });
      setIsEditDialogOpen(false);
      setCurrentTemplate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal memperbarui template",
        description: error.message || "Terjadi kesalahan saat memperbarui template ujian",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/examination-templates/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Template berhasil dihapus",
        description: "Template ujian telah berhasil dihapus",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/examination-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menghapus template",
        description: error.message || "Terjadi kesalahan saat menghapus template ujian",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission for adding a template
  const onSubmitAdd = (values: z.infer<typeof templateFormSchema>) => {
    createTemplateMutation.mutate(values);
  };

  // Function to handle form submission for editing a template
  const onSubmitEdit = (values: z.infer<typeof templateFormSchema>) => {
    if (currentTemplate) {
      updateTemplateMutation.mutate({ ...values, id: currentTemplate.id });
    }
  };

  // Function to handle editing a template
  const handleEditTemplate = (template: ExaminationTemplate) => {
    setCurrentTemplate(template);
    form.reset({
      schemeId: template.schemeId,
      name: template.name,
      description: template.description || "",
      duration: template.duration,
      totalQuestions: template.totalQuestions,
      passingScore: template.passingScore,
      randomizeQuestions: template.randomizeQuestions,
      active: template.active,
    });
    setIsEditDialogOpen(true);
  };

  // Helper function to find scheme name by ID
  const getSchemeNameById = (schemeId: number) => {
    const scheme = schemes.find((s: Scheme) => s.id === schemeId);
    return scheme ? scheme.name : "Unknown";
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} jam${remainingMinutes > 0 ? ` ${remainingMinutes} menit` : ''}`;
  };

  // Render the page
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Template Ujian</h1>
        <Button onClick={() => {
          form.reset();
          setIsAddDialogOpen(true);
        }}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Buat Template
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Select
          value={selectedSchemeId?.toString() || ""}
          onValueChange={(value) => setSelectedSchemeId(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter berdasarkan Skema" />
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
      </div>

      {isLoadingTemplates ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.length > 0 ? (
            templates.map((template: ExaminationTemplate) => (
              <Card key={template.id} className={`${!template.active ? 'bg-gray-50' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                    <div className="flex gap-1">
                      {!template.active && (
                        <Badge variant="outline" className="bg-gray-100">
                          Non-aktif
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {getSchemeNameById(template.schemeId)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="text-gray-500">Durasi: {formatDuration(template.duration)}</p>
                    <p className="text-gray-500">Jumlah Soal: {template.totalQuestions}</p>
                    <p className="text-gray-500">Nilai Kelulusan: {template.passingScore}%</p>
                    <p className="text-gray-500">
                      Randomisasi Soal: {template.randomizeQuestions ? "Ya" : "Tidak"}
                    </p>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditTemplate(template)}
                  >
                    <EditIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive" 
                    onClick={() => deleteTemplateMutation.mutate(template.id)}
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center">
              <div className="mx-auto bg-gray-50 p-8 rounded-lg max-w-md">
                <ListIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Belum ada template ujian</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Buat template ujian untuk mengelola ujian sertifikasi
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    form.reset();
                    setIsAddDialogOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Buat Template
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog for adding a new template */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Buat Template Ujian Baru</DialogTitle>
            <DialogDescription>
              Isi formulir berikut untuk membuat template ujian baru.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-6">
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
                    <FormDescription>
                      Template ini akan digunakan untuk ujian pada skema tersebut
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Template</FormLabel>
                    <FormControl>
                      <Input placeholder="Mis. Ujian Standar Digital Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Deskripsi singkat tentang template ujian ini..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi (menit)</FormLabel>
                      <FormControl>
                        <Input type="number" min="5" {...field} />
                      </FormControl>
                      <FormDescription>
                        Durasi ujian dalam menit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Soal</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Berapa banyak soal dalam ujian ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nilai Kelulusan (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Persentase minimal untuk lulus, mis. 70 berarti 70%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="randomizeQuestions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Acak Soal</FormLabel>
                        <FormDescription>
                          Mengacak urutan soal untuk setiap peserta
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Status Aktif</FormLabel>
                        <FormDescription>
                          Template aktif dapat digunakan untuk ujian
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createTemplateMutation.isPending}>
                  {createTemplateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a template */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Template Ujian</DialogTitle>
            <DialogDescription>
              Edit informasi template ujian yang dipilih.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-6">
              {/* Same form fields as the Add Template dialog */}
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
                    <FormDescription>
                      Template ini akan digunakan untuk ujian pada skema tersebut
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Template</FormLabel>
                    <FormControl>
                      <Input placeholder="Mis. Ujian Standar Digital Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Deskripsi singkat tentang template ujian ini..." 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi (menit)</FormLabel>
                      <FormControl>
                        <Input type="number" min="5" {...field} />
                      </FormControl>
                      <FormDescription>
                        Durasi ujian dalam menit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Soal</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Berapa banyak soal dalam ujian ini
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nilai Kelulusan (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Persentase minimal untuk lulus, mis. 70 berarti 70%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="randomizeQuestions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Acak Soal</FormLabel>
                        <FormDescription>
                          Mengacak urutan soal untuk setiap peserta
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Status Aktif</FormLabel>
                        <FormDescription>
                          Template aktif dapat digunakan untuk ujian
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={updateTemplateMutation.isPending}>
                  {updateTemplateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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