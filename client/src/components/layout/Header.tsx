import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Menu, X, ChevronDown } from "lucide-react";
import { LSPLogo } from "@/assets/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-neutral-800 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="hover:text-secondary transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-secondary transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-secondary transition-colors duration-200"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <span className="hidden md:inline-block">BISP-LSP-1565-ID</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="hover:text-secondary transition-colors duration-200"
            >
              Login
            </a>
            <Link
              href="/kontak"
              className="hover:text-secondary transition-colors duration-200"
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <LSPLogo className="h-16 logo-flower" />
              <div className="ml-3">
                <div className="text-primary-dark font-heading font-semibold text-lg">
                  Lembaga Sertifikasi Profesi
                </div>
                <div className="text-tertiary text-sm font-heading">
                  Wirausaha Kompeten Nusantara
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:block w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-2 text-sm font-heading font-medium">
              <li>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/") ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  BERANDA
                </Link>
              </li>
              <li className="relative group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center">
                      PROFIL <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/tentang-kami">Tentang Kami</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/visi-misi">Visi & Misi</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/struktur-organisasi">Struktur Organisasi</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li className="relative group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center">
                      SERTIFIKASI <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/skema">Skema Sertifikasi</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/jadwal-asesmen">Jadwal Asesmen</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/prosedur">Prosedur Sertifikasi</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li className="relative group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center">
                      MEDIA <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/berita">Berita</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/galeri">Galeri</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/kegiatan">Kegiatan</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li className="relative group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center">
                      INFORMASI <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/faq">FAQ</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/panduan">Panduan</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/dokumen">Dokumen</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <Link
                  href="/registrasi"
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/registrasi") ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  REGISTRASI
                </Link>
              </li>
              <li>
                <Link
                  href="/formulir-sertifikasi"
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/formulir-sertifikasi") ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  FORMULIR LSP
                </Link>
              </li>
              <li>
                <Link
                  href="/formulir-asesor"
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/formulir-asesor") ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  ASESOR
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden w-full mt-4">
              <ul className="flex flex-col space-y-2 text-sm font-heading font-medium">
                <li>
                  <Link
                    href="/"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    BERANDA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tentang-kami"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/tentang-kami") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    PROFIL
                  </Link>
                </li>
                <li>
                  <Link
                    href="/skema"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/skema") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SERTIFIKASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/berita"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/berita") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    MEDIA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/faq") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    INFORMASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/registrasi"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/registrasi") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    REGISTRASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/formulir-sertifikasi"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/formulir-sertifikasi") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FORMULIR LSP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/formulir-asesor"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/formulir-asesor") ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ASESOR
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
