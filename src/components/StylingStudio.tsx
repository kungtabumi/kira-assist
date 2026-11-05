import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  ShieldCheck, 
  MessageSquare, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Info, 
  Sliders, 
  Palette, 
  Lightbulb, 
  Gem, 
  BookmarkCheck, 
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ExternalLink,
  Shirt
} from 'lucide-react';
import { OERIP_PRODUCTS, OERIP_WASTRA_DATABASE } from '../data/oeripKnowledgeBase';
import { ProductItem } from '../types';
import { KiraQuickTipsOverlay } from './KiraQuickTipsOverlay';
import { VirtualMannequinLayering } from './VirtualMannequinLayering';
import { useToast } from '../context/ToastContext';

interface StylingStudioProps {
  onConsultLook?: (lookDescription: string) => void;
}

// ----------------------------------------------------------------------
// DATA: OCCASIONS & EVENT CONTEXTS
// ----------------------------------------------------------------------
export const OCCASIONS = [
  { id: 'ALL', name: 'Semua Suasana Acara', formality: 'Eksplorasi Bebas Koleksi Oerip', filterKeys: ['all'] },
  { id: 'DIPLOMACY', name: 'Diplomasi Budaya & Jamuan Kenegaraan', formality: 'Formal Etnik Luwes & Wibawa', filterKeys: ['diplomasi', 'resmi', 'kebudayaan', 'kenegaraan', 'bilateral'] },
  { id: 'WEDDING', name: 'Resepsi Pernikahan & Upacara Adat', formality: 'Agung, Sakral & Memikat', filterKeys: ['resepsi', 'pernikahan', 'upacara', 'gala', 'sakral', 'adat'] },
  { id: 'ART_EXHIBIT', name: 'Pameran Seni & Festival Kreatif', formality: 'Bohemian Artsy & Statement', filterKeys: ['art', 'seni', 'festival', 'pameran', 'kreatif', 'workshop'] },
  { id: 'EXECUTIVE', name: 'Pertemuan Eksekutif & Forum Bisnis', formality: 'Smart-Cultural Casual', filterKeys: ['kantor', 'smart-casual', 'b2b', 'eksekutif', 'bisnis', 'pidato'] },
  { id: 'CASUAL_CHIC', name: 'Daily Living Heritage & Traveling', formality: 'Kasual Bersahaja & Nyaman', filterKeys: ['kasual', 'casual', 'travel', 'traveling', 'daily', 'harian', 'informal', 'komunitas'] }
];

// ----------------------------------------------------------------------
// DATA: CULTURAL PERSONA ALIGNMENT
// ----------------------------------------------------------------------
export const PERSONA_TAGS = [
  { id: 'ALL', label: 'Semua Persona', icon: Compass },
  { id: 'SOVEREIGN', label: 'The Sovereign (Wibawa Kepemimpinan)', icon: Sparkles },
  { id: 'GROUNDER', label: 'The Grounder (Ketabahan Bumi & Alam)', icon: Layers },
  { id: 'GUARDIAN', label: 'The Guardian (Pelindung Adat & Doa)', icon: ShieldCheck },
  { id: 'NOMAD', label: 'The Nomad (Penjelajah Merdeka)', icon: Compass },
  { id: 'LUMINARY', label: 'The Luminary (Pencerah Kontemporer)', icon: Lightbulb },
  { id: 'DIPLOMAT', label: 'The Cultural Diplomat (Duta Luhur)', icon: Gem }
];

// Mapping product resonance to cultural personas
export const PRODUCT_PERSONA_MAP: Record<string, { persona: string; title: string; resonance: string }> = {
  'OERIP-OUT-001': {
    persona: 'SOVEREIGN',
    title: 'The Sovereign & Diplomat',
    resonance: 'Perpaduan agung Tenun Sumba dan Gedog Tuban mencerminkan kemandirian jiwa dan kharisma kepemimpinan Nusantara.'
  },
  'OERIP-KIM-002': {
    persona: 'SOVEREIGN',
    title: 'The Sovereign & Guardian',
    resonance: 'Motif Kuda (Njara) dan Pohon Hayat Sumba Timur memancarkan wibawa ksatria dan perlindungan spiritual.'
  },
  'OERIP-LUR-003': {
    persona: 'GROUNDER',
    title: 'The Grounder & Luminary',
    resonance: 'Garis lurik prasojo Klaten mengajarkan kesahajaan hidup ("lurus ing lakon") yang dinamis untuk mobilitas urban.'
  },
  'OERIP-ULO-004': {
    persona: 'GUARDIAN',
    title: 'The Guardian & Diplomat',
    resonance: 'Kain Ulos Ragidup Batak melambangkan doa restu leluhur dan ketegasan sikap dalam forum formal kenegaraan.'
  },
  'OERIP-CAP-005': {
    persona: 'NOMAD',
    title: 'The Nomad & Healer',
    resonance: 'Potongan asimetris zero-waste tanpa potong kain memberi ruang gerak merdeka bagi jiwa penjelajah.'
  },
  'OERIP-DRS-006': {
    persona: 'SOVEREIGN',
    title: 'The Sovereign & Luminary',
    resonance: 'Motif Pa\'teddong Toraja menghadirkan keanggunan siluet maxi dress yang sarat doa kemakmuran dan kerukunan.'
  },
  'OERIP-PON-007': {
    persona: 'NOMAD',
    title: 'The Nomad & Guardian',
    resonance: 'Pola tenun Mata Bolo Flores yang reversible memberi kehangatan dan perlindungan batin dalam perjalanan melintasi alam dan cuaca dingin.'
  },
  'OERIP-VES-008': {
    persona: 'LUMINARY',
    title: 'The Luminary & Grounder',
    resonance: 'Rompi sleeveless minimalis beraksen Tenun Sumba dan Lurik Klaten, sangat fleksibel untuk layering harian kaum urban yang dinamis dan bersahaja.'
  }
};

// ----------------------------------------------------------------------
// DATA: INNER & BOTTOM GARMENTS (EXPANDED & MODEST-FRIENDLY)
// ----------------------------------------------------------------------
export const INNER_BOTTOM_PIECES = [
  {
    id: 'BOT-01',
    name: 'Kulot Loose Linen Earth Sand',
    category: 'Celana & Kulot',
    material: 'Linen Premium 100% Unbleached',
    color: 'Sand / Krem Alami',
    drape: 'Fluid Loose Fit',
    vibe: 'Organik & Sejuk',
    pairing_notes: 'Memberikan dasar netral bersahaja yang menonjolkan keutuhan motif tenun outer tanpa berebut atensi.',
    hijab_friendly: true
  },
  {
    id: 'BOT-02',
    name: 'Kain Lilit Tenun Gedog Kerek',
    category: 'Kain Lilit & Rok',
    material: 'Katun Pintal Tangan Pewarna Indigo',
    color: 'Deep Indigo & Putih Kapas',
    drape: 'Struktur Tegas Berkarakter',
    vibe: 'Living Heritage Murni',
    pairing_notes: 'Menyajikan dialog tekstur utuh antara motif atasan dan ketukan kain Tuban tradisional.',
    hijab_friendly: true
  },
  {
    id: 'BOT-03',
    name: 'Straight Pants Katun Hitam Arang',
    category: 'Celana & Kulot',
    material: 'Katun Drill Halus Serat Alami',
    color: 'Charcoal Black',
    drape: 'Clean Tailored Line',
    vibe: 'Modern Executive Formal',
    pairing_notes: 'Mempertegas siluet formal untuk forum diplomasi, pidato resmi, dan pertemuan bisnis berwibawa.',
    hijab_friendly: true
  },
  {
    id: 'BOT-04',
    name: 'Inner Slip Dress Katun Mori Dingin',
    category: 'Inner & Modest Wear',
    material: 'Katun Mori Halus Tanpa Pemutih Kimia',
    color: 'Off-White / Broken White',
    drape: 'Maxi Flowing A-Line',
    vibe: 'Bohemian Elegance',
    pairing_notes: 'Sangat anggun dipadukan dengan Duster Robe panjang untuk pameran seni dan gala resepsi agung.',
    hijab_friendly: false
  },
  {
    id: 'BOT-05',
    name: 'Rok Plisket Katun Tenun Nila',
    category: 'Kain Lilit & Rok',
    material: 'Katun Halus Tenun ATBM Pewarna Alam',
    color: 'Deep Indigo Blue',
    drape: 'Pleated Flowing Motion',
    vibe: 'Anggun & Santun',
    pairing_notes: 'Jatuhnya lipatan plisket memberi kesan jenjang semampai dan sangat santun dipadukan dengan kimono Oerip.',
    hijab_friendly: true
  },
  {
    id: 'BOT-06',
    name: 'Tunic & Manset Katun Organik Hijab-Friendly',
    category: 'Inner & Modest Wear',
    material: 'Katun Bambu Sejuk Anti-Panas',
    color: 'Broken White Natural',
    drape: 'Comfort Modest Base',
    vibe: 'Modest Living Heritage',
    pairing_notes: 'Solusi ideal pemakai hijab: menyerap keringat, berkerah leher tinggi nyaman, dan menutupi lekuk tubuh.',
    hijab_friendly: true
  },
  {
    id: 'BOT-07',
    name: 'Celana Palazzo Tenun Soga Cokelat',
    category: 'Celana & Kulot',
    material: 'Katun Tenun ATBM Pewarna Kulit Kayu Tingi',
    color: 'Warm Terracotta / Soga',
    drape: 'Extra Wide Leg Drape',
    vibe: 'Bumi & Hangat',
    pairing_notes: 'Mengharmoniskan busana bernuansa tanah liat dan tenun Sumba motif Kuda untuk tampilan berkelas.',
    hijab_friendly: true
  }
];

// ----------------------------------------------------------------------
// DATA: AUTHENTIC ETHNIC ACCESSORIES (EXPANDED WITH REGIONAL PIECES)
// ----------------------------------------------------------------------
export const ACCESSORES_PIECES = [
  {
    id: 'ACC-01',
    name: 'Kalung Kuningan Antik Sumba (Mamuli Accent)',
    category: 'Kalung & Bros',
    region: 'Sumba Timur, NTT',
    material: 'Kuningan Cor Tradisional Tempa Tangan',
    symbolism: 'Simbol kesuburan, kemakmuran, dan martabat ksatria Marapu.',
    pairing_vibe: 'Statement Etnik Megah'
  },
  {
    id: 'ACC-02',
    name: 'Bros Antik Tatahan Daun Tembaga (Gedog Motif)',
    category: 'Kalung & Bros',
    region: 'Tuban, Jawa Timur',
    material: 'Tembaga Daur Ulang Pengrajin Logam Jawa',
    symbolism: 'Simbol pertumbuhan organik, kelenturan batin, dan harmoni alam.',
    pairing_vibe: 'Aksen Minimalis Halus'
  },
  {
    id: 'ACC-03',
    name: 'Tas Jinjing Anyam Lontar Flores',
    category: 'Tas & Pelengkap',
    region: 'Flores, NTT',
    material: 'Serat Daun Lontar Anyaman Mama Flores',
    symbolism: 'Ketangguhan dan kearifan ekologis perempuan pesisir.',
    pairing_vibe: 'Bohemian Kasual Berkelas'
  },
  {
    id: 'ACC-04',
    name: 'Scarf Selendang Sutra Tenun Daun Nila',
    category: 'Selendang & Obi',
    region: 'Klaten / Solo',
    material: 'Sutra Alam Liar & Pewarna Fermentasi Indigo',
    symbolism: 'Kesejukan jiwa dan kelembutan tutur kata santun.',
    pairing_vibe: 'Layering Diplomatik Hangat'
  },
  {
    id: 'ACC-05',
    name: 'Bros Perak Bakar Ragidup Batak',
    category: 'Kalung & Bros',
    region: 'Toba Samosir, Sumut',
    material: 'Perak Oksidasi Berukir Gorga Batak',
    symbolism: 'Perlindungan kehidupan dan doa restu para tetua adat.',
    pairing_vibe: 'Wibawa Aristokratik'
  },
  {
    id: 'ACC-06',
    name: 'Kalung Manik Kaba & Pa\'teddong Toraja',
    category: 'Kalung & Bros',
    region: 'Tana Toraja, Sulsel',
    material: 'Manik Kaca Kuno Berpadu Logam Tembaga',
    symbolism: 'Penghormatan pada etos kerja keras dan kemakmuran hidup.',
    pairing_vibe: 'Eksotisme Tradisi Sakral'
  },
  {
    id: 'ACC-07',
    name: 'Sabuk Obi Tenun Lurik Prasojo Klaten',
    category: 'Selendang & Obi',
    region: 'Klaten, Jawa Tengah',
    material: 'Tenun Garis Lurik Katun Kuat & Gesper Kayu Jati',
    symbolism: 'Pengikat tekad batin (pemberat hawa nafsu) dan kerapian postur.',
    pairing_vibe: 'Cinched Silhouette Accent'
  },
  {
    id: 'ACC-08',
    name: 'Bros Kerang Mutiara & Perak Doff Lombok',
    category: 'Kalung & Bros',
    region: 'Lombok, NTB',
    material: 'Kerang Mutiara Pesisir & Perak Bakar Halus',
    symbolism: 'Kemurnian batin dan keanggunan samudra kepulauan.',
    pairing_vibe: 'Kilau Lembut Bersahaja'
  }
];

export const StylingStudio: React.FC<StylingStudioProps> = ({ onConsultLook }) => {
  const toast = useToast();
  const [selectedOuter, setSelectedOuter] = useState<ProductItem>(OERIP_PRODUCTS[0]);
  const [selectedBottom, setSelectedBottom] = useState(INNER_BOTTOM_PIECES[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(ACCESSORES_PIECES[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[1]); // Default to Diplomacy
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CANVAS' | 'LAYERING_STUDIO' | 'FITTING_GUIDE'>('CANVAS');
  const [bottomCategoryFilter, setBottomCategoryFilter] = useState<string>('ALL');
  const [accessoryCategoryFilter, setAccessoryCategoryFilter] = useState<string>('ALL');
  const [onlyHijabFriendly, setOnlyHijabFriendly] = useState<boolean>(false);
  const [copiedLook, setCopiedLook] = useState(false);
  const [isQuickTipsOpen, setIsQuickTipsOpen] = useState(false);
  const [rightVisualType, setRightVisualType] = useState<'MANNEQUIN' | 'PHOTO'>('MANNEQUIN');
  const [isHarmonyExplanationOpen, setIsHarmonyExplanationOpen] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Filter products based on Occasion and Persona
  const filteredProducts = OERIP_PRODUCTS.filter((prod) => {
    // 1. Persona filter
    if (selectedPersonaFilter !== 'ALL') {
      const pInfo = PRODUCT_PERSONA_MAP[prod.product_id];
      if (!pInfo || pInfo.persona !== selectedPersonaFilter) {
        return false;
      }
    }

    // 2. Occasion filter
    if (selectedOccasion.id === 'ALL') return true;
    const keys = (selectedOccasion as any).filterKeys || [(selectedOccasion as any).filterKey || ''];
    return prod.occasion.some(pOcc => {
      const lower = pOcc.toLowerCase();
      return keys.some((k: string) => k && lower.includes(k));
    });
  });

  // Filter bottoms based on category and hijab-friendly toggle
  const filteredBottoms = INNER_BOTTOM_PIECES.filter(b => {
    if (onlyHijabFriendly && !b.hijab_friendly) return false;
    if (bottomCategoryFilter === 'ALL') return true;
    return b.category === bottomCategoryFilter;
  });

  // Filter accessories based on category
  const filteredAccessories = ACCESSORES_PIECES.filter(a => {
    if (accessoryCategoryFilter === 'ALL') return true;
    return a.category === accessoryCategoryFilter;
  });

  // Compute aesthetic harmony score dynamically
  const calculateHarmony = () => {
    let score = 94;
    const outerId = selectedOuter.product_id;
    const bottomId = selectedBottom.id;
    const accId = selectedAccessory.id;
    const occId = selectedOccasion.id;

    // Outer & Occasion alignment
    if (occId === 'DIPLOMACY' && (outerId === 'OERIP-OUT-001' || outerId === 'OERIP-ULO-004' || outerId === 'OERIP-CAP-005')) score += 3;
    if (occId === 'WEDDING' && (outerId === 'OERIP-KIM-002' || outerId === 'OERIP-DRS-006' || outerId === 'OERIP-ULO-004')) score += 3;
    if (occId === 'ART_EXHIBIT' && (outerId === 'OERIP-CAP-005' || outerId === 'OERIP-OUT-001' || outerId === 'OERIP-PON-007')) score += 3;
    if (occId === 'EXECUTIVE' && (outerId === 'OERIP-ULO-004' || outerId === 'OERIP-LUR-003' || outerId === 'OERIP-VES-008')) score += 3;
    if (occId === 'CASUAL_CHIC' && (outerId === 'OERIP-LUR-003' || outerId === 'OERIP-CAP-005' || outerId === 'OERIP-VES-008' || outerId === 'OERIP-PON-007')) score += 3;

    // Bottom synergy
    if (bottomId === 'BOT-01' || bottomId === 'BOT-03') score += 1; // Neutral baseline
    if (outerId === 'OERIP-OUT-001' && bottomId === 'BOT-02') score += 1; // Gedog dialog
    if (outerId === 'OERIP-KIM-002' && bottomId === 'BOT-04') score += 1; // Duster + slip dress
    if (outerId === 'OERIP-VES-008' && bottomId === 'BOT-01') score += 1; // Earth-tone vest + linen culotte
    if (outerId === 'OERIP-PON-007' && bottomId === 'BOT-03') score += 1; // Flores poncho + denim
    if (outerId === 'OERIP-DRS-006' && bottomId === 'BOT-04') score += 1; // Tunic dress + inner slip

    // Accessory synergy
    if (outerId.includes('KIM') && accId === 'ACC-01') score += 1; // Sumba + Mamuli
    if (outerId.includes('CAP') && accId === 'ACC-02') score += 1; // Tuban + Tembaga
    if (outerId.includes('PON') && accId === 'ACC-01') score += 1; // Flores + Mamuli
    if (outerId.includes('VES') && accId === 'ACC-02') score += 1; // Vest + Tembaga
    if (outerId.includes('DRS') && accId === 'ACC-02') score += 1; // Toraja Dress + Brass Accent

    return Math.min(score, 99);
  };

  const harmonyScore = calculateHarmony();

  const handleApplyAccessoryFromTips = (accInfo: {
    id: string;
    name: string;
    category: string;
    material: string;
    symbolism: string;
    pairing_vibe: string;
  }) => {
    const existing = ACCESSORES_PIECES.find(a => a.id === accInfo.id || a.name.includes(accInfo.name.split(' ')[0]));
    if (existing) {
      setSelectedAccessory(existing);
    } else {
      setSelectedAccessory({
        id: accInfo.id,
        name: accInfo.name,
        category: 'Aksesoris Khusus',
        region: selectedOuter.textile_origin,
        material: accInfo.material,
        symbolism: accInfo.symbolism,
        pairing_vibe: accInfo.pairing_vibe
      });
    }
  };

  const generateLookSummary = () => {
    const personaInfo = PRODUCT_PERSONA_MAP[selectedOuter.product_id];
    return (
      `Rangkuman Kurasi Gaya Oerip Indonesia:\n\n` +
      `• Statement Outer: ${selectedOuter.product_name}\n` +
      `  - Wastra: ${selectedOuter.textile} (${selectedOuter.textile_origin})\n` +
      `  - Siluet & Ukuran: ${selectedOuter.silhouette} (${selectedOuter.size})\n` +
      `• Padanan Bawahan: ${selectedBottom.name} (${selectedBottom.color} • ${selectedBottom.material})\n` +
      `• Aksesoris Etnik: ${selectedAccessory.name} (${selectedAccessory.material})\n` +
      `• Suasana Acara: ${selectedOccasion.name} (${selectedOccasion.formality})\n` +
      `• Resonansi Persona: ${personaInfo ? personaInfo.title : 'Nusantara Living Heritage'}\n` +
      `• Tingkat Keselarasan Budaya: ${harmonyScore}% Cultural Fit\n\n` +
      `Catatan Filosofis:\n"${selectedOuter.cultural_story.split('.')[0]}." Draping loose-fit menghormati keutuhan bentang kain tenun tangan tanpa potongan pola yang berlebihan.`
    );
  };

  const handleCopyLook = () => {
    navigator.clipboard.writeText(generateLookSummary());
    setCopiedLook(true);
    setTimeout(() => setCopiedLook(false), 2200);
    toast.success('Rangkuman paduan busana berhasil disalin ke papan klip.', {
      title: 'Tersalin'
    });
  };

  const handleToggleFavorite = () => {
    const lookId = `${selectedOuter.product_id}-${selectedBottom.id}-${selectedAccessory.id}`;
    if (savedFavorites.includes(lookId)) {
      setSavedFavorites(prev => prev.filter(id => id !== lookId));
      setIsFavorite(false);
      toast.info('Paduan busana dihapus dari daftar favorit.', {
        title: 'Favorit Dihapus'
      });
    } else {
      setSavedFavorites(prev => [...prev, lookId]);
      setIsFavorite(true);
      toast.success(`Paduan busana ${selectedOuter.product_name} disimpan ke favorit!`, {
        title: 'Favorit Disimpan'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D6] mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#963824] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#D4C9BC]">
            <Sparkles size={13} className="text-[#C89B53]" />
            <span>Interactive Styling Studio • Zero-Waste Wastra</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
            Rekomendasi Gaya & Padu-Padan Busana
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-2 max-w-2xl leading-relaxed">
            Kurasi perpaduan luaran tenun tangan Oerip Indonesia, bawahan berbahan serat alami, dan aksesoris etnik otentik. Temukan keselarasan rasa, siluet minim potong, dan kepatuhan kode adat untuk setiap suasana.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsQuickTipsOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#963824] border border-[#D4C9BC] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer group"
          >
            <Lightbulb size={14} className="text-[#C89B53] group-hover:scale-110 transition-transform" />
            <span>Tips Aksesoris Daerah</span>
          </button>

          <div className="flex items-center gap-1 bg-[#FFFFFF] p-1.5 rounded-full border border-[#D4C9BC] shadow-xs">
            <button
              onClick={() => setViewMode('CANVAS')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'CANVAS'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Sliders size={13} />
              <span>Padu-Padan Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('LAYERING_STUDIO')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'LAYERING_STUDIO'
                  ? 'bg-[#963824] text-[#FAF7F2] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#963824]'
              }`}
            >
              <Layers size={13} />
              <span>Studio Manekin 3D</span>
            </button>
            <button
              onClick={() => setViewMode('FITTING_GUIDE')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'FITTING_GUIDE'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Info size={13} />
              <span>Panduan Siluet & Hijab</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE STYLING CANVAS */}
      {/* ========================================================================= */}
      {viewMode === 'CANVAS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Selection Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Occasion & Cultural Persona Selection */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-[#FAF7F2] text-[10px] flex items-center justify-center font-mono">1</span>
                  Tujuan Acara & Panduan Persona
                </span>
                <span className="text-[11px] text-[#963824] font-medium font-serif italic">
                  {selectedOccasion.formality}
                </span>
              </div>

              {/* Occasion Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedOccasion.id === occ.id
                        ? 'bg-[#FAF7F2] border-[#1C1917] text-[#1C1917] font-semibold ring-1 ring-[#1C1917]/10'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs text-[#1C1917] line-clamp-1">{occ.name}</div>
                    <div className="text-[10px] text-[#78716C] truncate mt-0.5">{occ.formality}</div>
                  </button>
                ))}
              </div>

              {/* Cultural Persona Filter Bar (Synergy with Persona Budaya) */}
              <div className="pt-2 border-t border-[#E7E0D6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1">
                    <Compass size={11} className="text-[#963824]" />
                    <span>Filter Sesuai Persona Budaya:</span>
                  </span>
                  {selectedPersonaFilter !== 'ALL' && (
                    <button
                      onClick={() => setSelectedPersonaFilter('ALL')}
                      className="text-[10px] text-[#963824] hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {PERSONA_TAGS.map(pt => {
                    const isSelected = selectedPersonaFilter === pt.id;
                    return (
                      <button
                        key={pt.id}
                        onClick={() => setSelectedPersonaFilter(pt.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#963824] text-[#FAF7F2] border-[#963824] font-medium shadow-2xs'
                            : 'bg-[#FAF7F2] text-[#57534E] border-[#E7E0D6] hover:bg-[#F3EEE4]'
                        }`}
                      >
                        {pt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Statement Outer Selection */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-[#FAF7F2] text-[10px] flex items-center justify-center font-mono">2</span>
                  <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                    Pilih Statement Outer Oerip
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    ({filteredProducts.length} Koleksi Sesuai)
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsQuickTipsOpen(true)}
                    className="text-[11px] text-[#963824] hover:text-[#1C1917] bg-[#F3EEE4] hover:bg-[#EBE3D5] px-2.5 py-0.5 rounded-full border border-[#D4C9BC] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Lightbulb size={12} className="text-[#C89B53]" />
                    <span>Tips Aksesoris {selectedOuter.textile_origin.split(',')[0]}</span>
                  </button>
                </div>
              </div>

              {/* Outer Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedOuter.product_id === prod.product_id;
                  const personaMatch = PRODUCT_PERSONA_MAP[prod.product_id];
                  const matchesCurrentOccasion = selectedOccasion.id !== 'ALL' && 
                    prod.occasion.some(o => {
                      const lower = o.toLowerCase();
                      const keys = (selectedOccasion as any).filterKeys || [(selectedOccasion as any).filterKey || ''];
                      return keys.some((k: string) => k && lower.includes(k));
                    });

                  return (
                    <div
                      key={prod.product_id}
                      onClick={() => setSelectedOuter(prod)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#1C1917] ring-2 ring-[#1C1917]/10 shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E7E0D6] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F2] border border-[#E7E0D6] relative">
                          <img 
                            src={prod.image} 
                            alt={prod.product_name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = 'true';
                                target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-[#78716C] uppercase">{prod.product_id}</span>
                            {matchesCurrentOccasion && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                Sangat Cocok
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-xs text-[#1C1917] truncate mt-0.5">{prod.product_name}</h4>
                          <p className="text-[10px] text-[#963824] mt-0.5 line-clamp-1">{prod.textile}</p>
                          <div className="text-[10px] text-[#57534E] font-medium mt-1">{prod.price_range}</div>
                        </div>
                      </div>

                      {/* Persona and Silhouette Badges */}
                      <div className="mt-2.5 pt-2 border-t border-[#E7E0D6]/70 flex items-center justify-between text-[9px] text-[#78716C]">
                        <span className="truncate max-w-[140px] text-[#963824] font-medium">
                          {personaMatch ? personaMatch.title : 'Heritage Universal'}
                        </span>
                        <span className="truncate max-w-[120px] text-right">
                          {prod.silhouette.split(' ')[0]} {prod.silhouette.split(' ')[1] || ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] text-center space-y-2">
                  <p className="text-xs text-[#57534E]">
                    Tidak ada koleksi yang cocok persis dengan kombinasi filter saat ini.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedOccasion(OCCASIONS[0]);
                      setSelectedPersonaFilter('ALL');
                    }}
                    className="px-3 py-1 rounded-full bg-[#1C1917] text-[#FAF7F2] text-xs font-medium cursor-pointer"
                  >
                    Tampilkan Semua Koleksi
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Inner & Bottom Piece Selection */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-[#FAF7F2] text-[10px] flex items-center justify-center font-mono">3</span>
                  Padanan Bawahan / Inner
                </span>
                
                {/* Modest / Hijab Friendly Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOnlyHijabFriendly(!onlyHijabFriendly)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-1 ${
                      onlyHijabFriendly
                        ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
                        : 'bg-[#FAF7F2] text-[#57534E] border-[#D4C9BC] hover:bg-[#F3EEE4]'
                    }`}
                  >
                    <span>Hijab & Modest Only</span>
                    {onlyHijabFriendly && <Check size={11} />}
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['ALL', 'Celana & Kulot', 'Kain Lilit & Rok', 'Inner & Modest Wear'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBottomCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      bottomCategoryFilter === cat
                        ? 'bg-[#1C1917] text-[#FAF7F2]'
                        : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Bawahan' : cat}
                  </button>
                ))}
              </div>

              {/* Bottoms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredBottoms.map((piece) => (
                  <button
                    key={piece.id}
                    onClick={() => setSelectedBottom(piece)}
                    className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedBottom.id === piece.id
                        ? 'bg-[#FAF7F2] border-[#1C1917] text-[#1C1917] font-medium ring-1 ring-[#1C1917]/10 shadow-2xs'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-[#1C1917]">{piece.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#57534E] border border-[#E7E0D6]">{piece.category}</span>
                    </div>
                    <p className="text-[10px] text-[#78716C] mt-1">{piece.material} • {piece.color}</p>
                    {piece.hijab_friendly && (
                      <div className="text-[9px] text-[#1E3A2B] mt-1 font-medium flex items-center gap-1">
                        <Check size={10} /> Santun & Hijab Friendly
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Authentic Ethnic Accessories */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-[#FAF7F2] text-[10px] flex items-center justify-center font-mono">4</span>
                  Aksesoris Etnik Tradisional
                </span>
                
                {/* Category Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['ALL', 'Kalung & Bros', 'Selendang & Obi', 'Tas & Pelengkap'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAccessoryCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                        accessoryCategoryFilter === cat
                          ? 'bg-[#1C1917] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {cat === 'ALL' ? 'Semua Aksesoris' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredAccessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccessory(acc)}
                    className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedAccessory.id === acc.id
                        ? 'bg-[#FAF7F2] border-[#1C1917] text-[#1C1917] font-medium ring-1 ring-[#1C1917]/10 shadow-2xs'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-serif font-bold text-xs text-[#1C1917] line-clamp-1">{acc.name}</div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF7F2] text-[#78716C] border border-[#E7E0D6] shrink-0">
                        {acc.region ? acc.region.split(',')[0] : acc.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#78716C] mt-0.5">{acc.material}</p>
                    <p className="text-[9px] text-[#963824] italic mt-1 line-clamp-1">{acc.symbolism}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Styling Visualizer & Cultural Harmony Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* The Curated Look Board */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs sticky top-24 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider">Curated Look</span>
                  <h3 className="font-serif font-bold text-lg text-[#1C1917]">Harmoni Busana Jiwa</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-50 border-rose-300 text-rose-600' 
                        : 'bg-[#FAF7F2] border-[#D4C9BC] text-[#78716C] hover:text-[#1C1917]'
                    }`}
                    title={isFavorite ? 'Tersimpan di Paduan Favorit' : 'Simpan ke Favorit'}
                  >
                    <Heart size={14} className={isFavorite ? 'fill-rose-600' : ''} />
                  </button>
                  <button
                    onClick={() => setIsHarmonyExplanationOpen(!isHarmonyExplanationOpen)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3EEE4] text-[#1E3A2B] border border-[#D4C9BC] text-xs font-semibold hover:bg-[#EBE3D5] cursor-pointer transition-colors"
                    title="Klik untuk melihat rincian kalkulasi keselarasan budaya"
                  >
                    <ShieldCheck size={13} /> {harmonyScore}% Cultural Fit
                  </button>
                </div>
              </div>

              {/* Expandable Cultural Harmony Score Rationale */}
              {isHarmonyExplanationOpen && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4C9BC] text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-serif text-[#1C1917]">Rincian Skor Harmoni {harmonyScore}%:</strong>
                    <span className="text-[10px] text-[#963824] font-semibold">Oerip Quality Benchmark</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#57534E]">
                    <div className="p-2 rounded bg-white border border-[#E7E0D6]">
                      <span className="text-[10px] text-[#78716C] block">Keaslian Wastra:</span>
                      <strong className="text-emerald-700">100% Tenun Asli</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E7E0D6]">
                      <span className="text-[10px] text-[#78716C] block">Palet Warna Alami:</span>
                      <strong className="text-emerald-700">Resonansi Bumi</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E7E0D6]">
                      <span className="text-[10px] text-[#78716C] block">Siluet Zero-Waste:</span>
                      <strong className="text-emerald-700">Minim Potong</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#E7E0D6]">
                      <span className="text-[10px] text-[#78716C] block">Kepatuhan Acara:</span>
                      <strong className="text-emerald-700">Tepat Konteks</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#78716C] italic leading-tight">
                    *Kombinasi dinilai berdasarkan keterhubungan serat katun mentah, pewarnaan alam tanpa pigmen kimia sintetis, dan rasa hormat pada motif adat.
                  </p>
                </div>
              )}

              {/* Visual Mode Selector: Manekin Layering vs Foto Katalog */}
              <div className="flex items-center justify-between p-1 bg-[#FAF7F2] rounded-xl border border-[#E7E0D6] text-xs">
                <button
                  onClick={() => setRightVisualType('MANNEQUIN')}
                  className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    rightVisualType === 'MANNEQUIN'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs font-semibold'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Layers size={13} />
                  <span>Manekin Layering</span>
                </button>
                <button
                  onClick={() => setRightVisualType('PHOTO')}
                  className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    rightVisualType === 'PHOTO'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs font-semibold'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Palette size={13} />
                  <span>Foto Katalog Wastra</span>
                </button>
              </div>

              {/* Visual Composition Showcase: Layered Mannequin or Photo */}
              {rightVisualType === 'MANNEQUIN' ? (
                <div className="space-y-3">
                  <VirtualMannequinLayering
                    selectedOuter={selectedOuter}
                    selectedBottom={selectedBottom}
                    selectedAccessory={selectedAccessory}
                    onConsultLook={onConsultLook}
                    isExpandedView={false}
                    onToggleExpand={() => setViewMode('LAYERING_STUDIO')}
                  />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E7E0D6] p-4 text-center">
                  <div className="aspect-3/4 max-w-[260px] mx-auto rounded-lg overflow-hidden shadow-xs border border-[#E7E0D6] mb-3">
                    <img 
                      src={selectedOuter.image} 
                      alt={selectedOuter.product_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                        }
                      }}
                    />
                  </div>
                  <div className="font-serif font-bold text-base text-[#1C1917]">
                    {selectedOuter.product_name}
                  </div>
                  <div className="text-xs text-[#963824] font-medium">
                    {selectedOuter.textile} ({selectedOuter.textile_origin})
                  </div>
                  <div className="text-[11px] text-[#57534E] mt-1 font-mono">
                    {selectedOuter.price_range}
                  </div>
                </div>
              )}

              {/* Mix Details Summary Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between py-1.5 border-b border-[#FAF7F2]">
                  <span className="text-[#78716C] w-28 shrink-0">Bawahan / Inner:</span>
                  <span className="text-[#1C1917] font-medium text-right">{selectedBottom.name}</span>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-[#FAF7F2]">
                  <span className="text-[#78716C] w-28 shrink-0">Aksesoris:</span>
                  <span className="text-[#1C1917] font-medium text-right">{selectedAccessory.name}</span>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-[#FAF7F2]">
                  <span className="text-[#78716C] w-28 shrink-0">Nuansa Warna:</span>
                  <span className="text-[#963824] font-serif italic text-right">
                    {selectedOuter.colors.slice(0, 2).join(' • ')} + {selectedBottom.color.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Cultural Aesthetic Analysis */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#1C1917] font-bold font-serif">
                  <Palette size={14} className="text-[#963824]" />
                  <span>Analisis Kurasi Oerip:</span>
                </div>
                <p className="text-[#57534E] leading-relaxed text-[11px]">
                  {selectedBottom.pairing_notes} Aksen {selectedAccessory.category.toLowerCase()} memberikan sentuhan wibawa yang seimbang tanpa mendominasi motif sakral tenun tangan.
                </p>
                <div className="text-[10px] text-[#78716C] pt-1 border-t border-[#E7E0D6]">
                  <strong>Siluet:</strong> {selectedOuter.silhouette} ({selectedOuter.size})
                </div>
              </div>

              {/* Quick Tips Regional Accent Suggestion Banner */}
              <div className="p-3.5 rounded-xl bg-[#F3EEE4] border border-[#D5CABE] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#963824] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs">
                    <Lightbulb size={15} className="text-[#C89B53]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#963824] tracking-wider block">KIRA Quick Tips</span>
                    <span className="text-[11px] text-[#1C1917] font-serif font-bold line-clamp-1">
                      Aksesoris Selaras {selectedOuter.textile_origin.split(',')[0]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsQuickTipsOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#332E29] text-[#FAF7F2] text-[11px] font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Buka Tips
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {onConsultLook && (
                  <button
                    onClick={() => onConsultLook(generateLookSummary())}
                    className="w-full py-3 rounded-full bg-[#1C1917] hover:bg-[#2D2A26] text-[#FAF7F2] text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[#C89B53]" />
                    <span>Konsultasikan Paduan Ini ke KIRA AI</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLook}
                    className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#1C1917] text-xs font-medium flex items-center justify-center gap-1.5 border border-[#D4C9BC] transition-colors cursor-pointer"
                  >
                    {copiedLook ? <Check size={14} className="text-emerald-700" /> : <RotateCcw size={14} />}
                    <span>{copiedLook ? 'Rangkuman Tersalin!' : 'Salin Detail Paduan'}</span>
                  </button>

                  <a
                    href={`https://wa.me/6285174485581?text=${encodeURIComponent(
                      `Halo Tim Kurasi Oerip Indonesia, saya tertarik dengan paduan busana hasil Rekomendasi Gaya KIRA:\n\n${generateLookSummary()}\n\nMohon informasi ketersediaan pieces eksklusif ini.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#1E3A2B] hover:bg-[#254634] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                    title="Konsultasi WhatsApp Admin Kurasi Oerip"
                  >
                    <MessageSquare size={14} />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : viewMode === 'LAYERING_STUDIO' ? (
        /* ========================================================================= */
        /* MODE 2: DEDICATED FULLSCREEN VIRTUAL MANNEQUIN LAYERING STUDIO */
        /* ========================================================================= */
        <div className="space-y-8">
          
          {/* Studio Description & Mode Banner */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#963824] text-xs font-semibold uppercase tracking-wider border border-[#D4C9BC]">
                <Layers size={13} className="text-[#C89B53]" />
                <span>Zero-Waste Virtual Layering Simulation</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Studio Visualisasi Layering Busana & Wastra
              </h2>
              <p className="text-xs text-[#57534E] max-w-2xl leading-relaxed">
                Eksperimenkan tumpukan busana wastra Oerip di atas manekin virtual interaktif. Atur figur manekin (wanita/pria/atelier), visibilitas lapisan (inner, bawahan, outer tenun, obi, dan aksesoris), serta gaya draping untuk melihat efek jatuhnya kain asli.
              </p>
            </div>

            {/* Quick Actions in Studio Mode */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setViewMode('CANVAS')}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#1C1917] border border-[#D4C9BC] transition-all cursor-pointer"
              >
                ← Kembali ke Canvas
              </button>
              {onConsultLook && (
                <button
                  onClick={() => onConsultLook(generateLookSummary())}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#963824] hover:bg-[#802F1E] text-[#FAF7F2] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C89B53]" />
                  <span>Konsultasi Look Ini</span>
                </button>
              )}
            </div>
          </div>

          {/* Expanded Virtual Mannequin Layering Canvas */}
          <VirtualMannequinLayering
            selectedOuter={selectedOuter}
            selectedBottom={selectedBottom}
            selectedAccessory={selectedAccessory}
            onConsultLook={onConsultLook}
            isExpandedView={true}
            onToggleExpand={() => setViewMode('CANVAS')}
          />

          {/* In-Studio Quick Pickers for Statement Outer, Bottom & Accessory */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Outer Picker */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Ganti Outer Tenun Oerip
                </h4>
                <span className="text-[10px] text-[#963824] font-semibold">{OERIP_PRODUCTS.length} Varian</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {OERIP_PRODUCTS.map((prod) => (
                  <button
                    key={prod.product_id}
                    onClick={() => setSelectedOuter(prod)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedOuter.product_id === prod.product_id
                        ? 'bg-[#FAF7F2] border-[#963824] ring-2 ring-[#963824]/20 shadow-2xs'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] hover:border-[#D5CABE]'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#FAF7F2] border border-[#E7E0D6]">
                      <img 
                        src={prod.image} 
                        alt={prod.product_name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                          }
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-[11px] text-[#1C1917] line-clamp-1">{prod.product_name}</div>
                      <div className="text-[9px] text-[#963824] truncate">{prod.textile.split(' ')[0]} {prod.textile.split(' ')[1] || ''}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Bottom Picker */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Ganti Bawahan / Inner
                </h4>
                <span className="text-[10px] text-[#963824] font-semibold">{INNER_BOTTOM_PIECES.length} Opsi</span>
              </div>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {INNER_BOTTOM_PIECES.map((piece) => (
                  <button
                    key={piece.id}
                    onClick={() => setSelectedBottom(piece)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedBottom.id === piece.id
                        ? 'bg-[#FAF7F2] border-[#963824] font-medium ring-1 ring-[#963824]/20'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs text-[#1C1917] truncate">{piece.name}</div>
                    <div className="text-[10px] text-[#78716C] truncate">{piece.color} • {piece.material}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Accessory Picker */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Ganti Aksesoris Tradisional
                </h4>
                <span className="text-[10px] text-[#963824] font-semibold">{ACCESSORES_PIECES.length} Pilihan</span>
              </div>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {ACCESSORES_PIECES.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccessory(acc)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedAccessory.id === acc.id
                        ? 'bg-[#FAF7F2] border-[#963824] font-medium ring-1 ring-[#963824]/20'
                        : 'bg-[#FFFFFF] border-[#E7E0D6] text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs text-[#1C1917] truncate">{acc.name}</div>
                    <div className="text-[10px] text-[#78716C] truncate">{acc.region} • {acc.material}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 3: FITTING, SILHOUETTE & MODEST/HIJAB GUIDE */
        /* ========================================================================= */
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Sizing & Zero-Waste Pattern Philosophy */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#963824] flex items-center justify-center font-serif text-lg font-bold border border-[#D4C9BC]">
                Ø
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Filosofi Ukuran: All-Size & Pola Minim Potong (Zero-Waste)
                </h3>
                <p className="text-xs text-[#57534E]">
                  Mengapa Oerip Indonesia merancang busana dalam siluet <em>Free Size / Loose Fit</em>?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E7E0D6] text-xs">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">1. Menghormati Kain Utuh</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Penenun menghabiskan waktu berbulan-bulan untuk menenun sehelai kain. Dian Oerip meminimalkan potongan pola (<em>zero-waste</em>) agar makna dan benang sakral tidak terbuang sia-sia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">2. Adaptif & Inklusif</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Potongan kimono, loose outer, dan batwing dirancang fleksibel menyesuaikan lingkar dada (LD) 95 cm hingga 130+ cm dengan jatuhnya kain yang natural tanpa kaku.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">3. Fluiditas Lintas Gender</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Sebagian besar koleksi signature Oerip bersifat <em>unisex / gender-fluid</em>, dapat dikenakan pria maupun wanita dengan variasi teknik draping atau aksen sabuk obi.
                </p>
              </div>
            </div>
          </div>

          {/* Body Frame Drape Simulation Table */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              Panduan Jatuhnya Kain pada Berbagai Karakter Tubuh
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E0D6] text-[#78716C] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Tipe Postur</th>
                    <th className="py-2.5 px-3">Tinggi Badan</th>
                    <th className="py-2.5 px-3">Efek Jatuhnya Kain (Drape)</th>
                    <th className="py-2.5 px-3">Tips Styling Dian Oerip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E0D6] text-[#1C1917]">
                  <tr>
                    <td className="py-3 px-3 font-semibold">Petite (Mungil)</td>
                    <td className="py-3 px-3 text-[#57534E]">150 – 158 cm</td>
                    <td className="py-3 px-3">Outer jatuh di bawah lutut memberi aksen dramatis megah.</td>
                    <td className="py-3 px-3 text-[#963824]">Padukan dengan celana lurus berpotongan tinggi (high-waist) dan biarkan outer terbuka untuk ilusi jenjang.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Regular Proportional</td>
                    <td className="py-3 px-3 text-[#57534E]">159 – 168 cm</td>
                    <td className="py-3 px-3">Siluet jatuh tepat di pertengahan betis dengan flow natural.</td>
                    <td className="py-3 px-3 text-[#963824]">Bebas berekspresi: loose terurai atau disematkan bros kuningan di salah satu bahu.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Tall (Tinggi Semampai)</td>
                    <td className="py-3 px-3 text-[#57534E]">169 – 180+ cm</td>
                    <td className="py-3 px-3">Duster robe jatuh di sekitar lutut dengan siluet regal wibawa.</td>
                    <td className="py-3 px-3 text-[#963824]">Sangat pas dipadukan dengan kulot tenun longgar atau kain lilit etnik panjang.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Curvy / Plus Size</td>
                    <td className="py-3 px-3 text-[#57534E]">Semua Tinggi</td>
                    <td className="py-3 px-3">Potongan loose menyamarkan garis tubuh dan memberi kenyamanan mutlak.</td>
                    <td className="py-3 px-3 text-[#963824]">Pilih tenun bertekstur kapas sejuk seperti Gedog Tuban yang jatuh lurus (anti-gelembung).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Modest & Hijab Styling Section */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E0D6] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1E3A2B] text-white flex items-center justify-center font-bold text-xs">
                <Shirt size={16} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                  Panduan Modest & Hijab Styling Busana Oerip
                </h3>
                <p className="text-xs text-[#57534E]">
                  Cara memadukan wastra Nusantara dengan busana santun muslimah kontemporer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#963824]">1. Inner Manset Katun Sejuk</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Gunakan manset katun bambu atau katun mori warna broken white, hitam arang, atau terakota tua. Bahan alami menjamin sirkulasi udara tetap sejuk saat memakai outer tenun tangan tebal.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#963824]">2. Pemilihan Warna Hijab / Pashmina</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Pilihlah pashmina berbahan voal atau sutra polos dengan warna yang mengambil salah satu nada minor pada tenun (misalnya warna krem kapas atau cokelat soga), agar motif outer tetap menjadi primadona utama.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#963824]">3. Padanan Bawahan Longgar (Anti-Terawang)</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Padukan outer kimono dengan celana kulot linen longgar atau rok plisket tenun A-line. Potongan ini menjaga kesantunan gerak tanpa memperlihatkan siluet lekuk kaki.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#963824]">4. Etika Sematan Bros & Aksesoris</h4>
                <p className="text-[#57534E] leading-relaxed">
                  Sematkan bros etnik (seperti Mamuli atau bros tembaga) pada lipatan pashmina atau di kerah outer dengan menggunakan bantalan kain kecil di bagian belakang agar jarum tidak merusak rajutan benang tenun tangan.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* KIRA Quick Tips Regional Jewelry & Accessories Overlay */}
      <KiraQuickTipsOverlay
        isOpen={isQuickTipsOpen}
        onClose={() => setIsQuickTipsOpen(false)}
        currentProduct={selectedOuter}
        onApplyAccessory={handleApplyAccessoryFromTips}
        onConsultLookWithKira={(question) => {
          if (onConsultLook) {
            onConsultLook(question);
          }
        }}
      />

    </div>
  );
};
