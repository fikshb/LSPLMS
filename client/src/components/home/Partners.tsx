import { useQuery } from "@tanstack/react-query";
import { Partner } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const Partners = () => {
  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-2">
            Mitra Kerja Kami
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-center mb-2">
          Mitra Kerja Kami
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {/* Partner logos */}
          {partners?.map((partner) => (
            <div
              key={partner.id}
              className="flex justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
            >
              {/* Using a default placeholder for partner logos */}
              <img
                src="https://via.placeholder.com/120x60?text=Partner"
                alt={partner.name}
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/mitra"
            className="inline-block border border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
          >
            Lihat Semua Mitra →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Partners;
