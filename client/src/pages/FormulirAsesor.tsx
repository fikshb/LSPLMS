import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Definisi struktur data form
interface FormItem {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  description?: string;
  link: string;
}

const FormulirAsesor: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  
  // Data formulir berdasarkan dokumen yang diberikan
  const forms: FormItem[] = [
    // A. PELAKSANAAN ASESMEN
    { id: 1, kode: "FR.APL.01", nama: "Permohonan Sertifikasi Kompetensi", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-apl-01" },
    { id: 2, kode: "FR.APL.02", nama: "Asesmen Mandiri", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-apl-02" },
    { id: 3, kode: "Portofolio", nama: "Portofolio Asesi", kategori: "PELAKSANAAN ASESMEN", link: "/forms/portofolio" },
    { id: 4, kode: "FR.MAPA.01", nama: "Merencanakan Aktivitas dan Proses Asesmen", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-mapa-01" },
    { id: 5, kode: "FR.MAPA.02", nama: "Para Instrumen Asesmen Hasil Pendekatan Asesmen dan Perencanaan Asesmen", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-mapa-02" },
    { id: 6, kode: "FR.AK.01", nama: "Daftar Pertanyaan yang Wajib", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-ak-01" },
    { id: 7, kode: "FR.AK.04", nama: "Formulir Banding", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-ak-04" },
    { id: 8, kode: "FR.AK.07", nama: "Pertanyaan Asesmen dan Kerahasiaan", kategori: "PELAKSANAAN ASESMEN", link: "/forms/fr-ak-07" },
    
    // INSTRUMEN ASESMEN
    { id: 9, kode: "FR.IA.01", nama: "Observasi Aktivitas di Tempat Kerja / Tempat Kerja Simulasi", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-01" },
    { id: 10, kode: "FR.IA.02", nama: "TDD - Tugas Praktik Demonstrasi", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-02" },
    { id: 11, kode: "FR.IA.03", nama: "PTO - Pertanyaan untuk Mendukung Observasi", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-03" },
    { id: 12, kode: "FR.IA.04a", nama: "DIT - Daftar Instruksi Terstruktur (Penilaian Proyek Singkat / Kegiatan Terstruktur)", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-04a" },
    { id: 13, kode: "FR.IA.04b", nama: "DIT - Penilaian Proyek Singkat atau Kegiatan Terstruktur Lainnya", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-04b" },
    { id: 14, kode: "FR.IA.05", nama: "DPT - Pertanyaan Tertulis Pilihan Ganda / LJK - Lembar Kerja Jawaban Pilihan Ganda", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-05" },
    { id: 15, kode: "FR.IA.06a", nama: "DPT - Pertanyaan Tertulis Isian / Essay", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-06a" },
    { id: 16, kode: "FR.IA.06c", nama: "Lembar Jawab Pertanyaan Tes Isian", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-06c" },
    { id: 17, kode: "FR.IA.07", nama: "PPL - Pertanyaan Lisan", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-07" },
    { id: 18, kode: "FR.IA.08", nama: "CVP - Ceklis Verifikasi Portofolio", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-08" },
    { id: 19, kode: "FR.IA.09", nama: "PW - Pertanyaan Wawancara", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-09" },
    { id: 20, kode: "FR.IA.10", nama: "CUP - Ceklis Ulasan Pihak Ketiga", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-10" },
    { id: 21, kode: "FR.IA.11", nama: "CKP - Ceklis Kerja Produk", kategori: "INSTRUMEN ASESMEN", link: "/forms/fr-ia-11" },
    
    // B. KEPUTUSAN
    { id: 22, kode: "FR.AK.02", nama: "Rekaman Asesmen Kompetensi", kategori: "KEPUTUSAN", link: "/forms/fr-ak-02" },
    { id: 23, kode: "FR.AK.03", nama: "Umpan Balik dan Catatan Asesmen", kategori: "KEPUTUSAN", link: "/forms/fr-ak-03" },
    
    // C. LAPORAN ASESMEN
    { id: 24, kode: "FR.AK.05", nama: "Laporan Asesmen", kategori: "LAPORAN ASESMEN", link: "/forms/fr-ak-05" },
    { id: 25, kode: "FR.AK.06", nama: "Meninjau Proses Asesmen", kategori: "LAPORAN ASESMEN", link: "/forms/fr-ak-06" },
    
    // D. VALIDASI
    { id: 26, kode: "FR.VA", nama: "Memberikan Kontribusi dalam Validasi Asesmen", kategori: "VALIDASI", link: "/forms/fr-va" },
  ];

  // Mengatur status checkbox
  const toggleFormSelection = (formId: number) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  // Filter formulir berdasarkan pencarian
  const filteredForms = forms.filter(form => 
    form.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mengelompokkan formulir berdasarkan kategori
  const groupedForms: Record<string, FormItem[]> = {};
  filteredForms.forEach(form => {
    if (!groupedForms[form.kategori]) {
      groupedForms[form.kategori] = [];
    }
    groupedForms[form.kategori].push(form);
  });

  // Handle download selected forms
  const handleDownloadSelected = () => {
    if (selectedForms.length === 0) {
      toast({
        title: "Tidak ada formulir yang dipilih",
        description: "Pilih setidaknya satu formulir untuk diunduh",
        variant: "destructive",
      });
      return;
    }

    // Implementasi unduhan di sini (simulasi)
    toast({
      title: "Mengunduh formulir",
      description: `${selectedForms.length} formulir sedang diunduh`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Formulir Asesor | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Formulir Asesor</h1>
          <p className="text-muted-foreground mt-2">
            Kumpulan formulir asesmen untuk Skema Pelaksana Penjamah Makanan
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Cari formulir berdasarkan kode atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedForms([])}
              disabled={selectedForms.length === 0}
            >
              Reset Pilihan
            </Button>
            <Button 
              onClick={handleDownloadSelected}
              disabled={selectedForms.length === 0}
            >
              Unduh {selectedForms.length > 0 && `(${selectedForms.length})`}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="table">Tabel</TabsTrigger>
            <TabsTrigger value="cards">Kartu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableCaption>Daftar Formulir Asesor</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">
                        <Checkbox 
                          checked={
                            filteredForms.length > 0 && 
                            selectedForms.length === filteredForms.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedForms(filteredForms.map(f => f.id));
                            } else {
                              setSelectedForms([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead className="w-36">Kode</TableHead>
                      <TableHead>Nama Dokumen</TableHead>
                      <TableHead className="w-36">Kategori</TableHead>
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredForms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Tidak ada formulir yang sesuai dengan pencarian
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredForms.map((form, index) => (
                        <TableRow key={form.id}>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={selectedForms.includes(form.id)}
                              onCheckedChange={() => toggleFormSelection(form.id)}
                            />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{form.kode}</TableCell>
                          <TableCell>{form.nama}</TableCell>
                          <TableCell>{form.kategori.split(" ")[0]}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={form.link}>Lihat</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedForms).map(([category, categoryForms]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-xl font-semibold text-primary">{category}</h2>
                  
                  {categoryForms.map(form => (
                    <Card key={form.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2">
                            <Checkbox 
                              checked={selectedForms.includes(form.id)}
                              onCheckedChange={() => toggleFormSelection(form.id)}
                              className="mt-1"
                            />
                            <div>
                              <CardTitle className="text-lg">{form.kode}</CardTitle>
                              <CardDescription>{form.nama}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={form.link}>Lihat Formulir</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ))}
              
              {Object.keys(groupedForms).length === 0 && (
                <div className="col-span-3 flex justify-center items-center py-12">
                  <p className="text-muted-foreground">
                    Tidak ada formulir yang sesuai dengan pencarian
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FormulirAsesor;