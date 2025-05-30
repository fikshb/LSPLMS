import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FaFacebookF, FaInstagram, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
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
    <header className="w-full border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-[#79A84B] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <FaPhoneAlt className="h-3 w-3" />
              <span>+62 21 12345678</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <FaEnvelope className="h-3 w-3" />
              <span>info@lspwkn.ac.id</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="hover:text-white/80 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-white/80 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-white/80 transition-colors duration-200"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <span className="hidden md:inline-block border-l border-white/30 pl-3">BISP-LSP-1565-ID</span>
          </div>
        </div>
      </div>

      {/* Logo and brand section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex-1">
            <Link href="/" className="flex items-center">
              <LSPLogo className="h-16 logo-flower" />
              <div className="ml-3">
                <div className="text-[#79A84B] font-heading font-semibold text-xl md:text-2xl leading-tight">
                  Lembaga Sertifikasi
                </div>
                <div className="text-[#79A84B] font-heading font-semibold text-xl md:text-2xl leading-tight">
                  Profesi
                </div>
                <div className="text-[#8C3C18] text-base font-heading font-medium mt-0.5">
                  Wirausaha Kompeten Nusantara
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button - positioned at the center */}
          <div className="flex md:hidden items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
              className="p-1"
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </Button>
          </div>

          {/* Right side buttons for login & register */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/auth">
              <Button 
                variant="outline" 
                className="text-[#79A84B] border-[#79A84B] hover:bg-[#79A84B] hover:text-white"
                size="sm"
              >
                LOGIN
              </Button>
            </Link>
            <Link href="/auth?tab=register">
              <Button 
                className="bg-[#79A84B] text-white hover:bg-[#79A84B]/90"
                size="sm"
              >
                DAFTAR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation - Single horizontal line style */}
      <div className="bg-white border-t">
        <div className="container mx-auto">
          {/* Navigation - Desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 h-12">
              <li>
                <Link
                  href="/"
                  className={`h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200 ${
                    isActive("/") ? "font-bold" : ""
                  }`}
                >
                  BERANDA
                </Link>
              </li>
              <li className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200">
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
              <li className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200">
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
              <li className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200">
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
              <li className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200">
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
                  className={`h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200 ${
                    isActive("/registrasi") ? "font-bold" : ""
                  }`}
                >
                  REGISTRASI
                </Link>
              </li>
              <li>
                <Link
                  href="/formulir-sertifikasi"
                  className={`h-12 flex items-center text-[#79A84B] hover:text-[#79A84B]/80 transition-colors duration-200 ${
                    isActive("/formulir-sertifikasi") ? "font-bold" : ""
                  }`}
                >
                  FORMULIR LSP
                </Link>
              </li>
              <li>
                <Link
                  href="/formulir-asesor"
                  className={`h-12 flex items-center hover:text-[#79A84B] transition-colors duration-200 ${
                    isActive("/formulir-asesor") ? "font-bold" : ""
                  }`}
                >
                  ASESOR
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden w-full py-4 border-t">
              <div className="flex flex-col space-y-3 mb-4">
                <Link href="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="text-[#79A84B] border-[#79A84B] hover:bg-[#79A84B] hover:text-white w-full">
                    LOGIN
                  </Button>
                </Link>
                <Link href="/auth?tab=register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-[#79A84B] text-white hover:bg-[#79A84B]/90 w-full">
                    DAFTAR
                  </Button>
                </Link>
              </div>
              <ul className="flex flex-col space-y-3 text-sm font-heading font-medium">
                <li>
                  <Link
                    href="/"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
                      isActive("/tentang-kami") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
                      isActive("/skema") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
                      isActive("/berita") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
                      isActive("/faq") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
                      isActive("/registrasi") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    REGISTRASI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/formulir-sertifikasi"
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-[#79A84B] ${
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
                      isActive("/formulir-asesor") ? "bg-gray-100 text-[#79A84B] font-semibold" : ""
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
