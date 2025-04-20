import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Siap Meningkatkan Kompetensi Anda?
          </h2>
          <p className="text-white opacity-90 mb-8">
            Daftarkan diri Anda untuk mendapatkan sertifikasi profesi yang
            diakui secara nasional dan internasional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/jadwal-asesmen"
              className="bg-white text-primary font-heading font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Lihat Jadwal Sertifikasi
            </Link>
            <Link
              href="/registrasi"
              className="bg-tertiary text-white font-heading font-medium px-8 py-3 rounded-md hover:bg-tertiary-dark transition-colors duration-200"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
