'use client';

import Link from 'next/link';

const FEATURES = [
  { icon: '⚡', text: 'Setup dalam 5 menit tanpa ribet' },
  { icon: '🎯', text: 'Gratis 14 hari tanpa kartu kredit' },
  { icon: '📊', text: 'Dashboard analytics real-time' },
  { icon: '🔒', text: 'Keamanan data tingkat enterprise' },
  { icon: '💬', text: 'Support 24/7 dalam bahasa Indonesia' },
];

export default function RegisterLeftSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f23] to-[#0a0a0a] p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-2xl">
            P
          </div>
          <span className="text-3xl font-bold tracking-tight">
            POS<span className="text-purple-400">Pro</span>
          </span>
        </Link>

        {/* Headline */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
            ✨ Bergabung dengan 5,000+ Bisnis
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
            Mulai Transformasi
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Bisnis Anda
            </span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed">
            Bergabunglah dengan ribuan bisnis yang sudah meningkatkan efisiensi operasional
            hingga 3x lipat dengan POSPro.
          </p>

          {/* Feature list */}
          <div className="space-y-4 pt-8 mb-10">
            {FEATURES.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex-shrink-0" />
          <div>
            <p className="text-gray-300 mb-3">
              "POSPro mengubah cara kami mengelola bisnis. Sekarang semua data terintegrasi
              dan kami bisa fokus ke pertumbuhan."
            </p>
            <p className="font-semibold">Sarah Wijaya</p>
            <p className="text-sm text-gray-400">Owner, Kopi Kenangan Bandung</p>
          </div>
        </div>
      </div>
    </div>
  );
}