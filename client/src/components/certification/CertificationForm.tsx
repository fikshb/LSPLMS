import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificationScheme, Province } from "@shared/schema";

// Validasi skema untuk formulir pendaftaran sertifikasi
const formSchema = z.object({
  // Data Pribadi
  fullName: z.string().min(3, {
    message: "Nama lengkap harus minimal 3 karakter.",
  }),
  identityNumber: z.string().min(16, {
    message: "Nomor KTP harus 16 digit.",
  }).max(16, {
    message: "Nomor KTP harus 16 digit."
  }),
  birthPlace: z.string().min(3, {
    message: "Tempat lahir harus diisi.",
  }),
  birthDate: z.date({
    required_error: "Tanggal lahir harus diisi.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Jenis kelamin harus dipilih.",
  }),
  nationality: z.string().min(3, {
    message: "Kebangsaan harus diisi.",
  }),
  address: z.string().min(10, {
    message: "Alamat harus minimal 10 karakter.",
  }),
  postalCode: z.string().min(5, {
    message: "Kode pos harus diisi.",
  }),
  phone: z.string().min(10, {
    message: "Nomor telepon tidak valid.",
  }),
  email: z.string().email({
    message: "Alamat email tidak valid.",
  }),
  education: z.string({
    required_error: "Pendidikan terakhir harus dipilih.",
  }),
  
  // Data Pekerjaan
  company: z.string().min(3, {
    message: "Nama institusi/perusahaan harus diisi.",
  }),
  position: z.string().min(3, {
    message: "Jabatan harus diisi.",
  }),
  companyAddress: z.string().min(10, {
    message: "Alamat kantor harus minimal 10 karakter.",
  }),
  companyPostalCode: z.string().min(5, {
    message: "Kode pos harus diisi.",
  }),
  companyPhone: z.string().min(10, {
    message: "Nomor telepon kantor harus diisi.",
  }),
  companyEmail: z.string().email({
    message: "Alamat email kantor harus valid.",
  }),
  
  // Data Sertifikasi
  schemeId: z.string({
    required_error: "Skema sertifikasi harus dipilih.",
  }),
  assessmentPurpose: z.string({
    required_error: "Tujuan asesmen harus dipilih.",
  }),
  
  // Portofolio
  portfolioFile: z.instanceof(FileList).optional(),
  
  // Persetujuan
  agreement: z.literal(true, {
    errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CertificationForm = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: schemes } = useQuery<CertificationScheme[]>({
    queryKey: ["/api/schemes"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      identityNumber: "",
      birthPlace: "",
      nationality: "Indonesia",
      address: "",
      postalCode: "",
      phone: "",
      email: "",
      company: "",
      position: "",
      companyAddress: "",
      companyPostalCode: "",
      companyPhone: "",
      companyEmail: "",
      agreement: false,
    },
  });

  const educationLevels = [
    { value: "sma", label: "SMA/SMK" },
    { value: "d3", label: "D3" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
  ];

  const assessmentPurposes = [
    { value: "certification", label: "Sertifikasi" },
    { value: "recertification", label: "Resertifikasi" },
    { value: "rpl", label: "Pengakuan Kompetensi Terkini (PKT)" },
  ];

  const nextTab = async (tabId: string) => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (activeTab) {
      case "personal":
        fieldsToValidate = [
          "fullName",
          "identityNumber",
          "birthPlace",
          "birthDate",
          "gender",
          "nationality",
          "address",
          "postalCode",
          "phone",
          "email",
          "education",
        ];
        break;
      case "work":
        fieldsToValidate = [
          "company",
          "position",
          "companyAddress",
          "companyPostalCode",
          "companyPhone",
          "companyEmail",
        ];
        break;
      case "certification":
        fieldsToValidate = ["schemeId", "assessmentPurpose"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    
    if (result) {
      setActiveTab(tabId);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulasi pengiriman data ke server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Formulir Pendaftaran Terkirim",
        description: "Terima kasih atas pendaftaran Anda. Kami akan meninjau dan menghubungi Anda segera untuk langkah selanjutnya.",
      });
      
      console.log("Form data:", data);
      form.reset();
      setActiveTab("personal");
    } catch (error) {
      toast({
        title: "Pendaftaran Gagal",
        description: "Terjadi kesalahan saat memproses pendaftaran Anda. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Formulir Permohonan Sertifikasi Kompetensi</CardTitle>
          <CardDescription>
            Silakan lengkapi formulir pendaftaran sertifikasi kompetensi sesuai dengan Skema Pelaksana Penjamah Makanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
              <TabsTrigger value="work">Data Pekerjaan</TabsTrigger>
              <TabsTrigger value="certification">Data Sertifikasi</TabsTrigger>
              <TabsTrigger value="documents">Dokumen</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="identityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. KTP/NIK/Paspor</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor identitas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan tempat lahir" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Lahir</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "dd MMMM yyyy", { locale: id })
                                  ) : (
                                    <span>Pilih tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1940-01-01")
                                }
                                locale={id}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kelamin</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Laki-laki</SelectItem>
                              <SelectItem value="female">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kebangsaan</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan kebangsaan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Rumah</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Masukkan alamat lengkap" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Pos</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan kode pos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Telepon/HP</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan alamat email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kualifikasi Pendidikan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kualifikasi pendidikan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={() => nextTab("work")}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Institusi / Perusahaan</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama institusi/perusahaan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan jabatan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Kantor</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan alamat kantor"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyPostalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Pos</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan kode pos kantor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Telepon/Fax Kantor</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nomor telepon kantor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Kantor</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan alamat email kantor" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("personal")}
                      variant="outline"
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      type="button"
                      onClick={() => nextTab("certification")}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="certification" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Skema Sertifikasi</CardTitle>
                      <CardDescription>
                        Pilih skema sertifikasi yang sesuai
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="schemeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skema Sertifikasi</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih skema sertifikasi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schemes?.map((scheme) => (
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
                        name="assessmentPurpose"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Tujuan Asesmen</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih tujuan asesmen" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {assessmentPurposes.map((purpose) => (
                                  <SelectItem key={purpose.value} value={purpose.value}>
                                    {purpose.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("work")}
                      variant="outline"
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      type="button"
                      onClick={() => nextTab("documents")}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Unggah Portofolio</CardTitle>
                      <CardDescription>
                        Unggah dokumen pendukung untuk asesmen mandiri
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="portfolioFile"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>Portofolio/Bukti Pendukung</FormLabel>
                              <FormControl>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <Input
                                    type="file"
                                    id="portfolio"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => {
                                      // @ts-ignore - FileList adalah valid, tapi TS tidak mengenalinya
                                      onChange(e.target.files);
                                    }}
                                    {...field}
                                  />
                                  <label
                                    htmlFor="portfolio"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                  >
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">
                                      Klik untuk mengunggah atau seret file ke sini
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                      PDF, DOC, DOCX, JPG, PNG (Maks. 10MB)
                                    </span>
                                  </label>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Unggah dokumen pendukung seperti sertifikat, hasil kerja, atau bukti pengalaman yang relevan.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="checklist">
                            <AccordionTrigger>Daftar Periksa Dokumen</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <Checkbox id="doc1" className="mt-1" />
                                  <label htmlFor="doc1" className="ml-2 text-sm">
                                    Fotokopi KTP/Identitas Resmi
                                  </label>
                                </div>
                                <div className="flex items-start">
                                  <Checkbox id="doc2" className="mt-1" />
                                  <label htmlFor="doc2" className="ml-2 text-sm">
                                    Pas foto terbaru ukuran 3x4
                                  </label>
                                </div>
                                <div className="flex items-start">
                                  <Checkbox id="doc3" className="mt-1" />
                                  <label htmlFor="doc3" className="ml-2 text-sm">
                                    Fotokopi ijazah pendidikan terakhir
                                  </label>
                                </div>
                                <div className="flex items-start">
                                  <Checkbox id="doc4" className="mt-1" />
                                  <label htmlFor="doc4" className="ml-2 text-sm">
                                    CV atau daftar riwayat hidup
                                  </label>
                                </div>
                                <div className="flex items-start">
                                  <Checkbox id="doc5" className="mt-1" />
                                  <label htmlFor="doc5" className="ml-2 text-sm">
                                    Bukti pengalaman kerja (jika ada)
                                  </label>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      <FormField
                        control={form.control}
                        name="agreement"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Saya menyatakan bahwa dokumen yang saya lampirkan adalah benar dan sah. Saya bersedia mengikuti proses asesmen sesuai dengan prosedur yang telah ditetapkan.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("certification")}
                      variant="outline"
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Mengirim...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Kirim Formulir
                        </span>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-10 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Informasi Penting:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Pastikan semua data yang diisi benar dan valid.</li>
          <li>Seluruh dokumen pendukung harus diunggah dalam format yang ditentukan.</li>
          <li>Formulir yang tidak lengkap tidak akan diproses.</li>
          <li>Anda akan dihubungi oleh tim asesor untuk penjadwalan proses asesmen.</li>
          <li>Untuk informasi lebih lanjut, silakan hubungi kantor LSP Wirausaha Kompeten Nusantara.</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificationForm;