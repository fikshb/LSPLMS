import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'wouter';
import FRAPL01Form from '@/components/forms/FRAPL01Form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

const FormDetail: React.FC = () => {
  const { formCode } = useParams();
  
  // Fungsi untuk merender form berdasarkan kode form
  const renderForm = () => {
    switch (formCode) {
      case 'fr-apl-01':
        return <FRAPL01Form />;
      default:
        return (
          <div className="text-center py-12 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Form Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-8">
              Maaf, form dengan kode "{formCode}" tidak ditemukan atau belum tersedia.
            </p>
            <Button asChild>
              <Link href="/formulir-asesor">
                Kembali ke Daftar Formulir
              </Link>
            </Button>
          </div>
        );
    }
  };
  
  // Dapatkan judul form berdasarkan kode form
  const getFormTitle = () => {
    switch (formCode) {
      case 'fr-apl-01':
        return 'Formulir Permohonan Sertifikasi Kompetensi';
      default:
        return 'Formulir Tidak Ditemukan';
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{getFormTitle()} | LSP Wirausaha Kompeten Nusantara</title>
      </Helmet>
      
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/5"
          asChild
        >
          <Link href="/formulir-asesor">
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Formulir</span>
          </Link>
        </Button>
      </div>
      
      {renderForm()}
    </div>
  );
};

export default FormDetail;