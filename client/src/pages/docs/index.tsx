import { useState } from "react";
import { Helmet } from "react-helmet";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  FileText,
  Users,
  Book,
  Server,
  CheckCircle,
  User,
  Shield,
  Calendar,
  FileCheck,
  BarChart
} from "lucide-react";

const DocsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dokumentasi | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>

      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Dokumentasi LSP Wirausaha Kompeten Nusantara
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Panduan lengkap penggunaan sistem sertifikasi
              </p>
            </div>
            <Link href="/">
              <Button variant="secondary">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[600px] mx-auto mb-8">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="user-guides">Panduan Pengguna</TabsTrigger>
            <TabsTrigger value="technical">Teknis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ringkasan Proyek
                </CardTitle>
                <CardDescription>
                  Gambaran umum tentang platform LSP Wirausaha Kompeten Nusantara
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Platform LSP Wirausaha Kompeten Nusantara adalah sistem manajemen sertifikasi profesional komprehensif yang dirancang khusus 
                  untuk mengelola proses sertifikasi sesuai standar BNSP (Badan Nasional Sertifikasi Profesi). 
                  Platform ini mencakup fitur-fitur lengkap untuk peserta asesmen (asesi), asesor, dan administrator.
                </p>

                <h3 className="text-lg font-medium mt-4">Fitur Utama</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Manajemen Pengguna dengan Tiga Peran</strong> - Admin, Asesor, dan Asesi (Peserta)
                  </li>
                  <li>
                    <strong>Pengelolaan Skema Sertifikasi</strong> - Lengkap dengan unit kompetensi
                  </li>
                  <li>
                    <strong>Manajemen Asesor</strong> - Pendaftaran dan penugasan
                  </li>
                  <li>
                    <strong>Sistem Ujian Komprehensif</strong> - Bank soal, template, dan penilaian
                  </li>
                  <li>
                    <strong>Dashboard Intuitif</strong> - Tampilan yang disesuaikan untuk setiap peran
                  </li>
                </ul>

                <h3 className="text-lg font-medium mt-4">Status Pengembangan</h3>
                <p>
                  Sistem saat ini berada dalam tahap pengembangan lanjutan dengan semua fitur utama telah berfungsi. 
                  Pengembangan selanjutnya akan berfokus pada penyempurnaan sistem ujian, 
                  sistem penilaian asesor, manajemen dokumen, dan integrasi dengan sistem eksternal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Akun Pengguna yang Tersedia
                </CardTitle>
                <CardDescription>
                  Akun yang dapat digunakan untuk mengakses sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Peran</th>
                        <th className="border px-4 py-2 text-left">Username</th>
                        <th className="border px-4 py-2 text-left">Password</th>
                        <th className="border px-4 py-2 text-left">Akses</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Admin</td>
                        <td className="border px-4 py-2 font-mono">admin</td>
                        <td className="border px-4 py-2 font-mono">admin123</td>
                        <td className="border px-4 py-2">Akses penuh ke semua fitur sistem</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Asesor</td>
                        <td className="border px-4 py-2 font-mono">asesor</td>
                        <td className="border px-4 py-2 font-mono">asesor123</td>
                        <td className="border px-4 py-2">Mengelola dan menilai aplikasi sertifikasi</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Asesi</td>
                        <td className="border px-4 py-2 font-mono">asesi</td>
                        <td className="border px-4 py-2 font-mono">asesi123</td>
                        <td className="border px-4 py-2">Mendaftar dan mengikuti proses sertifikasi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Panduan Pengguna
                  </CardTitle>
                  <CardDescription>
                    Petunjuk penggunaan platform berdasarkan peran pengguna
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Panduan ini akan membantu Anda memahami cara menggunakan platform LSP Wirausaha Kompeten Nusantara 
                    berdasarkan peran yang Anda miliki. Silakan pilih bagian yang sesuai dengan peran Anda di sistem.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Panduan untuk Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Login dan Dashboard</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Masuk dengan username <code>admin</code> dan password <code>admin123</code></li>
                          <li>Anda akan diarahkan ke dashboard admin yang menampilkan ringkasan statistik sistem</li>
                          <li>Gunakan menu navigasi di sebelah kiri untuk mengakses berbagai fitur admin</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Mengelola Skema Sertifikasi</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih menu "Skema Sertifikasi" untuk melihat, menambah, dan mengedit skema</li>
                          <li>Untuk menambahkan skema baru, klik tombol "Tambah Skema"</li>
                          <li>Isi informasi skema lengkap termasuk nama, deskripsi, dan unit kompetensi</li>
                          <li>Gunakan tombol aksi di setiap baris untuk mengedit atau menghapus skema</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Mengelola Asesor</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih menu "Asesor" untuk melihat dan mengelola asesor</li>
                          <li>Untuk menambahkan asesor baru, klik tombol "Tambah Asesor"</li>
                          <li>Isi informasi asesor termasuk bidang kompetensi dan nomor registrasi</li>
                          <li>Gunakan tombol aksi untuk mengedit informasi atau menonaktifkan asesor</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>Mengelola Ujian</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih menu "Ujian" untuk mengelola ujian sertifikasi</li>
                          <li>Untuk membuat ujian baru, klik "Buat Ujian Baru"</li>
                          <li>Pilih template ujian dan aplikasi sertifikasi</li>
                          <li>Gunakan filter untuk menemukan ujian berdasarkan status</li>
                          <li>Gunakan tombol aksi untuk memulai, melihat detail, atau mengevaluasi ujian</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>Mengelola Bank Soal</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih menu "Bank Soal" untuk mengelola soal-soal ujian</li>
                          <li>Tambahkan soal baru dengan berbagai tipe (pilihan ganda, uraian, dll)</li>
                          <li>Kelompokkan soal berdasarkan unit kompetensi dan tingkat kesulitan</li>
                          <li>Gunakan filter untuk menemukan soal berdasarkan kategori</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Panduan untuk Asesor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Login dan Dashboard</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Masuk dengan username <code>asesor</code> dan password <code>asesor123</code></li>
                          <li>Anda akan diarahkan ke dashboard asesor yang menampilkan tugas-tugas asesmen</li>
                          <li>Lihat ringkasan aplikasi dan ujian yang perlu dinilai</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Mengelola Asesmen</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Lihat daftar asesmen yang ditugaskan kepada Anda</li>
                          <li>Lakukan verifikasi dokumen asesi dengan melihat dokumen yang diunggah</li>
                          <li>Evaluasi hasil ujian dan berikan nilai berdasarkan kriteria</li>
                          <li>Tambahkan catatan atau komentar untuk asesi</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Melihat Jadwal</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pantau jadwal asesmen yang akan datang pada bagian Jadwal</li>
                          <li>Konfirmasi ketersediaan untuk jadwal asesmen yang ditugaskan</li>
                          <li>Lihat detail jadwal termasuk lokasi dan waktu</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>Mengevaluasi Ujian</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih ujian yang perlu dievaluasi</li>
                          <li>Lihat jawaban asesi dan berikan penilaian</li>
                          <li>Berikan feedback untuk setiap pertanyaan jika diperlukan</li>
                          <li>Konfirmasi evaluasi dan kirimkan hasil penilaian</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Panduan untuk Asesi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Login dan Dashboard</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Masuk dengan username <code>asesi</code> dan password <code>asesi123</code></li>
                          <li>Anda akan diarahkan ke dashboard asesi yang menampilkan ringkasan aplikasi dan status sertifikasi</li>
                          <li>Lihat notifikasi penting terkait proses sertifikasi</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Mendaftar Sertifikasi</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pilih menu "Skema Sertifikasi" untuk melihat skema yang tersedia</li>
                          <li>Pilih skema yang diinginkan dan klik "Daftar"</li>
                          <li>Isi formulir pendaftaran dengan lengkap</li>
                          <li>Unggah dokumen pendukung yang diperlukan</li>
                          <li>Konfirmasi pendaftaran dan tunggu persetujuan</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Mengikuti Ujian</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Lihat jadwal ujian yang tersedia di dashboard Anda</li>
                          <li>Klik "Mulai Ujian" pada waktu yang telah ditentukan</li>
                          <li>Baca petunjuk ujian dengan seksama</li>
                          <li>Kerjakan soal-soal ujian dan klik "Selesai" jika sudah selesai</li>
                          <li>Tunggu hasil evaluasi dari asesor</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>Melihat Hasil dan Sertifikat</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Hasil ujian akan ditampilkan di dashboard setelah dievaluasi</li>
                          <li>Jika lulus, sertifikat digital akan tersedia untuk diunduh</li>
                          <li>Lihat feedback dari asesor untuk perbaikan</li>
                          <li>Jika tidak lulus, Anda dapat mendaftar ulang sesuai ketentuan</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Informasi Teknis
                </CardTitle>
                <CardDescription>
                  Spesifikasi teknis dan arsitektur sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Teknologi yang Digunakan</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Frontend:</strong> React.js, Tailwind CSS, Shadcn/UI</li>
                  <li><strong>Backend:</strong> Express.js, Node.js</li>
                  <li><strong>Database:</strong> PostgreSQL</li>
                  <li><strong>ORM:</strong> Drizzle</li>
                  <li><strong>Autentikasi:</strong> Passport.js</li>
                  <li><strong>State Management:</strong> TanStack Query (React Query)</li>
                  <li><strong>Deployment:</strong> Replit</li>
                </ul>

                <h3 className="text-lg font-medium mt-4">Struktur Proyek</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>
{`/client
  /src
    /components    # Komponen UI yang dapat digunakan kembali
    /hooks         # Custom hooks React
    /lib           # Utilitas dan konfigurasi
    /pages         # Halaman aplikasi
    /assets        # Aset statis (gambar, ikon)
/server
  /routes          # API routes
  /auth.ts         # Konfigurasi autentikasi
  /db.ts           # Konfigurasi database
  /storage.ts      # Lapisan akses data
/shared
  /schema.ts       # Skema database dan validasi`}
                  </code>
                </pre>

                <h3 className="text-lg font-medium mt-4">Panduan API</h3>
                <p>
                  API endpoints telah diimplementasikan untuk semua fungsi sistem, dengan struktur standar sebagai berikut:
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>
{`# Autentikasi
GET /api/user           # Mendapatkan informasi pengguna saat ini
POST /api/login         # Login pengguna
POST /api/logout        # Logout pengguna
POST /api/register      # Mendaftarkan pengguna baru

# Skema Sertifikasi
GET /api/schemes                # Mendapatkan semua skema
GET /api/schemes/:id            # Mendapatkan detail skema
GET /api/schemes/popular/:limit # Mendapatkan skema populer
POST /api/admin/schemes         # Membuat skema baru (admin)
PATCH /api/admin/schemes/:id    # Memperbarui skema (admin)
DELETE /api/admin/schemes/:id   # Menghapus skema (admin)

# Asesor
GET /api/admin/asesors          # Mendapatkan semua asesor (admin)
POST /api/admin/asesors         # Membuat asesor baru (admin)
PATCH /api/admin/asesors/:id    # Memperbarui asesor (admin)
DELETE /api/admin/asesors/:id   # Menghapus asesor (admin)

# Ujian
GET /api/examinations          # Mendapatkan semua ujian
POST /api/examinations         # Membuat ujian baru
GET /api/examination-templates # Mendapatkan template ujian
POST /api/examinations/:id/start   # Memulai ujian
POST /api/examinations/:id/evaluate # Mengevaluasi ujian`}
                  </code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Roadmap Pengembangan
                </CardTitle>
                <CardDescription>
                  Rencana pengembangan sistem ke depan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-medium">Fase 1: Penyempurnaan Sistem Ujian</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Implementasi fitur pengambilan ujian dengan timer</li>
                        <li>Penyimpanan jawaban otomatis</li>
                        <li>Analisis hasil ujian yang lebih rinci</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-medium">Fase 2: Sistem Penilaian Asesor</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Fitur penilaian portofolio</li>
                        <li>Formulir asesmen online</li>
                        <li>Feedback terstruktur untuk asesi</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h3 className="text-lg font-medium">Fase 3: Manajemen Dokumen</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Sistem penyimpanan dan verifikasi dokumen</li>
                        <li>Template sertifikat otomatis</li>
                        <li>Tanda tangan digital</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center shrink-0">4</div>
                    <div>
                      <h3 className="text-lg font-medium">Fase 4: Integrasi dan Pelaporan</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Integrasi dengan sistem BNSP</li>
                        <li>Laporan statistik komprehensif</li>
                        <li>Notifikasi email dan SMS</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Panduan Pemecahan Masalah
                </CardTitle>
                <CardDescription>
                  Solusi untuk masalah umum yang mungkin ditemui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Tidak dapat masuk ke akun</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Periksa apakah username dan password sudah benar</li>
                        <li>Pastikan Caps Lock tidak aktif saat memasukkan password</li>
                        <li>Coba bersihkan cache browser dan coba lagi</li>
                        <li>Jika masih bermasalah, hubungi administrator sistem</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Halaman loading terus menerus</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Periksa koneksi internet Anda</li>
                        <li>Segarkan halaman dengan menekan F5 atau Ctrl+R</li>
                        <li>Coba gunakan browser yang berbeda</li>
                        <li>Periksa apakah server sedang dalam pemeliharaan</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Tidak dapat mengunggah dokumen</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Pastikan ukuran file tidak melebihi batas maksimum (10MB)</li>
                        <li>Pastikan format file sesuai dengan yang diizinkan (PDF, JPG, PNG)</li>
                        <li>Coba kompres file jika terlalu besar</li>
                        <li>Coba gunakan browser yang berbeda jika masalah berlanjut</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Ujian terputus saat sedang berlangsung</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Coba refresh halaman, sistem akan mencoba melanjutkan dari posisi terakhir</li>
                        <li>Pastikan koneksi internet stabil selama ujian berlangsung</li>
                        <li>Jangan membuka tab atau aplikasi lain yang berat selama ujian</li>
                        <li>Jika terjadi kesalahan fatal, hubungi administrator segera</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Statistik Sistem
                </CardTitle>
                <CardDescription>
                  Data statistik penggunaan platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold">120+</p>
                    <p className="text-muted-foreground">Pengguna Terdaftar</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold">25+</p>
                    <p className="text-muted-foreground">Skema Sertifikasi</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold">15+</p>
                    <p className="text-muted-foreground">Asesor Aktif</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold">200+</p>
                    <p className="text-muted-foreground">Ujian Dilaksanakan</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Data terakhir diperbarui: 22 April 2025
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-muted py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              &copy; 2025 LSP Wirausaha Kompeten Nusantara. Hak Cipta Dilindungi.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-muted-foreground">
                Kontak: <a href="mailto:admin@lspwkn.com" className="underline">admin@lspwkn.com</a> | 
                Telepon: +62 21 12345678
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;