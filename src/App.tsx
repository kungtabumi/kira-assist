import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConsultationAgent } from './components/ConsultationAgent';
import { StylingStudio } from './components/StylingStudio';
import { WastraPersonaFinder } from './components/WastraPersonaFinder';
import { WastraExplorer } from './components/WastraExplorer';
import { ProductCatalog } from './components/ProductCatalog';
import { StorytellingGenerator } from './components/StorytellingGenerator';
import { ValidationQueueDashboard } from './components/ValidationQueueDashboard';
import { AdminKnowledgeBase } from './components/AdminKnowledgeBase';
import { Footer } from './components/Footer';
import { WovenBackground } from './components/WovenBackground';
import { BUSINESS_PROFILES, VALIDATION_QUEUE_INITIAL } from './data/oeripKnowledgeBase';
import { AppMode, ActiveTabType, BusinessProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Sliders,
  Compass,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Feather,
  CheckCircle2,
  Lock
} from 'lucide-react';

export function App() {
  const [appMode, setAppMode] = useState<AppMode>('USER');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('landing');
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(BUSINESS_PROFILES);
  const [activeBusiness, setActiveBusiness] = useState<BusinessProfile>(BUSINESS_PROFILES[0]);
  const [validationCount, setValidationCount] = useState<number>(0);
  const [consultationPrompt, setConsultationPrompt] = useState<string>('');

  const triggerConsultationWithPrompt = (prompt: string) => {
    setConsultationPrompt(prompt);
    setActiveTab('consultation');
  };

  const fetchValidationStats = () => {
    fetch('/api/kira/validation-queue')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pending = data.filter((item: any) => item.status === 'NEEDS_REVIEW' || item.status === 'DRAFT');
          setValidationCount(pending.length);
        }
      })
      .catch(() => {
        setValidationCount(VALIDATION_QUEUE_INITIAL.filter(i => i.status === 'NEEDS_REVIEW').length);
      });
  };

  useEffect(() => {
    fetchValidationStats();
  }, [activeTab, appMode]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans flex flex-col selection:bg-[#963824] selection:text-white relative w-full max-w-full overflow-x-hidden">
      
      {/* Aesthetic Woven Textile (Tenun) Motif Background Layer */}
      <WovenBackground opacity={0.9} />

      {/* Top Universal Navbar */}
      <Navbar
        appMode={appMode}
        setAppMode={setAppMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        businesses={businesses}
        activeBusiness={activeBusiness}
        setActiveBusiness={setActiveBusiness}
        validationCount={validationCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 relative z-10 pb-16 lg:pb-0 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${appMode}-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {/* ---------------------------------------------------- */}
            {/* USER / PELANGGAN MODE VIEWS */}
            {/* ---------------------------------------------------- */}
            {appMode === 'USER' && (
              <>
                {/* 1. Landing View (PRD Section 4 & 13) */}
                {activeTab === 'landing' && (
                  <div className="space-y-12">
                    <HeroSection
                      onStartConsultation={() => setActiveTab('consultation')}
                      onExploreWastra={() => setActiveTab('wastra')}
                      onOpenStyling={() => setActiveTab('styling')}
                      onOpenPersona={() => setActiveTab('persona')}
                      activeBusiness={activeBusiness}
                    />

                    {/* Quick Access Feature Grid (Clean Architectural Layout) */}
                    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                      <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-[11px] font-serif uppercase tracking-widest text-[#963824] font-bold">
                          Fitur Utama Pelanggan
                        </span>
                        <h2 className="font-serif text-3xl font-bold text-[#1C1917] mt-1.5">
                          Jelajahi Warisan Wastra Bersama KIRA
                        </h2>
                        <p className="text-xs sm:text-sm text-[#57534E] mt-2">
                          Pilih modul yang ingin Anda gunakan untuk menjelajah, berkonsultasi, atau memadukan busana tenun Nusantara.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Card 1: Tanya AI */}
                        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs flex flex-col justify-between hover:border-[#963824] transition-all group">
                          <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#963824] flex items-center justify-center">
                              <MessageSquare size={20} />
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                              Tanya AI & Konsultasi Gaya
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                              Tanyakan kecocokan busana untuk diplomasi, pesta, atau kasual. KIRA menjawab secara santun dengan akurasi data terverifikasi.
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveTab('consultation')}
                            className="mt-6 pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs font-semibold text-[#963824] group-hover:text-[#1C1917] cursor-pointer"
                          >
                            <span>Buka Chat KIRA</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {/* Card 2: Pustaka Wastra */}
                        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs flex flex-col justify-between hover:border-[#963824] transition-all group">
                          <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#1E3A2B] flex items-center justify-center">
                              <BookOpen size={20} />
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                              Pustaka Wastra Nusantara
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                              Eksplorasi tenun Sumba Timur, Batik Gedog Tuban, Tenun Toraja, Ulos Batak, hingga Tenun Lurik Klaten lengkap dengan mitologi & falsafahnya.
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveTab('wastra')}
                            className="mt-6 pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs font-semibold text-[#1E3A2B] group-hover:text-[#1C1917] cursor-pointer"
                          >
                            <span>Jelajahi Pustaka</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        {/* Card 3: Rekomendasi Gaya & Persona */}
                        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs flex flex-col justify-between hover:border-[#963824] transition-all group">
                          <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#C89B53] flex items-center justify-center">
                              <Compass size={20} />
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                              Persona Budaya & Styling
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                              Ikuti kuis 4 pertanyaan untuk menemukan persona wastra Anda (The Bohemian Nomad, The Cultural Diplomat, The Avant-Garde Minimalist, dsb).
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveTab('persona')}
                            className="mt-6 pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs font-semibold text-[#963824] group-hover:text-[#1C1917] cursor-pointer"
                          >
                            <span>Ikuti Kuis Persona</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>

                      </div>
                    </section>
                  </div>
                )}

                {/* 2. Tanya AI (Consultation Agent) */}
                {activeTab === 'consultation' && (
                  <ConsultationAgent
                    activeBusiness={activeBusiness}
                    initialPrompt={consultationPrompt}
                    onOpenWastraDetail={(wName) => {
                      setActiveTab('wastra');
                    }}
                  />
                )}

                {/* 3. Pustaka Wastra (Explorer) */}
                {activeTab === 'wastra' && (
                  <WastraExplorer
                    onConsultAboutWastra={(wName) => {
                      triggerConsultationWithPrompt(`Ceritakan lebih dalam tentang ${wName} dan bagaimana Oerip mengolahnya dalam busana kontemporer.`);
                    }}
                  />
                )}

                {/* 4. Katalog Produk (Product Catalog) */}
                {activeTab === 'products' && (
                  <ProductCatalog
                    onConsultProduct={(pName) => {
                      triggerConsultationWithPrompt(`Saya tertarik dengan koleksi ${pName}. Mengapa produk ini istimewa dan bagaimana cara perawatannya?`);
                    }}
                  />
                )}

                {/* 5. Rekomendasi Gaya (Styling Studio) */}
                {activeTab === 'styling' && (
                  <StylingStudio
                    onConsultLook={(lookText) => {
                      triggerConsultationWithPrompt(
                        `Saya menyusun paduan busana di Styling Studio:\n${lookText}\n\nBagaimana analisis kelayakan budaya dan saran aksesoris tambahannya dari KIRA?`
                      );
                    }}
                  />
                )}

                {/* 6. Persona Budaya (Persona Match) */}
                {activeTab === 'persona' && (
                  <WastraPersonaFinder
                    onApplyPersona={(personaText) => {
                      triggerConsultationWithPrompt(
                        `Saya telah mengikuti Kuis Persona Budaya dengan hasil:\n${personaText}\n\nBantu saya memilihkan varian koleksi Oerip yang paling sempurna untuk persona saya ini.`
                      );
                    }}
                    onExploreWastra={(wName) => {
                      setActiveTab('wastra');
                    }}
                    onExploreStyling={() => {
                      setActiveTab('styling');
                    }}
                  />
                )}
              </>
            )}

            {/* ---------------------------------------------------- */}
            {/* ADMIN & TIM OERIP / MARKETING VIEWS (PRD Section 4 & 13) */}
            {/* ---------------------------------------------------- */}
            {appMode === 'ADMIN' && (
              <>
                {/* 1. Dashboard & KPI */}
                {activeTab === 'dashboard' && (
                  <AdminKnowledgeBase initialSubTab="DASHBOARD" />
                )}

                {/* 2. Knowledge Base Manager (6 Entitas CRUD) */}
                {activeTab === 'knowledge_base' && (
                  <AdminKnowledgeBase initialSubTab="ENTITIES" />
                )}

                {/* 3. Content Studio (Storytelling Generator) */}
                {activeTab === 'content_studio' && (
                  <StorytellingGenerator />
                )}

                {/* 4. Validasi & Feedback Queue */}
                {activeTab === 'validation_feedback' && (
                  <ValidationQueueDashboard />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Standard Footer */}
      <Footer />

    </div>
  );
}

export default App;
