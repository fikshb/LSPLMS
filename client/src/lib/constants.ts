// Company information
export const COMPANY_INFO = {
  name: "LSP Wirausaha Kompeten Nusantara",
  shortName: "LSP-WKN",
  registrationNumber: "BISP-LSP-1565-ID",
  email: {
    info: "info@lspwkn.id",
    certification: "sertifikasi@lspwkn.id",
    partnership: "partnership@lspwkn.id"
  },
  phone: "+62 21 1234 5678",
  fax: "+62 21 1234 5679",
  whatsapp: "+62 812 3456 7890",
  address: {
    street: "Jl. Wirausaha No. 123",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    country: "Indonesia",
    postalCode: "12345"
  },
  businessHours: {
    weekdays: "08.00 - 16.00 WIB",
    saturday: "08.00 - 12.00 WIB",
    sunday: "Tutup"
  },
  socialMedia: {
    facebook: "https://facebook.com/lspwkn",
    instagram: "https://instagram.com/lspwkn",
    twitter: "https://twitter.com/lspwkn",
    linkedin: "https://linkedin.com/company/lspwkn"
  }
};

// Categories for certification schemes
export const SCHEME_CATEGORIES = [
  { id: "digital-marketing", name: "Digital Marketing & Office" },
  { id: "business-dev", name: "Pengembangan Bisnis" },
  { id: "ecommerce", name: "E-Commerce" },
  { id: "entrepreneurship", name: "Kewirausahaan" },
  { id: "data-science", name: "Data Science" },
  { id: "project-management", name: "Project Management" }
];

// Education levels
export const EDUCATION_LEVELS = [
  { value: "sma", label: "SMA/SMK" },
  { value: "d3", label: "D3" },
  { value: "s1", label: "S1" },
  { value: "s2", label: "S2" },
  { value: "s3", label: "S3" }
];

// Main navigation items
export const MAIN_NAV_ITEMS = [
  {
    title: "BERANDA",
    path: "/",
    isDropdown: false
  },
  {
    title: "PROFIL",
    path: "/tentang-kami",
    isDropdown: true,
    items: [
      { name: "Tentang Kami", path: "/tentang-kami" },
      { name: "Visi & Misi", path: "/visi-misi" },
      { name: "Struktur Organisasi", path: "/struktur-organisasi" }
    ]
  },
  {
    title: "SERTIFIKASI",
    path: "/skema",
    isDropdown: true,
    items: [
      { name: "Skema Sertifikasi", path: "/skema" },
      { name: "Jadwal Asesmen", path: "/jadwal-asesmen" },
      { name: "Prosedur Sertifikasi", path: "/prosedur" }
    ]
  },
  {
    title: "MEDIA",
    path: "/berita",
    isDropdown: true,
    items: [
      { name: "Berita", path: "/berita" },
      { name: "Galeri", path: "/galeri" },
      { name: "Kegiatan", path: "/kegiatan" }
    ]
  },
  {
    title: "INFORMASI",
    path: "/faq",
    isDropdown: true,
    items: [
      { name: "FAQ", path: "/faq" },
      { name: "Panduan", path: "/panduan" },
      { name: "Dokumen", path: "/dokumen" }
    ]
  },
  {
    title: "REGISTRASI",
    path: "/registrasi",
    isDropdown: false
  }
];

// Footer quick links
export const FOOTER_QUICK_LINKS = [
  { name: "Beranda", path: "/" },
  { name: "Tentang Kami", path: "/tentang-kami" },
  { name: "Skema Sertifikasi", path: "/skema" },
  { name: "Jadwal Asesmen", path: "/jadwal-asesmen" },
  { name: "FAQ", path: "/faq" },
  { name: "Kontak", path: "/kontak" }
];

// Footer information links
export const FOOTER_INFO_LINKS = [
  { name: "Prosedur Sertifikasi", path: "/prosedur-sertifikasi" },
  { name: "Syarat & Ketentuan", path: "/syarat-ketentuan" },
  { name: "Kebijakan Privasi", path: "/kebijakan-privasi" },
  { name: "Berita & Artikel", path: "/berita" },
  { name: "Galeri Kegiatan", path: "/galeri" }
];

// Competency areas shown on hero section
export const COMPETENCY_AREAS = [
  "PENGEMBANGAN DIGITAL MARKETING",
  "MANAJEMEN BISNIS ONLINE",
  "SISTEM MANAJEMEN KEWIRAUSAHAAN",
  "STRATEGI BISNIS DIGITAL",
  "MANAJEMEN PROYEK WIRAUSAHA",
  "PENGEMBANGAN PRODUK INOVATIF"
];

// About section stats
export const ABOUT_STATS = [
  {
    title: "45+ Skema Sertifikasi",
    description: "Skema / Profesi / Jabatan / Pekerjaan di bidang-bidang strategis sektor Kewirausahaan dan Bisnis Digital.",
    icon: "Certificate",
    link: { text: "Jadwal Sertifikasi", path: "/jadwal-sertifikasi" },
    backgroundColor: "bg-primary-light"
  },
  {
    title: "250+ Link DUDI",
    description: "Perusahaan mitra LSP yang siap untuk menerima profesional bidang wirausaha yang telah tersertifikasi dan kompeten.",
    icon: "Handshake",
    link: { text: "Lowongan Pekerjaan", path: "/lowongan-pekerjaan" },
    backgroundColor: "bg-secondary"
  },
  {
    title: "800+ SDM Tersertifikasi",
    description: "Daftar tenaga kerja profesional yang telah tersertifikasi. Siap untuk menjawab kebutuhan industri.",
    icon: "Users",
    link: { text: "Mencari Talenta", path: "/mencari-talenta" },
    backgroundColor: "bg-tertiary-light"
  }
];
