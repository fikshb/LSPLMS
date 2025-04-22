import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Terminal, Server, Database, Code, Download, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const InstallationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Panduan Instalasi | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>

      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Panduan Instalasi
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Panduan teknis instalasi dan deployment sistem LSP Wirausaha Kompeten Nusantara
              </p>
            </div>
            <Link href="/docs">
              <Button variant="secondary" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Dokumentasi
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mx-auto mb-8">
            <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
            <TabsTrigger value="installation">Instalasi</TabsTrigger>
            <TabsTrigger value="configuration">Konfigurasi</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Persyaratan Sistem
                </CardTitle>
                <CardDescription>
                  Spesifikasi minimal yang diperlukan untuk menjalankan aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Persyaratan Perangkat Keras</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>CPU:</strong> Dual-core 2GHz atau lebih tinggi</li>
                    <li><strong>RAM:</strong> Minimal 4GB, direkomendasikan 8GB atau lebih</li>
                    <li><strong>Penyimpanan:</strong> 20GB ruang disk tersedia untuk aplikasi dan database</li>
                    <li><strong>Koneksi Internet:</strong> Koneksi bandwith minimal 5 Mbps</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Persyaratan Perangkat Lunak</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Sistem Operasi:</strong> Linux (Ubuntu 20.04 LTS atau lebih baru), Windows Server 2016 atau lebih baru, macOS 11 atau lebih baru</li>
                    <li><strong>Node.js:</strong> Versi 18.x atau lebih baru</li>
                    <li><strong>PostgreSQL:</strong> Versi 14.x atau lebih baru</li>
                    <li><strong>Git:</strong> Versi terbaru untuk mengclone repositori</li>
                    <li><strong>NPM:</strong> Versi 8.x atau lebih baru</li>
                    <li><strong>Web Browser:</strong> Chrome, Firefox, Edge, atau Safari versi terbaru</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Persyaratan Jaringan</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Akses ke port 80 dan 443 untuk server web</li>
                    <li>Akses ke port 5432 untuk PostgreSQL</li>
                    <li>Kemampuan untuk mengonfigurasi reverse proxy (jika diperlukan)</li>
                    <li>Firewall yang memungkinkan koneksi keluar ke layanan npm, GitHub, dan repositori lainnya</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Alat yang Dibutuhkan
                </CardTitle>
                <CardDescription>
                  Software yang diperlukan untuk pengembangan dan deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Node.js dan NPM</strong>
                    <p className="mt-1 text-muted-foreground">Diperlukan untuk menjalankan aplikasi JavaScript/TypeScript. Unduh dari <a href="https://nodejs.org" target="_blank" className="text-primary hover:underline">nodejs.org</a>.</p>
                  </li>
                  <li>
                    <strong>PostgreSQL</strong>
                    <p className="mt-1 text-muted-foreground">Database relasional untuk menyimpan data aplikasi. Unduh dari <a href="https://www.postgresql.org/download/" target="_blank" className="text-primary hover:underline">postgresql.org</a>.</p>
                  </li>
                  <li>
                    <strong>Git</strong>
                    <p className="mt-1 text-muted-foreground">Untuk manajemen versi kode. Unduh dari <a href="https://git-scm.com/downloads" target="_blank" className="text-primary hover:underline">git-scm.com</a>.</p>
                  </li>
                  <li>
                    <strong>Visual Studio Code (opsional)</strong>
                    <p className="mt-1 text-muted-foreground">Editor kode yang direkomendasikan untuk pengembangan. Unduh dari <a href="https://code.visualstudio.com/" target="_blank" className="text-primary hover:underline">code.visualstudio.com</a>.</p>
                  </li>
                  <li>
                    <strong>Docker (opsional)</strong>
                    <p className="mt-1 text-muted-foreground">Untuk kontainerisasi aplikasi, memudahkan deployment. Unduh dari <a href="https://www.docker.com/products/docker-desktop" target="_blank" className="text-primary hover:underline">docker.com</a>.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Pengunduhan dan Instalasi
                </CardTitle>
                <CardDescription>
                  Langkah-langkah untuk mengunduh dan menginstal aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">1. Clone Repositori</h3>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      git clone https://github.com/lspwkn/certification-system.git<br />
                      cd certification-system
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">2. Instalasi Dependensi</h3>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      npm install
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Perintah ini akan menginstal semua dependensi yang diperlukan untuk frontend dan backend.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">3. Instalasi dan Konfigurasi Database</h3>
                  <p className="mt-2">
                    Pastikan PostgreSQL sudah terinstal dan berjalan. Kemudian buat database baru:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      psql -U postgres<br />
                      CREATE DATABASE lspwkn;<br />
                      \q
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">4. Konfigurasi Environment Variables</h3>
                  <p className="mt-2">
                    Buat file <code>.env</code> di root proyek dan isi dengan konfigurasi berikut:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      # Database Configuration<br />
                      DATABASE_URL=postgresql://postgres:password@localhost:5432/lspwkn<br />
                      <br />
                      # Application Configuration<br />
                      PORT=3000<br />
                      NODE_ENV=development<br />
                      <br />
                      # Auth Configuration<br />
                      SESSION_SECRET=change_this_to_a_secure_random_string<br />
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Pastikan untuk mengganti nilai <code>password</code> dengan password PostgreSQL Anda dan <code>SESSION_SECRET</code> dengan string acak yang aman.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">5. Migrasi Database</h3>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      npm run db:push
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Perintah ini akan membuat semua tabel yang diperlukan dalam database berdasarkan skema yang didefinisikan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">6. Memulai Aplikasi</h3>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      npm run dev
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Perintah ini akan memulai server pengembangan. Aplikasi akan dapat diakses di <code>http://localhost:3000</code>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Konfigurasi Aplikasi
                </CardTitle>
                <CardDescription>
                  Panduan untuk mengonfigurasi aplikasi sesuai kebutuhan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Environment Variables</h3>
                  <p className="mt-2">
                    Berikut adalah daftar lengkap environment variables yang dapat dikonfigurasi:
                  </p>
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full border-collapse border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">Variabel</th>
                          <th className="border px-4 py-2 text-left">Deskripsi</th>
                          <th className="border px-4 py-2 text-left">Contoh</th>
                          <th className="border px-4 py-2 text-left">Wajib</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2 font-mono">DATABASE_URL</td>
                          <td className="border px-4 py-2">URL koneksi ke database PostgreSQL</td>
                          <td className="border px-4 py-2 font-mono">postgresql://user:pass@host:port/dbname</td>
                          <td className="border px-4 py-2">Ya</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">PORT</td>
                          <td className="border px-4 py-2">Port untuk menjalankan server Express</td>
                          <td className="border px-4 py-2 font-mono">3000</td>
                          <td className="border px-4 py-2">Tidak (default: 3000)</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">NODE_ENV</td>
                          <td className="border px-4 py-2">Environment untuk menjalankan aplikasi</td>
                          <td className="border px-4 py-2 font-mono">development, production, test</td>
                          <td className="border px-4 py-2">Tidak (default: development)</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">SESSION_SECRET</td>
                          <td className="border px-4 py-2">Secret untuk enkripsi session</td>
                          <td className="border px-4 py-2 font-mono">random_string_min_32_chars</td>
                          <td className="border px-4 py-2">Ya</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">SMTP_HOST</td>
                          <td className="border px-4 py-2">Host SMTP untuk pengiriman email</td>
                          <td className="border px-4 py-2 font-mono">smtp.gmail.com</td>
                          <td className="border px-4 py-2">Tidak</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">SMTP_PORT</td>
                          <td className="border px-4 py-2">Port SMTP</td>
                          <td className="border px-4 py-2 font-mono">587</td>
                          <td className="border px-4 py-2">Tidak</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">SMTP_USER</td>
                          <td className="border px-4 py-2">Username SMTP</td>
                          <td className="border px-4 py-2 font-mono">user@example.com</td>
                          <td className="border px-4 py-2">Tidak</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2 font-mono">SMTP_PASS</td>
                          <td className="border px-4 py-2">Password SMTP</td>
                          <td className="border px-4 py-2 font-mono">password</td>
                          <td className="border px-4 py-2">Tidak</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Konfigurasi Tema</h3>
                  <p className="mt-2">
                    Untuk menyesuaikan tema aplikasi, edit file <code>theme.json</code> di root proyek:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      {`{
  "primary": "#79A84B",
  "variant": "tint",
  "appearance": "light",
  "radius": 0.5
}`}
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Variasi tema yang tersedia:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>variant:</strong> "professional", "tint", "vibrant"</li>
                    <li><strong>appearance:</strong> "light", "dark", "system"</li>
                    <li><strong>radius:</strong> Nilai antara 0 dan 1</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Konfigurasi Upload File</h3>
                  <p className="mt-2">
                    Untuk mengonfigurasi batas upload file, edit nilai berikut di <code>server/index.ts</code>:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      {`app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Konfigurasi Database
                </CardTitle>
                <CardDescription>
                  Panduan untuk konfigurasi dan pengelolaan database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Migrasi Database</h3>
                  <p className="mt-2">
                    Proyek ini menggunakan Drizzle ORM untuk mengelola skema database. Berikut adalah perintah yang tersedia untuk pengelolaan database:
                  </p>
                  <div className="mt-4">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong className="font-mono">npm run db:push</strong>
                        <p className="mt-1 text-muted-foreground">Menerapkan perubahan skema ke database tanpa migrasi.</p>
                      </li>
                      <li>
                        <strong className="font-mono">npm run db:generate</strong>
                        <p className="mt-1 text-muted-foreground">Membuat file migrasi berdasarkan perubahan skema.</p>
                      </li>
                      <li>
                        <strong className="font-mono">npm run db:migrate</strong>
                        <p className="mt-1 text-muted-foreground">Menjalankan migrasi yang telah dibuat.</p>
                      </li>
                      <li>
                        <strong className="font-mono">npm run db:studio</strong>
                        <p className="mt-1 text-muted-foreground">Membuka Drizzle Studio untuk melihat dan mengedit data secara visual.</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Backup Database</h3>
                  <p className="mt-2">
                    Untuk membuat backup database PostgreSQL, gunakan perintah berikut:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      pg_dump -U postgres -d lspwkn -F c -b -v -f backup.sql
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Untuk memulihkan database dari backup:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      pg_restore -U postgres -d lspwkn -v backup.sql
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Seed Data</h3>
                  <p className="mt-2">
                    Untuk mengisi database dengan data awal, jalankan:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      npm run seed
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Ini akan menambahkan:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Pengguna default (admin, asesor, asesi)</li>
                    <li>Skema sertifikasi contoh</li>
                    <li>Data provinsi</li>
                    <li>Template ujian dasar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Deployment ke Produksi
                </CardTitle>
                <CardDescription>
                  Panduan untuk men-deploy aplikasi ke lingkungan produksi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">1. Persiapan Build</h3>
                  <p className="mt-2">
                    Sebelum men-deploy, build aplikasi untuk produksi:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      npm run build
                    </code>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Perintah ini akan membuat versi optimasi aplikasi di folder <code>dist</code>.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">2. Deployment ke Server</h3>
                  <p className="mt-2">
                    Ada beberapa opsi untuk men-deploy aplikasi:
                  </p>
                  
                  <h4 className="font-medium mt-4">Opsi 1: Deployment Langsung</h4>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      # Clone repositori<br />
                      git clone https://github.com/lspwkn/certification-system.git<br />
                      cd certification-system<br /><br />
                      
                      # Instalasi dependensi<br />
                      npm install --production<br /><br />
                      
                      # Build aplikasi<br />
                      npm run build<br /><br />
                      
                      # Jalankan aplikasi dengan PM2<br />
                      pm2 start dist/server/index.js --name "lspwkn"
                    </code>
                  </div>
                  
                  <h4 className="font-medium mt-4">Opsi 2: Deployment dengan Docker</h4>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      # Build Docker image<br />
                      docker build -t lspwkn-app .<br /><br />
                      
                      # Jalankan container<br />
                      docker run -d -p 3000:3000 --name lspwkn-container \<br />
                      -e DATABASE_URL=postgresql://user:pass@host:port/dbname \<br />
                      -e SESSION_SECRET=your_session_secret \<br />
                      lspwkn-app
                    </code>
                  </div>
                  
                  <h4 className="font-medium mt-4">Opsi 3: Deployment ke Replit</h4>
                  <p className="mt-2">
                    Proyek ini dapat di-deploy langsung ke Replit dengan langkah-langkah berikut:
                  </p>
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Buat Repl baru dengan template Node.js</li>
                    <li>Import repositori GitHub atau upload kode proyek</li>
                    <li>Tambahkan environment variables yang diperlukan</li>
                    <li>Klik tombol "Run" untuk memulai aplikasi</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium">3. Konfigurasi Nginx (Opsional)</h3>
                  <p className="mt-2">
                    Jika Anda menggunakan Nginx sebagai reverse proxy, berikut adalah konfigurasi dasar:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      {`server {
    listen 80;
    server_name lspwkn.com www.lspwkn.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">4. SSL dengan Let's Encrypt</h3>
                  <p className="mt-2">
                    Untuk mengaktifkan HTTPS dengan sertifikat Let's Encrypt:
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                    <code className="text-sm">
                      sudo apt update<br />
                      sudo apt install certbot python3-certbot-nginx<br />
                      sudo certbot --nginx -d lspwkn.com -d www.lspwkn.com
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Checklist Deployment
                </CardTitle>
                <CardDescription>
                  Daftar pengecekan sebelum dan setelah deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Sebelum Deployment</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Pastikan semua environment variables sudah dikonfigurasi dengan benar</li>
                      <li>Jalankan <code>npm run build</code> dan verifikasi tidak ada error</li>
                      <li>Pastikan database telah dimigrasi dan siap digunakan</li>
                      <li>Periksa kebutuhan memori dan CPU untuk aplikasi Anda</li>
                      <li>Backup database produksi yang ada (jika ini adalah update)</li>
                      <li>Pastikan semua URL API dan endpoint dikonfigurasi untuk produksi</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Setelah Deployment</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Verifikasi aplikasi dapat diakses melalui domain yang dikonfigurasi</li>
                      <li>Periksa semua fitur utama berfungsi dengan benar</li>
                      <li>Tes login untuk semua jenis pengguna (admin, asesor, asesi)</li>
                      <li>Verifikasi upload dan download file berfungsi</li>
                      <li>Periksa log server untuk error atau warning</li>
                      <li>Verifikasi SSL berfungsi dengan benar (jika dikonfigurasi)</li>
                      <li>Lakukan tes performa dasar</li>
                      <li>Pastikan sistem backup terautomasi sudah dikonfigurasi</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Pemantauan</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Konfigurasi pemantauan uptime untuk aplikasi</li>
                      <li>Konfigurasi notifikasi untuk kejadian sistem kritis</li>
                      <li>Siapkan pemantauan penggunaan resources (CPU, memory, disk)</li>
                      <li>Konfigurasi logging dan analitik pengguna</li>
                      <li>Buat jadwal pemeliharaan reguler dan backup</li>
                    </ul>
                  </div>
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

export default InstallationPage;