import { useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Download, ArrowLeft, BookCopy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DocsExportPage = () => {
  const documentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ekspor Dokumentasi | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>

      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Dokumentasi LSP Wirausaha Kompeten Nusantara
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Versi untuk dicetak
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/docs">
                <Button variant="secondary" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Dokumentasi
                </Button>
              </Link>
              <Button 
                onClick={() => window.print()} 
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Cetak / Simpan PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" ref={documentRef}>
        <div className="space-y-10 print:space-y-6">
          {/* Judul Utama */}
          <div className="text-center mb-10 print:mb-6 print:mt-2">
            <h1 className="text-4xl font-bold">Dokumentasi Sistem</h1>
            <h2 className="text-2xl mt-2 text-primary">LSP Wirausaha Kompeten Nusantara</h2>
            <p className="mt-4 text-muted-foreground">Versi 1.0.0 - April 2025</p>
          </div>

          {/* Daftar Isi */}
          <Card className="print:shadow-none print:border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookCopy className="h-5 w-5" />
                Daftar Isi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-2">
                <li><a href="#overview" className="text-primary hover:underline">Ringkasan Proyek</a></li>
                <li><a href="#features" className="text-primary hover:underline">Fitur Utama</a></li>
                <li><a href="#users" className="text-primary hover:underline">Akun Pengguna</a></li>
                <li><a href="#admin-guide" className="text-primary hover:underline">Panduan untuk Admin</a></li>
                <li><a href="#asesor-guide" className="text-primary hover:underline">Panduan untuk Asesor</a></li>
                <li><a href="#asesi-guide" className="text-primary hover:underline">Panduan untuk Asesi</a></li>
                <li><a href="#technical" className="text-primary hover:underline">Informasi Teknis</a></li>
                <li><a href="#roadmap" className="text-primary hover:underline">Roadmap Pengembangan</a></li>
                <li><a href="#api" className="text-primary hover:underline">Dokumentasi API</a></li>
                <li><a href="#troubleshooting" className="text-primary hover:underline">Pemecahan Masalah</a></li>
              </ol>
            </CardContent>
          </Card>

          {/* Ringkasan Proyek */}
          <section id="overview" className="print:break-before-page">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">1. Ringkasan Proyek</h2>
            <div className="mt-6 space-y-4">
              <p>
                Platform LSP Wirausaha Kompeten Nusantara adalah sistem manajemen sertifikasi profesional komprehensif yang dirancang khusus untuk mengelola proses sertifikasi sesuai standar BNSP (Badan Nasional Sertifikasi Profesi). Platform ini mencakup fitur-fitur lengkap untuk peserta asesmen (asesi), asesor, dan administrator.
              </p>

              <p>
                Sistem ini dikembangkan dengan fokus pada kemudahan penggunaan, keamanan data, dan kemampuan skalabilitas untuk mendukung berbagai skema sertifikasi. Dengan menggunakan teknologi modern, sistem ini memudahkan pengelolaan seluruh proses sertifikasi, mulai dari pendaftaran hingga penerbitan sertifikat.
              </p>
            </div>
          </section>

          {/* Fitur Utama */}
          <section id="features">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">2. Fitur Utama</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Manajemen Pengguna dengan Tiga Peran</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Admin:</strong> Mengelola seluruh sistem termasuk skema sertifikasi, asesor, dan ujian</li>
                  <li><strong>Asesor:</strong> Menilai asesi dan mengelola proses asesmen</li>
                  <li><strong>Asesi (Peserta):</strong> Mendaftar sertifikasi dan mengikuti ujian</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Pengelolaan Skema Sertifikasi</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pendaftaran skema sertifikasi lengkap dengan unit kompetensi</li>
                  <li>Kategorisasi dan pencarian skema</li>
                  <li>Informasi detail tentang persyaratan sertifikasi</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Manajemen Asesor</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pendaftaran dan pengelolaan asesor</li>
                  <li>Penugasan asesor untuk skema tertentu</li>
                  <li>Pemantauan aktivitas asesor</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Sistem Ujian Komprehensif</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Bank soal dengan berbagai tipe pertanyaan</li>
                  <li>Template ujian yang dapat dikonfigurasi</li>
                  <li>Penilaian otomatis dan manual</li>
                  <li>Status ujian: Belum Dimulai, Sedang Berlangsung, Selesai, Dievaluasi</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Dashboard Intuitif untuk Setiap Peran</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Dashboard admin dengan statistik komprehensif</li>
                  <li>Dashboard asesor untuk mengelola asesmen</li>
                  <li>Dashboard asesi dengan status aplikasi dan sertifikasi</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Akun Pengguna */}
          <section id="users">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">3. Akun Pengguna</h2>
            <div className="mt-6 space-y-4">
              <p>
                Berikut adalah akun pengguna yang tersedia untuk mengakses sistem:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border print:border">
                  <thead>
                    <tr className="bg-muted print:bg-gray-200">
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
            </div>
          </section>

          {/* Panduan untuk Admin */}
          <section id="admin-guide" className="print:break-before-page">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">4. Panduan untuk Admin</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Login dan Dashboard</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Masuk dengan username <code>admin</code> dan password <code>admin123</code></li>
                  <li>Anda akan diarahkan ke dashboard admin yang menampilkan ringkasan statistik sistem</li>
                  <li>Gunakan menu navigasi di sebelah kiri untuk mengakses berbagai fitur admin</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengelola Skema Sertifikasi</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih menu "Skema Sertifikasi" untuk melihat, menambah, dan mengedit skema</li>
                  <li>Untuk menambahkan skema baru, klik tombol "Tambah Skema"</li>
                  <li>Isi informasi skema lengkap termasuk nama, deskripsi, dan unit kompetensi</li>
                  <li>Gunakan tombol aksi di setiap baris untuk mengedit atau menghapus skema</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengelola Asesor</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih menu "Asesor" untuk melihat dan mengelola asesor</li>
                  <li>Untuk menambahkan asesor baru, klik tombol "Tambah Asesor"</li>
                  <li>Isi informasi asesor termasuk bidang kompetensi dan nomor registrasi</li>
                  <li>Gunakan tombol aksi untuk mengedit informasi atau menonaktifkan asesor</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengelola Ujian</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih menu "Ujian" untuk mengelola ujian sertifikasi</li>
                  <li>Untuk membuat ujian baru, klik "Buat Ujian Baru"</li>
                  <li>Pilih template ujian dan aplikasi sertifikasi</li>
                  <li>Gunakan filter untuk menemukan ujian berdasarkan status</li>
                  <li>Gunakan tombol aksi untuk memulai, melihat detail, atau mengevaluasi ujian</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengelola Bank Soal</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih menu "Bank Soal" untuk mengelola soal-soal ujian</li>
                  <li>Tambahkan soal baru dengan berbagai tipe (pilihan ganda, uraian, dll)</li>
                  <li>Kelompokkan soal berdasarkan unit kompetensi dan tingkat kesulitan</li>
                  <li>Gunakan filter untuk menemukan soal berdasarkan kategori</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Panduan untuk Asesor */}
          <section id="asesor-guide">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">5. Panduan untuk Asesor</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Login dan Dashboard</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Masuk dengan username <code>asesor</code> dan password <code>asesor123</code></li>
                  <li>Anda akan diarahkan ke dashboard asesor yang menampilkan tugas-tugas asesmen</li>
                  <li>Lihat ringkasan aplikasi dan ujian yang perlu dinilai</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengelola Asesmen</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Lihat daftar asesmen yang ditugaskan kepada Anda</li>
                  <li>Lakukan verifikasi dokumen asesi dengan melihat dokumen yang diunggah</li>
                  <li>Evaluasi hasil ujian dan berikan nilai berdasarkan kriteria</li>
                  <li>Tambahkan catatan atau komentar untuk asesi</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Melihat Jadwal</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pantau jadwal asesmen yang akan datang pada bagian Jadwal</li>
                  <li>Konfirmasi ketersediaan untuk jadwal asesmen yang ditugaskan</li>
                  <li>Lihat detail jadwal termasuk lokasi dan waktu</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengevaluasi Ujian</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih ujian yang perlu dievaluasi</li>
                  <li>Lihat jawaban asesi dan berikan penilaian</li>
                  <li>Berikan feedback untuk setiap pertanyaan jika diperlukan</li>
                  <li>Konfirmasi evaluasi dan kirimkan hasil penilaian</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Panduan untuk Asesi */}
          <section id="asesi-guide" className="print:break-before-page">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">6. Panduan untuk Asesi</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Login dan Dashboard</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Masuk dengan username <code>asesi</code> dan password <code>asesi123</code></li>
                  <li>Anda akan diarahkan ke dashboard asesi yang menampilkan ringkasan aplikasi dan status sertifikasi</li>
                  <li>Lihat notifikasi penting terkait proses sertifikasi</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mendaftar Sertifikasi</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pilih menu "Skema Sertifikasi" untuk melihat skema yang tersedia</li>
                  <li>Pilih skema yang diinginkan dan klik "Daftar"</li>
                  <li>Isi formulir pendaftaran dengan lengkap</li>
                  <li>Unggah dokumen pendukung yang diperlukan</li>
                  <li>Konfirmasi pendaftaran dan tunggu persetujuan</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Mengikuti Ujian</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Lihat jadwal ujian yang tersedia di dashboard Anda</li>
                  <li>Klik "Mulai Ujian" pada waktu yang telah ditentukan</li>
                  <li>Baca petunjuk ujian dengan seksama</li>
                  <li>Kerjakan soal-soal ujian dan klik "Selesai" jika sudah selesai</li>
                  <li>Tunggu hasil evaluasi dari asesor</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Melihat Hasil dan Sertifikat</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Hasil ujian akan ditampilkan di dashboard setelah dievaluasi</li>
                  <li>Jika lulus, sertifikat digital akan tersedia untuk diunduh</li>
                  <li>Lihat feedback dari asesor untuk perbaikan</li>
                  <li>Jika tidak lulus, Anda dapat mendaftar ulang sesuai ketentuan</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Informasi Teknis */}
          <section id="technical">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">7. Informasi Teknis</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Teknologi yang Digunakan</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Frontend:</strong> React.js, Tailwind CSS, Shadcn/UI</li>
                  <li><strong>Backend:</strong> Express.js, Node.js</li>
                  <li><strong>Database:</strong> PostgreSQL</li>
                  <li><strong>ORM:</strong> Drizzle</li>
                  <li><strong>Autentikasi:</strong> Passport.js</li>
                  <li><strong>State Management:</strong> TanStack Query (React Query)</li>
                  <li><strong>Deployment:</strong> Replit</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Struktur Proyek</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto print:bg-gray-100">
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
              </div>
            </div>
          </section>

          {/* Roadmap Pengembangan */}
          <section id="roadmap" className="print:break-before-page">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">8. Roadmap Pengembangan</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Fase 1: Penyempurnaan Sistem Ujian</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Implementasi fitur pengambilan ujian dengan timer</li>
                  <li>Penyimpanan jawaban otomatis</li>
                  <li>Analisis hasil ujian yang lebih rinci</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Fase 2: Sistem Penilaian Asesor</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Fitur penilaian portofolio</li>
                  <li>Formulir asesmen online</li>
                  <li>Feedback terstruktur untuk asesi</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Fase 3: Manajemen Dokumen</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Sistem penyimpanan dan verifikasi dokumen</li>
                  <li>Template sertifikat otomatis</li>
                  <li>Tanda tangan digital</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Fase 4: Integrasi dan Pelaporan</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Integrasi dengan sistem BNSP</li>
                  <li>Laporan statistik komprehensif</li>
                  <li>Notifikasi email dan SMS</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Dokumentasi API */}
          <section id="api">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">9. Dokumentasi API</h2>
            <div className="mt-6 space-y-4">
              <p>
                API endpoints telah diimplementasikan untuk semua fungsi sistem, dengan struktur standar sebagai berikut:
              </p>

              <div>
                <h3 className="text-xl font-semibold">Autentikasi</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto print:bg-gray-100">
                  <code>
{`GET /api/user           # Mendapatkan informasi pengguna saat ini
POST /api/login         # Login pengguna
POST /api/logout        # Logout pengguna
POST /api/register      # Mendaftarkan pengguna baru`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Skema Sertifikasi</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto print:bg-gray-100">
                  <code>
{`GET /api/schemes                # Mendapatkan semua skema
GET /api/schemes/:id            # Mendapatkan detail skema
GET /api/schemes/popular/:limit # Mendapatkan skema populer
POST /api/admin/schemes         # Membuat skema baru (admin)
PATCH /api/admin/schemes/:id    # Memperbarui skema (admin)
DELETE /api/admin/schemes/:id   # Menghapus skema (admin)`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Asesor</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto print:bg-gray-100">
                  <code>
{`GET /api/admin/asesors          # Mendapatkan semua asesor (admin)
POST /api/admin/asesors         # Membuat asesor baru (admin)
PATCH /api/admin/asesors/:id    # Memperbarui asesor (admin)
DELETE /api/admin/asesors/:id   # Menghapus asesor (admin)`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Ujian</h3>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto print:bg-gray-100">
                  <code>
{`GET /api/examinations          # Mendapatkan semua ujian
POST /api/examinations         # Membuat ujian baru
GET /api/examination-templates # Mendapatkan template ujian
POST /api/examinations/:id/start   # Memulai ujian
POST /api/examinations/:id/evaluate # Mengevaluasi ujian`}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Pemecahan Masalah */}
          <section id="troubleshooting">
            <h2 className="text-3xl font-bold border-b pb-3 print:pb-2">10. Pemecahan Masalah</h2>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Tidak dapat masuk ke akun</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Periksa apakah username dan password sudah benar</li>
                  <li>Pastikan Caps Lock tidak aktif saat memasukkan password</li>
                  <li>Coba bersihkan cache browser dan coba lagi</li>
                  <li>Jika masih bermasalah, hubungi administrator sistem</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Halaman loading terus menerus</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Periksa koneksi internet Anda</li>
                  <li>Segarkan halaman dengan menekan F5 atau Ctrl+R</li>
                  <li>Coba gunakan browser yang berbeda</li>
                  <li>Periksa apakah server sedang dalam pemeliharaan</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Tidak dapat mengunggah dokumen</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Pastikan ukuran file tidak melebihi batas maksimum (10MB)</li>
                  <li>Pastikan format file sesuai dengan yang diizinkan (PDF, JPG, PNG)</li>
                  <li>Coba kompres file jika terlalu besar</li>
                  <li>Coba gunakan browser yang berbeda jika masalah berlanjut</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Ujian terputus saat sedang berlangsung</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Coba refresh halaman, sistem akan mencoba melanjutkan dari posisi terakhir</li>
                  <li>Pastikan koneksi internet stabil selama ujian berlangsung</li>
                  <li>Jangan membuka tab atau aplikasi lain yang berat selama ujian</li>
                  <li>Jika terjadi kesalahan fatal, hubungi administrator segera</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer Dokumen */}
          <div className="mt-12 pt-4 border-t text-center print:mt-8">
            <p className="text-muted-foreground">
              © 2025 LSP Wirausaha Kompeten Nusantara. Hak Cipta Dilindungi.
            </p>
            <p className="text-muted-foreground mt-2">
              Dokumen ini dibuat pada: 22 April 2025
            </p>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          header, .hide-on-print, button {
            display: none !important;
          }
          body {
            font-size: 12pt;
          }
          h1 {
            font-size: 22pt;
          }
          h2 {
            font-size: 18pt;
          }
          h3 {
            font-size: 14pt;
          }
          pre {
            font-size: 9pt;
          }
        }
      `
        }}
      />
    </div>
  );
};

export default DocsExportPage;