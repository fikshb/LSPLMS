import { useQuery } from "@tanstack/react-query";
import { CertificationScheme } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Calendar, GraduationCap, User } from "lucide-react";

interface SchemeDetailProps {
  slug: string;
}

const SchemeDetail = ({ slug }: SchemeDetailProps) => {
  const { data: scheme, isLoading, error } = useQuery<CertificationScheme>({
    queryKey: [`/api/schemes/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Skema tidak ditemukan</h2>
          <p>Maaf, skema sertifikasi yang Anda cari tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${scheme.name} | LSP Wirausaha Kompeten Nusantara`}</title>
        <meta name="description" content={scheme.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">{scheme.name}</h1>
          <p className="text-gray-600 max-w-3xl">{scheme.description}</p>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="mb-8">
            <TabsTrigger value="info">Informasi Umum</TabsTrigger>
            <TabsTrigger value="unit">Unit Kompetensi</TabsTrigger>
            <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
            <TabsTrigger value="assessment">Asesmen</TabsTrigger>
            <TabsTrigger value="jobs">Profesi Terkait</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Informasi Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Tentang Skema</h3>
                <p className="text-gray-700 mb-6">
                  {scheme.name} adalah skema sertifikasi yang dirancang untuk mempersiapkan profesional 
                  di bidang {scheme.category}. Sertifikasi ini diakui secara nasional dan internasional,
                  memberikan nilai tambah bagi karir Anda di industri.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Tujuan Sertifikasi</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Memvalidasi kemampuan dan keahlian di bidang {scheme.name}</li>
                  <li>Meningkatkan daya saing di pasar kerja nasional dan internasional</li>
                  <li>Memberikan bukti formal kompetensi yang diakui industri</li>
                  <li>Mengembangkan profesionalisme dalam bidang {scheme.category}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Informasi Sertifikasi</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium">Durasi Sertifikasi</h4>
                      <p className="text-gray-600 text-sm">3 tahun, dapat diperpanjang</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium">Lembaga Pemberi Sertifikasi</h4>
                      <p className="text-gray-600 text-sm">LSP Wirausaha Kompeten Nusantara</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <GraduationCap className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium">Tingkat</h4>
                      <p className="text-gray-600 text-sm">KKNI Level 5</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium">Target Peserta</h4>
                      <p className="text-gray-600 text-sm">
                        Profesional, Mahasiswa, Karyawan, Wirausahawan
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium">Prospek Karir</h4>
                      <p className="text-gray-600 text-sm">
                        Membuka peluang karir di berbagai industri terkait {scheme.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unit" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Unit Kompetensi</h2>
            <p className="text-gray-600 mb-6">
              Berikut adalah unit kompetensi yang akan diujikan dalam sertifikasi {scheme.name}:
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">1. Pengetahuan Dasar</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Memahami konsep dasar {scheme.name}</li>
                  <li>Mengenal tools dan teknologi terkait</li>
                  <li>Mengidentifikasi ruang lingkup dan batasan</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">2. Perencanaan dan Strategi</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Menyusun rencana strategis</li>
                  <li>Menganalisis kebutuhan dan target</li>
                  <li>Menentukan metode dan pendekatan optimal</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">3. Implementasi</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Menerapkan strategi sesuai rencana</li>
                  <li>Menggunakan tools dan teknologi</li>
                  <li>Mengoptimalkan proses dan hasil</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">4. Monitoring dan Evaluasi</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Memantau pelaksanaan program</li>
                  <li>Mengukur efektivitas dan efisiensi</li>
                  <li>Melakukan perbaikan berkelanjutan</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">5. Pelaporan dan Dokumentasi</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Menyusun laporan komprehensif</li>
                  <li>Mendokumentasikan proses dan hasil</li>
                  <li>Mengkomunikasikan temuan dan rekomendasi</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Persyaratan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Persyaratan Administratif</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Fotokopi KTP atau identitas resmi</li>
                  <li>Pas foto terbaru ukuran 3x4 (2 lembar)</li>
                  <li>Fotokopi ijazah pendidikan terakhir</li>
                  <li>CV atau daftar riwayat hidup</li>
                  <li>Formulir pendaftaran yang telah diisi lengkap</li>
                  <li>Bukti pembayaran biaya sertifikasi</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Persyaratan Teknis</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Minimal pendidikan SMA/SMK atau sederajat</li>
                  <li>Memiliki pengalaman di bidang terkait min. 1 tahun (dibuktikan dengan surat keterangan)</li>
                  <li>Mampu mengoperasikan komputer dan aplikasi standar</li>
                  <li>Memiliki pengetahuan dasar di bidang {scheme.name}</li>
                  <li>Lulus pre-assessment (jika diperlukan)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Proses Pendaftaran</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Unduh dan isi formulir pendaftaran di website resmi</li>
                <li>Siapkan semua dokumen persyaratan</li>
                <li>Lakukan pembayaran biaya sertifikasi</li>
                <li>Kirimkan formulir beserta dokumen persyaratan</li>
                <li>Tunggu konfirmasi jadwal asesmen</li>
                <li>Ikuti asesmen sesuai jadwal</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="assessment" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Asesmen</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Metode Asesmen</h3>
              <p className="text-gray-700 mb-4">
                Untuk mendapatkan sertifikasi {scheme.name}, asesi akan diuji menggunakan beberapa metode asesmen berikut:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-md mb-2">1. Tes Tertulis</h4>
                  <p className="text-gray-600 text-sm">
                    Tes pengetahuan dasar dan teori terkait {scheme.name} dalam bentuk pilihan ganda dan esai.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-md mb-2">2. Wawancara</h4>
                  <p className="text-gray-600 text-sm">
                    Tanya jawab dengan asesor tentang pengalaman, pengetahuan, dan keterampilan.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-md mb-2">3. Demonstrasi / Praktik</h4>
                  <p className="text-gray-600 text-sm">
                    Menunjukkan kemampuan praktis dalam menyelesaikan tugas sesuai standar kompetensi.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-md mb-2">4. Portofolio</h4>
                  <p className="text-gray-600 text-sm">
                    Koleksi bukti kerja yang menunjukkan pengalaman dan keahlian dalam bidang yang relevan.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Kriteria Kelulusan</h3>
              <p className="text-gray-700 mb-4">
                Asesi dinyatakan KOMPETEN apabila memenuhi semua kriteria berikut:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Lulus semua unit kompetensi yang diujikan</li>
                <li>Mendapatkan nilai minimal 70 untuk setiap metode asesmen</li>
                <li>Menunjukkan kemampuan praktis sesuai standar industri</li>
                <li>Mampu menjawab pertanyaan dari asesor dengan tepat</li>
                <li>Menyelesaikan semua tugas dalam batas waktu yang ditentukan</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Profesi Terkait</h2>
            
            <p className="text-gray-700 mb-6">
              Sertifikasi {scheme.name} dapat membuka peluang karir di berbagai posisi berikut:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Spesialis {scheme.name}</h3>
                <p className="text-gray-600 text-sm">
                  Profesional yang fokus pada implementasi strategi dan taktik {scheme.name}.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Konsultan {scheme.category}</h3>
                <p className="text-gray-600 text-sm">
                  Memberikan saran dan strategi kepada klien berdasarkan keahlian spesifik.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Manajer Proyek {scheme.category}</h3>
                <p className="text-gray-600 text-sm">
                  Memimpin dan mengkoordinasikan proyek-proyek terkait {scheme.name}.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Analis {scheme.category}</h3>
                <p className="text-gray-600 text-sm">
                  Menganalisis data dan tren untuk mengoptimalkan strategi.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Pengajar/Trainer</h3>
                <p className="text-gray-600 text-sm">
                  Memberikan pelatihan dan pendidikan di bidang {scheme.name}.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Wirausahawan</h3>
                <p className="text-gray-600 text-sm">
                  Membangun usaha sendiri dengan keahlian di bidang {scheme.name}.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Industri Potensial</h3>
              <p className="text-gray-700 mb-4">
                Pemegang sertifikasi {scheme.name} dapat bekerja di berbagai sektor industri, termasuk:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700 grid grid-cols-1 md:grid-cols-2">
                <li>Perusahaan teknologi</li>
                <li>Agensi pemasaran dan periklanan</li>
                <li>E-commerce dan retail</li>
                <li>Perbankan dan keuangan</li>
                <li>Pendidikan dan pelatihan</li>
                <li>Konsultan bisnis</li>
                <li>Startup dan perusahaan rintisan</li>
                <li>UMKM dan bisnis lokal</li>
                <li>Pemerintahan dan lembaga publik</li>
                <li>Organisasi non-profit</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-heading font-semibold mb-4">Daftar Sekarang</h2>
          <p className="text-gray-700 mb-6">
            Tingkatkan karir Anda dengan mendapatkan sertifikasi {scheme.name} dari LSP Wirausaha Kompeten Nusantara.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/jadwal-asesmen"
              className="bg-white border border-primary text-primary font-medium px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-200 text-center"
            >
              Lihat Jadwal
            </a>
            <a
              href="/registrasi"
              className="bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary-dark transition-colors duration-200 text-center"
            >
              Daftar Sertifikasi
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchemeDetail;
