import { Helmet } from "react-helmet";
import CertificationForm from "@/components/certification/CertificationForm";

const FormulirSertifikasi = () => {
  return (
    <>
      <Helmet>
        <title>Formulir Pendaftaran Sertifikasi | LSP Wirausaha Kompeten Nusantara</title>
        <meta
          name="description"
          content="Formulir pendaftaran sertifikasi kompetensi pada Skema Pelaksana Penjamah Makanan. Daftar sekarang untuk meningkatkan kompetensi dan karir Anda."
        />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Formulir Pendaftaran Sertifikasi
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-gray-700">
              Silakan lengkapi formulir pendaftaran sertifikasi kompetensi di bawah ini.
              Pastikan semua data yang dimasukkan benar dan valid.
            </p>
          </div>

          <CertificationForm />
        </div>
      </div>
    </>
  );
};

export default FormulirSertifikasi;