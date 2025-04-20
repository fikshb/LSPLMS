import { useState } from "react";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificationScheme, Province } from "@shared/schema";

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Nama lengkap harus minimal 3 karakter.",
  }),
  email: z.string().email({
    message: "Alamat email tidak valid.",
  }),
  phone: z.string().min(10, {
    message: "Nomor telepon tidak valid.",
  }),
  birthDate: z.date({
    required_error: "Tanggal lahir harus diisi.",
  }),
  identityNumber: z.string().min(16, {
    message: "Nomor KTP harus 16 digit.",
  }).max(16, {
    message: "Nomor KTP harus 16 digit."
  }),
  address: z.string().min(10, {
    message: "Alamat harus minimal 10 karakter.",
  }),
  provinceId: z.string({
    required_error: "Provinsi harus dipilih.",
  }),
  education: z.string({
    required_error: "Pendidikan terakhir harus dipilih.",
  }),
  occupation: z.string().min(3, {
    message: "Pekerjaan harus minimal 3 karakter.",
  }),
  company: z.string().optional(),
  schemeId: z.string({
    required_error: "Skema sertifikasi harus dipilih.",
  }),
  experience: z.string().min(20, {
    message: "Pengalaman harus minimal 20 karakter.",
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "Anda harus menyetujui syarat dan ketentuan." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      identityNumber: "",
      address: "",
      occupation: "",
      company: "",
      experience: "",
      agreeTerms: false,
    },
  });

  const { data: schemes } = useQuery<CertificationScheme[]>({
    queryKey: ["/api/schemes"],
  });

  const { data: provinces } = useQuery<Province[]>({
    queryKey: ["/api/provinces"],
  });

  const educationLevels = [
    { value: "sma", label: "SMA/SMK" },
    { value: "d3", label: "D3" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
  ];

  const nextStep = async () => {
    if (step === 1) {
      // Validate only the personal information fields
      const result = await form.trigger([
        "fullName",
        "email",
        "phone",
        "birthDate",
        "identityNumber",
        "address",
        "provinceId",
      ]);

      if (result) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      // Validate the professional information fields
      const result = await form.trigger([
        "education",
        "occupation",
        "company",
      ]);

      if (result) {
        setStep(3);
        window.scrollTo(0, 0);
      }
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call to submit registration
    try {
      // In real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Pendaftaran Berhasil",
        description: "Terima kasih atas pendaftaran Anda. Kami akan menghubungi Anda segera untuk langkah selanjutnya.",
      });
      
      form.reset();
      setStep(1);
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
    <>
      <Helmet>
        <title>Registrasi Sertifikasi | LSP Wirausaha Kompeten Nusantara</title>
        <meta
          name="description"
          content="Daftar untuk mendapatkan sertifikasi profesi dari LSP Wirausaha Kompeten Nusantara. Tingkatkan kompetensi dan karir Anda."
        />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Registrasi Sertifikasi
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-gray-700">
              Lengkapi formulir di bawah ini untuk mendaftar sertifikasi profesi.
              Tim kami akan menghubungi Anda untuk proses selanjutnya.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex justify-between">
              <div 
                className={`relative flex flex-col items-center ${
                  step >= 1 ? "text-primary" : "text-gray-400"
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 1 
                      ? "border-primary bg-primary text-white" 
                      : "border-gray-300"
                  }`}
                >
                  1
                </div>
                <span className="mt-2 text-sm font-medium">Data Pribadi</span>
              </div>
              
              <div className={`w-full h-0.5 mt-5 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
              
              <div 
                className={`relative flex flex-col items-center ${
                  step >= 2 ? "text-primary" : "text-gray-400"
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 2 
                      ? "border-primary bg-primary text-white" 
                      : "border-gray-300"
                  }`}
                >
                  2
                </div>
                <span className="mt-2 text-sm font-medium">Data Profesional</span>
              </div>
              
              <div className={`w-full h-0.5 mt-5 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}></div>
              
              <div 
                className={`relative flex flex-col items-center ${
                  step >= 3 ? "text-primary" : "text-gray-400"
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 3 
                      ? "border-primary bg-primary text-white" 
                      : "border-gray-300"
                  }`}
                >
                  3
                </div>
                <span className="mt-2 text-sm font-medium">Pemilihan Skema</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">
                        Data Pribadi
                      </h2>
                      
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
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Tanggal Lahir</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full pl-3 text-left font-normal ${
                                        !field.value && "text-muted-foreground"
                                      }`}
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

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Telepon</FormLabel>
                              <FormControl>
                                <Input placeholder="Masukkan nomor telepon" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="identityNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor KTP</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nomor KTP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alamat Lengkap</FormLabel>
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
                        name="provinceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provinsi</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih provinsi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {provinces?.map((province) => (
                                  <SelectItem
                                    key={province.id}
                                    value={province.id.toString()}
                                  >
                                    {province.name}
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
                          onClick={nextStep}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          Lanjutkan
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Professional Information */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">
                        Data Profesional
                      </h2>

                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pendidikan Terakhir</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih pendidikan terakhir" />
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pekerjaan</FormLabel>
                              <FormControl>
                                <Input placeholder="Masukkan pekerjaan Anda" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Perusahaan/Institusi
                                <span className="text-xs text-gray-500 ml-1">(Opsional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Masukkan nama perusahaan/institusi"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pengalaman di Bidang terkait</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Jelaskan pengalaman Anda di bidang terkait"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Deskripsikan pengalaman kerja, proyek, atau kegiatan yang relevan dengan skema sertifikasi yang akan diambil.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={previousStep}
                        >
                          Kembali
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          Lanjutkan
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Scheme Selection */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">
                        Pemilihan Skema Sertifikasi
                      </h2>

                      <FormField
                        control={form.control}
                        name="schemeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skema Sertifikasi</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih skema sertifikasi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schemes?.map((scheme) => (
                                  <SelectItem
                                    key={scheme.id}
                                    value={scheme.id.toString()}
                                  >
                                    {scheme.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Pilih skema sertifikasi yang sesuai dengan kompetensi yang ingin Anda peroleh
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-2">Dokumen Persyaratan</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Dokumen berikut akan diminta saat proses verifikasi:
                        </p>
                        <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                          <li>Fotokopi KTP</li>
                          <li>Fotokopi Ijazah Terakhir</li>
                          <li>Pas foto berwarna ukuran 3x4 (2 lembar)</li>
                          <li>CV atau daftar riwayat hidup</li>
                          <li>Surat keterangan pengalaman kerja (jika ada)</li>
                          <li>Portofolio (jika dibutuhkan sesuai skema)</li>
                        </ul>
                      </div>

                      <FormField
                        control={form.control}
                        name="agreeTerms"
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
                                Saya menyetujui syarat dan ketentuan yang berlaku
                              </FormLabel>
                              <FormDescription>
                                Dengan mendaftar, Anda menyetujui untuk mematuhi prosedur dan ketentuan sertifikasi oleh LSP Wirausaha Kompeten Nusantara.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={previousStep}
                        >
                          Kembali
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
                              Memproses...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Kirim Pendaftaran
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-green-800 font-medium text-lg mb-3">
                Tahapan Setelah Pendaftaran
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  Verifikasi data dan dokumen oleh admin LSP (1-2 hari kerja)
                </li>
                <li>
                  Pembayaran biaya sertifikasi melalui rekening yang akan
                  diinformasikan
                </li>
                <li>
                  Penjadwalan asesmen sesuai dengan ketersediaan slot
                </li>
                <li>Pelaksanaan asesmen (teori dan praktik)</li>
                <li>
                  Pengumuman hasil asesmen dan penerbitan sertifikat (jika
                  kompeten)
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
