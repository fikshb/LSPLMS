import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CertificationScheme } from '@shared/schema';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

const PopularSchemes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: schemes, isLoading } = useQuery<CertificationScheme[]>({
    queryKey: ['/api/schemes/popular/6'] // Get top 6 popular schemes
  });

  // Calculate total slides (groups of 3 schemes)
  const totalSlides = schemes ? Math.ceil(schemes.length / 3) : 0;

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const getVisibleSchemes = () => {
    if (!schemes) return [];
    const start = currentSlide * 3;
    return schemes.slice(start, start + 3);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-2">
            Skema Populer
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-48 w-full max-w-3xl rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-center mb-2">
          Skema Populer
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>

        {schemes && schemes.length > 0 && (
          <div className="relative">
            {/* Previous button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-colors duration-200 focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Carousel items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
              {getVisibleSchemes().map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${scheme.iconBackground} rounded-md flex items-center justify-center mr-3`}>
                        <span className="text-white text-lg">
                          {scheme.icon === 'bullhorn' && '📣'}
                          {scheme.icon === 'hashtag' && '#️⃣'}
                          {scheme.icon === 'briefcase' && '💼'}
                          {scheme.icon === 'chart-line' && '📈'}
                          {scheme.icon === 'shopping-cart' && '🛒'}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold">
                        {scheme.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        Profesi Terkait
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        Lembaga Diklat
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        Lowongan Pekerjaan
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {scheme.description}
                    </p>
                    <Link
                      href={`/skema/${scheme.slug}`}
                      className="text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
                    >
                      Lihat Skema →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-colors duration-200 focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Carousel indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-primary-light"
                } transition-colors duration-200`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularSchemes;
