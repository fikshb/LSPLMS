import { Link } from "wouter";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { LSPLogo } from "@/assets/logo";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <LSPLogo className="h-16 logo-flower" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">
              LSP Wirausaha Kompeten Nusantara
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Lembaga Sertifikasi Profesi yang berkomitmen untuk meningkatkan
              kompetensi profesional wirausaha di Indonesia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang-kami"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/skema"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Skema Sertifikasi
                </Link>
              </li>
              <li>
                <Link
                  href="/jadwal-asesmen"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Jadwal Asesmen
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Informasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/prosedur-sertifikasi"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Prosedur Sertifikasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Berita & Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Galeri Kegiatan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Kontak Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-primary-light" />
                <span className="text-gray-400">
                  Jl. Wirausaha No. 123, Jakarta Selatan, DKI Jakarta, Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-primary-light" />
                <span className="text-gray-400">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-primary-light" />
                <span className="text-gray-400">info@lspwkn.id</span>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3 text-primary-light" />
                <span className="text-gray-400">
                  Senin - Jumat: 08.00 - 16.00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 LSP Wirausaha Kompeten Nusantara. Hak Cipta Dilindungi.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/syarat-ketentuan"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              href="/kebijakan-privasi"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
