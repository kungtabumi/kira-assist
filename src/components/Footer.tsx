import React from 'react';
import { ShieldCheck, Heart, Instagram, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-[#2E2A27] pt-14 pb-10 mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#2E2A27] text-xs sm:text-sm">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#1C1917] font-serif font-bold text-base flex items-center justify-center">
                K
              </div>
              <span className="font-serif tracking-widest text-xl font-bold text-[#FAF7F2]">
                KIRA
              </span>
            </div>
            <p className="font-serif italic text-xs text-[#D4C9BC] leading-relaxed">
              “Temukan wastra. Pahami ceritanya. Pilih dengan lebih bermakna.”
            </p>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              AI Cultural & Fashion Decision Agent yang dirancang khusus untuk busana wastra Nusantara dengan komitmen anti-halusinasi.
            </p>
          </div>

          {/* Col 2: Pilot Credential */}
          <div className="space-y-2 text-xs">
            <h4 className="font-serif font-bold text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              Primary Pilot: Oerip Indonesia
            </h4>
            <p className="text-[#A8A29E] leading-relaxed">
              Didirikan oleh <strong>Dian Errakumalasari (Dian Oerip)</strong> di Ngawi, Jawa Timur.
            </p>
            <div className="flex items-center gap-1.5 text-[#D4C9BC] pt-1">
              <MapPin size={13} className="text-[#C89B53]" />
              <span>Ngawi, Jawa Timur, Indonesia</span>
            </div>
            <div className="pt-2 text-[11px] text-[#A8D5BA] flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>100% Grounded in Official Oerip Knowledge</span>
            </div>
          </div>

          {/* Col 3: Official Social Channels */}
          <div className="space-y-2 text-xs">
            <h4 className="font-serif font-bold text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              Kanal Resmi Terverifikasi
            </h4>
            <div className="space-y-1.5 text-[#A8A29E]">
              <div className="flex items-center gap-2">
                <Instagram size={14} className="text-[#C89B53]" />
                <span className="text-[#FAF7F2] font-mono">@oerip_official</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={14} className="text-[#C89B53]" />
                <span className="text-[#FAF7F2] font-mono">@dian_oerip</span>
              </div>
              <p className="text-[11px] text-[#78716C] pt-1">
                Data media sosial diekstrak melalui pipeline terkurasi dan tervalidasi manusia.
              </p>
            </div>
          </div>

          {/* Col 4: Oerip Ecosystem & Direct Empowerment */}
          <div className="space-y-2 text-xs">
            <h4 className="font-serif font-bold text-[#FAF7F2] uppercase tracking-wider text-[11px]">
              Ekosistem Oerip Indonesia
            </h4>
            <p className="text-[#A8A29E] leading-relaxed">
              Pemberdayaan tradisi tenun tangan & pelestarian budaya:
            </p>
            <ul className="text-[11px] text-[#D4C9BC] space-y-1">
              <li>• Museum Oerip (Ngawi, Jawa Timur)</li>
              <li>• Kriya Jiwa Dian Errakumalasari</li>
              <li>• Komunitas Penenun Sumba, Tuban & Flores</li>
              <li>• Gerakan Zero-Waste Fashion Nusantara</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78716C]">
          <div>
            © {new Date().getFullYear()} KIRA — AI Cultural & Fashion Decision Agent. Kolaborasi bersama Oerip Indonesia.
          </div>
          <div className="flex items-center gap-1 text-[#D4C9BC]">
            <span>Menjaga & Menghidupkan Tradisi Tenun Nusantara</span>
            <Heart size={12} className="text-[#963824] fill-[#963824]" />
          </div>
        </div>

      </div>
    </footer>
  );
};

