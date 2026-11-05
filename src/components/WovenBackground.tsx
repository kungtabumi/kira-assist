import React from 'react';

interface WovenBackgroundProps {
  opacity?: number;
}

/**
 * WovenBackground - Latar Belakang Tunggal Wastra Tenun Nusantara Dian Oerip
 * 
 * Karakter visual:
 * - Halus, anggun, dan tidak mengganggu keterbacaan teks/kartu (subtle & unobtrusive)
 * - Motif tenun ikat geometris khas Dian Oerip (stepped diamond resist-dye & sekong)
 * - Tekstur pakan-lungsi serat katun pintal tangan (ATBM slub yarn)
 * - Gradasi kehangatan pewarna alami (terakota mengkudu & soga kayu)
 */
export const WovenBackground: React.FC<WovenBackgroundProps> = ({
  opacity = 1
}) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* SVG Definitions for Authentic Indonesian Handwoven Pattern */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* 1. Micro Handloom Weft & Warp Texture (Anyaman Benang Katun ATBM) */}
          <pattern id="oerip-atbm-weave" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="none" />
            {/* Horizontal weft threads */}
            <line x1="0" y1="4" x2="16" y2="4" stroke="#8C7D70" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.08" />
            <line x1="0" y1="12" x2="16" y2="12" stroke="#8C7D70" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.08" />
            {/* Vertical warp threads */}
            <line x1="4" y1="0" x2="4" y2="16" stroke="#963824" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.05" />
            <line x1="12" y1="0" x2="12" y2="16" stroke="#C89B53" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.05" />
            {/* Cotton fiber crossing node */}
            <circle cx="8" cy="8" r="0.6" fill="#8C7D70" opacity="0.06" />
          </pattern>

          {/* 2. Primary Wastra Oerip Indonesia Motif: Geometris Tenun Ikat Nusantara */}
          {/* Menggabungkan Belah Ketupat Bertingkat (Sumba/Toraja) dan Pucuk Harapan dengan garis halus */}
          <pattern id="oerip-wastra-ikat" width="96" height="96" patternUnits="userSpaceOnUse">
            {/* Outer Serrated Resist-Dye Ikat Diamond */}
            <path
              d="M48 8 
                 L54 14 L60 14 L66 20 L72 20 L78 26 L84 32 L88 32 L88 38 L84 44 L78 44 L72 50 L66 50 L60 56 L54 56 L48 62 
                 L42 56 L36 56 L30 50 L24 50 L18 44 L12 44 L8 38 L8 32 L12 32 L18 26 L24 20 L30 20 L36 14 L42 14 Z"
              transform="translate(0, 13)"
              fill="none"
              stroke="#963824"
              strokeWidth="0.9"
              opacity="0.065"
            />

            {/* Inner Concentric Diamond (Soga Gold Ochre) */}
            <path
              d="M48 27 L69 48 L48 69 L27 48 Z"
              fill="none"
              stroke="#C89B53"
              strokeWidth="0.8"
              strokeDasharray="3,2"
              opacity="0.07"
            />

            {/* Core Sacred Eye of the Loom (Pusat Tenun) */}
            <polygon
              points="48,37 59,48 48,59 37,48"
              fill="#963824"
              fillOpacity="0.025"
              stroke="#963824"
              strokeWidth="0.75"
              opacity="0.08"
            />
            <circle cx="48" cy="48" r="2" fill="#C89B53" opacity="0.1" />

            {/* Subtle Connecting Weft Diagonal Filaments */}
            <line x1="0" y1="0" x2="20" y2="20" stroke="#8C7D70" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.04" />
            <line x1="96" y1="0" x2="76" y2="20" stroke="#8C7D70" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.04" />
            <line x1="0" y1="96" x2="20" y2="76" stroke="#8C7D70" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.04" />
            <line x1="96" y1="96" x2="76" y2="76" stroke="#8C7D70" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.04" />

            {/* Subtle Cardinal Cross Points */}
            <circle cx="48" cy="6" r="1.2" fill="#963824" opacity="0.08" />
            <circle cx="48" cy="90" r="1.2" fill="#963824" opacity="0.08" />
            <circle cx="6" cy="48" r="1.2" fill="#963824" opacity="0.08" />
            <circle cx="90" cy="48" r="1.2" fill="#963824" opacity="0.08" />
          </pattern>
        </defs>
      </svg>

      {/* Layer 1: Kehangatan Alami Pewarna Nabati (Sangat Lembut & Halus) */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #963824 0%, #C89B53 45%, transparent 70%)',
          opacity: 0.035
        }}
      />
      <div 
        className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full blur-3xl pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #C89B53 0%, #963824 40%, transparent 70%)',
          opacity: 0.03
        }}
      />

      {/* Layer 2: Anyaman Mikro Serat Katun ATBM */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="url(#oerip-atbm-weave)" />
      </svg>

      {/* Layer 3: Pola Geometri Tenun Ikat Wastra Oerip Indonesia */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="url(#oerip-wastra-ikat)" />
      </svg>

      {/* Layer 4: Pinggiran Tenun (Selvedge / Tumpal Line) Halus di Bagian Paling Atas */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: 'linear-gradient(90deg, transparent 0%, #963824 25%, #C89B53 50%, #963824 75%, transparent 100%)',
          opacity: 0.25 
        }}
      />
    </div>
  );
};
