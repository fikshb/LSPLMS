import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Skema validasi form
const formSchema = z.object({
  // Bagian A: Data Pribadi
  nama: z.string().min(1, "Nama lengkap harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  jenisKelamin: z.enum(["L", "P"], {
    required_error: "Jenis kelamin harus dipilih",
  }),
  kebangsaan: z.string().min(1, "Kebangsaan harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  kodePos: z.string().min(1, "Kode pos harus diisi"),
  noTelp: z.string().min(1, "Nomor telepon harus diisi"),
  email: z.string().email("Format email tidak valid"),
  pendidikanTerakhir: z.string().min(1, "Pendidikan terakhir harus diisi"),
  
  // Bagian B: Data Pekerjaan
  namaInstitusi: z.string().min(1, "Nama institusi/perusahaan harus diisi"),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  alamatKantor: z.string().min(1, "Alamat kantor harus diisi"),
  kodePosKantor: z.string().min(1, "Kode pos kantor harus diisi"),
  noTelpKantor: z.string().min(1, "Nomor telepon kantor harus diisi"),
  emailKantor: z.string().email("Format email kantor tidak valid"),
  
  // Bagian C: Data Sertifikasi
  tujuanAssessment: z.enum(["Sertifikasi", "Sertifikasi Ulang", "Lainnya"], {
    required_error: "Tujuan asesmen harus dipilih",
  }),
  tujuanLainnya: z.string().optional(),
  skemaKompetensi: z.enum(["Pelaksana Penjamah Makanan"], {
    required_error: "Skema kompetensi harus dipilih",
  }),
  judul: z.string().min(1, "Judul harus diisi"),
  nomor: z.string().min(1, "Nomor harus diisi"),
  
  // Pernyataan
  pernyataanApplicant: z.boolean().refine(val => val === true, {
    message: "Anda harus menyetujui pernyataan ini untuk melanjutkan",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const FRAPL01Form: React.FC = () => {
  const { toast } = useToast();
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisKelamin: "L",
      tujuanAssessment: "Sertifikasi",
      skemaKompetensi: "Pelaksana Penjamah Makanan",
      pernyataanApplicant: false,
    },
  });
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast({
      title: "Formulir Berhasil Dikirim",
      description: "Permohonan sertifikasi kompetensi telah berhasil dikirim.",
    });
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-primary">FR.APL.01</CardTitle>
            <CardDescription className="text-base">
              Formulir Permohonan Sertifikasi Kompetensi
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">No. Formulir: LSP-WKN-01</p>
            <p className="text-sm">Berlaku: April 2023</p>
          </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 pt-6">
            {/* Bagian A: Data Pribadi */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Bagian A: Data Pribadi</h3>
                <Separator className="ml-4 flex-1" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nama"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tempatLahir"
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
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="jenisKelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kebangsaan"
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
                
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan alamat lengkap"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kodePos"
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
                
                <FormField
                  control={form.control}
                  name="noTelp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
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
                        <Input type="email" placeholder="Masukkan email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pendidikanTerakhir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendidikan Terakhir</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan pendidikan terakhir" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Bagian B: Data Pekerjaan */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Bagian B: Data Pekerjaan</h3>
                <Separator className="ml-4 flex-1" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="namaInstitusi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Institusi/Perusahaan</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama institusi/perusahaan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jabatan"
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
                  name="alamatKantor"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat Kantor</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan alamat kantor"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kodePosKantor"
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
                
                <FormField
                  control={form.control}
                  name="noTelpKantor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nomor telepon kantor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emailKantor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Masukkan email kantor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Bagian C: Data Sertifikasi */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Bagian C: Data Sertifikasi</h3>
                <Separator className="ml-4 flex-1" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tujuanAssessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tujuan Asesmen</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tujuan asesmen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sertifikasi">Sertifikasi</SelectItem>
                          <SelectItem value="Sertifikasi Ulang">Sertifikasi Ulang</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("tujuanAssessment") === "Lainnya" && (
                  <FormField
                    control={form.control}
                    name="tujuanLainnya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tujuan Lainnya</FormLabel>
                        <FormControl>
                          <Input placeholder="Jelaskan tujuan lainnya" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="skemaKompetensi"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Skema Kompetensi</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih skema kompetensi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pelaksana Penjamah Makanan">Pelaksana Penjamah Makanan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nomor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nomor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Pernyataan Pemohon */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Pernyataan Pemohon</h3>
              
              <FormField
                control={form.control}
                name="pernyataanApplicant"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Saya menyatakan bahwa dokumen-dokumen yang saya lampirkan adalah sah 
                        dan benar. Saya setuju mengikuti asesmen dengan metode yang telah 
                        ditetapkan. Saya akan mengikuti kode etik profesi. Saya bersedia 
                        menyampaikan semua informasi yang diperlukan untuk asesmen.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" type="button">
              Batal
            </Button>
            <Button type="submit">
              Kirim Permohonan
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default FRAPL01Form;