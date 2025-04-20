import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Tentang Kami | LSP Wirausaha Kompeten Nusantara</title>
        <meta
          name="description"
          content="Mengenal lebih dekat LSP Wirausaha Kompeten Nusantara, lembaga sertifikasi profesi yang berkomitmen untuk meningkatkan kompetensi profesional di Indonesia."
        />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">
            Tentang Kami
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-heading font-semibold mb-4">
                  LSP Wirausaha Kompeten Nusantara
                </h2>
                <p className="text-gray-700 mb-4">
                  LSP Wirausaha Kompeten Nusantara adalah lembaga sertifikasi profesi yang
                  berkomitmen untuk meningkatkan kompetensi profesional
                  wirausaha di Indonesia. Kami didirikan dengan tujuan untuk
                  memberikan pengakuan formal terhadap kompetensi individu
                  sesuai dengan standar yang telah ditetapkan secara nasional
                  dan internasional.
                </p>
                <p className="text-gray-700">
                  Sertifikasi yang kami berikan diakui secara nasional dan
                  menjadi bukti bahwa pemiliknya telah memenuhi standar
                  kompetensi yang dibutuhkan oleh industri, sehingga
                  meningkatkan daya saing baik di tingkat nasional maupun
                  internasional.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Tim LSP Wirausaha Kompeten Nusantara"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">
                Visi
              </h2>
              <p className="text-gray-700">
                Menjadi lembaga sertifikasi profesi terkemuka yang menghasilkan
                wirausahawan kompeten dan berdaya saing global, berkontribusi
                dalam pengembangan ekonomi nasional melalui peningkatan kualitas
                sumber daya manusia Indonesia.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">
                Misi
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  Menyelenggarakan sertifikasi profesi yang kredibel dan
                  akuntabel sesuai kebutuhan industri
                </li>
                <li>
                  Mengembangkan skema sertifikasi yang relevan dengan
                  perkembangan teknologi dan kebutuhan pasar
                </li>
                <li>
                  Meningkatkan kualitas dan kuantitas tenaga kerja profesional
                  yang kompeten di bidang kewirausahaan dan bisnis digital
                </li>
                <li>
                  Membangun kerjasama dengan pemangku kepentingan untuk
                  meningkatkan pengakuan sertifikasi kompetensi
                </li>
                <li>
                  Mendorong budaya kompetensi dalam pengembangan sumber daya
                  manusia Indonesia
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-6 text-center">
              Legalitas dan Pengakuan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-primary text-4xl mb-2">📜</div>
                <h3 className="font-heading font-medium mb-2">
                  Lisensi BNSP
                </h3>
                <p className="text-gray-600 text-sm">
                  Terakreditasi dan mendapatkan lisensi dari Badan Nasional
                  Sertifikasi Profesi (BNSP)
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-primary text-4xl mb-2">📊</div>
                <h3 className="font-heading font-medium mb-2">
                  Standar Kompetensi Nasional
                </h3>
                <p className="text-gray-600 text-sm">
                  Skema sertifikasi mengacu pada Standar Kompetensi Kerja
                  Nasional Indonesia (SKKNI)
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-primary text-4xl mb-2">🌐</div>
                <h3 className="font-heading font-medium mb-2">
                  Pengakuan Internasional
                </h3>
                <p className="text-gray-600 text-sm">
                  Bekerja sama dengan lembaga internasional untuk pengakuan
                  global terhadap sertifikasi
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-6">
              Keunggulan Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="font-heading font-medium mb-2">
                  Asesor Berpengalaman
                </h3>
                <p className="text-gray-600 text-sm">
                  Tim asesor yang kompeten dan berpengalaman di bidangnya
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-tertiary text-2xl">📚</span>
                </div>
                <h3 className="font-heading font-medium mb-2">
                  Skema Kompetensi Lengkap
                </h3>
                <p className="text-gray-600 text-sm">
                  Berbagai skema sertifikasi yang sesuai dengan kebutuhan
                  industri
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-16 h-16 bg-tertiary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔄</span>
                </div>
                <h3 className="font-heading font-medium mb-2">
                  Proses Transparan
                </h3>
                <p className="text-gray-600 text-sm">
                  Prosedur sertifikasi yang jelas, akuntabel, dan transparan
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="font-heading font-medium mb-2">
                  Jaringan Industri Luas
                </h3>
                <p className="text-gray-600 text-sm">
                  Kerjasama dengan berbagai industri untuk penyerapan tenaga
                  kerja
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Siap Meningkatkan Kompetensi Anda?
            </h2>
            <p className="mb-6">
              Bergabunglah dengan ribuan profesional yang telah mendapatkan
              sertifikasi dari LSP Wirausaha Kompeten Nusantara
            </p>
            <a
              href="/registrasi"
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
