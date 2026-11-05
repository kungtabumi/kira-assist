import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Info,
  ChevronRight,
  Filter,
  Leaf,
  Layers,
  Heart,
  MessageSquare,
  ZoomIn,
  List,
  Eye
} from 'lucide-react';
import { WastraItem } from '../types';
import { OERIP_WASTRA_DATABASE, OERIP_PRODUCTS } from '../data/oeripKnowledgeBase';
import { WastraMacroViewer } from './WastraMacroViewer';

interface WastraExplorerProps {
  onConsultAboutWastra?: (wastraName: string) => void;
}

export const WastraExplorer: React.FC<WastraExplorerProps> = ({
  onConsultAboutWastra
}) => {
  const [wastraList] = useState<WastraItem[]>(OERIP_WASTRA_DATABASE);
  const [selectedWastra, setSelectedWastra] = useState<WastraItem | null>(OERIP_WASTRA_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [islandFilter, setIslandFilter] = useState('ALL');
  const [mobileTab, setMobileTab] = useState<'LIST' | 'DETAIL'>('LIST');

  const filteredWastra = wastraList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.motifs.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIsland =
      islandFilter === 'ALL' ||
      item.island.toLowerCase().includes(islandFilter.toLowerCase());

    return matchesSearch && matchesIsland;
  });

  const relatedProducts = selectedWastra
    ? OERIP_PRODUCTS.filter(
        p =>
          p.textile.toLowerCase().includes(selectedWastra.region.toLowerCase()) ||
          p.textile_origin.toLowerCase().includes(selectedWastra.region.toLowerCase()) ||
          p.textile.toLowerCase().includes(selectedWastra.name.split(' ')[0].toLowerCase())
      )
    : [];

  const handleSelectWastra = (wastra: WastraItem) => {
    setSelectedWastra(wastra);
    setMobileTab('DETAIL');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] text-[#963824] text-xs font-semibold uppercase tracking-wider border border-[#E7DFD5]">
          <BookOpen size={14} className="text-[#963824]" />
          <span>Pustaka Wastra Nusantara Terverifikasi</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917]">
          Pustaka Wastra & Ensiklopedia Tenun
        </h2>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          Eksplorasi ragam tenun tangan sakral dan batik tradisional Nusantara. Setiap helai kain didokumentasikan berdasarkan riset otentik kurasi Dian Oerip dengan menjunjung tinggi etika budaya adat.
        </p>
      </div>

      {/* Search & Island Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari wastra, daerah, motif..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm text-[#1C1917] placeholder-[#8C827A] focus:outline-none focus:ring-1 focus:ring-[#963824]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1C1917] text-xs min-h-[30px] min-w-[30px] flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs text-[#78716C] font-semibold mr-1 flex items-center gap-1 shrink-0">
              <Filter size={12} className="text-[#963824]" /> Wilayah:
            </span>
            {['ALL', 'Nusa Tenggara Timur', 'Jawa Timur', 'Sulawesi Selatan', 'Sumatera Utara', 'Jawa Tengah'].map((isl) => (
              <button
                key={isl}
                onClick={() => setIslandFilter(isl)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] ${
                  islandFilter === isl
                    ? 'bg-[#1C1917] text-[#FAF7F2] font-semibold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F5EFE6] border border-[#E7DFD5]'
                }`}
              >
                {isl === 'ALL' ? 'Semua Wilayah' : isl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View Switcher (Visible on < lg screens) */}
      <div className="flex lg:hidden rounded-2xl bg-[#FAF7F2] p-1 border border-[#E7DFD5]">
        <button
          onClick={() => setMobileTab('LIST')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
            mobileTab === 'LIST'
              ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <List size={14} />
          <span>Daftar Wastra ({filteredWastra.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('DETAIL')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
            mobileTab === 'DETAIL'
              ? 'bg-[#963824] text-[#FAF7F2] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Eye size={14} />
          <span className="truncate">Detail & Zoom Makro</span>
        </button>
      </div>

      {/* Main 2-Column Explorer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Wastra Cards List (5 Cols) */}
        <div className={`lg:col-span-5 xl:col-span-4 space-y-3 ${
          mobileTab === 'DETAIL' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#78716C] px-1 font-semibold">
            <span>Daftar Wastra ({filteredWastra.length})</span>
            <span className="hidden sm:inline">Pilih untuk membaca detail</span>
          </div>

          <div className="space-y-3">
            {filteredWastra.map((wastra) => {
              const isSelected = selectedWastra?.id === wastra.id;
              return (
                <div
                  key={wastra.id}
                  onClick={() => handleSelectWastra(wastra)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 sm:gap-3.5 items-center ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#963824] shadow-sm ring-1 ring-[#963824]'
                      : 'bg-[#FFFFFF] border-[#E7DFD5] hover:border-[#C89B53] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <img
                    src={wastra.image}
                    alt={wastra.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E7DFD5] shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#963824] truncate">
                        {wastra.island}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        Tervalidasi
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#1C1917] truncate">
                      {wastra.name}
                    </h3>
                    <p className="text-[11px] text-[#78716C] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={11} className="text-[#8C827A] shrink-0" /> {wastra.region}
                    </p>
                    <div className="text-[10px] text-[#57534E] font-medium mt-1 truncate">
                      Teknik: {wastra.technique}
                    </div>
                  </div>

                  <ChevronRight size={16} className={isSelected ? 'text-[#963824]' : 'text-[#D5CABE]'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Wastra Editorial Dossier (7/8 Cols) */}
        <div className={`lg:col-span-7 xl:col-span-8 ${
          mobileTab === 'LIST' ? 'hidden lg:block' : 'block'
        }`}>
          {selectedWastra ? (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-6 animate-in fade-in duration-200">
              
              {/* Dossier Header */}
              <div className="space-y-3 pb-5 border-b border-[#E7DFD5]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#963824] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5] font-semibold">
                      {selectedWastra.id}
                    </span>
                    <span className="text-xs text-[#78716C] truncate">
                      {selectedWastra.region}, {selectedWastra.island}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onConsultAboutWastra && (
                      <button
                        onClick={() => onConsultAboutWastra(selectedWastra.name)}
                        className="px-3.5 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#332D27] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors min-h-[36px]"
                      >
                        <Sparkles size={13} className="text-[#C89B53]" />
                        <span>Tanya KIRA</span>
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  {selectedWastra.name}
                </h2>
                
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {selectedWastra.characteristics || selectedWastra.cultural_meaning}
                </p>
              </div>

              {/* Macro Hover-Zoom Image & Weave Texture Explorer */}
              <div className="space-y-2">
                <WastraMacroViewer
                  src={selectedWastra.image || ''}
                  alt={selectedWastra.name}
                  title={selectedWastra.name}
                  technique={selectedWastra.technique}
                  region={`${selectedWastra.region}, ${selectedWastra.island}`}
                />
              </div>

              {/* Filosofi & Makna Sakral */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-[#963824]">✦</span> Filosofi & Makna Sakral:
                </h4>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#57534E] leading-relaxed">
                  {selectedWastra.cultural_meaning}
                </div>
              </div>

              {/* Kisah Budaya & Spiritual */}
              {selectedWastra.story && (
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-[#963824]">✦</span> Kisah Penenunan & Konteks Sejarah:
                  </h4>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#57534E] leading-relaxed space-y-2">
                    <p>{selectedWastra.story}</p>
                    {selectedWastra.historical_context && (
                      <p className="pt-2 border-t border-[#E7DFD5]/60 text-[11px] text-[#78716C]">
                        <strong>Konteks Sejarah:</strong> {selectedWastra.historical_context}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Motif-Motif Terdaftar */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-[#963824]">✦</span> Ragam Motif & Mitologi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedWastra.motifs.map((motif, i) => (
                    <div key={i} className="p-3 sm:p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="font-serif text-xs text-[#1C1917]">{motif.name}</strong>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          motif.is_sacred 
                            ? 'bg-[#963824]/10 border-[#963824]/30 text-[#963824] font-bold'
                            : 'bg-[#FFFFFF] border-[#E7DFD5] text-[#57534E]'
                        }`}>
                          {motif.is_sacred ? 'Sakral' : 'Harian'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">{motif.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pewarnaan Alam & Tanaman */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-xs text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf size={14} className="text-emerald-700" /> Ekologi Pewarnaan Alami & Material:
                </h4>
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-[#1C1917] space-y-2">
                  <div className="text-emerald-950 font-medium">
                    🍃 <strong>Pewarna Alami:</strong> {selectedWastra.dye}
                  </div>
                  <div className="text-emerald-900 text-[11px]">
                    🧵 <strong>Material Serat:</strong> {selectedWastra.material}
                  </div>
                  {selectedWastra.colors && selectedWastra.colors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedWastra.colors.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/80 border border-emerald-300/60 text-[10px] text-emerald-950 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Taboo / Pantangan Budaya */}
              {selectedWastra.cultural_sensitivity && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F5EFE6] border border-[#E7DFD5] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#963824]">
                    <AlertTriangle size={14} />
                    <span>Etika Budaya & Sensitivitas Adat (Zero Cultural Misappropriation):</span>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {selectedWastra.cultural_sensitivity}
                  </p>
                </div>
              )}

              {/* Panduan Perawatan Kain */}
              {selectedWastra.care && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#57534E]">
                  <strong className="text-[#1C1917] block mb-1">🧼 Panduan Perawatan Resmi:</strong>
                  <span>{selectedWastra.care}</span>
                </div>
              )}

              {/* Koleksi Busana Terkait dari Oerip */}
              {relatedProducts.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E7DFD5]">
                  <h4 className="font-serif font-bold text-xs text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-[#963824]" /> Karya Busana Oerip Terkait ({relatedProducts.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedProducts.map((p) => (
                      <div key={p.product_id} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex gap-3 items-center">
                        <img
                          src={p.image}
                          alt={p.product_name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = 'true';
                              target.src = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                            }
                          }}
                          className="w-14 h-14 rounded-lg object-cover border border-[#E7DFD5] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-serif font-bold text-xs text-[#1C1917] truncate">{p.product_name}</h5>
                          <span className="text-[10px] text-[#78716C] block truncate">{p.size} • {p.price_range}</span>
                          <span className="text-[9px] text-[#963824] font-semibold mt-0.5 block">{p.occasion[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Citations */}
              <div className="pt-4 border-t border-[#E7DFD5] text-[11px] text-[#78716C] flex flex-wrap justify-between gap-2">
                <span><strong>Sumber Kurasi:</strong> {selectedWastra.source}</span>
                <span><strong>Validator:</strong> {selectedWastra.validated_by}</span>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] text-center text-[#78716C]">
              Pilih salah satu wastra dari daftar di sebelah kiri untuk melihat kajian budaya.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

