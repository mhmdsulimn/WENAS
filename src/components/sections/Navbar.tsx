import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX, Globe, Orbit, Menu, X, Home, HeartPulse, Activity, Brain } from 'lucide-react';
import { sound } from '../../audio/soundSystem';

interface NavbarProps {
  audioMuted: boolean;
  toggleAudio: () => void;
  activeStatus: 'normal' | 'emergency' | 'stress' | 'caffeine';
}

export const Navbar: React.FC<NavbarProps> = ({ audioMuted, toggleAudio, activeStatus }) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      // Section spy
      const sections = ['hero', 'belt', 'bracelet', 'grounding'];
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStatusColor = () => {
    switch (activeStatus) {
      case 'emergency':
        return 'border-red-500/60 bg-red-950/70 text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.45)]';
      case 'stress':
        return 'border-amber-500/60 bg-amber-950/70 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.35)]';
      case 'caffeine':
        return 'border-cyan-500/60 bg-cyan-950/70 text-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.35)]';
      default:
        return 'border-cyan-500/30 bg-cyan-950/40 text-cyan-400';
    }
  };

  const navItems = [
    { id: 'hero', label: t.nav.hero, icon: <Home className="w-4 h-4" /> },
    { id: 'belt', label: t.nav.belt, icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'bracelet', label: t.nav.bracelet, icon: <Activity className="w-4 h-4" /> },
    { id: 'grounding', label: t.nav.psychology, icon: <Brain className="w-4 h-4" /> },
  ];

  const scrollTo = (id: string) => {
    sound.playClick('subtle');
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-slate-950/85 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
          : 'py-4 bg-slate-950/35 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand (Cleaned to save horizontal space) */}
        <div
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300">
            <Orbit className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-wider text-white">
              {t.appName}
            </span>
            <span className="text-cyan-400 font-bold text-lg font-arabic drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              ({t.appArabicName})
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links with Active Spy Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold p-1 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                activeSection === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              } ${isRtl ? 'font-arabic text-[13px]' : 'font-mono'}`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Tools & Language Toggle & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Status Indicator (Desktop/Tablet) */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono transition-all ${getStatusColor()}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span className="uppercase font-semibold tracking-wider">
              {activeStatus === 'emergency'
                ? isRtl ? 'حالة طوارئ' : 'EMERGENCY'
                : activeStatus === 'stress'
                ? isRtl ? 'توتر نشط' : 'STRESS ACTIVE'
                : activeStatus === 'caffeine'
                ? isRtl ? 'كافيين آمن' : 'CAFFEINE SAFE'
                : isRtl ? 'مستقر' : 'NOMINAL'}
            </span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleAudio}
            title={audioMuted ? 'Unmute Sound' : 'Mute Sound'}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              audioMuted
                ? 'bg-slate-900/80 text-slate-500 border-slate-800 hover:text-slate-300'
                : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
            }`}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Toggle Button (EN / AR) */}
          <button
            onClick={() => {
              sound.playClick('action');
              toggleLanguage();
            }}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl font-mono font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_18px_rgba(6,182,212,0.4)] min-w-[50px]"
            title="Switch Language (EN / AR)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.toggleLangBtn}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              sound.playClick('subtle');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="Navigation Menu"
            aria-label="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-3 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10 px-2">
            <span className="text-[11px] font-mono text-slate-400">
              {isRtl ? 'أقسام المنظومة' : 'SYSTEM NAVIGATION'}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${getStatusColor()}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span>
                {activeStatus === 'emergency'
                  ? isRtl ? 'طوارئ' : 'EMERGENCY'
                  : activeStatus === 'stress'
                  ? isRtl ? 'توتر' : 'STRESS'
                  : activeStatus === 'caffeine'
                  ? isRtl ? 'كافيين' : 'CAFFEINE'
                  : isRtl ? 'مستقر' : 'NOMINAL'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                } ${isRtl ? 'font-arabic text-sm text-right flex-row-reverse' : 'font-sans text-xs text-left'}`}
              >
                <span className={activeSection === item.id ? 'text-cyan-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
