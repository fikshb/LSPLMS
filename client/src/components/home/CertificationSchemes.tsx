import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { CertificationScheme } from '@shared/schema';
import SchemeCard from '@/components/scheme/SchemeCard';

const categories = [
  { name: "Digital Marketing", slug: "Digital Marketing & Office" },
  { name: "Pengembangan Bisnis", slug: "Pengembangan Bisnis" },
  { name: "E-Commerce", slug: "E-Commerce" },
  { name: "Kewirausahaan", slug: "Kewirausahaan" }
];

const CertificationSchemes = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: schemes } = useQuery<CertificationScheme[]>({
    queryKey: ["/api/schemes"]
  });

  // Filter schemes by active category
  const filteredSchemes = schemes?.filter(scheme => 
    !activeCategory || scheme.category === activeCategory
  ).slice(0, 4);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4 md:mb-0">
            Daftar Skema Sertifikasi
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(activeCategory === category.slug ? null : category.slug)}
                className={`px-4 py-2 bg-white rounded-full text-sm font-medium ${
                  activeCategory === category.slug
                    ? "bg-primary text-white"
                    : "border border-primary text-primary hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSchemes?.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/skema"
            className="inline-block border border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
          >
            Lihat Semua Skema →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CertificationSchemes;
