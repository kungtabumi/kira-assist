import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Tag,
  Info,
  Sparkles,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Leaf,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ProductItem } from '../types';
import { OERIP_PRODUCTS } from '../data/oeripKnowledgeBase';

interface ProductCatalogProps {
  onConsultProduct?: (productName: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onConsultProduct
}) => {
  const [products] = useState<ProductItem[]>(OERIP_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC'>('DEFAULT');

  const categories = [
    { id: 'ALL', label: 'Semua Koleksi' },
    { id: 'OUTER', label: 'Outer & Kimono' },
    { id: 'VEST', label: 'Vest & Rompi' },
    { id: 'CAPE', label: 'Cape & Wrap' },
    { id: 'DRESS', label: 'Dress & Set' }
  ];

  const occasions = [
    'ALL',
    'Diplomasi Budaya',
    'Pesta & Resepsi',
    'Kasual Berkelas',
    'Pertunjukan Seni',
    'Acara Resmi'
  ];

  const checkOccasionMatch = (productOccasions: string[], filter: string) => {
    if (filter === 'ALL') return true;
    const f = filter.toLowerCase();

    return productOccasions.some((occ) => {
      const o = occ.toLowerCase();
      if (f.includes('diplomasi')) {
        return o.includes('diplomasi') || o.includes('gala') || o.includes('internasional') || o.includes('bilateral');
      }
      if (f.includes('resepsi') || f.includes('pesta')) {
        return o.includes('resepsi') || o.includes('pesta') || o.includes('pernikahan') || o.includes('gala') || o.includes('agung');
      }
      if (f.includes('kasual')) {
        return o.includes('kasual') || o.includes('casual') || o.includes('daily') || o.includes('santai') || o.includes('traveling') || o.includes('kantor') || o.includes('workshop');
      }
      if (f.includes('seni')) {
        return o.includes('seni') || o.includes('art') || o.includes('pameran') || o.includes('budaya') || o.includes('kreatif');
      }
      if (f.includes('resmi')) {
        return o.includes('resmi') || o.includes('formal') || o.includes('kantor') || o.includes('kehormatan') || o.includes('pertemuan') || o.includes('forum');
      }
      return o.includes(f) || f.includes(o);
    });
  };

  const checkCategoryMatch = (p: ProductItem, catId: string) => {
    if (catId === 'ALL') return true;
    const text = `${p.category} ${p.product_name} ${p.silhouette} ${p.description}`.toLowerCase();
    if (catId === 'OUTER') {
      return text.includes('outer') || text.includes('kimono') || text.includes('duster') || text.includes('jacket') || text.includes('coat');
    }
    if (catId === 'VEST') {
      return text.includes('vest') || text.includes('rompi') || text.includes('sleeveless');
    }
    if (catId === 'CAPE') {
      return text.includes('cape') || text.includes('wrap') || text.includes('poncho') || text.includes('shawl') || text.includes('selendang');
    }
    if (catId === 'DRESS') {
      return text.includes('dress') || text.includes('set') || text.includes('tunik') || text.includes('tunic');
    }
    return true;
  };

  const parsePriceMin = (priceStr: string) => {
    const clean = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(clean.substring(0, 7), 10);
    return isNaN(num) ? 0 : num;
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.textile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.textile_origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.motif.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = checkCategoryMatch(p, selectedCategory);
      const matchesOccasion = checkOccasionMatch(p.occasion, selectedOccasion);

      return matchesSearch && matchesCategory && matchesOccasion;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return parsePriceMin(a.price_range) - parsePriceMin(b.price_range);
      if (sortBy === 'PRICE_DESC') return parsePriceMin(b.price_range) - parsePriceMin(a.price_range);
      return 0;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] text-[#963824] text-xs font-semibold uppercase tracking-wider border border-[#E7DFD5]">
          <Layers size={14} className="text-[#963824]" />
          <span>Koleksi Ready-to-Wear Oerip Indonesia</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Katalog Busana Wastra Terkurasi
        </h2>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          Setiap busana Oerip dirancang dengan konsep <strong>Minim Potong (Zero-Waste)</strong>, siluet <strong>Oversized & All-Size</strong> yang inklusif, serta menggunakan tenun tangan asli dengan pewarna alami ramah lingkungan.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama busana, asal tenun..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm text-[#1C1917] placeholder-[#8C827A] focus:outline-none focus:ring-1 focus:ring-[#963824]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1C1917] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
                  selectedCategory === cat.id
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F5EFE6] border border-[#E7DFD5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Occasion Filter Pills & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#E7DFD5] text-xs">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[#78716C] font-semibold flex items-center gap-1 mr-1 shrink-0">
              <Filter size={12} className="text-[#963824]" /> Acara:
            </span>
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] ${
                  selectedOccasion === occ
                    ? 'bg-[#963824] text-white font-semibold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#EAE2D5] border border-[#E7DFD5]'
                }`}
              >
                {occ === 'ALL' ? 'Semua Acara' : occ}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-1.5 text-[#78716C]">
              <span className="text-[11px]">Urutan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-lg px-2.5 py-1 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#963824]"
              >
                <option value="DEFAULT">Rekomendasi Kurasi</option>
                <option value="PRICE_ASC">Harga Terendah</option>
                <option value="PRICE_DESC">Harga Tertinggi</option>
              </select>
            </div>

            <span className="text-[11px] text-[#78716C] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E7DFD5] whitespace-nowrap">
              <strong>{filteredProducts.length}</strong> busana
            </span>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#8C827A] flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h4 className="font-serif font-bold text-lg text-[#1C1917]">Tidak Ada Busana yang Sesuai</h4>
          <p className="text-xs text-[#57534E]">Coba ubah kata kunci pencarian atau pilih filter acara lain.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedOccasion('ALL');
            }}
            className="px-4 py-2 rounded-full bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold cursor-pointer min-h-[40px]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-7">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E7DFD5] overflow-hidden shadow-xs hover:border-[#963824] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={product.image}
                    alt={product.product_name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1C1917]/90 text-[#FAF7F2] font-mono text-[10px] font-semibold backdrop-blur-xs">
                      {product.product_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
                      <ShieldCheck size={11} /> {product.validation_status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E7DFD5] shadow-xs">
                    <span className="text-[9px] uppercase font-bold text-[#963824] tracking-wider block">
                      Asal Wastra
                    </span>
                    <p className="text-xs font-semibold text-[#1C1917] line-clamp-1">
                      {product.textile} ({product.textile_origin})
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#963824] transition-colors line-clamp-1">
                      {product.product_name}
                    </h3>
                    <p className="text-xs text-[#57534E] line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                      <span className="text-[10px] text-[#78716C] block">Ukuran</span>
                      <span className="font-semibold text-[#1C1917]">{product.size}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                      <span className="text-[10px] text-[#78716C] block">Pewarna</span>
                      <span className="font-semibold text-[#1C1917] text-[11px] truncate block">Pewarna Alami</span>
                    </div>
                  </div>

                  {/* Occasions Tags */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {product.occasion.slice(0, 3).map((occ, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#57534E] border border-[#E7DFD5]"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Story Excerpt */}
                  <div className="p-3 rounded-xl bg-[#F5EFE6] border border-[#E7DFD5] text-[11px] text-[#57534E] leading-relaxed line-clamp-2">
                    <strong className="text-[#1C1917]">Filosofi:</strong> {product.cultural_story}
                  </div>

                  {/* Pricing Info */}
                  <div className="pt-2 border-t border-[#E7DFD5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#78716C] block">Rentang Kurasi</span>
                      <span className="font-serif font-bold text-xs text-[#963824]">
                        {product.price_range}
                      </span>
                    </div>
                    <span className="text-[10px] text-right text-[#78716C] italic">
                      *Living heritage pieces
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <a
                  href={`https://wa.me/6285174485581?text=${encodeURIComponent(
                    `Halo Oerip Indonesia, saya tertarik dengan koleksi ${product.product_name} (${product.product_id}). Mohon informasi ketersediaan pieces dan pemesanannya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 rounded-full bg-[#1E3A2B] hover:bg-[#254634] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare size={13} className="text-[#A8D5BA]" />
                  <span>Tanya Admin</span>
                </a>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#1C1917] text-xs font-semibold border border-[#E7DFD5] transition-colors cursor-pointer"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7DFD5] max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5]">
              <div>
                <span className="text-xs font-mono text-[#963824] font-bold">
                  {selectedProduct.product_id}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  {selectedProduct.product_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#E7DFD5] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                  }
                }}
                className="w-full h-64 sm:h-72 object-cover rounded-xl border border-[#E7DFD5]"
              />

              <div>
                <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-1">Deskripsi Resmi Koleksi:</h4>
                <p className="text-[#57534E] leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5]">
                  <span className="text-[10px] text-[#78716C] block">Wastra</span>
                  <strong className="text-[#1C1917] text-xs">{selectedProduct.textile}</strong>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5]">
                  <span className="text-[10px] text-[#78716C] block">Asal Daerah</span>
                  <strong className="text-[#1C1917] text-xs">{selectedProduct.textile_origin}</strong>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5]">
                  <span className="text-[10px] text-[#78716C] block">Teknik Tenun</span>
                  <strong className="text-[#1C1917] text-xs">{selectedProduct.technique}</strong>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5]">
                  <span className="text-[10px] text-[#78716C] block">Siluet / Ukuran</span>
                  <strong className="text-[#1C1917] text-xs">{selectedProduct.size}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                <h5 className="font-serif font-bold text-xs text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#963824]" /> Panduan Padu-Padan (Styling Notes):
                </h5>
                <p className="text-[#57534E] leading-relaxed text-xs">{selectedProduct.styling_notes}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                <h5 className="font-serif font-bold text-xs text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf size={13} className="text-emerald-700" /> Cara Perawatan Kain Tenun Alam:
                </h5>
                <p className="text-[#57534E] leading-relaxed text-xs">{selectedProduct.care_instruction}</p>
              </div>

              <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#E7DFD5] flex flex-wrap justify-between gap-2">
                <span><strong>Sumber Dokumen:</strong> {selectedProduct.official_source}</span>
                <span><strong>Validator:</strong> {selectedProduct.validated_by}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7DFD5] flex flex-wrap items-center justify-end gap-2.5">
              {onConsultProduct && (
                <button
                  onClick={() => {
                    const name = selectedProduct.product_name;
                    setSelectedProduct(null);
                    onConsultProduct(name);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332D27] text-[#FAF7F2] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles size={14} className="text-[#C89B53]" />
                  <span>Konsultasikan dengan KIRA</span>
                </button>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#57534E] text-xs font-semibold cursor-pointer border border-[#E7DFD5] transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
