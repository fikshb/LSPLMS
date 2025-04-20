import { Check } from "lucide-react";

const Hero = () => {
  const competencyAreas = [
    "PENGEMBANGAN DIGITAL MARKETING",
    "MANAJEMEN BISNIS ONLINE",
    "SISTEM MANAJEMEN KEWIRAUSAHAAN",
    "STRATEGI BISNIS DIGITAL",
    "MANAJEMEN PROYEK WIRAUSAHA",
    "PENGEMBANGAN PRODUK INOVATIF",
  ];

  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            UNIT SKEMA LSP WIRAUSAHA KOMPETEN NUSANTARA
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {competencyAreas.map((area, index) => (
              <div key={index} className="flex items-start">
                <Check className="text-secondary mt-1 mr-2 h-5 w-5" />
                <p className="text-sm">{area}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Teknologi Digital"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
