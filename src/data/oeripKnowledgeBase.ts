import {
  BusinessProfile,
  KnowledgeItem,
  ProductItem,
  WastraItem,
  SocialMediaPost,
  RestrictedDataItem,
  FAQItem,
  BrandEntity,
  ContentGuidelineEntity,
  SourceEntity,
  AIFeedbackItem
} from '../types';

export const BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'OERIP',
    name: 'Oerip Indonesia',
    founder: 'Dian Errakumalasari (Dian Oerip)',
    city: 'Ngawi, Jawa Timur',
    tagline: 'Living Heritage, Zero-Waste Etnik Kontemporer',
    description: 'Jenama fesyen etnik kontemporer dan berkelanjutan (sustainable fashion) yang mengolah wastra tradisional tenun tangan Nusantara menjadi busana ready-to-wear modern bergaya bohemian, loose, dan versatile dengan menjaga orisinalitas kain tenun.',
    is_active_pilot: true,
    verified_socials: ['@oerip_official', '@dian_oerip']
  }
];

export const KIRA_ADMIN_CONTACT = {
  phone_raw: '+6285174485581',
  phone_display: '+62 851-7448-5581',
  wa_number: '6285174485581',
  wa_link: 'https://wa.me/6285174485581'
};

export const OERIP_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'KB-BRAND-001',
    business_id: 'OERIP',
    category: 'BRAND',
    title: 'Profil & Identitas Oerip Indonesia',
    content: 'Oerip Indonesia adalah jenama fesyen etnik kontemporer dan berkelanjutan (sustainable fashion) asal Ngawi, Jawa Timur, yang didirikan oleh Dian Errakumalasari (Dian Oerip). Oerip mengolah beragam wastra tradisional Nusantara (terutama tenun tangan dari berbagai pelosok Indonesia) menjadi busana ready-to-wear modern bergaya bohemian, loose, dan versatile dengan tetap menjaga orisinalitas kain tenun.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian A. Informasi Umum Oerip No. 1-2',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari (Cultural & Creative Director) & Bagas Qolbu Cetta (CEO)',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-BRAND-002',
    business_id: 'OERIP',
    category: 'BRAND',
    title: 'Visi Utama Pelestarian Wastra Nusantara',
    content: 'Menjadikan wastra Nusantara bagian dari gaya hidup sehari-hari masyarakat modern dunia, menghidupkan ekosistem para penenun lokal di berbagai pelosok Indonesia, serta menjaga warisan spiritual dan kultural di balik setiap helai kain tenun tangan.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian A. Informasi Umum Oerip No. 3',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-BRAND-003',
    business_id: 'OERIP',
    category: 'BRAND',
    title: 'Diferensiasi Utama Oerip (Zero-Waste, Oversized All-Size, Living Heritage)',
    content: 'Tiga pilar pembeda Oerip:\n1. Konsep Minim Potong / Zero Waste: Menghargai proses sakral penenun dengan meminimalisir pemotongan kain agar motif dan struktur kain tetap utuh.\n2. Siluet Oversized & All-Size: Busana berkarakter bebas, inklusif, gender-neutral / unisex, dan sangat adaptif untuk berbagai bentuk tubuh (Lingkar Dada fleksibel 100–130 cm).\n3. Living Heritage & Direct Empowerment: Pendekatan riset langsung (spiritual journey) menemui para penenun di pelosok (Sumba, Tuban, Toraja, Halmahera, Flores, dll.) dan memprioritaskan pewarna alami ramah lingkungan.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian A. Informasi Umum Oerip No. 4',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-BRAND-004',
    business_id: 'OERIP',
    category: 'CUSTOMER_NEEDS',
    title: 'Target Konsumen & Karakter Persona Oerip',
    content: 'Target konsumen utama Oerip meliputi: Dewasa muda, Dewasa, Kolektor/Pencinta Wastra, Wisatawan, Institusi/Perusahaan (Diplomasi Budaya & B2B), Komunitas Diaspora, Seniman/Budayawan, dan Ekspatriat. Persona komunikasi KIRA berkarakter berbudaya, edukatif, hangat, puitis/penuh filosofi (storyteller), apresiatif terhadap pengrajin daerah, serta inklusif dan ramah menyapa ("Oerip Lovers" / "Sahabat Budaya").',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian A. No. 5-6 & Bagian D',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Bagas Qolbu Cetta (CEO)',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-TECH-001',
    business_id: 'OERIP',
    category: 'TECHNIQUES',
    title: 'Filosofi Konsep Minim Potong (Zero-Waste)',
    content: 'Oerip memperlakukan setiap helai kain tenun tangan sebagai karya seni hidup yang utuh. Teknik potong tradisional Barat dihindari; sebaliknya busana dirancang mengikuti bentang geometri kain tenun asli agar benang dan motif sakral tidak terputus sia-sia.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI & Buku Soul Craft Kriya Jiwa',
    source_reference: 'Buku Soul Craft Kriya Jiwa Dian Erra Kumalasari',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-CARE-001',
    business_id: 'OERIP',
    category: 'CARE_GUIDES',
    title: 'Panduan Perawatan Resmi Tenun Pewarna Alami',
    content: 'Perawatan Wastra Tenun Pewarna Alam:\n1. Cuci terpisah menggunakan tangan dengan lerak (buah lerak) atau sampo rambut lembut berkadar pH netral.\n2. Jangan menggunakan deterjen keras atau pemutih.\n3. Jangan diperas dengan kuat atau dipelintir.\n4. Jemur di tempat teduh yang berangin dan tidak terpapar sinar matahari langsung untuk menjaga keutuhan pigmen alami.\n5. Setrika dengan suhu sedang (medium heat) dari bagian dalam, atau gunakan kain pelapis.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian C. Data Produk Oerip No. 14',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'PUBLIC'
  },
  {
    id: 'KB-GUARD-001',
    business_id: 'OERIP',
    category: 'GUARDRAILS',
    title: 'Batasan Mutlak Klaim Budaya & Anti-Halusinasi',
    content: 'KIRA DILARANG KERAS:\n1. Mengklaim kain tenun tangan sebagai kain print pabrik / tekstil industri.\n2. Mengklaim warna alam 100% tahan luntur abadi tanpa edukasi instruksi perawatan khusus.\n3. Menyederhanakan motif sakral adat menjadi sekadar "pola dekoratif".\n4. Menemukan/mengarang asal suku, teknik tenun fiktif, atau makna spiritual tanpa rujukan pustaka terverifikasi.\n5. Jika informasi tidak ada di Knowledge Base, wajib menolak dengan sopan dan mengarahkan ke Tim Kurasi Oerip.',
    source_type: 'LEVEL_1_PRIMARY',
    source_name: 'Form Pengumpulan Data Oerip AI',
    source_reference: 'Bagian B. No. 10 & Bagian G. No. 5',
    source_date: '2026-08-25',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_updated: '2026-08-25',
    cultural_sensitivity_level: 'CULTURAL_RESPECT'
  }
];

export const OERIP_PRODUCTS: ProductItem[] = [
  {
    product_id: 'OERIP-OUT-001',
    business_id: 'OERIP',
    product_name: 'Oerip Signature Blanket Outer / Kimono Nusantara',
    category: 'Outerwear / Kimono / Poncho / Jubah Etnik',
    description: 'Busana luaran multifungsi berpotongan minim potong yang menampilkan keaslian corak tenun tangan Nusantara, nyaman dipakai harian maupun acara diplomasi formal.',
    textile: 'Kombinasi Tenun Gedog Tuban & Tenun Sumba / Lurik',
    textile_origin: 'Tuban (Jawa Timur) & Sumba Timur (Nusa Tenggara Timur)',
    technique: 'Tenun Gedogan Tradisional & Tenun Ikat Tangan Asli',
    material: 'Katun tenun tangan (benang pintal tangan dengan pewarna alam)',
    motif: 'Motif Siklus Hayat Sumba & Garis Harmonik Gedog Tuban',
    colors: ['Indigo Blue', 'Terakota', 'Off-white', 'Hitam'],
    size: 'All Size / Free Size (Desain loose fit fleksibel LD 100–130 cm)',
    silhouette: 'Oversized Bohemian Outer berpotongan jatuh natural (fluid draping)',
    occasion: [
      'Acara kebudayaan',
      'Diplomasi resmi',
      'Art event / Pameran seni',
      'Menghadiri resepsi formal',
      'Fesyen traveling',
      'Smart-casual di kantor'
    ],
    styling_notes: 'Dapat dipadukan dengan celana panjang kulot katun/linen polos atau inner dress netral warna hitam/krem. Aksen drape loose memberikan wibawa elegan tanpa kekakuan pakaian formal konvensional.',
    cultural_story: 'Dirancang untuk memberikan kebebasan bergerak tanpa merusak lembaran karya seni penenun tradisional. Memadukan keteduhan Tenun Gedog Tuban dari pesisir Jawa dan kemegahan Tenun Sumba yang sarat doa Marapu, menghadirkan nuansa etnik berkelas di panggung diplomasi dunia.',
    care_instruction: 'Cuci terpisah dengan lerak/sampo lembut, jangan diperas kuat, jemur di tempat teduh tanpa matahari langsung, setrika suhu sedang.',
    price_range: 'Rp 1.500.000 – Rp 4.500.000',
    price_note: 'Tergantung kelangkaan kain & proses pewarnaan alam. Hubungi admin untuk ketersediaan pieces eksklusif.',
    availability: 'Koleksi Signature Berkelanjutan (One-of-a-kind Pieces, hubungi admin untuk konfirmasi stok terkini)',
    image: '/images/oerip_blanket_outer_1789048086335.jpg',
    official_source: 'Form Pengumpulan Data Oerip AI (Bagian C. Data Produk Oerip)',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari & Tim Kurasi Oerip',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-KIM-002',
    business_id: 'OERIP',
    product_name: 'Oerip Bohemian Sumba Long Duster Robe',
    category: 'Outerwear / Long Cardigan / Robe',
    description: 'Long outerwear megah berbasis Tenun Ikat Sumba Timur bermotif Kuda (Njara) dan Pohon Hayat (Andung) berpadu pewarna alami akar mengkudu dan nila.',
    textile: 'Tenun Ikat & Pahikung Sumba Timur Asli',
    textile_origin: 'Sumba Timur, Nusa Tenggara Timur (NTT)',
    technique: 'Tenun Gedogan Ikat Tangan pewarna alam murni',
    material: '100% Katun pintal tangan alami',
    motif: 'Kuda (Njara), Pohon Hayat (Andung), Figur Leluhur',
    colors: ['Terakota / Cokelat Merah Mengkudu', 'Biru Indigo Nila Tua', 'Krem Kapas Alami'],
    size: 'All Size Loose Fit (LD hingga 130 cm)',
    silhouette: 'Long fluid silhouette dengan kerah kimono draped',
    occasion: [
      'Gala diplomasi internasional',
      'Malam penganugerahan budaya',
      'Resepsi pernikahan agung',
      'Art exhibition opening'
    ],
    styling_notes: 'Padukan dengan inner dress polos monokrom gelap atau celana palazzo sutra mentah. Biarkan keagungan tenun Sumba menjadi pusat perhatian utama.',
    cultural_story: 'Kuda (Njara) dalam kebudayaan Sumba Timur melambangkan kepemimpinan, keberanian, dan kehormatan para ksatria. Tenun ini dibuat melalui proses ritual sakral selama berbulan-bulan oleh mama-mama penenun Sumba.',
    care_instruction: 'Dry clean atau cuci tangan dengan lerak khusus wastra, simpan dengan gantungan busa dan berikan cengkeh/lada di lemari penyimpan.',
    price_range: 'Rp 2.800.000 – Rp 5.200.000',
    price_note: 'Rentang harga tercatat pada arsip koleksi Oerip. Hubungi Tim Oerip untuk pemesanan kurasi khusus.',
    availability: 'Eksklusif / Terbatas (Karakteristik kain tenun tangan satu-satu)',
    image: '/images/oerip_sumba_duster_1789048101881.jpg',
    official_source: 'Dokumentasi Kurasi Perjalanan Riset Dian Oerip & Lookbook Resmi',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-LUR-003',
    business_id: 'OERIP',
    category: 'Kimono Pendek / Casual Robe',
    product_name: 'Oerip Contemporary Lurik Minimalist Short Kimono',
    description: 'Kimono pendek berpotongan rileks mengombinasikan Tenun Lurik Prasojo Klaten dan aksen Tenun Gedog Tuban warna bumi.',
    textile: 'Tenun Lurik Tradisional Prasojo & Katun Gedog',
    textile_origin: 'Klaten & Tuban (Jawa)',
    technique: 'Tenun ATBM Tradisional & Gedogan',
    material: 'Katun adem bertekstur nap alami',
    motif: 'Lurik Telupat & Garis Harmoni Bumi',
    colors: ['Hitam Arang', 'Indigo Blue', 'Abu-abu Alami', 'Krem'],
    size: 'All Size Loose Fit (LD 100–125 cm)',
    silhouette: 'Short relaxed kimono with wide sleeve hems',
    occasion: [
      'Smart-casual di kantor',
      'Workshop kreatif',
      'Daily bohemian styling',
      'Diskusi budaya informal'
    ],
    styling_notes: 'Sangat serasi dipadukan dengan celana denim favorit, kaos putih polos, atau sneakers kasual untuk tampilan modern berselera tinggi.',
    cultural_story: 'Lurik mengajarkan filosofi "lurus ing lakon" (kejujuran dan kesahajaan hidup). Dikombinasikan dengan sentuhan bohemian Oerip agar menjadi busana harian generasi muda yang bangga akan akar budayanya.',
    care_instruction: 'Cuci tangan dengan air dingin dan sampo lembut, hindari paparan terik matahari langsung.',
    price_range: 'Rp 1.200.000 – Rp 2.400.000',
    price_note: 'Rentang harga estimasi berdasarkan data koleksi tercatat.',
    availability: 'Tersedia dalam variasi motif garis eksklusif',
    image: '/images/oerip_lurik_kimono_1789048117010.jpg',
    official_source: 'Katalog Koleksi Ready-to-Wear Oerip Indonesia',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-ULO-004',
    business_id: 'OERIP',
    category: 'Statement Vest / Structured Outer',
    product_name: 'Oerip Heritage Ulos Statement Vest / Outer',
    description: 'Vest luaran berstruktur tegas yang mengadaptasi kain Ulos Ragidup Batak dengan perpaduan tenun polos katun mentah.',
    textile: 'Tenun Ulos Ragidup & Katun Pintal Alami',
    textile_origin: 'Toba Samosir, Sumatera Utara',
    technique: 'Tenun Gedogan Ulos Tradisional',
    material: 'Benang katun kuat berserat tegas',
    motif: 'Bintang Maratur & Garis Pembawa Kehangatan Hidup',
    colors: ['Hitam Pekat', 'Merah Marun Alami', 'Aksen Putih Kapas'],
    size: 'All Size (LD 100–120 cm)',
    silhouette: 'Structured long vest with open-front collar',
    occasion: [
      'Resepsi formal',
      'Pertemuan bilateral / Forum diplomasi B2B',
      'Pidato kehormatan kebudayaan'
    ],
    styling_notes: 'Padukan dengan kemeja kerah tegak (mandarin collar) putih dan celana bahan wol hitam untuk kesan berwibawa dan penuh penghormatan.',
    cultural_story: 'Ulos melambangkan berkat kehidupan, penghormatan antargenerasi, serta kehangatan doa restu para leluhur. Oerip menghadirkan Ulos dalam siluet modern tanpa merusak pakem sakral ragam hiasnya.',
    care_instruction: 'Perawatan khusus: jangan disikat, cuci kering atau hand-wash dengan lerak cair.',
    price_range: 'Rp 2.200.000 – Rp 4.800.000',
    price_note: 'Harga bergantung pada orisinalitas kain ulos dan tingkat kerumitan tenunan.',
    availability: 'Kurasi Khusus (Konfirmasi kepada Tim Kurasi Oerip)',
    image: '/images/oerip_ulos_vest_1789048137063.jpg',
    official_source: 'Dokumentasi Pameran Museum Oerip Indonesia',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-CAP-005',
    business_id: 'OERIP',
    category: 'Cape & Wrap / Asymmetric Shawl',
    product_name: 'Oerip Zero-Waste Asymmetric Gedog Cape Wrap',
    description: 'Cape berpotongan asimetris tanpa potong kain yang membalut bahu secara anggun dengan material Tenun Gedog Tuban dan aksen rumbai raw edge.',
    textile: 'Tenun Gedog Tuban Pewarna Daun Nila & Kayu Tingi',
    textile_origin: 'Tuban, Jawa Timur',
    technique: 'Tenun Gedogan Klasik & Hand-Knotted Fringe',
    material: 'Kapas kenthang lokal bertekstur nap',
    motif: 'Ganggeng & Garis Pantai Pesisir Jawa',
    colors: ['Biru Indigo Nila', 'Krem Alami', 'Abu Serat Kapas'],
    size: 'All Size Versatile Wrap',
    silhouette: 'Asymmetric Shoulder Cape with Draped Front',
    occasion: [
      'Gala diplomasi internasional',
      'Art event / Pameran seni',
      'Smart-casual di kantor',
      'Pesta & Resepsi'
    ],
    styling_notes: 'Dapat disampirkan di atas gaun malam polos atau kemeja berkerah untuk menambahkan aksen etnik yang modern dan elegan.',
    cultural_story: 'Menghormati kesederhanaan hidup petani kapas Tuban. Potongan asimetris dibentuk murni dari lipatan geometri kain tanpa memotong satu pun helai benang.',
    care_instruction: 'Cuci tangan lembut dengan lerak cair, jemur di tempat teduh.',
    price_range: 'Rp 1.600.000 – Rp 3.200.000',
    price_note: 'Karya zero waste eksklusif.',
    availability: 'Tersedia Terbatas',
    image: '/images/oerip_gedog_cape_1789048156376.jpg',
    official_source: 'Katalog Koleksi Zero Waste Oerip Indonesia',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-DRS-006',
    business_id: 'OERIP',
    category: 'Dress & Set / Tunic Wrap',
    product_name: 'Oerip Living Heritage Tunic Dress & Selendang Set',
    description: 'Set tunik loose fit panjang dengan aksen selendang Tenun Toraja warna bumi yang serasi untuk acara resmi keluarga maupun jamuan agung.',
    textile: 'Tenun Ikat Toraja Sa\'dan & Katun Mori Alami',
    textile_origin: 'Tana Toraja, Sulawesi Selatan',
    technique: 'Tenun Gedogan Tradisional Toraja',
    material: 'Katun mori sejuk berpadu tenun berserat rapat',
    motif: 'Pa\'teddong (Kerbau) & Sekong Kandeata',
    colors: ['Terakota Tanah Toraja', 'Hitam Arang', 'Emas Ochre'],
    size: 'All Size Loose (LD 105–130 cm)',
    silhouette: 'Maxi Tunic Dress dengan Draped Side Slit',
    occasion: [
      'Resepsi pernikahan agung',
      'Acara kebudayaan',
      'Acara Resmi',
      'Malam penganugerahan budaya'
    ],
    styling_notes: 'Padukan dengan kalung tempa kuningan dan sandal kulit etnik untuk siluet yang menjulang tinggi dan penuh keanggunan.',
    cultural_story: 'Motif kerbau (Pa\'teddong) melambangkan kemakmuran, kemurahan hati, dan pengorbanan suci dalam tata hidup masyarakat Toraja.',
    care_instruction: 'Dry clean atau cuci tangan terpisah dengan sabun lerak netral.',
    price_range: 'Rp 2.600.000 – Rp 5.500.000',
    price_note: 'Set lengkap dengan selendang tenun tangan.',
    availability: 'Koleksi Eksklusif',
    image: '/images/oerip_toraja_tunic_1789048169122.jpg',
    official_source: 'Dokumentasi Kurasi Dian Oerip - Toraja Heritage',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-PON-007',
    business_id: 'OERIP',
    category: 'Poncho & Shawl / Cape',
    product_name: 'Oerip Flores Geometric Reversible Poncho',
    description: 'Poncho wol katun hangat dengan motif tenun ikat Flores yang dapat dikenakan bolak-balik untuk perjalanan traveling dan musim dingin.',
    textile: 'Tenun Ikat Ende Lio & Katun Tenun Halus',
    textile_origin: 'Ende, Flores, Nusa Tenggara Timur (NTT)',
    technique: 'Tenun Ikat Tradisional Dua Muka',
    material: 'Katun tebal bertekstur lembut',
    motif: 'Mata Bolo & Belah Ketupat Pelindung Jiwa',
    colors: ['Merah Marun Alami', 'Cokelat Gelap', 'Kuning Kunyit'],
    size: 'Free Size Oversized Poncho',
    silhouette: 'Draped Poncho with Fringe Hem',
    occasion: [
      'Fesyen traveling',
      'Smart-casual di kantor',
      'Pertunjukan seni',
      'Daily bohemian styling'
    ],
    styling_notes: 'Sangat cocok untuk perjalanan ke destinasi dingin maupun ruang ber-AC, memberikan kehangatan sekaligus pernyataan gaya berkarakter.',
    cultural_story: 'Pola geometris Mata Bolo melambangkan mata batin yang waspada dan kehangatan persaudaraan warga lereng pegunungan Flores.',
    care_instruction: 'Cuci dengan sampo rambut bayi/lerak, jangan dipelintir.',
    price_range: 'Rp 1.800.000 – Rp 3.600.000',
    price_note: 'Reversible dua sisi motif.',
    availability: 'Tersedia',
    image: '/images/oerip_flores_poncho_1789048186389.jpg',
    official_source: 'Katalog Koleksi Nusantara Oerip',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip',
    last_verified: '2026-08-25'
  },
  {
    product_id: 'OERIP-VES-008',
    business_id: 'OERIP',
    category: 'Vest & Rompi / Layering Piece',
    product_name: 'Oerip Earth-Tone Minimalist Sleeveless Vest',
    description: 'Rompi luaran tanpa lengan dengan potongan leher V berpadu tenun lurik katun dan aksen Tenun Sumba di bagian kantong depan.',
    textile: 'Tenun Lurik Klaten & Aksen Tenun Sumba',
    textile_origin: 'Klaten & Sumba Timur',
    technique: 'Tenun ATBM & Aplikasi Tenun Ikat',
    material: 'Katun twill nap alami',
    motif: 'Garis Pinstripe Lurik & Motif Kuda Sumba',
    colors: ['Hitam Arang', 'Terakota', 'Krem'],
    size: 'All Size (LD 100–120 cm)',
    silhouette: 'Relaxed Sleeveless Vest with Deep Pockets',
    occasion: [
      'Smart-casual di kantor',
      'Workshop kreatif',
      'Diskusi budaya informal',
      'Acara Resmi'
    ],
    styling_notes: 'Padukan dengan kemeja putih berlengan panjang atau turtle neck hitam untuk gaya layering kantor yang kontemporer.',
    cultural_story: 'Perpaduan harmoni antara kesederhanaan Lurik Jawa dan kemegahan Tenun Sumba, mencerminkan persatuan dalam keberagaman wastra Indonesia.',
    care_instruction: 'Cuci terpisah dengan air dingin, setrika suhu sedang.',
    price_range: 'Rp 1.400.000 – Rp 2.800.000',
    price_note: 'Unisex All Size.',
    availability: 'Tersedia',
    image: '/images/oerip_minimalist_vest_1789048197435.jpg',
    official_source: 'Lookbook Koleksi Modern Oerip',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    last_verified: '2026-08-25'
  }
];

// Product Catalog export alias for consultation and matching engines
export const PRODUCT_CATALOG: ProductItem[] = OERIP_PRODUCTS;

export const OERIP_WASTRA_DATABASE: WastraItem[] = [
  {
    id: 'WASTRA-SUMBA-001',
    business_id: 'OERIP',
    name: 'Tenun Ikat & Pahikung Sumba Timur',
    region: 'Sumba Timur',
    island: 'Nusa Tenggara Timur (NTT)',
    community: 'Masyarakat Adat Sumba Timur (Tradisi Marapu)',
    technique: 'Tenun Gedogan / Tenun Ikat Tangan dan Tenun Songket Pahikung (teknik pakan tambahan dengan lidi/kayu)',
    material: 'Benang katun pintal tangan murni',
    dye: 'Pewarna alami murni (akar mengkudu/kombu untuk merah terakota, daun nila/taum untuk biru indigo, dan lumpur untuk hitam pekat)',
    motifs: [
      {
        name: 'Kuda (Njara)',
        meaning: 'Simbol kepemimpinan, kehormatan ksatria, kekuatan spiritual, dan transportasi jiwa leluhur.',
        is_sacred: false
      },
      {
        name: 'Pohon Hayat (Andung)',
        meaning: 'Simbol pohon kemenangan, pusat kehidupan kosmis, dan perlindungan bagi seluruh warga kampung adat.',
        is_sacred: true
      },
      {
        name: 'Rusa & Buaya',
        meaning: 'Simbol kearifan hubungan manusia dengan alam liar, ketangkasan, dan keagungan strata sosial bangsawan.',
        is_sacred: false
      },
      {
        name: 'Udang',
        meaning: 'Simbol siklus kelahiran kembali (regenerasi) dan kehidupan abadi karena kemampuannya berganti kulit.',
        is_sacred: false
      },
      {
        name: 'Figur Manusia / Leluhur',
        meaning: 'Penghormatan kepada arwah leluhur (Marapu) sebagai pelindung moral dan berkah keturunan.',
        is_sacred: true
      }
    ],
    colors: ['Terakota / Cokelat Merah (mengkudu)', 'Biru Tua / Indigo (nila)', 'Hitam Lumpur', 'Krem Kapas Alami'],
    characteristics: 'Tekstur padat bertingkat, kaya simbol fauna dan figur leluhur, serta proses pembuatan sakral yang memakan waktu berbulan-bulan hingga bertahun-tahun.',
    cultural_meaning: 'Simbol keagungan, kepemimpinan, siklus kehidupan, kekuatan spiritual, dan penghormatan kepada arwah leluhur (Marapu). Menjadi bekal perjalanan jiwa dan martabat sosial keluarga.',
    historical_context: 'Dalam tradisi Sumba, tenun bukan sekadar komoditas melainkan bagian penting dalam ritus siklus hidup (perkawinan/belis, upacara kematian agung, dan perjanjian adat). Setiap helai ditenun dengan doa dan pantangan adat tertentu.',
    cultural_sensitivity: 'Kain sakral upacara adat (misalnya kain kematian atau kain khusus ritual strata bangsawan) harus dijelaskan fungsi dan adaptasinya dengan penuh hormat tanpa menyinggung pakem adat asalnya. Dilarang menyederhanakan motif Marapu menjadi sekadar dekorasi komersial biasa.',
    story: 'Penenunan diawali doa dan puasa adat oleh mama penenun. Benang kapas dipintal dari ladang sendiri, lalu diikat simpul demi simpul sebelum dicelup puluhan kali ke dalam ramuan fermentasi akar mengkudu dan nila. Di balik keindahannya, tersimpan hembusan doa panjang para ibu di pelosok Sumba.',
    care: 'Cuci terpisah dengan lerak/sampo lembut, jangan diperas kencang, jemur di tempat teduh berangin, setrika suhu sedang dengan pelapis kain.',
    source: 'Form Pengumpulan Data Oerip AI (Bagian B) & Riset Dian Oerip, dokumentasi Museum Oerip Indonesia.',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari (Cultural & Creative Director)',
    image: '/images/wastra_sumba_ikat_1789048988491.jpg'
  },
  {
    id: 'WASTRA-TUBAN-002',
    business_id: 'OERIP',
    name: 'Tenun Gedog Tuban',
    region: 'Kerek, Tuban',
    island: 'Jawa Timur',
    community: 'Komunitas Perempuan Penenun Kerek Tuban',
    technique: 'Tenun Gedogan Tradisional dari kapas pohon lokal (kapas kenthang) yang dipintal tangan',
    material: 'Kapas pohon lokal pintal manual bertekstur serat tebal berkarakter nap',
    dye: 'Pewarna alam nila (indigofera) dan kulit kayu tingi/mahoni',
    motifs: [
      {
        name: 'Ganggeng',
        meaning: 'Simbol ganggang air yang meliuk fleksibel mengikuti arus air, menggambarkan kelenturan batin dan kerendahan hati.',
        is_sacred: false
      },
      {
        name: 'Burung Merak & Walet',
        meaning: 'Simbol keindahan budi pekerti dan ketenangan jiwa masyarakat pesisir utara Jawa.',
        is_sacred: false
      },
      {
        name: 'Kijing Miring',
        meaning: 'Filosofi pengingat kefanaan hidup, kesadaran spiritual manusia terhadap Sang Pencipta.',
        is_sacred: false
      }
    ],
    colors: ['Biru Nila Tradisional', 'Cokelat Kayu Tingi', 'Krem Kapas Mentah', 'Hitam Alami'],
    characteristics: 'Kain berserat tebal dengan bunyi "dog... dog..." saat ditenun (asal kata Gedog). Memberikan sensasi sejuk di kala panas dan hangat di kala dingin.',
    cultural_meaning: 'Simbol ketekunan perempuan desa Tuban yang mengolah kapas dari ladang hingga menjadi sehelai kain penutup jiwa.',
    historical_context: 'Salah satu tradisi tekstil paling langka di Jawa di mana proses kapas, pintal, tenun gedog, hingga batik dilakukan secara terpadu oleh keluarga petani penenun.',
    cultural_sensitivity: 'Hargai proses tenun manual 100% dan ketidaksempurnaan benang pintal tangan (slub texture) sebagai tanda otentisitas karya seni.',
    story: 'Dari biji kapas yang ditanam di tanah kering Tuban, tangan-tangan renta memintal menjadi benang kasar berjiwa. Bunyi kayu gedogan yang berirama mengiringi lagu-lagu doa penenun dari fajar hingga senja.',
    care: 'Cuci dengan air dingin dan lerak alami, hindari mesin cuci dan pemutih kimiawi.',
    source: 'Kurasi Pustaka Dian Oerip & Dokumentasi Riset Pengrajin Tuban.',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    image: '/images/wastra_gedog_tuban_1789049000569.jpg'
  },
  {
    id: 'WASTRA-FLORES-003',
    business_id: 'OERIP',
    name: 'Tenun Ikat Flores (Ende & Manggarai)',
    region: 'Ende & Manggarai',
    island: 'Flores, Nusa Tenggara Timur (NTT)',
    community: 'Penenun Tradisional Lio-Ende dan Manggarai',
    technique: 'Tenun Ikat Gedogan dengan kerapatan pakan dan lungsi tinggi',
    material: 'Katun alam pintal tangan',
    dye: 'Pewarna alam moke/kelapa, akar mengkudu, dan indigo alami',
    motifs: [
      {
        name: 'Mata Bolo (Belah Ketupat)',
        meaning: 'Simbol kewaspadaan mata batin, perlindungan spiritual dari energi negatif, dan harmoni semesta empat arah mata angin.',
        is_sacred: false
      },
      {
        name: 'Reptil & Biawak Air',
        meaning: 'Simbol ketahanan hidup, adaptasi yang tangguh, dan kesuburan tanah ulayat.',
        is_sacred: false
      }
    ],
    colors: ['Cokelat Gelap / Hitam Alami', 'Merah Marun Alami', 'Kuning Kunyit', 'Krem'],
    characteristics: 'Pola geometris simetris rapat dengan kontras warna bumi yang tegas dan anggun.',
    cultural_meaning: 'Ikatan kekerabatan yang kokoh dalam kampung adat dan penghubung manusia dengan ritme alam pegunungan Flores.',
    historical_context: 'Penenunan di Ende erat kaitannya dengan upacara adat panen dan perjumpaan tokoh-tokoh bangsa dalam sejarah pergerakan kebudayaan.',
    cultural_sensitivity: 'Motif tertentu memiliki hak ulayat keluarga adat; Oerip menggunakan motif universal yang diizinkan untuk apresiasi busana publik.',
    story: 'Setiap goresan ikat pada benang di Flores adalah manifestasi keteguhan hati para perempuan penenun di lereng bukit vulkanik, merajut memori leluhur menjadi selimut penghangat generasi penerus.',
    care: 'Gunakan lerak atau sampo pH seimbang, jemur selalu di keteduhan.',
    source: 'Dokumentasi Pameran Kebudayaan Oerip Indonesia & Riset Lapangan Dian Oerip.',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    image: '/images/wastra_flores_ende_1789049014876.jpg'
  },
  {
    id: 'WASTRA-ULOS-004',
    business_id: 'OERIP',
    name: 'Ulos Ragidup & Sadum Batak Toba',
    region: 'Toba Samosir & Tarutung',
    island: 'Sumatera Utara',
    community: 'Masyarakat Adat Batak Toba',
    technique: 'Tenun Gedogan Tradisional dengan teknik pakan sirat dan tumpal',
    material: 'Benang katun pilihan berserat kokoh',
    dye: 'Pewarna alam itom (indigo) dan kulit kayu salam/sala',
    motifs: [
      {
        name: 'Bintang Maratur',
        meaning: 'Simbol keteraturan alam semesta, tata krama hidup, dan harapan berkah anak cucu yang berbakti.',
        is_sacred: false
      },
      {
        name: 'Sigumang & Tumpal',
        meaning: 'Simbol kekuatan pelindung dan tiang penyangga kehormatan keluarga besar (Dalihan Na Tolu).',
        is_sacred: true
      }
    ],
    colors: ['Hitam Pekat (Itom)', 'Merah Darah Alami', 'Putih Kapas'],
    characteristics: 'Tekstur berstruktur tegas, berwibawa, dengan bidang kain utama yang diapit ornamen batas yang sakral.',
    cultural_meaning: 'Ulos bermakna memberi kehangatan fisik dan spiritual (manggomgomi). Diwariskan sebagai berkah kasih sayang orang tua dan tetua adat kepada generasi penerus.',
    historical_context: 'Tiga sumber kehangatan dalam filosofi Batak: Matahari, Api, dan Ulos. Ulos Ragidup adalah salah satu jenis ulos dengan derajat martabat tertinggi dalam daur hidup adat Batak.',
    cultural_sensitivity: 'Ulos sakral yang diserahkan dalam upacara adat kematian atau penyerahan waris tidak boleh dipotong sembarangan. Oerip menggunakan kain ulos tenunan khusus dengan izin pengrajin dan konsep minim potong.',
    story: 'Saat ulos ditenun, doa "Horas" dan keselamatan dipanjatkan dalam setiap ketukan sisir gedogan. Sehelai kain yang membawa martabat, kehangatan jiwa, dan doa para tetua.',
    care: 'Dry clean khusus atau cuci tangan perlahan tanpa perasan kasar.',
    source: 'Dokumentasi Pustaka Wastra Nusantara Museum Oerip Indonesia.',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    image: '/images/wastra_ulos_batak_1789049028823.jpg'
  },
  {
    id: 'WASTRA-LURIK-005',
    business_id: 'OERIP',
    name: 'Tenun Lurik Prasojo Klaten & Yogyakarta',
    region: 'Klaten & Yogyakarta',
    island: 'Jawa Tengah & DIY',
    community: 'Sentra Tenun Tradisional Prasojo Klaten',
    technique: 'Tenun Alat Tenun Bukan Mesin (ATBM) & Gedogan klasik',
    material: 'Katun halus berpori adem',
    dye: 'Pewarna alam & ramah lingkungan terstandarisasi',
    motifs: [
      {
        name: 'Lurik Telupat',
        meaning: 'Filosofi keteguhan pendirian dan keterikatan manusia dengan hukum keseimbangan alam.',
        is_sacred: false
      },
      {
        name: 'Sapit Urang',
        meaning: 'Simbol strategi, ketangkasan, perlindungan diri, dan pertahanan spiritual dalam menghadapi tantangan hidup.',
        is_sacred: false
      }
    ],
    colors: ['Hitam Arang', 'Indigo Blue', 'Cokelat Kayu', 'Garis Pinstripe Krem'],
    characteristics: 'Corak garis-garis geometris murni yang minimalis, ringan, sejuk di kulit, dan sangat fleksibel untuk gaya busana kontemporer.',
    cultural_meaning: 'Berasal dari kata "lorek" yang melambangkan kesederhanaan lahiriah namun kaya akan keteguhan batin (lurus ing lakon).',
    historical_context: 'Pernah dikenakan oleh prajurit keraton dan abdi dalem sebagai lambang kesetiaan serta busana rakyat yang sarat fungsi harian.',
    cultural_sensitivity: 'Motif klasik terbuka untuk umum; rawat dengan baik agar garis simetrisnya tetap lurus dan tidak melar.',
    story: 'Garis-garis sederhana pada lurik adalah cermin dari keheningan hidup Jawa: bersahaja di luar, mendalam di dalam. Menjadi jembatan busana harian modern bagi pencinta etnik perkotaan.',
    care: 'Cuci tangan dengan air dingin dan lerak cair, setrika dari bagian dalam.',
    source: 'Form Pengumpulan Data Oerip AI & Arsip Kolaborasi Pengrajin Klaten.',
    validation_status: 'VALIDATED',
    validated_by: 'Tim Kurasi & Desain Oerip Indonesia',
    image: '/images/wastra_lurik_klaten_1789049042190.jpg'
  },
  {
    id: 'WASTRA-TORAJA-006',
    business_id: 'OERIP',
    name: 'Tenun Ikat Toraja Sa\'dan',
    region: 'Tana Toraja & Toraja Utara',
    island: 'Sulawesi Selatan',
    community: 'Komunitas Penenun Sa\'dan Toraja',
    technique: 'Tenun Gedogan Klasik Toraja (Ikat Benang Tradisional)',
    material: 'Katun mori alami & benang pintal tangan lokal',
    dye: 'Pewarna alam murni (daun nila, tanah liat merah, getah kayu)',
    motifs: [
      {
        name: 'Pa\'teddong (Kepala Kerbau)',
        meaning: 'Lambang kemakmuran, kemuliaan hidup, status kehormatan, dan ketulusan berkorban demi keluarga.',
        is_sacred: false
      },
      {
        name: 'Sekong Kandeata',
        meaning: 'Bentuk geometris silang panah melambangkan harapan masa depan yang cerah, ketajaman akal budi, dan keselamatan.',
        is_sacred: false
      }
    ],
    colors: ['Terakota Tanah Toraja', 'Hitam Arang', 'Emas Ochre', 'Putih Kapas'],
    characteristics: 'Anyaman rapat berbobot kokoh dengan corak motif geometris arsitektur Tongkonan yang sarat wibawa.',
    cultural_meaning: 'Kain tenun Toraja adalah penghubung sakral antara dunia manusia (Lino) dan leluhur (Puya), menyimbolkan ikatan kekeluargaan yang tak terputus.',
    historical_context: 'Dikenakan pada upacara adat Rambu Tuka\' (sukacita & jamuan resmi) maupun sebagai busana kehormatan bangsawan Toraja.',
    cultural_sensitivity: 'Motif Pa\'teddong dan Sekong Kandeata dapat dikenakan dalam upacara resmi sukacita dan perjamuan formal dengan sikap penuh penghormatan.',
    story: 'Kain tenun Toraja membawa keteguhan pegunungan Sa\'dan. Oerip menghadirkannya dalam set tunik dan selendang anggun tanpa memotong motif kerbau kehormatan.',
    care: 'Dry clean atau cuci tangan terpisah dengan sabun lerak netral, jangan diperas kencang.',
    source: 'Dokumentasi Kurasi Dian Oerip - Ekspedisi Heritage Toraja Sulawesi.',
    validation_status: 'VALIDATED',
    validated_by: 'Dian Errakumalasari',
    image: '/images/wastra_toraja_sadan_1789049055552.jpg'
  }
];

export const OERIP_SOCIAL_MEDIA_POSTS: SocialMediaPost[] = [
  {
    id: 'SOC-001',
    business_id: 'OERIP',
    platform: 'Instagram',
    account: '@oerip_official',
    post_url: 'https://instagram.com/p/C_oerip_signature_lookbook',
    post_date: '2026-08-20',
    extracted_information: 'Rilis koleksi Signature Blanket Outer terbaru dalam palet warna Indigo Nila dan Terakota Sumba untuk panggung diplomasi budaya internasional di Jenewa.',
    caption_snippet: 'Melangkah dengan kehormatan doa mama penenun Sumba. Setiap helai outer kimono kami dibuat dengan prinsip zero waste...',
    capture_date: '2026-08-21',
    validation_status: 'VALIDATED',
    category: 'CONTENT',
    reviewed_by: 'Bagas Qolbu Cetta (CEO)'
  },
  {
    id: 'SOC-002',
    business_id: 'OERIP',
    platform: 'Instagram',
    account: '@dian_oerip',
    post_url: 'https://instagram.com/p/C_dian_spiritual_journey_sumba',
    post_date: '2026-08-15',
    extracted_information: 'Dokumentasi perjalanan spiritual riset menemui penenun desa Rende, Sumba Timur. Proses memintal kapas lokal dan perendaman daun nila murni.',
    caption_snippet: 'Bukan sekadar kain, ini adalah nafas kehidupan. Bersama mama penenun di Sumba Timur yang menjaga tradisi Marapu...',
    capture_date: '2026-08-16',
    validation_status: 'VALIDATED',
    category: 'CULTURAL_STORIES',
    reviewed_by: 'Dian Errakumalasari'
  },
  {
    id: 'SOC-003',
    business_id: 'OERIP',
    platform: 'Instagram',
    account: '@oerip_official',
    post_url: 'https://instagram.com/p/C_oerip_new_collection_teaser',
    post_date: '2026-08-24',
    extracted_information: 'Eksplorasi tenun baru dari kawasan Halmahera dan Toraja dengan pewarna tanah liat alami untuk koleksi Musim Gugur 2026.',
    caption_snippet: 'Sneak peek: Riset eksplorasi wastra Halmahera yang memikat hati. Segera hadir setelah kurasi tim desain...',
    capture_date: '2026-08-25',
    validation_status: 'NEEDS_REVIEW',
    category: 'PRODUCTS',
    reviewed_by: undefined
  },
  {
    id: 'SOC-004',
    business_id: 'OERIP',
    platform: 'Instagram',
    account: '@dian_oerip',
    post_url: 'https://instagram.com/p/C_dian_sustainable_workshop',
    post_date: '2026-08-23',
    extracted_information: 'Workshop zero waste pattern making di Ngawi bersama mahasiswa fesyen diaspora.',
    caption_snippet: 'Mendidik generasi muda agar mengerti bahwa memotong kain tenun sembarangan berarti memotong doa penenun...',
    capture_date: '2026-08-24',
    validation_status: 'NEEDS_REVIEW',
    category: 'BRAND',
    reviewed_by: undefined
  }
];

export const RESTRICTED_ENTERPRISE_DATA: RestrictedDataItem[] = [
  {
    id: 'RESTRICT-001',
    business_id: 'OERIP',
    type: 'HPP',
    title: 'Struktur Harga Pokok Produksi (HPP) & Margin Mitra Penenun',
    confidential_summary: 'Breakdown biaya pengadaan benang, ongkos kompensasi adil (fair trade fee) penenun langsung, biaya riset lapangan, dan margin operasional brand Oerip.',
    access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY',
    protected_reason: 'Kerahasiaan komersial internal dan perlindungan nilai tawar penenun desa mitra.'
  },
  {
    id: 'RESTRICT-002',
    business_id: 'OERIP',
    type: 'WEAVER_CONTACT',
    title: 'Buku Kontak Pribadi & Nomor WhatsApp Mama Penenun di Pedalaman',
    confidential_summary: 'Daftar nomor kontak seluler langsung, alamat rumah adat, dan nama ketua kelompok penenun di Sumba Timur, Tuban, Flores, dan Toraja.',
    access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY',
    protected_reason: 'Perlindungan privasi pengrajin tradisional dari eksploitasi pihak ketiga dan perantara komersial liar.'
  },
  {
    id: 'RESTRICT-003',
    business_id: 'OERIP',
    type: 'DYE_FORMULA',
    title: 'Formula Rahasia Fermentasi Pewarna Alami Tanpa Kimia Sintetis',
    confidential_summary: 'Komposisi gramasi akar mengkudu tua, takaran abu dapur fiksasi, waktu fermentasi lumpur vulkanik, dan resep stabilisasi warna Dian Oerip.',
    access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY',
    protected_reason: 'Hak kekayaan intelektual riset kriya Dian Oerip dan formula kearifan lokal yang sakral.'
  },
  {
    id: 'RESTRICT-004',
    business_id: 'OERIP',
    type: 'VIP_COLLECTOR',
    title: 'Database Pelanggan VIP, Duta Besar & Kolektor Privat Oerip',
    confidential_summary: 'Daftar kontak pejabat diplomatik, duta besar kementerian luar negeri, artis budayawan, dan data ukuran badan personal kolektor VIP.',
    access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY',
    protected_reason: 'Kepatuhan UU Perlindungan Data Pribadi (PDP) dan privasi nasabah VVIP.'
  }
];

export const VALIDATION_QUEUE_INITIAL = [
  {
    id: 'VAL-001',
    business_id: 'OERIP',
    content_type: 'WASTRA',
    title: 'Eksplorasi Makna Motif Kuda Sumba pada Koleksi 2026',
    source: 'Form Pengumpulan Data Oerip AI (Bagian B)',
    status: 'VALIDATED',
    validator: 'Dian Errakumalasari (Founder)',
    date: '2026-08-25',
    notes: 'Akurat sesuai literatur Marapu dan riset kurasi Dian Oerip.'
  },
  {
    id: 'VAL-002',
    business_id: 'OERIP',
    content_type: 'PRODUCT',
    title: 'Oerip Signature Blanket Outer (OERIP-OUT-001) Description',
    source: 'Form Pengumpulan Data Oerip AI (Bagian C)',
    status: 'VALIDATED',
    validator: 'Bagas Qolbu Cetta (CEO)',
    date: '2026-08-25',
    notes: 'Spesifikasi ukuran All Size LD 100-130cm dan rentang harga Rp 1.500.000 - Rp 4.500.000 terverifikasi.'
  },
  {
    id: 'VAL-003',
    business_id: 'OERIP',
    content_type: 'SOCIAL_MEDIA',
    title: 'Post IG @oerip_official: Eksplorasi Tenun Halmahera Baru',
    source: 'Instagram Post @oerip_official (2026-08-24)',
    status: 'NEEDS_REVIEW',
    validator: 'Pending Kurasi Desain',
    date: '2026-08-25',
    notes: 'Perlu konfirmasi nama komunitas suku penenun Halmahera sebelum dijadikan fakta budaya publik.'
  },
  {
    id: 'VAL-004',
    business_id: 'OERIP',
    content_type: 'SOCIAL_MEDIA',
    title: 'Post IG @dian_oerip: Workshop Zero-Waste Ngawi',
    source: 'Instagram Post @dian_oerip (2026-08-23)',
    status: 'NEEDS_REVIEW',
    validator: 'Pending Review Admin',
    date: '2026-08-25',
    notes: 'Kategori konten edukasi brand.'
  },
  {
    id: 'VAL-005',
    business_id: 'OERIP',
    content_type: 'CULTURAL_STORY',
    title: 'Draft Kisah Ulos Ragidup untuk Generasi Muda',
    source: 'Dokumentasi Pustaka Museum Oerip',
    status: 'VALIDATED',
    validator: 'Dian Errakumalasari',
    date: '2026-08-25',
    notes: 'Sudah diselaraskan dengan tata krama adat Dalihan Na Tolu.'
  }
];

// PRD Section 10: FAQ Entity
export const OERIP_FAQS: FAQItem[] = [
  {
    id: 'FAQ-001',
    question: 'Apakah kain yang digunakan Oerip asli tenun tangan atau cetak pabrik/printing?',
    answer: '100% menggunakan kain tenun tangan asli (living textile) yang ditenun secara tradisional oleh para mama dan pengrajin di desa-desa adat Nusantara menggunakan alat tenun bukan mesin (ATBM) atau gedogan. Oerip tidak pernah menggunakan kain printing sintetis massal.',
    category: 'Otentisitas Wastra',
    source: 'Form Pengumpulan Data Oerip AI (Bagian B. Wastra)',
    validation_status: 'VALIDATED'
  },
  {
    id: 'FAQ-002',
    question: 'Bagaimana konsep ukuran All-Size pada busana Oerip?',
    answer: 'Sebagian besar busana Oerip dirancang dengan siluet longgar (loose silhouette) dan pola minim potong (zero-waste). Lingkar dada berkisar 100–130 cm, sangat fleksibel dan inklusif untuk berbagai proporsi tubuh tanpa menghilangkan kenyamanan gerak.',
    category: 'Ukuran & Fitting',
    source: 'Form Pengumpulan Data Oerip AI (Bagian C. Produk)',
    validation_status: 'VALIDATED'
  },
  {
    id: 'FAQ-003',
    question: 'Bagaimana cara merawat busana tenun pewarna alami Oerip?',
    answer: 'Gunakan cairan lerak alami atau sampo bayi lembut. Hindari deterjen kimia keras, jangan memeras kuat atau menggunakan mesin cuci. Keringkan di tempat teduh tanpa terkena paparan sinar matahari langsung, dan setrika dengan suhu sedang beralas kain katun tipis.',
    category: 'Perawatan Busana',
    source: 'Buku Panduan Perawatan Wastra Dian Oerip',
    validation_status: 'VALIDATED'
  },
  {
    id: 'FAQ-004',
    question: 'Apakah Oerip menerima pesanan busana custom dengan motif khusus?',
    answer: 'Ya, Oerip melayani kurasi personal dan pemesanan khusus dengan berkonsultasi langsung bersama Tim Desain Dian Oerip, disesuaikan dengan ketersediaan kain tenun asli dari desa adat mitra.',
    category: 'Layanan & Pemesanan',
    source: 'Katalog Layanan Kurasi Oerip 2026',
    validation_status: 'VALIDATED'
  },
  {
    id: 'FAQ-005',
    question: 'Berapa banyak biasanya kapasitas dan jumlah produksi busana di Oerip Indonesia?',
    answer: 'Oerip Indonesia menerapkan prinsip Slow Fashion berkelanjutan dan BUKAN produksi massal pabrikan. Sebagian besar karya bersifat One-of-a-Kind (hanya 1 potong per helai kain) atau batch sangat terbatas (1–5 pieces per variasi tenun) karena ditenun tangan oleh mama penenun desa adat selama 1–6 bulan per kain. Untuk pesanan korporat/diplomasi (B2B), Oerip menggunakan sistem Made-to-Order dengan kuota terjadwal demi menjaga etika kerja penenun.',
    category: 'Sistem & Kapasitas Produksi',
    source: 'Form Profil Brand & Filosofi Kurasi Oerip AI',
    validation_status: 'VALIDATED'
  }
];

// PRD Section 10: Brand Entity
export const OERIP_BRAND_ENTITY: BrandEntity = {
  id: 'BRAND-OERIP',
  name: 'Oerip Indonesia',
  founder: 'Dian Errakumalasari (Dian Oerip)',
  ceo: 'Bagas Qolbu Cetta',
  tagline: 'Living Heritage, Zero-Waste Etnik Kontemporer',
  positioning: 'Jenama fesyen etnik kontemporer dan berkelanjutan premium berbasis riset wastra sakral Nusantara dan pemberdayaan langsung komunitas penenun desa.',
  communication_style: 'Hangat, santun beradab, berwibawa, apresiatif terhadap kebudayaan lokal, dan mendidik tanpa menggurui.',
  core_values: [
    'Penghormatan Sakralitas Wastra (Doa & Falsafah Penenun)',
    'Konsep Pola Minim Potong (Zero-Waste Tailoring)',
    '100% Pewarnaan Alami & Ramah Lingkungan',
    'Pemberdayaan Fair Trade Komunitas Penenun Tradisional',
    'Siluet Inklusif & Membebaskan Raga (All-Size)'
  ],
  limitations: [
    'Dilarang mengklaim kain tenun pabrik/mesin sebagai tenun tangan asli.',
    'Dilarang membocorkan HPP, margin, atau kontak pribadi penenun.',
    'Dilarang mengubah pakem sakral motif adat demi kepentingan tren sesaat.'
  ]
};

// PRD Section 10: Content Guidelines Entity
export const OERIP_CONTENT_GUIDELINES: ContentGuidelineEntity = {
  id: 'GUIDELINE-001',
  title: 'Pedoman Narasi & Konten Pemasaran Oerip AI',
  tone_options: [
    'Edukasi Budaya & Living Heritage',
    'Mewah, Elegan & Berwibawa (Haute Couture Etnik)',
    'Storytelling Puitis & Jiwa Pengelana Nusantara',
    'Modern Minimalis & Generasi Muda (Gen Z / Millennials)'
  ],
  mandatory_terms: [
    'Wastra Nusantara',
    'Tenun Tangan Asli / Handwoven',
    'Pewarna Alam (Natural Dyes)',
    'Minim Potong / Zero-Waste',
    'Living Heritage',
    'Doa & Falsafah Penenun',
    'Dian Oerip'
  ],
  forbidden_terms: [
    'Batik Printing (saat membahas tenun)',
    'Kain Pabrikan Massal',
    'Bahan Sintetis Murah',
    'Supercharge / Empower (AI Jargon)',
    'Diskon Cuci Gudang Murahan'
  ],
  publication_rules: [
    'Seluruh draf narasi wajib bersumber dari Knowledge Base tervalidasi.',
    'Draf konten berstatus DRAFT dan wajib direview kurator sebelum dipublikasikan ke media sosial atau marketplace.',
    'Motif sakral tidak boleh dinarasikan sembarangan tanpa verifikasi pustaka adat.'
  ]
};

// PRD Section 10: Source Entity Hierarchy
export const OERIP_SOURCES_ENTITY: SourceEntity[] = [
  {
    id: 'SRC-001',
    title: 'Form Pengumpulan Data Oerip AI (Bagian A, B, C, D)',
    type: 'DOCUMENT',
    owner: 'Dian Errakumalasari & Bagas Qolbu Cetta',
    date: '2026-08-25',
    trust_level: 'LEVEL_1_PRIMARY',
    status: 'VALIDATED',
    description: 'Dokumen master primer yang mencakup profil brand, data wastra prioritas, spesifikasi katalog produk, dan batasan guardrail AI.'
  },
  {
    id: 'SRC-002',
    title: 'Buku Soul Craft: Kriya Jiwa Dian Oerip',
    type: 'BOOK',
    owner: 'Pustaka Budaya Oerip Indonesia',
    date: '2025-11-10',
    trust_level: 'LEVEL_1_PRIMARY',
    status: 'VALIDATED',
    description: 'Catatan perjalanan riset antropologi tenun Dian Oerip ke ratusan desa adat di Sabang sampai Merauke.'
  },
  {
    id: 'SRC-003',
    title: 'Lookbook & Katalog Resmi Oerip Indonesia 2026',
    type: 'LOOKBOOK',
    owner: 'Tim Desain Oerip',
    date: '2026-01-15',
    trust_level: 'LEVEL_2_OFFICIAL',
    status: 'VALIDATED',
    description: 'Dokumentasi visual, rentang harga, pola siluet, dan panduan padu-padan koleksi busana resmi.'
  },
  {
    id: 'SRC-004',
    title: 'Kanal Media Sosial Terverifikasi (@oerip_official & @dian_oerip)',
    type: 'SOCIAL_MEDIA',
    owner: 'Tim Digital & Media Oerip',
    date: '2026-08-24',
    trust_level: 'LEVEL_2_OFFICIAL',
    status: 'VALIDATED',
    description: 'Unggahan visual, cerita di balik layar, workshop tenun, dan interaksi komunitas pemakai wastra.'
  }
];

// PRD Section 6 & 8: AI User Feedback Log Initial
export const INITIAL_AI_FEEDBACKS: AIFeedbackItem[] = [
  {
    id: 'FDB-001',
    timestamp: '2026-08-25 14:20',
    user_query: 'Saya butuh busana untuk menghadiri resepsi adat Batak, rekomendasi apa yang tepat?',
    ai_response_snippet: 'KIRA merekomendasikan Oerip Heritage Ulos Statement Vest (OERIP-ULO-004) dengan Tenun Ulos Ragidup...',
    rating: 'THUMBS_UP',
    feedback_category: 'Rekomendasi Sangat Tepat',
    user_note: 'Penjelasannya sangat menghargai adat Batak dan siluetnya bagus sekali.',
    status: 'RESOLVED',
    reviewed_by: 'Bagas Qolbu Cetta (CEO)'
  },
  {
    id: 'FDB-002',
    timestamp: '2026-08-25 16:45',
    user_query: 'Berapa harga pas Outer Tenun Sumba ini?',
    ai_response_snippet: 'Rentang harga resmi Oerip Signature Blanket Outer adalah Rp 1.500.000 – Rp 4.500.000 tergantung kerumitan tenun...',
    rating: 'THUMBS_UP',
    feedback_category: 'Informasi Harga Akurat',
    user_note: 'Sangat jelas dan ada opsi konsultasi ke WhatsApp admin.',
    status: 'RESOLVED',
    reviewed_by: 'Tim Kurasi Desain'
  }
];
