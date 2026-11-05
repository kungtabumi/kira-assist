import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, Compass, HeartHandshake, Leaf, ArrowRight, Sparkle } from 'lucide-react';
import { BusinessProfile } from '../types';

interface HeroSectionProps {
  onStartConsultation: () => void;
  onExploreWastra: () => void;
  onOpenStyling?: () => void;
  onOpenPersona?: () => void;
  activeBusiness: BusinessProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartConsultation,
  onExploreWastra,
  onOpenStyling,
  onOpenPersona,
  activeBusiness
}) => {
  return (
    <section className="relative pt-10 sm:pt-14 pb-16 sm:pb-20 border-b border-[#E7E0D6] overflow-hidden">
      
      {/* Editorial Decorative Weave Flourish Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none">
          <path d="M0 200 C200 100, 600 300, 800 200" stroke="#963824" strokeWidth="1.5" strokeDasharray="6,4" />
          <path d="M0 220 C200 320, 600 120, 800 220" stroke="#A8763E" strokeWidth="1.5" strokeDasharray="4,6" />
        </svg>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Masthead */}
        <div className="max-w-5xl mx-auto text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3EEE4] border border-[#E7E0D6] text-xs text-[#57534E] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#963824] animate-pulse"></span>
            <span>Basis Pengetahuan Resmi Terkurasi: <strong className="text-[#1C1917] font-semibold">{activeBusiness.name}</strong></span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1C1917] tracking-tight leading-[1.08]">
            Temukan wastra.<br />
            <span className="italic font-normal text-[#963824]">Pahami ceritanya.</span><br />
            Pilih dengan lebih bermakna.
          </h1>

          <p className="text-sm sm:text-lg text-[#57534E] font-normal max-w-2xl mx-auto leading-relaxed pt-1">
            KIRA adalah <em>AI Cultural & Fashion Decision Agent</em> yang memandu keputusan berbusana etnik Nusantara berbasis riset tenun sakral, filosofi <em>zero-waste</em>, dan kurasi tervalidasi.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 pb-8">
            <button
              onClick={onStartConsultation}
              className="px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#332E29] text-[#FAF7F2] font-semibold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              <Sparkles size={16} className="text-[#C89B53]" />
              <span>Mulai Konsultasi KIRA</span>
              <ArrowRight size={15} className="text-[#FAF7F2]/70" />
            </button>

            {onOpenStyling && (
              <button
                onClick={onOpenStyling}
                className="px-6 py-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#F3EEE4] text-[#1C1917] font-semibold text-sm sm:text-base border border-[#D4C9BC] transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:border-[#963824]"
              >
                <Compass size={16} className="text-[#963824]" />
                <span>Studio Padu-Padan</span>
              </button>
            )}

            {onOpenPersona && (
              <button
                onClick={onOpenPersona}
                className="px-6 py-3.5 rounded-full bg-[#F3EEE4] hover:bg-[#EAE2D5] text-[#1C1917] font-semibold text-sm sm:text-base border border-[#E7E0D6] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkle size={15} className="text-[#C89B53]" />
                <span>Kuis Persona Budaya</span>
              </button>
            )}

            <button
              onClick={onExploreWastra}
              className="px-5 py-3.5 rounded-full text-[#57534E] hover:text-[#1C1917] font-semibold text-sm sm:text-base transition-all flex items-center gap-1.5 cursor-pointer hover:bg-[#F3EEE4]/50"
            >
              <BookOpen size={16} className="text-[#57534E]" />
              <span>Pustaka Wastra</span>
            </button>
          </div>

        </div>

        {/* 4 Pillars of Integrity (Clean architectural cards without AI slop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-[#E7E0D6]">
          
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-2xs hover:border-[#963824] transition-all space-y-2">
            <div className="flex items-center gap-2 text-[#963824] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Otentisitas Data</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              Terverifikasi & Akurat
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Seluruh data wastra, motif, dan aturan adat bersumber langsung dari kurasi resmi Dian Oerip tanpa halusinasi model generik.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-2xs hover:border-[#1E3A2B] transition-all space-y-2">
            <div className="flex items-center gap-2 text-[#1E3A2B] text-xs font-semibold uppercase tracking-wider">
              <Leaf size={16} />
              <span>Filosofi Busana</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              Zero-Waste & All-Size
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Konsep minim potong yang menghormati setiap helai doa penenun tangan tradisional dengan siluet inklusif yang jatuh luwes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-2xs hover:border-[#C89B53] transition-all space-y-2">
            <div className="flex items-center gap-2 text-[#A8763E] text-xs font-semibold uppercase tracking-wider">
              <HeartHandshake size={16} />
              <span>Dampak Sosial</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              Living Heritage
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Menghubungkan langsung apresiasi pemakai dengan kesejahteraan komunitas penenun pelosok Nusantara dan pewarna alami.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-2xs hover:border-[#162436] transition-all space-y-2">
            <div className="flex items-center gap-2 text-[#162436] text-xs font-semibold uppercase tracking-wider">
              <Compass size={16} />
              <span>Kecerdasan AI</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1917]">
              Contextual Decision
            </h4>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Memahami tujuan acara, tingkat formalitas, dan karakter pemakai sebelum merekomendasikan pilihan busana yang tepat.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
