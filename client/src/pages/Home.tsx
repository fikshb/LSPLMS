import Hero from "@/components/home/Hero";
import SearchFilter from "@/components/home/SearchFilter";
import AboutUs from "@/components/home/AboutUs";
import CertificationSchemes from "@/components/home/CertificationSchemes";
import PopularSchemes from "@/components/home/PopularSchemes";
import CTASection from "@/components/home/CTASection";
import Partners from "@/components/home/Partners";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>LSP Wirausaha Kompeten Nusantara - Lembaga Sertifikasi Profesi</title>
        <meta 
          name="description" 
          content="LSP Wirausaha Kompeten Nusantara adalah lembaga sertifikasi profesi yang berkomitmen untuk meningkatkan kompetensi profesional di Indonesia." 
        />
      </Helmet>

      <Hero />
      <SearchFilter />
      <AboutUs />
      <CertificationSchemes />
      <PopularSchemes />
      <CTASection />
      <Partners />
    </>
  );
};

export default Home;
