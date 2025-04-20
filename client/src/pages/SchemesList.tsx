import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CertificationScheme } from "@shared/schema";
import SchemeCard from "@/components/scheme/SchemeCard";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SchemesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: schemes, isLoading } = useQuery<CertificationScheme[]>({
    queryKey: ["/api/schemes"],
  });

  // Get unique categories from schemes
  const categories = schemes
    ? [...new Set(schemes.map((scheme) => scheme.category))]
    : [];

  // Filter schemes based on search query and selected category
  const filteredSchemes = schemes?.filter((scheme) => {
    const matchesSearch = scheme.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || scheme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Skema Sertifikasi | LSP Wirausaha Kompeten Nusantara</title>
        <meta
          name="description"
          content="Daftar lengkap skema sertifikasi yang tersedia di LSP Wirausaha Kompeten Nusantara"
        />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Skema Sertifikasi
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-gray-700">
              Temukan skema sertifikasi profesi yang tepat untuk meningkatkan
              kompetensi dan karir Anda. LSP Wirausaha Kompeten Nusantara
              menyediakan berbagai skema yang diakui secara nasional.
            </p>
          </div>

          {/* Search and filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Cari skema sertifikasi..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value === "" ? null : e.target.value
                    )
                  }
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schemes grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredSchemes && filteredSchemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                Tidak ditemukan skema yang sesuai
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau kategori Anda
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SchemesList;
