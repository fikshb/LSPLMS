import { useParams } from "wouter";
import SchemeDetailComponent from "@/components/scheme/SchemeDetail";

const SchemeDetail = () => {
  const { slug } = useParams();
  
  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Skema tidak ditemukan</h2>
          <p>Maaf, skema sertifikasi yang Anda cari tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }
  
  return <SchemeDetailComponent slug={slug} />;
};

export default SchemeDetail;
