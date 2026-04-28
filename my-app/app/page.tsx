'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function POSLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Point of Sale",
      desc: "Sistem kasir cepat dengan antarmuka intuitif untuk transaksi yang lancar",
      icon: "💳",
      stats: "3x Lebih Cepat"
    },
    {
      title: "Manajemen Stok",
      desc: "Pantau inventori real-time dengan notifikasi otomatis untuk stok minimum",
      icon: "📦",
      stats: "Real-time Tracking"
    },
    {
      title: "Kontrol Gudang",
      desc: "Kelola multi-lokasi gudang dengan sistem transfer yang terintegrasi",
      icon: "🏭",
      stats: "Multi-warehouse"
    }
  ];

  const benefits = [
    { icon: "⚡", title: "Efisiensi Maksimal", desc: "Hemat waktu hingga 70% dalam operasional harian" },
    { icon: "📊", title: "Laporan Lengkap", desc: "Dashboard analitik untuk keputusan bisnis yang tepat" },
    { icon: "🔒", title: "Aman & Terpercaya", desc: "Enkripsi data tingkat enterprise untuk keamanan maksimal" },
    { icon: "☁️", title: "Cloud-based", desc: "Akses dari mana saja, kapan saja dengan sinkronisasi otomatis" },
    { icon: "🔄", title: "Integrasi Mudah", desc: "Kompatibel dengan berbagai hardware dan platform e-commerce" },
    { icon: "💡", title: "Support 24/7", desc: "Tim support siap membantu Anda setiap saat" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "299K",
      period: "/bulan",
      features: ["1 Outlet", "Basic POS", "Stok Management", "5 Users", "Email Support"],
      popular: false
    },
    {
      name: "Professional",
      price: "799K",
      period: "/bulan",
      features: ["3 Outlets", "Advanced POS", "Multi-warehouse", "Unlimited Users", "Priority Support", "Custom Reports"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited Outlets", "Full Features", "API Access", "Dedicated Support", "Custom Integration", "Training & Onboarding"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0a] to-[#0f0f23]"></div>
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold tracking-tight">POS<span className="text-purple-400">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Fitur</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Keunggulan</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Harga</a>
            <Link href="/register">
              <button className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105">
                Coba Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-4 animate-[fadeIn_1s_ease-out]">
              ✨ Solusi Terlengkap untuk Bisnis Modern
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight animate-[fadeIn_1s_ease-out_0.2s_both]">
              Sistem POS
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                Terintegrasi
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out_0.4s_both]">
              Kelola kasir, stok, dan gudang dalam satu platform modern. Tingkatkan efisiensi bisnis hingga 3x lipat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-[fadeIn_1s_ease-out_0.6s_both]">
              <Link href="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105">
                  Mulai Gratis 14 Hari
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all hover:scale-105">
                  Jadwalkan Demo
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-500 animate-[fadeIn_1s_ease-out_0.8s_both]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Tanpa Kartu Kredit
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Setup 5 Menit
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Support Indonesia
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 animate-[fadeIn_1s_ease-out_1s_both]">
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-2 rounded-2xl border border-gray-700 shadow-2xl">
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] rounded-xl overflow-hidden">
                  {/* Mockup Header */}
                  <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-gray-500">Dashboard POS</div>
                  </div>
                  {/* Mockup Content */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-xl border border-purple-500/20">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="text-sm text-gray-400">Penjualan Hari Ini</div>
                      <div className="text-3xl font-bold mt-2">Rp 15.4jt</div>
                      <div className="text-xs text-green-400 mt-1">↗ +23% dari kemarin</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-xl border border-blue-500/20">
                      <div className="text-3xl mb-2">📦</div>
                      <div className="text-sm text-gray-400">Produk Terjual</div>
                      <div className="text-3xl font-bold mt-2">1,247</div>
                      <div className="text-xs text-green-400 mt-1">↗ +15% dari kemarin</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 p-6 rounded-xl border border-pink-500/20">
                      <div className="text-3xl mb-2">⚠️</div>
                      <div className="text-sm text-gray-400">Stok Menipis</div>
                      <div className="text-3xl font-bold mt-2">8 Item</div>
                      <div className="text-xs text-orange-400 mt-1">Perlu restock segera</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-32 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Tiga Sistem dalam
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text"> Satu Platform</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Integrasi sempurna antara kasir, inventori, dan gudang untuk operasional yang efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 rounded-2xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <div className="relative">
                  <div className="text-6xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.desc}</p>
                  <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 px-6 py-32 lg:px-12 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Mengapa Memilih <span className="text-purple-400">POSPro?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Lebih dari sekadar software, ini adalah partner pertumbuhan bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-32 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pilih Paket yang <span className="text-blue-400">Tepat</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Harga transparan tanpa biaya tersembunyi. Semua paket sudah termasuk update gratis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-2xl shadow-purple-500/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-sm font-semibold">
                    Paling Populer
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="w-full">
                  <button className={`w-full py-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:shadow-purple-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}>
                    {plan.price === "Custom" ? "Hubungi Sales" : "Mulai Sekarang"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-12 md:p-20 rounded-3xl border border-purple-500/30">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Siap Tingkatkan Bisnis Anda?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan bisnis yang sudah mempercayai POSPro untuk mengelola operasional mereka
              </p>
              <Link href="/register">
                <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-2xl">
                  Mulai Gratis Sekarang →
                </button>
              </Link>
              <p className="text-sm text-gray-400 mt-4">Gratis 14 hari • Tanpa kartu kredit • Cancel kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 lg:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrasi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
                P
              </div>
              <span className="font-bold">POSPro</span>
            </div>
            <p className="text-gray-400 text-sm">© 2026 POSPro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}