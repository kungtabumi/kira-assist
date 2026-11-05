import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Layers,
  CheckCircle2,
  Sliders,
  Compass,
  Feather,
  Menu,
  X,
  User,
  Shield,
  LayoutDashboard,
  Database,
  MessageSquare
} from 'lucide-react';
import { AppMode, ActiveTabType, UserTabType, AdminTabType, BusinessProfile } from '../types';

interface NavbarProps {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  businesses?: BusinessProfile[];
  activeBusiness?: BusinessProfile;
  setActiveBusiness?: (b: BusinessProfile) => void;
  validationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  appMode,
  setAppMode,
  activeTab,
  setActiveTab,
  validationCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Mode Tabs - Label yang rapi dan pas secara proporsi
  const userNavItems: { id: UserTabType; label: string; fullLabel: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'landing', label: 'Beranda', fullLabel: 'Beranda', icon: Sparkles },
    { id: 'consultation', label: 'Tanya AI', fullLabel: 'Tanya AI', icon: MessageSquare, badge: 'RAG' },
    { id: 'wastra', label: 'Pustaka', fullLabel: 'Pustaka Wastra', icon: BookOpen },
    { id: 'products', label: 'Katalog', fullLabel: 'Katalog Produk', icon: Layers },
    { id: 'styling', label: 'Padu Padan', fullLabel: 'Rekomendasi Gaya', icon: Sliders },
    { id: 'persona', label: 'Persona', fullLabel: 'Persona Budaya', icon: Compass }
  ];

  // Admin & Marketing Mode Tabs
  const adminNavItems: { id: AdminTabType; label: string; fullLabel: string; icon: React.FC<any>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', fullLabel: 'Dashboard & KPI', icon: LayoutDashboard },
    { id: 'knowledge_base', label: 'Knowledge Base', fullLabel: 'Knowledge Base', icon: Database },
    { id: 'content_studio', label: 'Studio Konten', fullLabel: 'Content Studio AI', icon: Feather, badge: 'AI' },
    {
      id: 'validation_feedback',
      label: 'Validasi',
      fullLabel: 'Validasi Kurator',
      icon: CheckCircle2,
      badge: validationCount > 0 ? validationCount : undefined
    }
  ];

  const handleSelectTab = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSwitchMode = (newMode: AppMode) => {
    setAppMode(newMode);
    if (newMode === 'ADMIN') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('landing');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all ${
        appMode === 'ADMIN'
          ? 'bg-[#1C1917] text-[#FAF7F2] border-b border-[#38332E] shadow-sm'
          : 'bg-[#FAF7F2]/95 backdrop-blur-md text-[#1C1917] border-b border-[#E7DFD5] shadow-xs'
      }`}>
        
        {/* Admin Top Status Bar */}
        {appMode === 'ADMIN' && (
          <div className="bg-[#963824] text-[#FAF7F2] text-[11px] font-medium py-1 px-4 text-center">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <Shield size={12} className="text-amber-300 shrink-0" />
                <span className="truncate"><strong>PORTAL KURASI OERIP</strong> — Kurasi Budaya, Grounding AI & Studio Konten</span>
              </div>
              <button
                onClick={() => handleSwitchMode('USER')}
                className="text-[11px] underline hover:text-amber-200 cursor-pointer font-semibold shrink-0 ml-2"
              >
                Lihat Tampilan Publik →
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[68px] gap-3">
            
            {/* 1. Brand Identity (Kiri) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleSelectTab(appMode === 'ADMIN' ? 'dashboard' : 'landing')}
                className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
                title="Menuju Beranda OERIP AI"
              >
                {/* Monogram Logo Badge */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-serif font-bold text-lg sm:text-xl transition-all shadow-xs shrink-0 ${
                  appMode === 'ADMIN'
                    ? 'bg-[#963824] text-[#FAF7F2] border border-amber-400/40 group-hover:bg-[#B3452D]'
                    : 'bg-[#1C1917] text-[#FAF7F2] border border-[#C89B53]/40 group-hover:bg-[#963824]'
                }`}>
                  O
                </div>

                {/* Typography Brand & Subtitle */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-serif tracking-[0.16em] text-lg sm:text-xl font-bold leading-none ${
                      appMode === 'ADMIN' ? 'text-[#FAF7F2]' : 'text-[#1C1917]'
                    }`}>
                      OERIP AI
                    </span>
                    <span className={`hidden sm:inline-block text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full font-semibold border ${
                      appMode === 'ADMIN'
                        ? 'bg-[#2E2822] text-amber-300 border-amber-500/30'
                        : 'bg-[#EAE2D5] text-[#963824] border-[#D5CABE]'
                    }`}>
                      {appMode === 'ADMIN' ? 'Admin' : 'Wastra'}
                    </span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-serif italic mt-0.5 truncate max-w-[140px] sm:max-w-none ${
                    appMode === 'ADMIN' ? 'text-[#A89E95]' : 'text-[#78716C]'
                  }`}>
                    {appMode === 'ADMIN' ? 'Kurasi Dian Oerip' : 'Asisten Wastra Resmi'}
                  </span>
                </div>
              </button>
            </div>

            {/* 2. Desktop Navigation Menu (Tengah - Proporsional & Rapi) */}
            <nav 
              className="hidden lg:flex items-center gap-1 p-1 rounded-full border shadow-2xs transition-colors"
              style={{
                backgroundColor: appMode === 'ADMIN' ? '#26221E' : '#F2ECE1',
                borderColor: appMode === 'ADMIN' ? '#3D3730' : '#E3DACD'
              }}
            >
              {appMode === 'USER' ? (
                userNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs font-semibold'
                          : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2]/80'
                      }`}
                    >
                      <Icon
                        size={13}
                        className={isActive ? 'text-[#C89B53]' : 'text-[#8C827A]'}
                      />
                      {/* Label ringkas dan pas */}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#EAE2D5] text-[#963824] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#FAF7F2] text-[#1C1917] shadow-xs font-semibold'
                          : 'text-[#C7BCB1] hover:text-[#FAF7F2] hover:bg-[#38322B]'
                      }`}
                    >
                      <Icon
                        size={13}
                        className={isActive ? 'text-[#963824]' : 'text-[#A89E95]'}
                      />
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                          typeof item.badge === 'number'
                            ? 'bg-[#963824] text-white'
                            : 'bg-amber-400 text-stone-900'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </nav>

            {/* 3. Role Switcher & Actions (Kanan - Rapi & Sejajar) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Segmented Mode Switcher (Pelanggan / Admin) */}
              <div className={`flex items-center p-0.5 rounded-full border shadow-2xs transition-all ${
                appMode === 'ADMIN'
                  ? 'bg-[#26221E] border-[#4A423A]'
                  : 'bg-[#F2ECE1] border-[#DCD3C5]'
              }`}>
                <button
                  onClick={() => handleSwitchMode('USER')}
                  title="Beralih ke Mode Pelanggan / Publik"
                  className={`h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    appMode === 'USER'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                      : appMode === 'ADMIN'
                      ? 'text-[#A89E95] hover:text-[#FAF7F2]'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <User size={12} className={appMode === 'USER' ? 'text-[#C89B53]' : 'text-current'} />
                  <span className="text-[11px] sm:text-xs">Pelanggan</span>
                </button>

                <button
                  onClick={() => handleSwitchMode('ADMIN')}
                  title="Beralih ke Portal Admin Tim Oerip"
                  className={`h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                    appMode === 'ADMIN'
                      ? 'bg-[#963824] text-[#FAF7F2] shadow-xs'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  <ShieldCheck size={12} className={appMode === 'ADMIN' ? 'text-amber-300' : 'text-current'} />
                  <span className="text-[11px] sm:text-xs">Admin</span>
                  {validationCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight ${
                      appMode === 'ADMIN' ? 'bg-[#FAF7F2] text-[#963824]' : 'bg-[#963824] text-white animate-pulse'
                    }`}>
                      {validationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Hamburger Menu Toggle Button */}
              <div className="flex lg:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`h-9 w-9 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                    appMode === 'ADMIN'
                      ? 'bg-[#26221E] border-[#3D3730] text-[#FAF7F2] hover:bg-[#38322B]'
                      : 'bg-[#FFFFFF] border-[#D5CABE] text-[#1C1917] hover:bg-[#F3EEE4]'
                  }`}
                  aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-b px-4 pt-3 pb-5 space-y-3.5 shadow-xl animate-in fade-in duration-200 ${
            appMode === 'ADMIN'
              ? 'bg-[#26221E] border-[#3D3730] text-[#FAF7F2]'
              : 'bg-[#FAF7F2] border-[#E7DFD5] text-[#1C1917]'
          }`}>
            
            {/* Navigasi Utama Mobile */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-serif uppercase tracking-widest text-[#963824] font-bold px-1">
                {appMode === 'USER' ? 'Menu Wastra & Fashion' : 'Menu Admin Tim Oerip'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {appMode === 'USER' ? (
                  userNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`min-h-[42px] p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs font-semibold'
                            : 'bg-[#FFFFFF] text-[#57534E] border-[#E7DFD5] hover:bg-[#F3EEE4]'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-[#C89B53]' : 'text-[#963824]'} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })
                ) : (
                  adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`min-h-[42px] p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FAF7F2] text-[#1C1917] border-[#FAF7F2] shadow-xs font-semibold'
                            : 'bg-[#332D27] text-[#C7BCB1] border-[#453D35] hover:bg-[#3D3730]'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-[#963824]' : 'text-amber-400'} />
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full bg-[#963824] text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </header>

      {/* Floating Mobile Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t px-2 py-1.5 backdrop-blur-lg shadow-lg flex items-center justify-around transition-all ${
        appMode === 'ADMIN'
          ? 'bg-[#1C1917]/95 border-[#3D3730] text-[#FAF7F2]'
          : 'bg-[#FAF7F2]/95 border-[#E7DFD5] text-[#1C1917]'
      }`}>
        {appMode === 'USER' ? (
          userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-1 py-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#963824] font-bold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#963824]/10 text-[#963824]' : ''}`}>
                  <Icon size={17} className={isActive ? 'text-[#963824]' : 'text-[#8C827A]'} />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#963824]" />
                )}
              </button>
            );
          })
        ) : (
          adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-1 py-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-[#A89E95] hover:text-[#FAF7F2]'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#332D27] text-amber-400' : ''}`}>
                  <Icon size={17} className={isActive ? 'text-amber-400' : 'text-[#A89E95]'} />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#963824]" />
                )}
              </button>
            );
          })
        )}
      </nav>
    </>
  );
};
