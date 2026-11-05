import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  Palette,
  ShieldCheck,
  ChevronRight,
  Info,
  User,
  Scissors,
  BookmarkPlus,
  Share2
} from 'lucide-react';
import { ProductItem } from '../types';

export interface LayerItem {
  id: string;
  name: string;
  category: 'MANNEQUIN' | 'INNER' | 'BOTTOM' | 'OUTER' | 'SASH' | 'ACCESSORY';
  label: string;
  visible: boolean;
  opacity: number;
  itemData?: any;
  colorHex?: string;
  patternUrl?: string;
  drapeStyle?: 'OPEN' | 'CINCHED' | 'ASYMMETRIC' | 'DRAPED';
}

interface VirtualMannequinLayeringProps {
  selectedOuter: ProductItem;
  selectedBottom: {
    id: string;
    name: string;
    color: string;
    material: string;
    pairing_notes: string;
  };
  selectedAccessory: {
    id: string;
    name: string;
    category: string;
    material: string;
    symbolism: string;
  };
  onConsultLook?: (summary: string) => void;
  isExpandedView?: boolean;
  onToggleExpand?: () => void;
}

export const VirtualMannequinLayering: React.FC<VirtualMannequinLayeringProps> = ({
  selectedOuter,
  selectedBottom,
  selectedAccessory,
  onConsultLook,
  isExpandedView = false,
  onToggleExpand
}) => {
  // Mannequin Figure Presets
  const [mannequinType, setMannequinType] = useState<'FEMALE' | 'MALE' | 'ATELIER'>('FEMALE');
  const [mannequinTone, setMannequinTone] = useState<'SAND' | 'OCHRE' | 'TERRA' | 'CHARCOAL'>('SAND');
  const [drapeStyle, setDrapeStyle] = useState<'OPEN' | 'CINCHED' | 'ASYMMETRIC'>('OPEN');
  
  // Inner top base selection
  const [selectedInnerTop, setSelectedInnerTop] = useState({
    name: 'Kemben & Inner Tanktop Katun Mentah',
    color: '#FAF7F2',
    colorName: 'Broken White Natural',
    neckline: 'SCOOP'
  });

  // Optional Sash / Obi selection
  const [selectedSash, setSelectedSash] = useState<{
    enabled: boolean;
    name: string;
    color: string;
  }>({
    enabled: false,
    name: 'Obi Tenun Lurik Prasojo Klaten',
    color: '#963824'
  });

  // Layer visibility toggles
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    ACCESSORY: true,
    SASH: true,
    OUTER: true,
    BOTTOM: true,
    INNER: true,
    MANNEQUIN: true
  });

  // Active layer inspect mode
  const [activeInspectedLayer, setActiveInspectedLayer] = useState<string | null>('OUTER');
  const [copiedLook, setCopiedLook] = useState(false);

  const toggleLayer = (layerKey: string) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const getToneColor = () => {
    switch (mannequinTone) {
      case 'SAND': return '#E8E1D5';
      case 'OCHRE': return '#D5C4AC';
      case 'TERRA': return '#C29B88';
      case 'CHARCOAL': return '#38332E';
      default: return '#E8E1D5';
    }
  };

  const getBottomColorHex = () => {
    const col = selectedBottom.color.toLowerCase();
    if (col.includes('hitam') || col.includes('charcoal')) return '#1F1E1D';
    if (col.includes('krem') || col.includes('broken white') || col.includes('raw')) return '#ECE5D8';
    if (col.includes('terakota') || col.includes('bata')) return '#8C3B2B';
    if (col.includes('indigo') || col.includes('navy') || col.includes('biru')) return '#1B2A3D';
    if (col.includes('emas') || col.includes('mustard') || col.includes('cokelat')) return '#8C6838';
    return '#2D2824';
  };

  const getOuterPrimaryColor = () => {
    if (selectedOuter.colors.some(c => c.toLowerCase().includes('marun') || c.toLowerCase().includes('terakota'))) {
      return '#8C3122';
    }
    if (selectedOuter.colors.some(c => c.toLowerCase().includes('nila') || c.toLowerCase().includes('biru') || c.toLowerCase().includes('indigo'))) {
      return '#1D2F44';
    }
    if (selectedOuter.colors.some(c => c.toLowerCase().includes('hitam') || c.toLowerCase().includes('lumpur'))) {
      return '#262220';
    }
    return '#A3723E';
  };

  const layersList = [
    {
      key: 'ACCESSORY',
      title: 'Aksesoris Etnik Otentik',
      name: selectedAccessory.name,
      sub: `${selectedAccessory.category} • ${selectedAccessory.material}`,
      colorHex: '#C89B53'
    },
    {
      key: 'SASH',
      title: 'Aksen Sabuk / Obi / Selendang',
      name: selectedSash.enabled ? selectedSash.name : 'Tanpa Ikat Pinggang (Loose Flow)',
      sub: selectedSash.enabled ? 'Cinched Waist Accent' : 'Siluet Lepas All-Size',
      colorHex: '#963824'
    },
    {
      key: 'OUTER',
      title: 'Statement Outer Wastra Oerip',
      name: selectedOuter.product_name,
      sub: `${selectedOuter.textile} (${selectedOuter.textile_origin})`,
      colorHex: getOuterPrimaryColor()
    },
    {
      key: 'INNER',
      title: 'Inner Atasan / Base Garment',
      name: selectedInnerTop.name,
      sub: selectedInnerTop.colorName,
      colorHex: selectedInnerTop.color
    },
    {
      key: 'BOTTOM',
      title: 'Bawahan / Rok / Kulot',
      name: selectedBottom.name,
      sub: `${selectedBottom.color} • ${selectedBottom.material}`,
      colorHex: getBottomColorHex()
    },
    {
      key: 'MANNEQUIN',
      title: 'Manekin Siluet Tubuh',
      name: mannequinType === 'FEMALE' ? 'Manekin Wanita Anggun' : mannequinType === 'MALE' ? 'Manekin Pria Wibawa' : 'Bentuk Manekin Atelier',
      sub: `Nada Kulit: ${mannequinTone}`,
      colorHex: getToneColor()
    }
  ];

  return (
    <div className={`w-full rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs overflow-hidden transition-all duration-300 ${
      isExpandedView ? 'p-6 sm:p-8 space-y-6' : 'p-5 space-y-5'
    }`}>
      
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#E7E0D6]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#963824] border border-[#D4C9BC] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Layers size={11} className="text-[#C89B53]" />
            <span>Virtual Layering Visualizer</span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] flex items-center gap-2">
            <span>Visualisasi Layering Manekin</span>
            <span className="text-xs font-sans font-normal text-[#78716C]">
              ({layerVisibility.OUTER ? 'Outer Terpasang' : 'Outer Dilepas'})
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#1C1917] border border-[#D4C9BC] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title={isExpandedView ? 'Perkecil Tampilan' : 'Perluas Kanvas Manekin'}
            >
              {isExpandedView ? (
                <>
                  <Minimize2 size={14} />
                  <span className="text-[11px] font-medium hidden sm:inline">Perkecil</span>
                </>
              ) : (
                <>
                  <Maximize2 size={14} />
                  <span className="text-[11px] font-medium hidden sm:inline">Perluas Studio</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Interactive Stage */}
      <div className={`grid gap-6 ${isExpandedView ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 md:grid-cols-12'}`}>
        
        {/* Left / Center: Interactive Mannequin Canvas (7 cols in expanded, 6 cols standard) */}
        <div className={`${isExpandedView ? 'lg:col-span-7' : 'md:col-span-7'} flex flex-col items-center justify-center`}>
          
          {/* Controls Bar Above Mannequin */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] mb-3 text-xs">
            
            {/* Mannequin Type Switcher */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-[#78716C] mr-1">Figur:</span>
              <button
                onClick={() => setMannequinType('FEMALE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  mannequinType === 'FEMALE' ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Wanita
              </button>
              <button
                onClick={() => setMannequinType('MALE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  mannequinType === 'MALE' ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Pria
              </button>
              <button
                onClick={() => setMannequinType('ATELIER')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  mannequinType === 'ATELIER' ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Atelier
              </button>
            </div>

            {/* Drape Mode Switcher */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-[#78716C] mr-1">Jatuh Kain:</span>
              <button
                onClick={() => setDrapeStyle('OPEN')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  drapeStyle === 'OPEN' ? 'bg-[#963824] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
                title="Outer terurai bebas / Loose Open Flow"
              >
                Loose
              </button>
              <button
                onClick={() => {
                  setDrapeStyle('CINCHED');
                  setSelectedSash(prev => ({ ...prev, enabled: true }));
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  drapeStyle === 'CINCHED' ? 'bg-[#963824] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
                title="Diberi ikat pinggang / Cinched with Sash"
              >
                Belted
              </button>
              <button
                onClick={() => setDrapeStyle('ASYMMETRIC')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  drapeStyle === 'ASYMMETRIC' ? 'bg-[#963824] text-[#FAF7F2]' : 'bg-[#FFFFFF] text-[#57534E] hover:text-[#1C1917]'
                }`}
                title="Gaya sampir selempang bahu asimetris"
              >
                Draped
              </button>
            </div>

          </div>

          {/* Mannequin Interactive Stage Container */}
          <div className="w-full relative aspect-3/4 max-h-[520px] rounded-2xl bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EFE7DC] border border-[#E7E0D6] shadow-inner flex items-center justify-center p-4 overflow-hidden select-none group">
            
            {/* Background Studio Light & Cultural Circular Motif */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-radial from-white/70 via-white/20 to-transparent blur-xl pointer-events-none" />
            
            {/* Heritage Decorative Background Loom Line Graphic */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="mannequin-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M0 15 L30 15 M15 0 L15 30" stroke="#1C1917" strokeWidth="0.5" strokeDasharray="3,3" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mannequin-grid)" />
              </svg>
            </div>

            {/* MANNEQUIN SVG & LAYER COMPOSITE STACK */}
            <div className="relative w-full h-full max-w-[340px] flex items-center justify-center">
              
              <svg viewBox="0 0 340 500" className="w-full h-full drop-shadow-md">
                <defs>
                  {/* Outer Wastra Image Pattern Mask */}
                  <pattern id="wastra-photo-pattern" patternUnits="userSpaceOnUse" width="340" height="500">
                    <image
                      href={selectedOuter.image}
                      x="20"
                      y="70"
                      width="300"
                      height="400"
                      preserveAspectRatio="xMidYMid slice"
                      opacity={layerVisibility.OUTER ? 0.95 : 0}
                    />
                  </pattern>

                  {/* Gradient for Outer Fabric Shading */}
                  <linearGradient id="outer-drape-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
                    <stop offset="30%" stopColor="#000000" stopOpacity="0.05" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
                    <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Bottom Fabric Texture */}
                  <pattern id="bottom-weave-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill={getBottomColorHex()} />
                    <line x1="0" y1="6" x2="12" y2="6" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.15" strokeDasharray="2,2" />
                    <line x1="6" y1="0" x2="6" y2="12" stroke="#000000" strokeWidth="0.5" opacity="0.1" />
                  </pattern>

                  {/* Gold Jewelry Shimmer */}
                  <linearGradient id="gold-jewelry-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5C178" />
                    <stop offset="50%" stopColor="#C89B53" />
                    <stop offset="100%" stopColor="#966C24" />
                  </linearGradient>
                </defs>

                {/* ============================================================ */}
                {/* LAYER 0: MANNEQUIN BASE SILHOUETTE (Body Form) */}
                {/* ============================================================ */}
                {layerVisibility.MANNEQUIN && (
                  <g id="layer-mannequin-form" opacity={activeInspectedLayer && activeInspectedLayer !== 'MANNEQUIN' ? 0.45 : 1} className="transition-opacity duration-300">
                    {/* Atelier Stand Pole & Base */}
                    {mannequinType === 'ATELIER' && (
                      <g>
                        <line x1="170" y1="360" x2="170" y2="480" stroke="#332E29" strokeWidth="6" strokeLinecap="round" />
                        <ellipse cx="170" cy="480" rx="45" ry="12" fill="#24201D" />
                        <ellipse cx="170" cy="478" rx="38" ry="9" fill="#3D3732" />
                      </g>
                    )}

                    {/* Head / Form Finial */}
                    {mannequinType === 'ATELIER' ? (
                      <circle cx="170" cy="45" r="10" fill="#332E29" />
                    ) : (
                      <g>
                        <ellipse cx="170" cy="52" rx="20" ry="26" fill={getToneColor()} />
                        {/* Hair Silhouette (Minimalist Chignon / Bun for female) */}
                        {mannequinType === 'FEMALE' && (
                          <ellipse cx="170" cy="28" rx="14" ry="10" fill="#2E2822" />
                        )}
                      </g>
                    )}

                    {/* Neck */}
                    <path d="M162 72 L162 94 L178 94 L178 72 Z" fill={getToneColor()} />

                    {/* Torso Silhouette */}
                    {mannequinType === 'FEMALE' ? (
                      <path
                        d="M125 105 C130 94, 155 92, 170 92 C185 92, 210 94, 215 105 C210 135, 198 160, 192 185 C186 210, 198 245, 204 275 L136 275 C142 245, 154 210, 148 185 C142 160, 130 135, 125 105 Z"
                        fill={getToneColor()}
                      />
                    ) : mannequinType === 'MALE' ? (
                      <path
                        d="M118 105 C125 94, 152 92, 170 92 C188 92, 215 94, 222 105 C220 140, 210 175, 202 210 C198 235, 202 265, 206 285 L134 285 C138 265, 142 235, 138 210 C130 175, 120 140, 118 105 Z"
                        fill={getToneColor()}
                      />
                    ) : (
                      /* Tailor Dummy Form */
                      <path
                        d="M126 100 C135 94, 155 92, 170 92 C185 92, 205 94, 214 100 C208 140, 198 175, 190 210 C185 235, 195 270, 200 295 L140 295 C145 270, 155 235, 150 210 C142 175, 132 140, 126 100 Z"
                        fill={getToneColor()}
                        stroke="#B8A898"
                        strokeWidth="1"
                        strokeDasharray="4,2"
                      />
                    )}

                    {/* Legs (for Female and Male models) */}
                    {mannequinType !== 'ATELIER' && (
                      <g fill={getToneColor()}>
                        <path d="M140 275 L148 450 L162 450 L166 275 Z" opacity="0.9" />
                        <path d="M174 275 L178 450 L192 450 L200 275 Z" opacity="0.9" />
                        {/* Minimalist Footwear Base */}
                        <path d="M146 450 L164 450 L166 462 L144 462 Z" fill="#24201D" />
                        <path d="M176 450 L194 450 L196 462 L174 462 Z" fill="#24201D" />
                      </g>
                    )}
                  </g>
                )}

                {/* ============================================================ */}
                {/* LAYER 1: INNER / BASE GARMENT (Atasan / Kemben / Kemeja) */}
                {/* ============================================================ */}
                {layerVisibility.INNER && (
                  <g id="layer-inner-base" opacity={activeInspectedLayer && activeInspectedLayer !== 'INNER' ? 0.5 : 1} className="transition-opacity duration-300">
                    <path
                      d="M138 120 C150 135, 190 135, 202 120 L198 250 L142 250 Z"
                      fill={selectedInnerTop.color}
                      stroke="#000000"
                      strokeOpacity="0.1"
                      strokeWidth="1"
                    />
                    {/* Inner texture lines */}
                    <line x1="170" y1="135" x2="170" y2="250" stroke="#000000" strokeWidth="0.75" opacity="0.08" strokeDasharray="3,2" />
                  </g>
                )}

                {/* ============================================================ */}
                {/* LAYER 2: BOTTOM / SKIRT / CULLOTE (Bawahan) */}
                {/* ============================================================ */}
                {layerVisibility.BOTTOM && (
                  <g id="layer-bottom-garment" opacity={activeInspectedLayer && activeInspectedLayer !== 'BOTTOM' ? 0.5 : 1} className="transition-opacity duration-300">
                    {/* Wastra Wrap Skirt / Cullote Geometry */}
                    <path
                      d="M136 240 C150 244, 190 244, 204 240 L218 420 C185 432, 155 432, 122 420 Z"
                      fill="url(#bottom-weave-pattern)"
                    />
                    {/* Skirt Pleat / Draped Overlap Line */}
                    <path
                      d="M152 242 Q162 330 178 426"
                      stroke="#000000"
                      strokeWidth="1.5"
                      opacity="0.2"
                      fill="none"
                    />
                    <path
                      d="M150 242 Q160 330 176 426"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      opacity="0.25"
                      fill="none"
                    />
                  </g>
                )}

                {/* ============================================================ */}
                {/* LAYER 3: STATEMENT OUTER WASTRA OERIP (Zero-Waste Cut) */}
                {/* ============================================================ */}
                {layerVisibility.OUTER && (
                  <g id="layer-outer-wastra" opacity={activeInspectedLayer && activeInspectedLayer !== 'OUTER' ? 0.6 : 1} className="transition-opacity duration-300">
                    
                    {drapeStyle === 'OPEN' ? (
                      /* STYLE 1: LOOSE OPEN KIMONO / ROBE / DUSTER */
                      <g>
                        {/* Outer Body Outline filled with real Wastra Photo Pattern */}
                        <path
                          d="M110 115 C125 94, 155 92, 170 92 C185 92, 215 94, 230 115 L245 235 L218 250 L228 395 C190 405, 150 405, 112 395 L122 250 L95 235 Z"
                          fill="url(#wastra-photo-pattern)"
                          stroke="#2A2420"
                          strokeWidth="1"
                        />
                        {/* Open Center Placket Reveal of Inner */}
                        <path
                          d="M152 93 L152 398 L160 399 L162 140 L178 140 L180 399 L188 398 L188 93 Z"
                          fill="none"
                          stroke="#1C1917"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                        {/* Drape Shadow Layer */}
                        <path
                          d="M110 115 C125 94, 155 92, 170 92 C185 92, 215 94, 230 115 L245 235 L218 250 L228 395 C190 405, 150 405, 112 395 L122 250 L95 235 Z"
                          fill="url(#outer-drape-shadow)"
                          opacity="0.45"
                        />
                        {/* Collar / Revers Trim (Tenun Border Accent) */}
                        <path
                          d="M150 93 L142 396 M190 93 L198 396"
                          stroke={getOuterPrimaryColor()}
                          strokeWidth="3.5"
                          opacity="0.9"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : drapeStyle === 'CINCHED' ? (
                      /* STYLE 2: CINCHED WITH SASH / WRAPPED KIMONO */
                      <g>
                        <path
                          d="M112 110 C130 94, 155 92, 170 92 C185 92, 210 94, 228 110 L242 220 L216 230 L195 235 L222 390 C185 402, 155 402, 118 390 L145 235 L124 230 L98 220 Z"
                          fill="url(#wastra-photo-pattern)"
                          stroke="#2A2420"
                          strokeWidth="1"
                        />
                        {/* Cross Front Wrap */}
                        <path
                          d="M142 95 L202 230 L138 230 L198 95"
                          fill="none"
                          stroke="#241E1A"
                          strokeWidth="1.5"
                          opacity="0.35"
                        />
                        <path
                          d="M112 110 C130 94, 155 92, 170 92 C185 92, 210 94, 228 110 L242 220 L216 230 L195 235 L222 390 C185 402, 155 402, 118 390 L145 235 L124 230 L98 220 Z"
                          fill="url(#outer-drape-shadow)"
                          opacity="0.4"
                        />
                      </g>
                    ) : (
                      /* STYLE 3: ASYMMETRIC SHOULDER DRAPE / SELENDANG MEWAH */
                      <g>
                        <path
                          d="M106 105 C130 92, 160 92, 175 95 L220 120 L235 240 L212 250 L220 395 C180 405, 145 400, 112 385 L120 245 L90 230 Z"
                          fill="url(#wastra-photo-pattern)"
                          stroke="#2A2420"
                          strokeWidth="1"
                        />
                        {/* Dynamic Asymmetrical Shoulder Swath */}
                        <path
                          d="M106 105 Q140 160 160 260 L210 230 Q170 140 175 95 Z"
                          fill={getOuterPrimaryColor()}
                          opacity="0.25"
                        />
                        <path
                          d="M106 105 C130 92, 160 92, 175 95 L220 120 L235 240 L212 250 L220 395 C180 405, 145 400, 112 385 L120 245 L90 230 Z"
                          fill="url(#outer-drape-shadow)"
                          opacity="0.4"
                        />
                      </g>
                    )}

                  </g>
                )}

                {/* ============================================================ */}
                {/* LAYER 4: SASH / OBI / BELT ACCENT */}
                {/* ============================================================ */}
                {layerVisibility.SASH && selectedSash.enabled && (
                  <g id="layer-sash-belt" opacity={activeInspectedLayer && activeInspectedLayer !== 'SASH' ? 0.6 : 1} className="transition-opacity duration-300">
                    <rect x="136" y="222" width="68" height="20" rx="3" fill="#963824" stroke="#4A190E" strokeWidth="1" />
                    {/* Obi Pattern Texture */}
                    <line x1="136" y1="232" x2="204" y2="232" stroke="#C89B53" strokeWidth="2" strokeDasharray="3,2" />
                    {/* Dangling Sash Ribbon Accent */}
                    <path d="M165 242 L160 310 L172 310 L175 242 Z" fill="#963824" opacity="0.9" />
                    <line x1="166" y1="242" x2="166" y2="310" stroke="#C89B53" strokeWidth="1" />
                  </g>
                )}

                {/* ============================================================ */}
                {/* LAYER 5: AUTHENTIC ETHNIC ACCESSORIES & JEWELRY */}
                {/* ============================================================ */}
                {layerVisibility.ACCESSORY && (
                  <g id="layer-accessories" opacity={activeInspectedLayer && activeInspectedLayer !== 'ACCESSORY' ? 0.6 : 1} className="transition-opacity duration-300">
                    
                    {selectedAccessory.category.toLowerCase().includes('kalung') || selectedAccessory.name.toLowerCase().includes('marapu') ? (
                      /* Kalung Etnik Tradisional / Marapu Choker */
                      <g>
                        <path
                          d="M152 102 C160 128, 180 128, 188 102"
                          fill="none"
                          stroke="url(#gold-jewelry-grad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Pendant Marapu / Pendant Disc */}
                        <circle cx="170" cy="126" r="6" fill="url(#gold-jewelry-grad)" stroke="#6E4D15" strokeWidth="1" />
                        <circle cx="170" cy="126" r="2.5" fill="#FAF7F2" />
                      </g>
                    ) : selectedAccessory.category.toLowerCase().includes('bros') || selectedAccessory.name.toLowerCase().includes('mamuli') ? (
                      /* Bros Dada Antik / Mamuli Pin di Kerah Kiri */
                      <g>
                        {/* Mamuli Shaped Traditional Brooch on Left Lapel */}
                        <path
                          d="M140 135 C134 130, 134 142, 140 148 C146 142, 146 130, 140 135 Z"
                          fill="url(#gold-jewelry-grad)"
                          stroke="#6E4D15"
                          strokeWidth="1.2"
                        />
                        <circle cx="140" cy="139" r="1.5" fill="#FFFFFF" />
                      </g>
                    ) : selectedAccessory.category.toLowerCase().includes('anting') ? (
                      /* Anting Etnik di Telinga */
                      <g>
                        <circle cx="152" cy="65" r="2" fill="url(#gold-jewelry-grad)" />
                        <circle cx="188" cy="65" r="2" fill="url(#gold-jewelry-grad)" />
                        <line x1="152" y1="67" x2="152" y2="76" stroke="url(#gold-jewelry-grad)" strokeWidth="1.5" />
                        <line x1="188" y1="67" x2="188" y2="76" stroke="url(#gold-jewelry-grad)" strokeWidth="1.5" />
                        <circle cx="152" cy="77" r="3" fill="url(#gold-jewelry-grad)" />
                        <circle cx="188" cy="77" r="3" fill="url(#gold-jewelry-grad)" />
                      </g>
                    ) : (
                      /* Gelang / Sabuk Accent */
                      <g>
                        <ellipse cx="140" cy="135" rx="5" ry="5" fill="url(#gold-jewelry-grad)" />
                      </g>
                    )}

                  </g>
                )}

              </svg>

              {/* Live Hover Inspection Badge */}
              {activeInspectedLayer && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1C1917]/90 text-[#FAF7F2] text-[10px] font-mono tracking-wide backdrop-blur-xs flex items-center gap-1.5 shadow-lg border border-white/10 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C89B53]" />
                  <span>Fokus: {layersList.find(l => l.key === activeInspectedLayer)?.title}</span>
                </div>
              )}

            </div>

            {/* Quick Drape / Reset Floating Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setLayerVisibility({
                    ACCESSORY: true,
                    SASH: true,
                    OUTER: true,
                    BOTTOM: true,
                    INNER: true,
                    MANNEQUIN: true
                  });
                  setActiveInspectedLayer(null);
                }}
                className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#1C1917] shadow-xs border border-[#E7E0D6] transition-all cursor-pointer"
                title="Tampilkan Semua Layer"
              >
                <RotateCcw size={13} />
              </button>
            </div>

          </div>

          {/* Mannequin Tone Palette Selector */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#78716C]">
            <span className="text-[10px] uppercase font-bold">Warna Kulit:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMannequinTone('SAND')}
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${mannequinTone === 'SAND' ? 'ring-2 ring-[#963824] scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: '#E8E1D5' }}
                title="Warm Sand"
              />
              <button
                onClick={() => setMannequinTone('OCHRE')}
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${mannequinTone === 'OCHRE' ? 'ring-2 ring-[#963824] scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: '#D5C4AC' }}
                title="Golden Ochre"
              />
              <button
                onClick={() => setMannequinTone('TERRA')}
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${mannequinTone === 'TERRA' ? 'ring-2 ring-[#963824] scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: '#C29B88' }}
                title="Warm Terracotta"
              />
              <button
                onClick={() => setMannequinTone('CHARCOAL')}
                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${mannequinTone === 'CHARCOAL' ? 'ring-2 ring-[#963824] scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: '#38332E' }}
                title="Minimalist Charcoal"
              />
            </div>
          </div>

        </div>

        {/* Right: Layer Stack Manager & Customizer (5 cols in expanded, 5 cols standard) */}
        <div className={`${isExpandedView ? 'lg:col-span-5' : 'md:col-span-5'} space-y-4`}>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
              <Layers size={14} className="text-[#963824]" />
              <span>Hierarki Tumpukan Layer ({layersList.filter(l => layerVisibility[l.key]).length}/6 Aktif)</span>
            </span>
          </div>

          {/* Layer Cards Stack */}
          <div className="space-y-2">
            {layersList.map((layer) => {
              const isVisible = layerVisibility[layer.key];
              const isInspected = activeInspectedLayer === layer.key;

              return (
                <div
                  key={layer.key}
                  onMouseEnter={() => setActiveInspectedLayer(layer.key)}
                  onMouseLeave={() => setActiveInspectedLayer(null)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isInspected 
                      ? 'bg-[#FAF7F2] border-[#963824] shadow-xs' 
                      : isVisible 
                        ? 'bg-[#FFFFFF] border-[#E7E0D6] hover:border-[#D5CABE]' 
                        : 'bg-[#F9F7F5] border-[#ECE6DE] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Layer Color swatch / indicator */}
                    <div 
                      className="w-3.5 h-8 rounded-md shrink-0 border border-black/10"
                      style={{ backgroundColor: layer.colorHex }}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#78716C] block truncate">
                          {layer.title}
                        </span>
                      </div>
                      <div className="text-xs font-serif font-bold text-[#1C1917] truncate">
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-[#57534E] truncate">
                        {layer.sub}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Eye Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleLayer(layer.key)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isVisible 
                          ? 'bg-[#F3EEE4] hover:bg-[#EAE2D5] text-[#1C1917] border-[#D4C9BC]' 
                          : 'bg-[#E7E0D6] text-[#78716C] border-[#D5CABE]'
                      }`}
                      title={isVisible ? 'Sembunyikan Layer' : 'Tampilkan Layer'}
                    >
                      {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inner Top Preset Quick Switcher */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider block">
              Ganti Warna Inner Atasan (Base):
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => setSelectedInnerTop({
                  name: 'Kemben & Inner Katun Mentah',
                  color: '#FAF7F2',
                  colorName: 'Broken White Natural',
                  neckline: 'SCOOP'
                })}
                className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                  selectedInnerTop.color === '#FAF7F2' ? 'bg-[#FFFFFF] border-[#963824] font-bold text-[#963824]' : 'bg-[#FFFFFF]/70 border-[#E7E0D6] text-[#57534E]'
                }`}
              >
                Broken White
              </button>
              <button
                onClick={() => setSelectedInnerTop({
                  name: 'Turtleneck Sutra Hitam',
                  color: '#1F1E1D',
                  colorName: 'Charcoal Black',
                  neckline: 'TURTLENECK'
                })}
                className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                  selectedInnerTop.color === '#1F1E1D' ? 'bg-[#FFFFFF] border-[#963824] font-bold text-[#963824]' : 'bg-[#FFFFFF]/70 border-[#E7E0D6] text-[#57534E]'
                }`}
              >
                Charcoal Black
              </button>
              <button
                onClick={() => setSelectedInnerTop({
                  name: 'Tunic Linen Terakota',
                  color: '#8C3B2B',
                  colorName: 'Terracotta Earth',
                  neckline: 'V_NECK'
                })}
                className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                  selectedInnerTop.color === '#8C3B2B' ? 'bg-[#FFFFFF] border-[#963824] font-bold text-[#963824]' : 'bg-[#FFFFFF]/70 border-[#E7E0D6] text-[#57534E]'
                }`}
              >
                Terracotta
              </button>
              <button
                onClick={() => setSelectedInnerTop({
                  name: 'Camisole Sutra Nila Indigo',
                  color: '#1B2A3D',
                  colorName: 'Indigo Nila',
                  neckline: 'V_NECK'
                })}
                className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                  selectedInnerTop.color === '#1B2A3D' ? 'bg-[#FFFFFF] border-[#963824] font-bold text-[#963824]' : 'bg-[#FFFFFF]/70 border-[#E7E0D6] text-[#57534E]'
                }`}
              >
                Indigo Nila
              </button>
            </div>
          </div>

          {/* Zero-Waste Layering Insight */}
          <div className="p-3 rounded-xl bg-[#F3EEE4] border border-[#D5CABE] flex items-start gap-2 text-xs">
            <ShieldCheck size={15} className="text-[#1E3A2B] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#57534E] leading-relaxed">
              <strong className="text-[#1C1917] font-serif">Karakter Potongan Zero-Waste:</strong> Outer <em>{selectedOuter.product_name}</em> memiliki siluet {selectedOuter.silhouette.toLowerCase()} yang jatuh natural tanpa menggelembung ketika ditumpuk di atas inner katun mentah atau celana tenun.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
