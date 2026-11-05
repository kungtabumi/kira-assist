import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Share2, 
  Scroll,
  Leaf,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OERIP_PRODUCTS } from '../data/oeripKnowledgeBase';
import { useToast } from '../context/ToastContext';

interface WastraPersonaFinderProps {
  onApplyPersona?: (personaSummary: string) => void;
  onExploreWastra?: (wastraName: string) => void;
  onExploreStyling?: () => void;
}

export type PersonaKey = 'SOVEREIGN' | 'GROUNDER' | 'GUARDIAN' | 'NOMAD' | 'LUMINARY' | 'DIPLOMAT';

interface QuestionOption {
  id: string;
  label: string;
  sublabel: string;
  persona_score: PersonaKey;
}

interface Question {
  id: number;
  title: string;
  pillar: string;
  subtitle: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Aura Kepribadian & Manifestasi Karakter Diri',
    pillar: 'Pilar 1: Karakter & Kehadiran',
    subtitle: 'Bagaimana Anda menggambarkan energi dan pembawaan diri Anda saat melangkah ke hadapan dunia?',
    options: [
      {
        id: '1A',
        label: 'Visioner, Tegas & Berjiwa Pemimpin Luhur',
        sublabel: 'Menyukai kepemimpinan yang berintegritas, keberanian menembus batas, dan kehadiran yang menggetarkan rasa hormat.',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '1B',
        label: 'Tenang, Teduh & Sarat Kesabaran Batin',
        sublabel: 'Menghargai kedamaian batin, proses alami yang mengalir, harmoni dengan bumi, dan ketulusan tanpa pamrih.',
        persona_score: 'GROUNDER'
      },
      {
        id: '1C',
        label: 'Bijaksana, Sakral & Penjaga Doa Tradisi',
        sublabel: 'Menjunjung tinggi ikatan kekeluargaan, doa berkat leluhur, spiritualitas mendalam, dan memelihara nilai pusaka.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '1D',
        label: 'Eksploratif, Berjiwa Bebas & Pencerita Seni',
        sublabel: 'Menyukai kebebasan tanpa batas, perjalanan melintasi ruang budaya, ekspresi artistik, dan busana yang bernafas.',
        persona_score: 'NOMAD'
      },
      {
        id: '1E',
        label: 'Bersahaja, Reflektif & Kesederhanaan Cerdas',
        sublabel: 'Menghayati filosofi "lurus ing lakon"—kejujuran esensial, mindful, bersih tanpa kepura-puraan dan riasan berlebih.',
        persona_score: 'LUMINARY'
      },
      {
        id: '1F',
        label: 'Agung, Berwibawa Global & Membawa Marwah Bangsa',
        sublabel: 'Mewakili martabat peradaban luhur, diplomasi kehormatan, dan keanggunan kenegaraan di hadapan forum dunia.',
        persona_score: 'DIPLOMAT'
      }
    ]
  },
  {
    id: 2,
    title: 'Resonansi Ruang & Atmosfer Momen Impian',
    pillar: 'Pilar 2: Ruang & Konteks Sosial',
    subtitle: 'Di panggung atau suasana ruang seperti apa kehadiran busana Anda akan menemani momen paling bermakna?',
    options: [
      {
        id: '2A',
        label: 'Panggung Diplomasi Budaya & Jamuan Resmi Kenegaraan',
        sublabel: 'Mewakili keteguhan martabat dan kepemimpinan institusi di hadapan mitra terhormat.',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '2B',
        label: 'Ruang Dialog Hangat, Temu Keluarga & Kontemplasi',
        sublabel: 'Pertemuan intim, teduh, santai namun sarat makna kekeluargaan dan persahabatan sejati.',
        persona_score: 'GROUNDER'
      },
      {
        id: '2C',
        label: 'Upacara Sakral, Resepsi Pernikahan Adat & Tonggak Hidup',
        sublabel: 'Menyambut berkat doa suci, momen penting lintas generasi, dan perlindungan ikatan batin keluarga.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '2D',
        label: 'Festival Seni Internasional & Eksplorasi Pelosok Nusantara',
        sublabel: 'Menjelajahi ruang kreasi terbuka, galeri kontemporer, dan petualangan budaya lintas batas.',
        persona_score: 'NOMAD'
      },
      {
        id: '2E',
        label: 'Ruang Kerja Kreatif, Kafe Modern & Mobilitas Urban Cerdas',
        sublabel: 'Gaya smart-casual harian yang dinamis, berkarakter, sejuk ber-AC, dan santun untuk hijab modern.',
        persona_score: 'LUMINARY'
      },
      {
        id: '2F',
        label: 'Gala Dinner Kenegaraan, KTT Internasional & Resepsi Agung',
        sublabel: 'Membawa citra adiluhung peradaban maritim Nusantara ke panggung sorotan dunia.',
        persona_score: 'DIPLOMAT'
      }
    ]
  },
  {
    id: 3,
    title: 'Kompas Moral & Filosofi Hidup Leluhur',
    pillar: 'Pilar 3: Filosofi Batin & Nilai',
    subtitle: 'Nilai luhur leluhur manakah yang paling Anda jadikan kompas batin dalam menjalani pilihan hidup?',
    options: [
      {
        id: '3A',
        label: 'Keberanian Ksatria Kuda Sumba & Pohon Hayat Pelindung',
        sublabel: 'Menjadi pengayom yang tangguh menembus badai tantangan demi kesejahteraan sesama (Kosmologi Marapu).',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '3B',
        label: 'Ketabahan Memintal Kapas Sendiri & Menghormati Ritme Musim',
        sublabel: 'Sabar menjalani setiap tahapan hidup, membumi, dan selaras dengan nafas bumi tanpa memaksakan kehendak.',
        persona_score: 'GROUNDER'
      },
      {
        id: '3C',
        label: 'Doa Restu Kehidupan (Ulos Pasu-pasu) & Dalihan Na Tolu',
        sublabel: 'Menjaga kehangatan batin keluarga, menghormati leluhur, dan memelihara kerukunan antar generasi.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '3D',
        label: 'Kebebasan Samudra & Ketajaman Mata Batin (Mata Bolo Flores)',
        sublabel: 'Menyelami kedalaman rasa, berani keluar dari zona nyaman, dan mencintai keberagaman warna alam.',
        persona_score: 'NOMAD'
      },
      {
        id: '3E',
        label: 'Falsafah Jawa "Lurus Ing Lakon" & Sikap Prasojo Bersahaja',
        sublabel: 'Menjalani hidup dengan lurus, jujur, teguh memegang amanah, tanpa topeng kemewahan semu.',
        persona_score: 'LUMINARY'
      },
      {
        id: '3F',
        label: 'Kejayaan Bahari Sriwijaya & Keteguhan Ksatria Phinisi',
        sublabel: 'Menjaga kedaulatan martabat bangsa, kemakmuran bersama, dan wibawa di mata bangsa-bangsa.',
        persona_score: 'DIPLOMAT'
      }
    ]
  },
  {
    id: 4,
    title: 'Sensibilitas Taktil & Karakter Serat Alami',
    pillar: 'Pilar 4: Sentuhan Serat & Termal',
    subtitle: 'Kenyamanan tekstil dan sensasi sentuhan fisik seperti apa yang paling menenangkan tubuh Anda?',
    options: [
      {
        id: '4A',
        label: 'Tenun Ikat Tebal Bertekstur Tegas & Berbobot Wibawa',
        sublabel: 'Struktur kain jatuh kokoh yang memberi rasa aman, perlindungan, dan aura kepemimpinan alami.',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '4B',
        label: 'Katun Kapas Pintal Tangan Berpori Mikro yang Bernafas Sejuk',
        sublabel: 'Tekstur organik sedikit kasar yang semakin dicuci semakin lembut dan sejuk di iklim tropis.',
        persona_score: 'GROUNDER'
      },
      {
        id: '4C',
        label: 'Tenun Rapat Helai Doa dengan Rasa Hangat Memeluk Tubuh',
        sublabel: 'Kerapatan benang yang melindungi dari terpaan angin dan memancarkan rasa khidmat sakral.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '4D',
        label: 'Draping Luwes Mengalir yang Melambai Bebas Mengikuti Langkah',
        sublabel: 'Kain yang ringan melayang, dinamis saat bergerak aktif, dan tidak membatasi ruang gerak tubuh.',
        persona_score: 'NOMAD'
      },
      {
        id: '4E',
        label: 'Tenun Garis Halus yang Rapi, Ringan & Sejuk di Ruangan Ber-AC',
        sublabel: 'Kenyamanan benang katun halus berpori yang tidak mudah kusut saat duduk seharian.',
        persona_score: 'LUMINARY'
      },
      {
        id: '4F',
        label: 'Tenun Pakan Halus dengan Aksen Kemilau Benang Emas Kencana',
        sublabel: 'Sentuhan kemewahan halus berfuring lembut yang memikat mata namun tetap nyaman di kulit.',
        persona_score: 'DIPLOMAT'
      }
    ]
  },
  {
    id: 5,
    title: 'Alkimia Pewarna Alami & Palet Emosi Jiwa',
    pillar: 'Pilar 5: Warna & Alkimia Bumi',
    subtitle: 'Jika jiwa Anda adalah pigmen warna tanaman alam Nusantara, nuansa manakah yang paling mewakili Anda?',
    options: [
      {
        id: '5A',
        label: 'Merah Terakota Akar Mengkudu (Kombu) & Biru Malam Indigo (Taum)',
        sublabel: 'Kontras megah tanah vulkanik dan langit malam yang memancarkan wibawa ksatria luhur.',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '5B',
        label: 'Krem Alami Kapas Mentah, Cokelat Kayu Tingi & Hijau Lumut',
        sublabel: 'Nuansa organik tanah dan pepohonan purba yang meneduhkan batin dan menyatu dengan alam.',
        persona_score: 'GROUNDER'
      },
      {
        id: '5C',
        label: 'Merah Marun Kehidupan & Hitam Pekat Fiksasi Lumpur Purba (Itom)',
        sublabel: 'Kedalaman visual yang tegas, sakral, sarat energi spiritual, dan tak lekang oleh perputaran zaman.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '5D',
        label: 'Biru Indigo Laut Lepas, Kuning Kunyit Mentah & Jingga Senja',
        sublabel: 'Palet ekspresif pesisir yang dinamis, optimis, dan memancarkan jiwa petualang bebas.',
        persona_score: 'NOMAD'
      },
      {
        id: '5E',
        label: 'Monokrom Hitam Arang, Garis Putih Kapas & Cokelat Soga Jawa',
        sublabel: 'Estetika minimalis murni yang tenang, cerdas, berintegritas, dan bersahaja modern.',
        persona_score: 'LUMINARY'
      },
      {
        id: '5F',
        label: 'Kemilau Emas Kencana, Merah Delima Keraton & Biru Samudra Dalam',
        sublabel: 'Kemegahan bangsawan maritim yang agung, memikat pandang, dan merepresentasikan martabat bangsa.',
        persona_score: 'DIPLOMAT'
      }
    ]
  },
  {
    id: 6,
    title: 'Siluet Busana Oerip & Dinamika Gerak Tubuh',
    pillar: 'Pilar 6: Siluet & Gaya Berekspresi',
    subtitle: 'Potongan busana khas Dian Oerip seperti apa yang memberi Anda rasa percaya diri dan kebebasan hakiki?',
    options: [
      {
        id: '6A',
        label: 'Signature Blanket Outer & Kimono All-Size Berstruktur Tegas',
        sublabel: 'Siluet besar dan kokoh yang langsung memancarkan aura pemimpin saat Anda memasuki ruangan.',
        persona_score: 'SOVEREIGN'
      },
      {
        id: '6B',
        label: 'Loose-Fit Kimono Santai & Cardigan Membumi Bertekstur Tebal',
        sublabel: 'Potongan inklusif yang ramah untuk semua postur tubuh dan membebaskan pernafasan harian.',
        persona_score: 'GROUNDER'
      },
      {
        id: '6C',
        label: 'Tailored Long Vest Sakral & Rompi Berkerah Adat Rapi',
        sublabel: 'Siluet berstruktur formal yang menghormati etiket upacara dan menjaga marwah penampilan.',
        persona_score: 'GUARDIAN'
      },
      {
        id: '6D',
        label: 'Nomadic Long Duster Melayang & Asymmetrical Cape Artistik',
        sublabel: 'Potongan asimetris dramatis yang melambai indah saat Anda melangkah di panggung kreasi.',
        persona_score: 'NOMAD'
      },
      {
        id: '6E',
        label: 'Contemporary Short Kimono & Modern Tunic Versatile',
        sublabel: 'Potongan ringkas, rapi, santun untuk hijab, dan sangat fleksibel dari meja kerja ke perhelatan seni.',
        persona_score: 'LUMINARY'
      },
      {
        id: '6F',
        label: 'Jubah Agung Seremonial & Royal Outer Berdetail Tenun Simetris',
        sublabel: 'Siluet megah peninggalan peradaban agung yang memukau tamu kehormatan internasional.',
        persona_score: 'DIPLOMAT'
      }
    ]
  }
];

export const PERSONA_RESULTS: Record<PersonaKey, {
  archetype: string;
  local_title: string;
  category: 'leadership' | 'mindfulness' | 'sacred' | 'arts' | 'minimalist';
  description: string;
  primary_wastra: string;
  wastra_id: string;
  product_match: typeof OERIP_PRODUCTS[0];
  philosophical_quote: string;
  colors: string[];
  tags: string[];
  resonance_pillars: {
    character: string;
    philosophy: string;
    comfort: string;
  };
  styling_tips: {
    inner: string;
    bottom: string;
    accessories: string;
    hijab: string;
  };
  cultural_significance: {
    origin_lore: string;
    symbolic_meanings: { motif: string; meaning: string }[];
    spiritual_blessing: string;
    natural_alchemy: string;
  };
}> = {
  SOVEREIGN: {
    archetype: 'The Resilient Sovereign',
    local_title: 'Jiwa Ksatria Marapu & Pemimpin Visioner',
    category: 'leadership',
    description: 'Anda adalah pribadi yang memiliki kepemimpinan alami, berani mengambil keputusan besar, dan memancarkan wibawa yang memikat tanpa harus bersuara keras. Busana bagi Anda adalah simbol kehormatan, integritas, dan jembatan diplomasi bangsa.',
    primary_wastra: 'Tenun Ikat & Pahikung Sumba Timur (NTT)',
    wastra_id: 'WASTRA-SUMBA-001',
    product_match: OERIP_PRODUCTS[0],
    philosophical_quote: '“Bagaikan kuda Sumba yang pantang berbalik arah, melangkah mantap di bawah naungan pohon hayat Marapu.”',
    colors: ['Terakota Mengkudu (Kombu)', 'Indigo Sumba (Wora)', 'Krem Serat Alami'],
    tags: ['Kepemimpinan', 'Diplomasi Budaya', 'Martabat Bangsa', 'Living Heritage'],
    resonance_pillars: {
      character: 'Ketegasan Berintegritas & Karisma Ksatria',
      philosophy: 'Keberanian Melindungi Sesama & Kosmologi Marapu',
      comfort: 'Tenun Ikat Kokoh Berwibawa & Siluet Blanket Outer'
    },
    styling_tips: {
      inner: 'Kemeja kerah tegak (mandarin collar) katun putih mentah atau turtleneck tipis hitam.',
      bottom: 'Celana bahan tailored lurus hitam, kulot katun linen, atau kain sarung tenun lilit.',
      accessories: 'Bros tembaga antik Oerip, kalung tumpuk etnik pedalaman, sepatu loafers kulit.',
      hijab: 'Pashmina voal polos warna terakota tanah liat atau krem pasir mentah.'
    },
    cultural_significance: {
      origin_lore: 'Berasal dari perbukitan padang sabana Sumba Timur, tenun ikat ini dibuat melalui ritual permohonan restu roh leluhur (Marapu). Setiap tarikan motif dipintal dari benang kapas lokal dan direndam berulang kali dalam rebusan akar mengkudu selama berbulan-bulan.',
      symbolic_meanings: [
        { motif: 'Kuda Sumba (Njara)', meaning: 'Simbol kepemimpinan luhur, keberanian ksatria, dan kehormatan para bangsawan (Maramba).' },
        { motif: 'Pohon Tengkorak (Andung)', meaning: 'Lambang keteguhan batin, kejayaan spiritual, dan perlindungan bagi seluruh warga negeri.' },
        { motif: 'Buaya & Udang (Kadu Watu)', meaning: 'Kekuatan regenerasi kehidupan dan kebijaksanaan adaptif di tengah perubahan zaman.' }
      ],
      spiritual_blessing: 'Membawa energi keteguhan prinsip, karisma yang tenang, dan keberanian melindungi nilai-nilai kebajikan bersama.',
      natural_alchemy: 'Pewarna Kombu merah bata dari Morinda citrifolia berpadu dengan fermentasi daun Wora (Indigofera tinctoria).'
    }
  },
  GROUNDER: {
    archetype: 'The Serene Grounder',
    local_title: 'Keteduhan Bumi & Kesabaran Jiwa',
    category: 'mindfulness',
    description: 'Anda menghargai keaslian, ketulusan proses, dan kedamaian hidup. Anda tidak mudah terdistraksi oleh tren sesaat karena Anda percaya pada kemewahan dari hal-hal yang dibuat dengan sabar oleh ketukan tangan manusia.',
    primary_wastra: 'Batik & Tenun Gedog Tuban (Jawa Timur)',
    wastra_id: 'WASTRA-TUBAN-002',
    product_match: OERIP_PRODUCTS[2],
    philosophical_quote: '“Dari kapas pohon yang dipintal perlahan, terbit kain yang menghangatkan saat dingin dan menyejukkan saat terik.”',
    colors: ['Krem Kapas Mentah', 'Nila Daun Tom', 'Cokelat Kulit Kayu Tingi'],
    tags: ['Mindfulness', 'Slow Fashion', 'Kedamaian Organik', 'Harmoni Alam'],
    resonance_pillars: {
      character: 'Ketenangan Emosional & Ketulusan Hati',
      philosophy: 'Kesabaran Menanam Kapas & Siklus Alami Semesta',
      comfort: 'Kapas Pintal Tangan Berpori Sejuk & Loose Kimono'
    },
    styling_tips: {
      inner: 'Kaos katun bambu tanpa kerah warna krem pasir atau putih kapas alami.',
      bottom: 'Celana kulot linen longgar warna khaki, celana chino santai, atau rok katun rimpi.',
      accessories: 'Gelang kayu tasbih, tas anyaman purun/pandan, sandal selop kulit mentah.',
      hijab: 'Kerudung katun paris alami polos tanpa motif dengan draping longgar.'
    },
    cultural_significance: {
      origin_lore: 'Ditenun di pesisir utara Tuban di mana kapas ditanam sendiri oleh petani, dipintal manual dengan alat jentera kayu, lalu ditenun dengan ritme ketukan suara "dog... dog... dog..." yang menghasilkan kain bertekstur tebal dan berpori sejuk.',
      symbolic_meanings: [
        { motif: 'Ganggang & Kembang Waluh', meaning: 'Kesuburan tanah pesisir dan ketulusan berbagi rezeki dalam kesederhanaan.' },
        { motif: 'Burung Kutilang & Merak', meaning: 'Kemerdekaan jiwa dan keharmonisan hidup berdampingan dengan alam raya.' },
        { motif: 'Serat Pintal Kasar', meaning: 'Kejujuran tekstur apa adanya tanpa kepalsuan lapisan kimia industri.' }
      ],
      spiritual_blessing: 'Menghadirkan ketenangan emosional, ketabahan dalam melewati proses panjang, dan rasa syukur yang membumi.',
      natural_alchemy: 'Serat kapas mentah lokal (Gossypium) dipadukan dengan celupan daun Indigo dan fiksasi lumpur mineral.'
    }
  },
  GUARDIAN: {
    archetype: 'The Heritage Guardian',
    local_title: 'Penjaga Doa Tradisi & Ikatan Batin',
    category: 'sacred',
    description: 'Bagi Anda, warisan leluhur bukanlah artefak mati di museum, melainkan napas kehidupan yang harus dirawat dengan penuh takzim. Anda adalah tiang penyangga keluarga dan komunitas, menjunjung tinggi nilai restu, etika sakral, dan perlindungan antargenerasi.',
    primary_wastra: 'Tenun Ulos Ragidup Batak Toba (Sumatera Utara)',
    wastra_id: 'WASTRA-BATAK-003',
    product_match: OERIP_PRODUCTS[3],
    philosophical_quote: '“Ijuk ni ruma do silalap ni alogo, denggan ni basa do pargogoi tondi: Kasih sayang dan doa restu orang tua adalah penguat jiwa abadi.”',
    colors: ['Merah Darah Kehidupan', 'Hitam Fiksasi Lumpur Purba', 'Putih Tinali Doa'],
    tags: ['Spiritualitas Sakral', 'Doa Restu Orang Tua', 'Dalihan Na Tolu', 'Pusaka Tradisi'],
    resonance_pillars: {
      character: 'Kebijaksanaan Tradisi & Keteguhan Prinsip',
      philosophy: 'Doa Restu Kehidupan & Falsafah Dalihan Na Tolu',
      comfort: 'Tenun Rapat Hangat Memeluk & Rompi Adat Formal'
    },
    styling_tips: {
      inner: 'Kemeja berkerah tegak warna hitam pekat atau blus sutra berpotongan sopan.',
      bottom: 'Celana bahan bergaris tegas atau sarung tenun tradisional Toba dengan lipatan rapi.',
      accessories: 'Bros perak filigri antik, kalung liontin motif pinar halak, clutch tenun berfuring.',
      hijab: 'Jilbab segi empat warna marun tua atau hitam dengan pin perak bakar klasik.'
    },
    cultural_significance: {
      origin_lore: 'Ulos Ragidup adalah kasta tertinggi dalam hierarki ulos Batak, menyimbolkan "pola kehidupan". Ditenun dalam lima bagian terpisah yang sangat rumit lalu disatukan kembali dengan ketelitian spiritual tinggi.',
      symbolic_meanings: [
        { motif: 'Badan Ragidup & Tinali', meaning: 'Garis takdir manusia yang senantiasa berada dalam naungan Sang Pencipta.' },
        { motif: 'Pinar Halak (Bentuk Manusia)', meaning: 'Simbol garis keturunan, restu orang tua (pasu-pasu), dan doa kelangsungan generasi.' },
        { motif: 'Bintang Maratur', meaning: 'Tata krama sosial Dalihan Na Tolu dan keteraturan hidup bermasyarakat.' }
      ],
      spiritual_blessing: 'Menganugerahkan kehangatan batin (tondi), restu perlindungan dari marabahaya, dan keteguhan ikatan persaudaraan.',
      natural_alchemy: 'Pewarna daun Salaon alami untuk warna hitam pekat kebiruan, kulit kayu Mahoni, dan getah Gambir.'
    }
  },
  NOMAD: {
    archetype: 'The Nomadic Artisan',
    local_title: 'Pengelana Jiwa Seni & Kebebasan Alam',
    category: 'arts',
    description: 'Jiwa Anda senantiasa haus akan petualangan, warna-warni kehidupan baru, dan kebebasan berekspresi. Anda menolak keseragaman pabrik dan memilih busana yang memiliki jiwa, dinamika gerak, serta kisah perjalanan melintasi pulau dan benua.',
    primary_wastra: 'Tenun Ikat Flores & Sumba Eksploratif (NTT)',
    wastra_id: 'WASTRA-FLORES-004',
    product_match: OERIP_PRODUCTS[1],
    philosophical_quote: '“Setiap motif adalah peta pengembaraan jiwa, membebaskan langkah menyatu dengan deburan ombak dan angin sabana.”',
    colors: ['Indigo Laut Lepas', 'Terakota Mentah', 'Kuning Kunyit Segar'],
    tags: ['Bohemian Luxury', 'Jiwa Merdeka', 'Wearable Art', 'Eksplorasi Budaya'],
    resonance_pillars: {
      character: 'Kreativitas Lepas & Jiwa Petualang Mandiri',
      philosophy: 'Kebebasan Samudra & Ketajaman Mata Batin Flores',
      comfort: 'Draping Luwes Melayang & Asymmetrical Duster'
    },
    styling_tips: {
      inner: 'Tanktop katun rib polos, kaos longgar leher lebar, atau slip dress katun.',
      bottom: 'Celana palazzo gombrang, celana denim raw cut, atau rok tenun asimetris bertingkat.',
      accessories: 'Topi anyaman lontar Flores, gelang manik-manik etnik tumpuk, kacamata bingkai tanduk.',
      hijab: 'Pashmina crinkle warna terakota atau mustard yang dililit santai dengan layer mengalir.'
    },
    cultural_significance: {
      origin_lore: 'Menggabungkan kelenturan tenun pesisir Flores dan keberanian motif Sumba. Mencerminkan perempuan penenun tebing karang yang mengekspresikan dinamika laut dan vulkanik ke dalam untaian benang.',
      symbolic_meanings: [
        { motif: 'Mata Bolo (Mata Hati)', meaning: 'Ketajaman intuisi batin untuk melihat keindahan di balik kesederhanaan alam.' },
        { motif: 'Ayam Jago (Manuk)', meaning: 'Simbol kewaspadaan, keberanian menyambut fajar baru, dan pemandu jalan petualangan.' },
        { motif: 'Pola Ombak Samudra', meaning: 'Keluwesan beradaptasi dan keberanian mengarungi samudera kehidupan yang luas.' }
      ],
      spiritual_blessing: 'Menyalakan api kreativitas tanpa batas, intuisi tajam dalam mengambil langkah, dan aura kebebasan yang memikat.',
      natural_alchemy: 'Perpaduan rebusan rimpang kunyit mentah, kayu secang, dan fermentasi daun tarum pesisir.'
    }
  },
  LUMINARY: {
    archetype: 'The Avant-Garde Luminary',
    local_title: 'Pencari Esensi Murni & Bersahaja Modern',
    category: 'minimalist',
    description: 'Anda memandang dunia dengan kejernihan berpikir yang tajam, rasional, dan berprinsip. Anda mengagumi keindahan minimalis yang lahir dari garis murni, tanpa distraksi ornamen berlebih. Busana bagi Anda adalah cermin kejujuran batin dan kecerdasan sikap.',
    primary_wastra: 'Tenun Lurik Prasojo Klaten & Baduy (Jawa Tengah & Banten)',
    wastra_id: 'WASTRA-LURIK-006',
    product_match: OERIP_PRODUCTS[2],
    philosophical_quote: '“Lurus Ing Lakon: Menjalani hidup dengan lurus, jujur pada esensi diri, dan bersahaja dalam setiap langkah.”',
    colors: ['Monokrom Hitam Arang', 'Garis Abu Tenun', 'Cokelat Soga Tenang'],
    tags: ['Minimalis Kontemporer', 'Lurus Ing Lakon', 'Smart Casual', 'Intelektual'],
    resonance_pillars: {
      character: 'Kejujuran Intelektual & Integritas Bersahaja',
      philosophy: 'Falsafah Jawa "Lurus Ing Lakon" & Pikukuh Baduy',
      comfort: 'Tenun Garis Halus Mikro-Pori & Modern Short Kimono'
    },
    styling_tips: {
      inner: 'Kemeja katun poplin putih bersih, inner turtleneck tipis abu-abu, atau kaos crewneck katun.',
      bottom: 'Celana ankle cropped tailored, celana kulot katun hitam bergaris lurus, atau rok lipit.',
      accessories: 'Jam tangan minimalis tali kulit hitam, kacamata frame titanium, totebag kanvas tenun.',
      hijab: 'Kerudung segi empat voal premium polos warna abu semen, arang, atau hitam pekat rapi.'
    },
    cultural_significance: {
      origin_lore: 'Ditenun di Pedan, Klaten dengan alat tenun bukan mesin (ATBM). Corak garis lurik bukan sekadar motif grafis, melainkan perwujudan filosofi hidup Jawa kuno tentang kejujuran, kerendahan hati, dan keteguhan laku spiritual.',
      symbolic_meanings: [
        { motif: 'Lurik Telupat (Tiga-Empat)', meaning: 'Keseimbangan antara cipta, rasa, karsa, dan karya dalam harmoni ketuhanan.' },
        { motif: 'Corak Sapit Urang', meaning: 'Strategi pertahanan batin ksatria yang gigih menjaga kemurnian integritas diri.' },
        { motif: 'Tenun Katun Bersahaja (Prasojo)', meaning: 'Kesejukan serat alami yang ramah di kulit, nyaman dipakai di ruang kantor maupun kafe.' }
      ],
      spiritual_blessing: 'Membawa kejernihan pikiran, ketenangan sikap, dan konsistensi dalam memegang komitmen hidup.',
      natural_alchemy: 'Pintalan katun organik dengan fiksasi tawas alami dan pewarnaan indigo nabati yang lembut di kulit.'
    }
  },
  DIPLOMAT: {
    archetype: 'The Cultural Diplomat',
    local_title: 'Keagungan Maritim & Citra Bangsa',
    category: 'leadership',
    description: 'Anda adalah figur pembawa pesan perdamaian dan marwah bangsa. Anda percaya bahwa wastra adalah media diplomasi paling berdaya magis untuk menyatukan perbedaan dan memperlihatkan ketinggian peradaban Nusantara di hadapan dunia.',
    primary_wastra: 'Songket Palembang & Sutra Bugis Makassar (Sumsel & Sulsel)',
    wastra_id: 'WASTRA-SONGKET-005',
    product_match: OERIP_PRODUCTS[0],
    philosophical_quote: '“Membawa marwah tenun benang emas dan sutra maritim Nusantara ke panggung kehormatan dunia.”',
    colors: ['Kilau Emas Kencana', 'Merah Marun Bangsawan', 'Biru Samudra Dalam'],
    tags: ['Kehormatan Bangsa', 'Kemegahan Bahari', 'Diplomasi Global', 'Benang Emas'],
    resonance_pillars: {
      character: 'Karisma Kehormatan & Kemegahan Maritim',
      philosophy: 'Kedaulatan Budaya & Kejayaan Peradaban Bahari',
      comfort: 'Kemilau Benang Emas Halus & Jubah Seremonial Agung'
    },
    styling_tips: {
      inner: 'Kemeja sutra tenun polos berkerah shanghai atau blus satin sutra berpotongan asimetris.',
      bottom: 'Kain songket lilit formal berfuring sutra, celana tailored bahan wol halus, atau rok duyung katun.',
      accessories: 'Cincin emas bakar Nusantara, gesper kuningan ukir flora Sriwijaya, clutch songket beraksen kulit.',
      hijab: 'Jilbab sutra ceruti polos warna champagne gold atau marun tua dengan pin mutiara air tawar.'
    },
    cultural_significance: {
      origin_lore: 'Mengawinkan keagungan teknik benang emas peninggalan kemaharajaan maritim Sriwijaya di Palembang dengan keberanian dan keteguhan pelaut Phinisi Bugis-Makassar. Menghasilkan kain berwibawa tinggi yang menjadi busana para bangsawan agung.',
      symbolic_meanings: [
        { motif: 'Bunga Tanjung & Lepus Emas', meaning: 'Kemakmuran spiritual, wangi nama baik, dan keabadian nilai kebajikan.' },
        { motif: 'Baji Minasa & Geometri Phinisi', meaning: 'Kesiapan mengarungi samudera tantangan global dengan keberanian ksatria maritim.' },
        { motif: 'Tumpal Pucuk Rebung', meaning: 'Doa agar setiap langkah kepemimpinan senantiasa bertumbuh mengayomi rakyat banyak.' }
      ],
      spiritual_blessing: 'Menganugerahkan karisma kepemimpinan berskala global, daya tarik diplomasi yang santun, dan restu kelimpahan hidup.',
      natural_alchemy: 'Penenunan benang pakan emas halus dipadukan dengan celupan kulit kayu secang dan indigo maritim tua.'
    }
  }
};

export const WastraPersonaFinder: React.FC<WastraPersonaFinderProps> = ({
  onApplyPersona,
  onExploreWastra,
  onExploreStyling
}) => {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [resultPersonaKey, setResultPersonaKey] = useState<PersonaKey | null>(null);
  const [secondaryPersonaKey, setSecondaryPersonaKey] = useState<PersonaKey | null>(null);
  const [scorePercentages, setScorePercentages] = useState<{ primary: number; secondary: number }>({ primary: 70, secondary: 30 });
  const [copiedResult, setCopiedResult] = useState(false);
  const [activeLoreTab, setActiveLoreTab] = useState<'MYTHOLOGY' | 'SYMBOLS' | 'BLESSINGS' | 'STYLING'>('MYTHOLOGY');
  const [isLoreExpanded, setIsLoreExpanded] = useState<boolean>(true);

  const currentQuestion = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  const handleSelectOption = (option: QuestionOption) => {
    const updated = { ...answers, [currentStep]: option };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate top scoring personas
      setIsAnalyzing(true);

      setTimeout(() => {
        const scores: Record<PersonaKey, number> = { 
          SOVEREIGN: 0, 
          GROUNDER: 0, 
          GUARDIAN: 0, 
          NOMAD: 0,
          LUMINARY: 0,
          DIPLOMAT: 0
        };
        
        Object.values(updated).forEach((opt: QuestionOption) => {
          if (opt && opt.persona_score) {
            scores[opt.persona_score] = (scores[opt.persona_score] || 0) + 1;
          }
        });

        // Sort keys by score descending
        const sortedKeys = (Object.keys(scores) as PersonaKey[]).sort((a, b) => scores[b] - scores[a]);
        const primary = sortedKeys[0];
        const secondary = sortedKeys[1] || sortedKeys[0];

        const totalAnswers = QUESTIONS.length;
        const primaryPercent = Math.round((scores[primary] / totalAnswers) * 100);
        const secondaryPercent = Math.round((scores[secondary] / totalAnswers) * 100);

        setResultPersonaKey(primary);
        setSecondaryPersonaKey(secondary !== primary ? secondary : null);
        setScorePercentages({
          primary: Math.max(primaryPercent, 55),
          secondary: secondary !== primary ? Math.min(secondaryPercent || 25, 45) : 0
        });
        setIsAnalyzing(false);

        const primaryResult = PERSONA_RESULTS[primary];
        toast.success(`Jati diri wastra Anda: ${primaryResult.archetype} (${primaryResult.local_title})`, {
          title: 'Persona Terungkap'
        });
      }, 1100);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultPersonaKey(null);
    setSecondaryPersonaKey(null);
    setIsLoreExpanded(true);
    setActiveLoreTab('MYTHOLOGY');
    toast.info('Kuis jati diri diulang dari awal.', {
      title: 'Kuis Dimulai Ulang'
    });
  };

  const result = resultPersonaKey ? PERSONA_RESULTS[resultPersonaKey] : null;
  const secondary = secondaryPersonaKey ? PERSONA_RESULTS[secondaryPersonaKey] : null;

  const generateShareText = () => {
    if (!result) return '';
    return (
      `🌿 Wastra Jati Diri Saya bersama Oerip Indonesia:\n` +
      `✨ Persona Utama: ${result.archetype} (${result.local_title})\n` +
      (secondary ? `✨ Nuansa Jiwa: ${secondary.archetype} (${secondary.local_title})\n` : '') +
      `🧵 Wastra Selaras: ${result.primary_wastra}\n` +
      `🧥 Rekomendasi Busana: ${result.product_match.product_name}\n` +
      `📜 Filosofi Hidup: ${result.philosophical_quote}\n\n` +
      `Ditemukan melalui Kuis Jati Diri Wastra Budaya Oerip Indonesia.`
    );
  };

  const handleCopyPersona = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2200);
    toast.success('Rangkuman persona jati diri berhasil disalin ke papan klip.', {
      title: 'Persona Disalin'
    });
  };

  const handleApplyToStyling = () => {
    if (result) {
      toast.success(`Persona ${result.archetype} (${result.local_title}) diselaraskan ke kurasi busana.`, {
        title: 'Persona Applied'
      });
    }
    if (onExploreStyling) {
      onExploreStyling();
    }
  };

  const handleApplyToConsultation = () => {
    if (result) {
      toast.success(`Arketipe ${result.archetype} (${result.local_title}) diaktifkan ke konsultasi KIRA AI.`, {
        title: 'Persona Applied'
      });
    }
    if (onApplyPersona) {
      onApplyPersona(generateShareText());
    }
  };

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Quiz Suite Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] text-[#963824] text-xs font-semibold uppercase tracking-wider border border-[#E7DFD5]">
          <Compass size={14} className="text-[#963824]" />
          <span>Kuis Jati Diri Wastra Nusantara</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Temukan Wastra Jati Diri Anda
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          Singkap keselarasan antara energi kepribadian, kompas batin, dan kepekaan rasa Anda dengan filosofi kain tenun Nusantara serta karya busana Dian Oerip.
        </p>
      </div>

      {/* Analyzing Transition Screen */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-10 sm:p-14 rounded-3xl bg-white border border-[#E7DFD5] shadow-sm text-center space-y-5 max-w-lg mx-auto"
        >
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#F5EFE6] border-t-[#963824] animate-spin" />
            <Compass size={32} className="text-[#963824]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Menyelaraskan Jiwa Wastra...
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Mengkorelasikan 6 pilar jati diri Anda dengan khazanah tenun sakral Nusantara dan prinsip busana minim potong Oerip Indonesia.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[11px] text-[#963824] border border-[#E7DFD5]">
            <Sparkles size={12} />
            <span>Harmonisasi Karakter, Filosofi, & Kenyamanan</span>
          </div>
        </motion.div>
      )}

      {/* Interactive Quiz Flow (When not analyzing and not completed) */}
      {!isAnalyzing && !resultPersonaKey && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DFD5] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#963824] text-white font-bold text-[10px]">
                  Langkah {currentStep + 1} dari {QUESTIONS.length}
                </span>
                <span className="font-medium text-[#1C1917] hidden sm:inline">
                  {currentQuestion.pillar}
                </span>
              </div>
              <span className="font-mono font-semibold text-[#963824]">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F5EFE6] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#963824] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7DFD5] shadow-xs space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#963824] uppercase tracking-wider block">
                  {currentQuestion.pillar}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                  {currentQuestion.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentStep]?.id === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-md ring-2 ring-[#963824]/30'
                          : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6] hover:border-[#963824]/40 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isSelected 
                              ? 'bg-[#C89B53] text-[#1C1917]' 
                              : 'bg-white text-[#78716C] border border-[#E7DFD5]'
                          }`}>
                            Pilihan {opt.id}
                          </span>
                          {isSelected && <Check size={14} className="text-[#C89B53]" />}
                        </div>
                        <h3 className={`font-serif font-bold text-sm leading-snug pt-1 ${
                          isSelected ? 'text-[#FAF7F2]' : 'text-[#1C1917]'
                        }`}>
                          {opt.label}
                        </h3>
                        <p className={`text-xs leading-relaxed ${
                          isSelected ? 'text-[#FAF7F2]/80' : 'text-[#57534E]'
                        }`}>
                          {opt.sublabel}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-current/10 flex items-center justify-end text-[11px] font-semibold opacity-80 group-hover:opacity-100">
                        <span className="flex items-center gap-1">
                          <span>Pilih resonansi ini</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation Back Button */}
              {currentStep > 0 && (
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#57534E] text-xs font-medium border border-[#E7DFD5] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>Kembali ke Pertanyaan Sebelumnya</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Results View */}
      {!isAnalyzing && resultPersonaKey && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Main Persona Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E7DFD5] shadow-sm space-y-8">
            
            {/* Header Archetype Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5EFE6] text-[#963824] text-xs font-semibold border border-[#E7DFD5]">
                <Sparkles size={14} />
                <span>Persona Budaya Terungkap</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                {result.archetype}
              </h2>
              <p className="text-sm font-serif italic text-[#963824]">
                {result.local_title}
              </p>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed pt-1">
                {result.description}
              </p>
            </div>

            {/* Resonance Duality Breakdown (Primary + Secondary) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1C1917]">
                <span className="flex items-center gap-1.5">
                  <Compass size={14} className="text-[#963824]" />
                  <span>Spektrum Harmonisasi Kepribadian</span>
                </span>
                <span className="text-[11px] text-[#78716C]">
                  {scorePercentages.primary}% Utama • {secondary ? `${scorePercentages.secondary}% Nuansa` : 'Murni'}
                </span>
              </div>

              <div className="w-full h-3 bg-[#E7DFD5] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[#963824] transition-all"
                  style={{ width: `${scorePercentages.primary}%` }}
                  title={`${result.archetype} (${scorePercentages.primary}%)`}
                />
                {secondary && (
                  <div 
                    className="h-full bg-[#C89B53] transition-all"
                    style={{ width: `${scorePercentages.secondary}%` }}
                    title={`${secondary.archetype} (${scorePercentages.secondary}%)`}
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#963824] shrink-0" />
                  <span className="font-semibold text-[#1C1917]">
                    Dominan: {result.archetype} ({scorePercentages.primary}%)
                  </span>
                </div>
                {secondary && (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C89B53] shrink-0" />
                    <span className="text-[#57534E]">
                      Nuansa Jiwa: {secondary.archetype} ({scorePercentages.secondary}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Philosophical Quote Card */}
            <div className="p-5 rounded-2xl bg-[#1C1917] text-[#FAF7F2] text-center space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C89B53]">
                Mantra & Kompas Batin
              </span>
              <p className="font-serif italic text-sm sm:text-base leading-relaxed text-[#FAF7F2]/90">
                {result.philosophical_quote}
              </p>
            </div>

            {/* Three Resonance Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#963824] block">
                  1. Aura Karakter
                </span>
                <p className="text-xs font-semibold text-[#1C1917]">
                  {result.resonance_pillars.character}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#963824] block">
                  2. Kompas Filosofi
                </span>
                <p className="text-xs font-semibold text-[#1C1917]">
                  {result.resonance_pillars.philosophy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#963824] block">
                  3. Kenyamanan & Siluet
                </span>
                <p className="text-xs font-semibold text-[#1C1917]">
                  {result.resonance_pillars.comfort}
                </p>
              </div>
            </div>

            {/* Wastra Match & Signature Product Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E7DFD5]">
              
              {/* Wastra Match */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#963824] uppercase tracking-wider">
                  <Scroll size={14} />
                  <span>Wastra Jati Diri Selaras</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
                  <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                    {result.primary_wastra}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-white text-[#57534E] text-[10px] font-medium border border-[#E7DFD5]">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-[#57534E] space-y-1">
                    <p><strong>Palet Alami:</strong> {result.colors.join(' • ')}</p>
                    <p><strong>Nilai Utama:</strong> {result.cultural_significance.symbolic_meanings[0]?.meaning}</p>
                  </div>
                </div>
              </div>

              {/* Signature Product */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#963824] uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Rekomendasi Koleksi Oerip</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex gap-4 items-center">
                  <img 
                    src={result.product_match.image} 
                    alt={result.product_match.product_name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-[#E7DFD5] shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                  />
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-[#963824] font-bold">
                      {result.product_match.product_id}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#1C1917] leading-snug">
                      {result.product_match.product_name}
                    </h4>
                    <p className="text-[11px] text-[#57534E] line-clamp-2">
                      {result.product_match.short_description}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white text-[#1C1917] text-[10px] font-bold border border-[#E7DFD5] mt-1">
                      {result.product_match.price_range}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Cultural Lore & Styling Deep Dive */}
            <div className="space-y-4 pt-4 border-t border-[#E7DFD5]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                  <Layers size={16} className="text-[#963824]" />
                  <span>Kajian Mendalam Wastra Jati Diri</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLoreExpanded(!isLoreExpanded)}
                  className="text-xs font-semibold text-[#963824] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
                >
                  <span>{isLoreExpanded ? 'Tutup Kajian' : 'Buka Kajian'}</span>
                  {isLoreExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {isLoreExpanded && (
                <div className="space-y-4">
                  {/* Lore Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E7DFD5]">
                    {[
                      { id: 'MYTHOLOGY', label: '1. Mitologi & Spiritualitas', icon: Scroll },
                      { id: 'SYMBOLS', label: '2. Tiga Simbol Sakral', icon: Layers },
                      { id: 'BLESSINGS', label: '3. Doa & Alkimia Pewarna', icon: Leaf },
                      { id: 'STYLING', label: '4. Panduan Padu-Padan', icon: Sparkle }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeLoreTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveLoreTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                              : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F5EFE6]'
                          }`}
                        >
                          <Icon size={12} className={isActive ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Lore Content Box */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs leading-relaxed text-[#57534E]">
                    {activeLoreTab === 'MYTHOLOGY' && (
                      <div className="space-y-2">
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          Asal-Usul & Spiritualitas Leluhur
                        </h4>
                        <p>{result.cultural_significance.origin_lore}</p>
                      </div>
                    )}

                    {activeLoreTab === 'SYMBOLS' && (
                      <div className="space-y-3">
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          Tiga Simbol Kunci & Makna Filosofis
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {result.cultural_significance.symbolic_meanings.map((sym, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-[#E7DFD5] space-y-1">
                              <strong className="text-[#963824] block font-serif text-[11px]">{sym.motif}</strong>
                              <p className="text-[11px] text-[#57534E]">{sym.meaning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeLoreTab === 'BLESSINGS' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                          <strong className="block font-bold">Doa & Berkat Batin Wastra:</strong>
                          <p>{result.cultural_significance.spiritual_blessing}</p>
                        </div>
                        <div className="p-3 bg-white border border-[#E7DFD5] rounded-xl space-y-1">
                          <strong className="block text-[#1C1917] font-bold">Alkimia Pewarna Alami Tanpa Kimia:</strong>
                          <p>{result.cultural_significance.natural_alchemy}</p>
                        </div>
                      </div>
                    )}

                    {activeLoreTab === 'STYLING' && (
                      <div className="space-y-3">
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          Panduan Padu-Padan Kontemporer Oerip
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="p-3 bg-white rounded-xl border border-[#E7DFD5] space-y-1">
                            <strong className="text-[#963824] text-[11px] block">Inner / Atasan Dalam:</strong>
                            <p className="text-[11px]">{result.styling_tips.inner}</p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E7DFD5] space-y-1">
                            <strong className="text-[#963824] text-[11px] block">Bawahan / Celana:</strong>
                            <p className="text-[11px]">{result.styling_tips.bottom}</p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E7DFD5] space-y-1">
                            <strong className="text-[#963824] text-[11px] block">Aksesoris Etnik:</strong>
                            <p className="text-[11px]">{result.styling_tips.accessories}</p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E7DFD5] space-y-1">
                            <strong className="text-[#963824] text-[11px] block">Panduan Hijab Friendly:</strong>
                            <p className="text-[11px]">{result.styling_tips.hijab}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#57534E] text-xs font-semibold flex items-center gap-1.5 border border-[#E7DFD5] transition-colors cursor-pointer w-full sm:w-auto justify-center"
              >
                <RotateCcw size={14} />
                <span>Ulangi Kuis Jati Diri</span>
              </button>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCopyPersona}
                  className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#1C1917] text-xs font-semibold flex items-center gap-1.5 border border-[#E7DFD5] transition-colors cursor-pointer"
                >
                  {copiedResult ? <Check size={14} className="text-emerald-700" /> : <Share2 size={14} />}
                  <span>{copiedResult ? 'Hasil Tersalin!' : 'Bagikan Persona'}</span>
                </button>

                {onExploreStyling && (
                  <button
                    type="button"
                    onClick={handleApplyToStyling}
                    className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#963824] text-xs font-semibold flex items-center gap-1.5 border border-[#D4C9BC] transition-colors cursor-pointer"
                  >
                    <Layers size={14} className="text-[#963824]" />
                    <span>Coba di Rekomendasi Gaya</span>
                  </button>
                )}

                {onApplyPersona && (
                  <button
                    type="button"
                    onClick={handleApplyToConsultation}
                    className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332D27] text-[#FAF7F2] text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-[#C89B53]" />
                    <span>Konsultasikan dengan KIRA AI</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};
