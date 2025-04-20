import { Link } from "wouter";
import { 
  IdCard, 
  Handshake, 
  Users 
} from "lucide-react";

const AboutUs = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-2">
          Lembaga Sertifikasi Profesi
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <h3 className="text-xl font-heading font-semibold mb-4">
            Mengapa Kami?
          </h3>
          <p className="text-gray-700 mb-6">
            Karena komitmen kami untuk meningkatkan kebertrimaan Sertifikat
            Kompetensi oleh industri baik di tingkat nasional maupun
            internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <IdCard className="text-white text-2xl" />
            </div>
            <h4 className="text-lg font-heading font-semibold mb-2">
              45+ Skema Sertifikasi
            </h4>
            <p className="text-gray-600 text-sm">
              Skema / Profesi / Jabatan / Pekerjaan di bidang-bidang strategis
              sektor Kewirausahaan dan Bisnis Digital.
            </p>
            <Link
              href="/jadwal-sertifikasi"
              className="inline-block mt-4 text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
            >
              Jadwal Sertifikasi →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="text-tertiary text-2xl" />
            </div>
            <h4 className="text-lg font-heading font-semibold mb-2">
              250+ Link DUDI
            </h4>
            <p className="text-gray-600 text-sm">
              Perusahaan mitra LSP yang siap untuk menerima profesional bidang
              wirausaha yang telah tersertifikasi dan kompeten.
            </p>
            <Link
              href="/lowongan-pekerjaan"
              className="inline-block mt-4 text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
            >
              Lowongan Pekerjaan →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-tertiary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white text-2xl" />
            </div>
            <h4 className="text-lg font-heading font-semibold mb-2">
              800+ SDM Tersertifikasi
            </h4>
            <p className="text-gray-600 text-sm">
              Daftar tenaga kerja profesional yang telah tersertifikasi. Siap
              untuk menjawab kebutuhan industri.
            </p>
            <Link
              href="/mencari-talenta"
              className="inline-block mt-4 text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
            >
              Mencari Talenta →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
