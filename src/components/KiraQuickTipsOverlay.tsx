import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Gem, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Search, 
  Lightbulb, 
  Compass, 
  Palette, 
  Info, 
  Layers, 
  MessageSquare,
  Sparkle,
  BookmarkCheck
} from 'lucide-react';
import { ProductItem } from '../types';

export interface RegionalAccessoryTip {
  id: string;
  region_key: string;
  region_name: string;
  island: string;
  wastra_examples: string[];
  signature_jewelry: {
    name: string;
    category: string;
    materials: string;
    symbolism: string;
    why_it_works: string;
    styling_placement: string;
    accessory_mapping_id?: string; // Links to StylingStudio ACCESSORES_PIECES if matching
  }[];
  metal_palette: {
    recommended: string[];
    avoid: string[];
    finishing_vibe: string;
  };
  cultural_guardrails: {
    dos: string[];
    donts: string[];
    sacred_note: string;
  };
  color_harmony: string;
}

export const REGIONAL_ACCESSORY_TIPS: RegionalAccessoryTip[] = [
  {
    id: 'TIP-SUMBA',
    region_key: 'sumba',
    region_name: 'Sumba Timur & NTT',
    island: 'Nusa Tenggara Timur',
    wastra_examples: ['Tenun Ikat Sumba', 'Tenun Pahikung', 'Hinggi & Lau'],
    signature_jewelry: [
      {
        name: 'Kalung Kuningan Antik Mamuli (Marapu Accent)',
        category: 'Aksesoris Dada / Kalung',
        materials: 'Kuningan cor tempa tangan / perunggu kuno',
        symbolism: 'Simbol kesuburan, kemakmuran rahim semesta, dan martabat ksatria Marapu.',
        why_it_works: 'Warna emas kuningan antik yang hangat memperkuat nada terakota akar mengkudu dan biru indigo tenun Sumba.',
        styling_placement: 'Kenakan sebagai kalung liontin tunggal di atas inner polos agar tidak menabrak motif fauna tenun.',
        accessory_mapping_id: 'ACC-01'
      },
      {
        name: 'Untaian Manik Kaba & Mutisalah Terakota',
        category: 'Kalung Beruntai',
        materials: 'Manik kaca kuno / tanah liat terakota pewarna alam',
        symbolism: 'Lambang kehormatan bangsawan dan pelindung perjalanan jiwa.',
        why_it_works: 'Tekstur manik tanah liat menggemakan kealamian benang katun pintal tangan Sumba.',
        styling_placement: 'Posisikan melingkar rapat di leher (choker) dipadukan dengan outer kimono berkerah terbuka.'
      },
      {
        name: 'Tas Anyam Lontar Sumba & Rumbai Serat Alami',
        category: 'Tas Jinjing',
        materials: 'Daun lontar kering anyaman tangan Mama Sumba',
        symbolism: 'Ketangguhan dan kearifan ekologis padang sabana.',
        why_it_works: 'Tekstur anyaman matte memberi pernapasan visual di samping pekatnya bidang tenun ikat.',
        styling_placement: 'Gunakan sebagai clutch kasual atau tote bag etnik berstruktur luwes.',
        accessory_mapping_id: 'ACC-03'
      }
    ],
    metal_palette: {
      recommended: ['Kuningan Antik (Brushed Brass)', 'Perunggu Tempa', 'Tembaga Bakar', 'Tanduk Kerbau Hitam'],
      avoid: ['Perak berkilau tajam (high-shine chrome)', 'Permata imitasi neon/plastik'],
      finishing_vibe: 'Earthy Majesty & Warm Antique Patina'
    },
    cultural_guardrails: {
      dos: [
        'Posisikan ornamen besar di bidang kain yang polos (seperti inner netral) agar panel motif sakral Kuda/Andung tetap bernapas.',
        'Pilih perhiasan dengan finishing matte atau patina antik untuk menjaga wibawa sakral Marapu.'
      ],
      donts: [
        'Jangan menusukkan peniti/bros berdiameter tebal menembus panel tenun ikat sakral utama agar benang pakan tidak robek.',
        'Hindari menumpuk lebih dari 2 perhiasan statement sekaligus karena tenun Sumba sudah memiliki gravitas visual yang kuat.'
      ],
      sacred_note: 'Dalam filosofi Sumba, Mamuli adalah pusaka sakral keluarga. Adaptasi fesyen harus mengedepankan kesopanan dan penghargaan spiritual.'
    },
    color_harmony: 'Terakota Mengkudu • Biru Nila Taum • Hitam Lumpur • Krem Kapas'
  },
  {
    id: 'TIP-TUBAN',
    region_key: 'tuban',
    region_name: 'Tuban & Jawa Pesisir (Gedog)',
    island: 'Jawa Timur',
    wastra_examples: ['Tenun Gedog Kerek', 'Batik Gedog Pewarna Alam', 'Katun Kenthang'],
    signature_jewelry: [
      {
        name: 'Bros Antik Tatahan Daun Ganggeng Tembaga',
        category: 'Aksesoris Kerah / Bahu',
        materials: 'Tembaga daur ulang pengrajin kriya logam Jawa',
        symbolism: 'Melambangkan kelenturan batin (adaptif seperti ganggang air) dan kesahajaan hidup.',
        why_it_works: 'Warna tembaga merah bata menyatu lembut dengan serat kapas kenthang bertekstur kasar (slub).',
        styling_placement: 'Sematkan di lapel kerah kimono atau sebagai penaut lipatan selendang di salah satu bahu.',
        accessory_mapping_id: 'ACC-02'
      },
      {
        name: 'Cincin & Gelang Kayu Jati Daur Ulang Beraksen Perak Bakar',
        category: 'Aksesoris Tangan',
        materials: 'Kayu jati tua hutan Tuban & perak teroksidasi',
        symbolism: 'Ketabahan dan keteguhan perempuan desa pengolah kapas.',
        why_it_works: 'Unsur kayu alami menonjolkan autentisitas tenun gedogan yang 100% dipintal manual.',
        styling_placement: 'Kenakan pada jari telunjuk atau pergelangan tangan dengan lengan outer digulung 3/4.'
      },
      {
        name: 'Selendang Sutra Tenun Pewarna Daun Nila (Indigo Scarf)',
        category: 'Selendang & Layering',
        materials: 'Sutra alam liar & fermentasi daun indigofera',
        symbolism: 'Kesejukan jiwa dan kelembutan tutur kata.',
        why_it_works: 'Menghadirkan perpaduan kontras tekstur antara katun gedog yang kokoh dengan sutra yang jatuh melayang.',
        styling_placement: 'Sampirkan di leher mengalir ke depan untuk tampilan diplomasi santai.',
        accessory_mapping_id: 'ACC-04'
      }
    ],
    metal_palette: {
      recommended: ['Tembaga Bakar (Oxidized Copper)', 'Perak Bakar Doff', 'Kayu Jati / Sono Keling', 'Batu Jasper'],
      avoid: ['Emas kuning berkilau berlebihan (high-gloss gold)', 'Rantai logam berat industrial'],
      finishing_vibe: 'Organic Earthy & Humble Artisan'
    },
    cultural_guardrails: {
      dos: [
        'Pilih aksesori bertekstur alami unpolished (tidak terlalu licin) agar selaras dengan tekstur slub kapas kenthang.',
        'Biarkan benang dan motif gedog menjadi aksen utama dengan memilih perhiasan berukuran proporsional (medium-subtle).'
      ],
      donts: [
        'Hindari aksesori plastik sintetis yang merusak kesan ramah lingkungan (eco-living) tenun gedog.',
        'Jangan gunakan bros berpenjepit tajam tanpa pelindung bantalan kain di balik tenunan.'
      ],
      sacred_note: 'Tradisi Gedog Tuban melambangkan ketekunan harian petani-penenun; busana dan aksesorisnya memancarkan kesederhanaan lahiriah yang berwibawa.'
    },
    color_harmony: 'Indigo Biru Nila • Cokelat Kayu Tingi • Krem Putih Kapas • Abu-Abu Arang'
  },
  {
    id: 'TIP-BATAK',
    region_key: 'batak',
    region_name: 'Toba Samosir & Batak (Ulos)',
    island: 'Sumatera Utara',
    wastra_examples: ['Ulos Ragidup', 'Ulos Sadum', 'Ulos Ragi Hotang', 'Tenun Silindung'],
    signature_jewelry: [
      {
        name: 'Bros Perak Gorga Batak & Motif Sigulempong',
        category: 'Aksesoris Dada Kiri',
        materials: 'Perak murni 925 tempaan pengrajin Toba',
        symbolism: 'Simbol perlindungan keluarga besar (Dalihan Na Tolu) dan penolak marabahaya.',
        why_it_works: 'Kilau perak tempa dingin memberikan kontras monokromatik agung terhadap bidang warna hitam dan merah darah ulos.',
        styling_placement: 'Posisikan di dada sebelah kiri tepat di atas jantung untuk memancarkan simbol doa perlindungan.'
      },
      {
        name: 'Gelang Perak Rantai Tenun Batak (Toba Silver Cuff)',
        category: 'Gelang Tangan',
        materials: 'Perak bakar berukir motif geometris Bintang Maratur',
        symbolism: 'Keteraturan tata krama dan kehormatan antargenerasi.',
        why_it_works: 'Menegaskan garis siluet berwibawa (structured) pada busana berpotongan vest atau long outer.',
        styling_placement: 'Kenakan pada pergelangan tangan berpadu dengan kemeja kerah tegak (mandarin collar).'
      },
      {
        name: 'Tas Jinjing Kulit Berstruktur Tegas (Executive Heritage Tote)',
        category: 'Tas Formal',
        materials: 'Kulit sapi nabati hitam dengan aksen tenun ulos tepi',
        symbolism: 'Keteguhan martabat dan kepemimpinan dalam forum diplomasi.',
        why_it_works: 'Struktur tas yang kokoh menyeimbangkan wibawa kain ulos dalam acara kenegaraan atau resepsi resmi.',
        styling_placement: 'Dijinjing di tangan kanan dengan postur tegak.'
      }
    ],
    metal_palette: {
      recommended: ['Perak Murni (Sterling Silver)', 'Perak Bakar Teroksidasi', 'Batu Obsidian Hitam', 'Kulit Nabati Hitam'],
      avoid: ['Emas kuning pucat', 'Aksesoris berumbai bohemian terlalu liar'],
      finishing_vibe: 'Regal Aristocracy & Diplomatic Authority'
    },
    cultural_guardrails: {
      dos: [
        'Sematkan bros utama di dada kiri dekat jantung sebagai simbol menerima kehangatan doa (manggomgomi).',
        'Pertahankan garis busana yang rapi dan simetris untuk menghormati filosofi Bintang Maratur.'
      ],
      donts: [
        'Jangan memotong atau melubangi bagian sirat dan tumpal sakral ulos demi menyematkan aksesoris berat.',
        'Hindari gaya terlalu kasual/acak-acakan saat mengenakan busana berbahan Ulos Ragidup dalam acara resmi.'
      ],
      sacred_note: 'Ulos melambangkan sumber kehangatan fisik dan spiritual. Busana dan perhiasannya harus memancarkan wibawa dan rasa hormat kepada leluhur.'
    },
    color_harmony: 'Hitam Pekat Itom • Merah Marun Darah • Putih Kapas Murni • Aksen Emas Sirat'
  },
  {
    id: 'TIP-FLORES',
    region_key: 'flores',
    region_name: 'Flores (Lio-Ende & Manggarai)',
    island: 'Flores, Nusa Tenggara Timur',
    wastra_examples: ['Tenun Ikat Ende', 'Kain Songke Manggarai', 'Tenun Sikka'],
    signature_jewelry: [
      {
        name: 'Anting Geometris Mata Bolo (Belah Ketupat Flores)',
        category: 'Anting Telinga',
        materials: 'Kuningan tempa tangan & batu akik vulkanik',
        symbolism: 'Kewaspadaan mata batin dan perlindungan empat penjuru mata angin.',
        why_it_works: 'Bentuk geometris belah ketupat berdialog langsung dengan motif Mata Bolo pada tenun Flores.',
        styling_placement: 'Padukan dengan tatanan rambut bersahaja (updo / disanggul rapi) agar anting terlihat elegan.'
      },
      {
        name: 'Kalung Manik Kayu Cendana & Biji Hutan Tropis',
        category: 'Kalung Etnik',
        materials: 'Kayu cendana wangi NTT & biji-bijian hutan alami',
        symbolism: 'Keharuman budi pekerti dan harmoni dengan alam bukit vulkanik.',
        why_it_works: 'Menghadirkan kehangatan organik yang melengkapi warna cokelat moke dan merah marun tenun Flores.',
        styling_placement: 'Kenakan beruntai ganda di atas kemeja linen atau inner polos.'
      },
      {
        name: 'Tas Jinjing Serat Lontar Anyaman Mama Flores',
        category: 'Tas',
        materials: 'Anyaman daun lontar pesisir NTT',
        symbolism: 'Kemakmuran pesisir dan ketelatenan perempuan penenun.',
        why_it_works: 'Ringan dan bertekstur unik, cocok untuk acara seni dan perjalanan budaya.',
        styling_placement: 'Dijinjing santai di samping busana duster robe longgar.',
        accessory_mapping_id: 'ACC-03'
      }
    ],
    metal_palette: {
      recommended: ['Kuningan Tempa Kasar', 'Kayu Cendana Asli', 'Tembaga Kemerahan', 'Batu Akik Merah Hati'],
      avoid: ['Aksesoris akrilik modern mengkilap', 'Perhiasan perak dingin terlalu pucat'],
      finishing_vibe: 'Geometric Bohemian & Island Soul'
    },
    cultural_guardrails: {
      dos: [
        'Pilih aksesori bernuansa hangat (warm tones) seperti kuningan atau kayu cendana untuk menonjolkan warna pewarna alami akar mengkudu dan moke.',
        'Manfaatkan aksesoris geometris simetris untuk mengimbangi kepadatan tenun ikat Flores.'
      ],
      donts: [
        'Hindari aksesori yang terlalu gemerlap sehingga menenggelamkan detail halus ketukan tenun ikat Ende.',
        'Jangan menggunakan logam yang mudah berkarat pada kain tenun pewarna alam.'
      ],
      sacred_note: 'Tenun Flores merekam ikatan kekerabatan kampung adat. Aksesorisnya harus memancarkan keakraban dengan alam dan kehangatan persaudaraan.'
    },
    color_harmony: 'Cokelat Moke Gelap • Merah Marun Alami • Kuning Kunyit • Hitam Arang'
  },
  {
    id: 'TIP-LURIK',
    region_key: 'lurik',
    region_name: 'Klaten & Yogyakarta (Lurik)',
    island: 'Jawa Tengah & DIY',
    wastra_examples: ['Tenun Lurik Prasojo', 'Lurik Telupat', 'Lurik Sapit Urang', 'Lurik Dom Kecer'],
    signature_jewelry: [
      {
        name: 'Bros Keraton Gandik Tatahan Perak Bakar',
        category: 'Aksesoris Dada / Kerah',
        materials: 'Perak bakar khas Kotagede / kuningan sepuh antik',
        symbolism: 'Keanggunan tata krama keraton dan kesahajaan laku hidup.',
        why_it_works: 'Aksen lengkung klasik melembutkan ketegasan garis-garis lurus geometris lurik.',
        styling_placement: 'Sematkan di dada bagian tengah atas atau di lipatan kerah kimono pendek.'
      },
      {
        name: 'Kalung Tali Kulit Minimalis dengan Liontin Fosil Kayu / Batu Jasper',
        category: 'Kalung Modern-Etnik',
        materials: 'Tali kulit nabati cokelat tua & batu alam nusantara',
        symbolism: 'Keseimbangan hidup perkotaan dengan akar bumi Nusantara.',
        why_it_works: 'Memberikan sentuhan modern urban yang segar untuk gaya smart-casual kantor maupun pameran seni.',
        styling_placement: 'Jatuh tepat di garis dada di atas kaos polos atau kemeja kasual.'
      },
      {
        name: 'Clutch Kulit Pull-Up Cokelat Tembakau',
        category: 'Tas Kasual-Elegan',
        materials: 'Kulit sapi lokal dengan patina alami',
        symbolism: 'Kesederhanaan fungsional dan keindahan yang bertambah seiring waktu.',
        why_it_works: 'Warna tembakau hangat harmonis sempurna dengan garis pinstripe lurik hitam, indigo, dan abu-abu.',
        styling_placement: 'Diapit di bawah lengan untuk gaya eksekutif kasual.'
      }
    ],
    metal_palette: {
      recommended: ['Perak Bakar Kotagede (Oxidized Silver)', 'Tembaga Patina', 'Kulit Nabati Cokelat', 'Batu Jasper Jawa'],
      avoid: ['Aksesoris berlian imitasi ramai (glittery rhinestone)', 'Bentuk asimetris yang terlalu kacau'],
      finishing_vibe: 'Zen Minimalist & Modern Heritage'
    },
    cultural_guardrails: {
      dos: [
        'Pertahankan prinsip kesederhanaan (simplicity) — cukup 1 sampai 2 aksesoris bersih untuk menonjolkan irama garis lurik.',
        'Pilih perhiasan dengan proporsi ramping agar selaras dengan tenun katun lurik yang ringan.'
      ],
      donts: [
        'Hindari kalung statement yang terlalu lebar dan menutupi hampir seluruh pola garis busana lurik.',
        'Jangan memadukan lurik garis-garis dengan syal bermotif garis bentrok tanpa jeda warna solid.'
      ],
      sacred_note: 'Lurik bermakna "lurus ing lakon" (kejujuran). Aksesoris yang bersih dan tidak berlebihan mencerminkan keindahan batin yang hening.'
    },
    color_harmony: 'Hitam Arang • Indigo Blue • Abu-abu Sejuk • Garis Pinstripe Krem Kapas'
  },
  {
    id: 'TIP-TORAJA',
    region_key: 'toraja',
    region_name: 'Toraja & Sulawesi (Tenun Sa\'dan)',
    island: 'Sulawesi Selatan',
    wastra_examples: ['Tenun Sa\'dan Toraja', 'Tenun Rongkong', 'Tenun Donggala'],
    signature_jewelry: [
      {
        name: 'Kalung Manik Kaba Tanduk Kerbau Bonga',
        category: 'Kalung Etnik',
        materials: 'Tanduk kerbau belang alami & manik kaca jingga-hitam',
        symbolism: 'Kemakmuran lumbung padi (Alang) dan status kepemimpinan adat.',
        why_it_works: 'Menghadirkan aura ksatria pegunungan yang sangat berkarakter.',
        styling_placement: 'Dikenakan di leher di atas outer panjang berpotongan duster robe.'
      },
      {
        name: 'Bros Pa\'ssura Ukir Pa\'teddong Kuningan',
        category: 'Bros Kerah / Bahu',
        materials: 'Kuningan tempa cor dengan ukiran kepala kerbau',
        symbolism: 'Simbol kerja keras, perlindungan keluarga, dan kemuliaan hidup.',
        why_it_works: 'Menonjolkan detail geometris khas ukiran Tongkonan pada busana formal.',
        styling_placement: 'Disematkan di bahu kanan outer kimono.'
      }
    ],
    metal_palette: {
      recommended: ['Kuningan Antik', 'Tanduk Kerbau Alam', 'Perak Filigri Sulawesi', 'Manik Kaca Oranye'],
      avoid: ['Plastik neon', 'Aksesoris bergaya rococo eropa berlebihan'],
      finishing_vibe: 'Ancestral Honor & High Mountain Majesty'
    },
    cultural_guardrails: {
      dos: [
        'Padukan dengan warna-warna tanah (earthy reds and yellows) untuk menggemakan palet warna rumah Tongkonan.',
        'Gunakan aksesoris tanduk alami untuk menonjolkan nilai kelestarian adat.'
      ],
      donts: [
        'Jangan menggunakan simbol ukiran pemakaman sakral untuk acara pesta tanpa memahami maknanya.'
      ],
      sacred_note: 'Tenun dan ornamen Toraja sarat dengan doa keselamatan bagi klan dan penghormatan kepada para leluhur.'
    },
    color_harmony: 'Merah Darah Alami • Hitam Jelaga • Kuning Kunyit • Putih Kapas'
  },
  {
    id: 'TIP-KALIMANTAN',
    region_key: 'kalimantan',
    region_name: 'Kalimantan & Dayak (Ulap Doyo & Iban)',
    island: 'Kalimantan',
    wastra_examples: ['Tenun Ulap Doyo Benuaq', 'Tenun Ikat Iban', 'Kain Cual Sambas'],
    signature_jewelry: [
      {
        name: 'Aksesoris Anyaman Manik Dayak & Taring Kayu Ulin',
        category: 'Kalung Dada & Gelang',
        materials: 'Manik kaca Dayak aneka warna & kayu besi ulin Kalimantan',
        symbolism: 'Kekuatan hidup rimba raya dan keharmonisan masyarakat adat Dayak.',
        why_it_works: 'Warna manik yang hidup mengimbangi warna alami cokelat serat daun Doyo.',
        styling_placement: 'Jatuh melingkar di dada di atas pakaian luaran berserat alami.'
      },
      {
        name: 'Gelang Anyaman Serat Rotan Jangang Halus',
        category: 'Gelang Tangan',
        materials: 'Serat rotan hutan belantara Kalimantan',
        symbolism: 'Kelenturan daya tahan dan cinta pada hutan tropis.',
        why_it_works: 'Sangat ringan, fleksibel, dan memberikan aksen kriya hutan alami.',
        styling_placement: 'Dikenakan 2-3 lapis di pergelangan tangan.'
      }
    ],
    metal_palette: {
      recommended: ['Kuningan Etnik', 'Kayu Ulin Alami', 'Serat Rotan', 'Manik Kaca Tradisional'],
      avoid: ['Logam berlapis emas sintetis licin', 'Aksesoris perak tipis rentan patah'],
      finishing_vibe: 'Rainforest Living & Sacred Earth'
    },
    cultural_guardrails: {
      dos: [
        'Pilih aksesoris berbahan serat hutan untuk memperkuat narasi keberlanjutan (sustainable eco-fashion).',
        'Seimbangkan aksesoris manik berwarna dengan warna pakaian yang lebih teduh.'
      ],
      donts: [
        'Hindari ornamen yang menggunakan bagian satwa liar yang dilindungi; selalu pilih bahan nabati (kayu ulin/biji/rotan).'
      ],
      sacred_note: 'Tenun Doyo dibuat dari serat daun liar; pemakaian aksesorisnya melambangkan janji menjaga kelestarian hutan adat.'
    },
    color_harmony: 'Cokelat Serat Doyo • Merah Getah Kayu • Hitam Arang • Aksen Manik Kuning'
  }
];

interface KiraQuickTipsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct?: ProductItem;
  onApplyAccessory?: (accessoryInfo: {
    id: string;
    name: string;
    category: string;
    material: string;
    symbolism: string;
    pairing_vibe: string;
  }) => void;
  onConsultLookWithKira?: (question: string) => void;
}

export const KiraQuickTipsOverlay: React.FC<KiraQuickTipsOverlayProps> = ({
  isOpen,
  onClose,
  currentProduct,
  onApplyAccessory,
  onConsultLookWithKira
}) => {
  // Determine initial region from current selected product
  const getInitialRegionKey = (): string => {
    if (!currentProduct) return 'sumba';
    const origin = (currentProduct.textile_origin || '').toLowerCase();
    const textile = (currentProduct.textile || '').toLowerCase();
    
    if (origin.includes('sumba') || textile.includes('sumba') || origin.includes('ntt')) return 'sumba';
    if (origin.includes('tuban') || textile.includes('gedog')) return 'tuban';
    if (origin.includes('toba') || origin.includes('batak') || textile.includes('ulos') || origin.includes('sumatera')) return 'batak';
    if (origin.includes('flores') || origin.includes('ende') || origin.includes('manggarai')) return 'flores';
    if (origin.includes('klaten') || origin.includes('jogja') || origin.includes('jawa') || textile.includes('lurik')) return 'lurik';
    if (origin.includes('toraja') || origin.includes('sulawesi')) return 'toraja';
    if (origin.includes('kalimantan') || origin.includes('dayak') || textile.includes('doyo')) return 'kalimantan';
    
    return 'sumba';
  };

  const [selectedRegionKey, setSelectedRegionKey] = useState<string>(getInitialRegionKey());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedAccessoryId, setAppliedAccessoryId] = useState<string | null>(null);

  // Sync region when current product changes
  useEffect(() => {
    if (isOpen && currentProduct) {
      setSelectedRegionKey(getInitialRegionKey());
    }
  }, [isOpen, currentProduct?.product_id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTip = REGIONAL_ACCESSORY_TIPS.find(t => t.region_key === selectedRegionKey) || REGIONAL_ACCESSORY_TIPS[0];

  // Filter jewelry if search is active
  const filteredJewelry = searchQuery.trim() === ''
    ? currentTip.signature_jewelry
    : currentTip.signature_jewelry.filter(j => 
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.symbolism.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleApply = (jewelry: RegionalAccessoryTip['signature_jewelry'][0]) => {
    if (onApplyAccessory) {
      onApplyAccessory({
        id: jewelry.accessory_mapping_id || `ACC-CUSTOM-${Date.now()}`,
        name: jewelry.name,
        category: jewelry.category,
        material: jewelry.materials,
        symbolism: jewelry.symbolism,
        pairing_vibe: jewelry.why_it_works
      });
      setAppliedAccessoryId(jewelry.name);
      setTimeout(() => setAppliedAccessoryId(null), 2500);
    }
  };

  const handleAskKira = (jewelry: RegionalAccessoryTip['signature_jewelry'][0]) => {
    if (onConsultLookWithKira) {
      const prompt = `Halo KIRA, saya ingin bertanya tentang padu-padan perhiasan etnik untuk wastra ${currentProduct?.textile || currentTip.region_name}. Apakah aksesoris "${jewelry.name}" (${jewelry.materials}) cocok dipadukan untuk acara resmi, dan bagaimana etika adat penempatannya?`;
      onConsultLookWithKira(prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-3xl border border-[#D5CABE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-[#1C1917] text-[#FAF7F2] px-6 py-5 sm:px-8 border-b border-[#38332E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#963824] text-[#FAF7F2] flex items-center justify-center shadow-xs">
              <Sparkles size={20} className="text-[#C89B53]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-wider text-lg sm:text-xl font-bold">
                  KIRA Quick Tips
                </span>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#38322B] text-[#C89B53] border border-[#C89B53]/30 font-semibold">
                  Regional Accessory Guide
                </span>
              </div>
              <p className="text-xs text-[#A89E95] mt-0.5">
                Panduan instan padu-padan perhiasan & aksesoris etnik berbasis asal daerah wastra dan etika adat Nusantara.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A89E95] hover:text-[#FAF7F2] hover:bg-[#332E29] transition-colors cursor-pointer"
            aria-label="Tutup Panduan"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subheader: Active Wastra Context Banner */}
        {currentProduct && (
          <div className="bg-[#F3EEE4] px-6 py-2.5 sm:px-8 border-b border-[#E3DACD] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#78716C]">Wastra yang sedang dipilih di kanvas:</span>
              <span className="font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                <Gem size={13} className="text-[#963824]" />
                {currentProduct.product_name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#963824] border border-[#D5CABE] font-semibold">
                Asal: {currentProduct.textile_origin}
              </span>
            </div>
            <div className="text-[11px] text-[#57534E] flex items-center gap-1">
              <Sparkle size={12} className="text-[#C89B53]" />
              <span>Saran di bawah otomatis diselaraskan dengan asal tenun ini.</span>
            </div>
          </div>
        )}

        {/* Region Selector Tabs & Search Bar */}
        <div className="px-6 sm:px-8 pt-4 pb-3 bg-[#FAF7F2] border-b border-[#E7DFD5] space-y-3 shrink-0">
          
          {/* Scrollable Region Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Compass size={13} /> Wilayah Wastra:
            </span>
            {REGIONAL_ACCESSORY_TIPS.map((tip) => {
              const isSelected = tip.region_key === selectedRegionKey;
              return (
                <button
                  key={tip.id}
                  onClick={() => {
                    setSelectedRegionKey(tip.region_key);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#963824] text-[#FAF7F2] border-[#963824] shadow-xs font-semibold'
                      : 'bg-[#FFFFFF] text-[#57534E] border-[#D5CABE] hover:bg-[#F3EEE4] hover:text-[#1C1917]'
                  }`}
                >
                  <span>{tip.region_name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search inside selected region */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari aksesoris, jenis logam, atau perhiasan untuk wilayah ${currentTip.region_name}...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#FFFFFF] border border-[#D5CABE] text-[#1C1917] placeholder-[#8C827A] focus:outline-hidden focus:ring-1 focus:ring-[#963824] focus:border-[#963824]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C827A] hover:text-[#1C1917]"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Active Region Hero Card */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#963824] tracking-wider">
                <ShieldCheck size={13} />
                <span>Terverifikasi Kurasi Etnik Oerip • {currentTip.island}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                Karakter Aksesoris: {currentTip.region_name}
              </h3>
              <p className="text-xs text-[#57534E]">
                Cocok untuk wastra: <strong className="text-[#1C1917]">{currentTip.wastra_examples.join(', ')}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5]">
              <Palette size={16} className="text-[#963824] shrink-0" />
              <div className="text-xs">
                <span className="text-[#78716C] block text-[10px] font-bold uppercase">Sinergi Warna Tenun & Aksesoris</span>
                <span className="font-serif italic font-medium text-[#1C1917]">{currentTip.color_harmony}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Signature Jewelry & Accessories Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                <Gem size={16} className="text-[#963824]" />
                <span>Rekomendasi Perhiasan & Aksesoris Komplementer ({filteredJewelry.length})</span>
              </h4>
              <span className="text-[11px] text-[#78716C]">
                Klik "Terapkan" untuk memasang langsung ke kanvas styling
              </span>
            </div>

            {filteredJewelry.length === 0 ? (
              <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#E7DFD5] text-xs text-[#78716C]">
                Tidak ditemukan aksesoris yang cocok dengan kata kunci "{searchQuery}". Coba kata kunci lain atau reset pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJewelry.map((jewelry, idx) => {
                  const isApplied = appliedAccessoryId === jewelry.name;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs hover:border-[#963824] transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#963824] border border-[#E7DFD5]">
                            {jewelry.category}
                          </span>
                          <span className="text-[10px] text-[#78716C] font-mono">
                            Oerip Curated #{idx + 1}
                          </span>
                        </div>

                        <h5 className="font-serif font-bold text-sm text-[#1C1917] group-hover:text-[#963824] transition-colors leading-snug">
                          {jewelry.name}
                        </h5>

                        <div className="space-y-1.5 text-xs text-[#57534E]">
                          <div className="text-[11px] bg-[#FAF7F2] p-2 rounded-lg border border-[#F0EAE1]">
                            <strong className="text-[#1C1917]">Material:</strong> {jewelry.materials}
                          </div>
                          <p className="text-[11px] text-[#78716C] leading-relaxed">
                            <strong className="text-[#1C1917]">Filosofi:</strong> {jewelry.symbolism}
                          </p>
                          <p className="text-[11px] text-[#1E3A2B] leading-relaxed font-medium">
                            <strong className="text-[#1C1917]">Kesesuaian:</strong> {jewelry.why_it_works}
                          </p>
                          <div className="text-[10px] text-[#963824] pt-1 border-t border-[#FAF7F2] italic">
                            📍 <strong>Posisi Ideal:</strong> {jewelry.styling_placement}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-[#E7DFD5] flex gap-2">
                        <button
                          onClick={() => handleApply(jewelry)}
                          className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-[#1C1917] hover:bg-[#332E29] text-[#FAF7F2] shadow-xs'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check size={13} />
                              <span>Terpasang!</span>
                            </>
                          ) : (
                            <>
                              <BookmarkCheck size={13} className="text-[#C89B53]" />
                              <span>Terapkan</span>
                            </>
                          )}
                        </button>

                        {onConsultLookWithKira && (
                          <button
                            onClick={() => handleAskKira(jewelry)}
                            title="Tanyakan etika padu-padan ini ke KIRA AI"
                            className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#1C1917] border border-[#D5CABE] transition-colors cursor-pointer shrink-0"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Metal Palette & Cultural Guardrails */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Left: Recommended Metals & Textures */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E7DFD5]">
                <Lightbulb size={16} className="text-[#C89B53]" />
                <h4 className="font-serif font-bold text-base text-[#1C1917]">
                  Palet Logam & Tekstur yang Harmonis
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#1E3A2B] font-bold block mb-1.5 flex items-center gap-1">
                    <Check size={13} /> Logam & Material Paling Disarankan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTip.metal_palette.recommended.map((metal, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#1C1917] border border-[#E7DFD5] font-medium text-[11px]">
                        {metal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[#963824] font-bold block mb-1.5 flex items-center gap-1">
                    <X size={13} /> Hindari / Kurang Selaras:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTip.metal_palette.avoid.map((avoid, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#78716C] border border-[#E7DFD5] text-[11px]">
                        {avoid}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[11px]">
                  <strong className="text-[#1C1917]">Karakter Akhir (Finishing Vibe):</strong>
                  <p className="text-[#57534E] mt-0.5 font-serif italic">{currentTip.metal_palette.finishing_vibe}</p>
                </div>
              </div>
            </div>

            {/* Right: Cultural Guardrails & Do's and Don'ts */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E7DFD5]">
                <ShieldCheck size={16} className="text-[#963824]" />
                <h4 className="font-serif font-bold text-base text-[#1C1917]">
                  Etika Adat & Panduan Penempatan
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#1E3A2B] font-bold block mb-1">
                    ✓ Panduan Praktis (Do's):
                  </span>
                  <ul className="space-y-1 text-[#57534E] text-[11px] list-disc list-inside">
                    {currentTip.cultural_guardrails.dos.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[#963824] font-bold block mb-1">
                    ✕ Pantangan Estetika / Adat (Don'ts):
                  </span>
                  <ul className="space-y-1 text-[#78716C] text-[11px] list-disc list-inside">
                    {currentTip.cultural_guardrails.donts.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#F3EEE4] border border-[#D5CABE] text-[11px]">
                  <strong className="text-[#963824] flex items-center gap-1">
                    <Info size={12} /> Catatan Kesakralan Motif:
                  </strong>
                  <p className="text-[#57534E] mt-0.5 leading-relaxed">{currentTip.cultural_guardrails.sacred_note}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Footer Action Bar */}
        <div className="bg-[#FFFFFF] px-6 py-4 sm:px-8 border-t border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#78716C] text-center sm:text-left">
            Menemukan paduan aksesoris idaman? Klik <strong>Terapkan</strong> untuk memperbarui kanvas busana.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3EEE4] text-[#1C1917] text-xs font-semibold border border-[#D5CABE] transition-colors cursor-pointer"
            >
              Tutup Panduan
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
