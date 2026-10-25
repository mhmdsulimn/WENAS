/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useVitalStore } from './state/useVitalStore';
import { SpaceBackground } from './components/ui/SpaceBackground';
import { Navbar } from './components/sections/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ChestBeltSection } from './components/sections/ChestBeltSection';
import { SmartBraceletSection } from './components/sections/SmartBraceletSection';
import { GroundingSection } from './components/sections/GroundingSection';

function WenasAppContent() {
  const {
    status,
    metrics,
    biomarkers,
    audioMuted,
    toggleAudio,
    triggerReset,
    triggerCaffeine,
    triggerStress,
    triggerEmergency,
  } = useVitalStore();

  const { isRtl } = useLanguage();

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Cosmic Space Background with Twinkling Stars & Shooting Stars */}
      <SpaceBackground />

      {/* 1. Dynamic Bilingual Navbar with Blur on Scroll */}
      <Navbar
        audioMuted={audioMuted}
        toggleAudio={toggleAudio}
        activeStatus={status}
      />

      {/* 2. Section 1: Hero Section */}
      <HeroSection />

      {/* 3. Section 2: The Chest Belt Section (حزام الصدر Astro-EMS) */}
      <ChestBeltSection
        status={status}
        metrics={metrics}
        onEmergency={triggerEmergency}
        onReset={triggerReset}
      />

      {/* 4. Section 3: The Smart Bracelet Section (السوار الذكي) */}
      <SmartBraceletSection
        status={status}
        biomarkers={biomarkers}
        onCaffeine={triggerCaffeine}
        onStress={triggerStress}
        onReset={triggerReset}
      />

      {/* 5. Section 4: Psychological Grounding Engine (Wenas Architecture) */}
      <GroundingSection />

      {/* Subtle floating ambient indicator */}
      {status === 'emergency' && (
        <div className="fixed bottom-4 right-4 z-40 px-4 py-2.5 rounded-xl bg-red-600/90 backdrop-blur-md text-white font-mono text-xs font-bold shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400 animate-pulse flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className={isRtl ? 'font-arabic font-bold text-sm' : ''}>
            {isRtl ? 'طوارئ حرجة: إيقاف الوسائط' : 'CRITICAL EMERGENCY: MEDIA PAUSED'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <WenasAppContent />
    </LanguageProvider>
  );
}
