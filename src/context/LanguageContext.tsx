import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export interface Translations {
  appName: string;
  appArabicName: string;
  tagline: string;
  heroSub: string;
  badge: string;
  exploreBtn: string;
  toggleLangBtn: string;
  nasaBadge: string;
  nav: {
    hero: string;
    belt: string;
    bracelet: string;
    psychology: string;
    telemetry: string;
  };
  beltSection: {
    badge: string;
    title: string;
    arabicTitle: string;
    desc: string;
    liveEcgTitle: string;
    statusNominal: string;
    emergencyBtn: string;
    resetBtn: string;
    emergencyAlertTitle: string;
    emergencyAlertMessage: string;
    smartPenaltyTitle: string;
    smartPenaltyDesc: string;
    modelSwapNotice: string;
    metrics: {
      hr: string;
      hrNominal: string;
      spo2: string;
      spo2Nominal: string;
      temp: string;
      resp: string;
      bp: string;
    };
  };
  braceletSection: {
    badge: string;
    title: string;
    arabicTitle: string;
    desc: string;
    biomarkersTitle: string;
    caffeineBtn: string;
    stressBtn: string;
    caffeineAlertTitle: string;
    caffeineAlertMessage: string;
    stressAlertTitle: string;
    stressAlertMessage: string;
    modelSwapNotice: string;
    biomarkers: {
      caffeine: string;
      cortisol: string;
      hydration: string;
      electrolytes: string;
      lactic: string;
    };
  };
  groundingSection: {
    badge: string;
    title: string;
    desc: string;
    voiceTitle: string;
    voiceDesc: string;
    mintTitle: string;
    mintDesc: string;
    penaltyTitle: string;
    penaltyDesc: string;
  };
  threeDControls: {
    dragHint: string;
    modelSwapTitle: string;
    modelSwapCodeHint: string;
  };
  footer: {
    rights: string;
    spaceAppsQuote: string;
  };
}

const translationsData: Record<Language, Translations> = {
  en: {
    appName: 'WENAS',
    appArabicName: 'ونس',
    tagline: 'Autonomous Physiological & Psychological Astronaut Support Ecosystem',
    heroSub: 'Named after the Arabic concept of "Wenas (ونس)"—comfort, companionship, and emotional grounding in deep solitude. An integrated dual-tier wearable ecosystem monitoring physiological vitals through the Astro-EMS Chest Belt and neuro-biochemical sweat markers via the Smart Bracelet, paired with autonomous grounding interventions.',
    badge: 'NASA SPACE APPS CHALLENGE',
    exploreBtn: 'Explore Ecosystem',
    toggleLangBtn: 'AR',
    nasaBadge: 'ARTEMIS DEEP SPACE INITIATIVE',
    nav: {
      hero: 'Home',
      belt: 'Astro-EMS Belt',
      bracelet: 'Smart Bracelet',
      psychology: 'Grounding System',
      telemetry: 'Live Telemetry',
    },
    beltSection: {
      badge: 'LAYER 1 // CARDIOPULMONARY TELEMETRY',
      title: 'The Astro-EMS Chest Belt',
      arabicTitle: 'حزام الصدر Astro-EMS',
      desc: 'Positioned over the thorax, the Astro-EMS Belt delivers uninterrupted multi-lead electrocardiography (ECG), thoracic impedance plethysmography, and autonomic nervous tone evaluation to detect acute physiological crises.',
      liveEcgTitle: 'REAL-TIME LEAD-II CARDIAC OSCILLOSCOPE',
      statusNominal: 'HEMODYNAMIC STATUS: NOMINAL (60-80 BPM)',
      emergencyBtn: 'Simulate Emergency',
      resetBtn: 'Reset Baseline',
      emergencyAlertTitle: 'CRITICAL EMERGENCY PROTOCOL ENGAGED',
      emergencyAlertMessage: 'Critical Condition - Smart Penalty: Media Paused / خطر حقيقي - إيقاف الوسائط',
      smartPenaltyTitle: 'SMART PENALTY ACTIVATED',
      smartPenaltyDesc: 'Non-essential astronaut entertainment systems (music, VR video, audiobooks) are instantly paused to preserve cognitive bandwidth, clear communications channels, and re-route emergency oxygen.',
      modelSwapNotice: 'Interactive 3D Belt Prototype (Drag to orbit, scroll to zoom)',
      metrics: {
        hr: 'HEART RATE',
        hrNominal: '60 - 80 BPM',
        spo2: 'OXYGEN SATURATION',
        spo2Nominal: 'SpO2 > 98%',
        temp: 'CORE TEMP',
        resp: 'RESPIRATION',
        bp: 'BLOOD PRESSURE',
      },
    },
    braceletSection: {
      badge: 'LAYER 2 // NEURO-BIOCHEMICAL SWEAT SENSING',
      title: 'The Smart Bracelet',
      arabicTitle: 'السوار الذكي',
      desc: 'Equipped with continuous microfluidic epidermal patches, the WENAS Smart Bracelet analyzes sweat biomarkers in real-time, distinguishing between benign stimulant ingestion and psychological distress.',
      biomarkersTitle: 'SWEAT MICROFLUIDIC BIOSENSOR STREAM',
      caffeineBtn: 'Caffeine Spike',
      stressBtn: 'Simulate Stress',
      caffeineAlertTitle: 'SWEAT SENSOR VERIFIED',
      caffeineAlertMessage: 'Caffeine Detected - No Alarm / رصد كافيين - إنذار كاذب مقفل',
      stressAlertTitle: 'PSYCHOLOGICAL DISTRESS INTERVENTION',
      stressAlertMessage: "Stress Detected - Mother's Voice & Mint Scent Activated / رصد توتر - تفعيل التوأم الرقمي بصوت الأم",
      modelSwapNotice: 'Interactive 3D Bracelet Prototype (Drag to orbit, scroll to zoom)',
      biomarkers: {
        caffeine: 'Caffeine Level',
        cortisol: 'Cortisol (Stress)',
        hydration: 'Hydration Level',
        electrolytes: 'Electrolytes',
        lactic: 'Lactic Acid',
      },
    },
    groundingSection: {
      badge: 'AUTONOMOUS PSYCHOLOGICAL GROUNDING',
      title: 'The "Wenas" Solace Architecture',
      desc: 'In deep space, isolation is the invisible hazard. Wenas counters psychological drift with automated, sensory interventions before panic impacts mission safety.',
      voiceTitle: "Mother's Voice Audio Twin",
      voiceDesc: 'Synthesizes acoustic maternal tones and familiar vocal warmth from encrypted family recordings to rapidly lower amygdala hyperactivity.',
      mintTitle: 'Olfactory Mint Micro-Nebulizer',
      mintDesc: 'Disperses pulsed sub-micron peppermint aroma into the helmet airflow to induce immediate parasympathetic nervous reset.',
      penaltyTitle: 'Cognitive Load Smart Penalty',
      penaltyDesc: 'Automatically suspends distracting recreational feeds when heart rate spikes without physiological stimulant origin.',
    },
    threeDControls: {
      dragHint: 'Click & Drag to Rotate • Scroll to Zoom',
      modelSwapTitle: 'Replace with your .glb model',
      modelSwapCodeHint: 'Edit file: src/components/3d/models/...',
    },
    footer: {
      rights: 'WENAS (ونس) Space Apps Project. Built for deep-space astronaut resilience.',
      spaceAppsQuote: 'Turning extreme isolation into human warmth through biometric intelligence.',
    },
  },
  ar: {
    appName: 'ونس',
    appArabicName: 'WENAS',
    tagline: 'المنظومة الذكية للرعاية الفسيولوجية والدعم النفسي لرواد الفضاء',
    heroSub: 'مستوحى من المعنى العربي العميق لكلمة "ونس"—حيث يجد رائد الفضاء الطمأنينة والألفة والأمان النفسي في أعماق العزلة الكونية. منظومة ثنائية ذكية تجمع بين حزام الصدر (Astro-EMS) لمراقبة المؤشرات الحيوية والسوار الذكي لتحليل العرق وهرمونات التوتر، مع تدخلات تلطيف نفسية ذاتية.',
    badge: 'تحدي ناسا لتطبيقات الفضاء (NASA SPACE APPS)',
    exploreBtn: 'استكشف المنظومة',
    toggleLangBtn: 'EN',
    nasaBadge: 'مبادرة أرتميس للفضاء السحيق',
    nav: {
      hero: 'الرئيسية',
      belt: 'حزام الصدر',
      bracelet: 'السوار الذكي',
      psychology: 'منظومة الأنس',
      telemetry: 'المؤشرات الحية',
    },
    beltSection: {
      badge: 'الطبقة الأولى // القياسات القلبية والتنفسية',
      title: 'حزام الصدر (Astro-EMS)',
      arabicTitle: 'The Astro-EMS Chest Belt',
      desc: 'يُثبّت الحزام حول القفص الصدري لتوفير تخطيط كهربائي فوري للقلب (ECG) وقياس معدل التنفس وتدفق الدم بدقة فائقة لاكتشاف الأزمات الفسيولوجية المفاجئة.',
      liveEcgTitle: 'راسم نبضات القلب اللحظي (LEAD-II ECG)',
      statusNominal: 'الحالة الحيوية: طبيعية ومستقرة (60 - 80 نبضة/د)',
      emergencyBtn: 'محاكاة حالة طوارئ',
      resetBtn: 'إعادة ضبط الحالة',
      emergencyAlertTitle: 'تفعيل بروتوكول الطوارئ الحرجة',
      emergencyAlertMessage: 'خطر حقيقي - إيقاف الوسائط / Critical Condition - Smart Penalty: Media Paused',
      smartPenaltyTitle: 'العقوبة الذكية: إيقاف الترفيه',
      smartPenaltyDesc: 'إيقاف فوري وتلقائي لكافة وسائط الترفيه (الموسيقى، نظارات الواقع الافتراضي، الكتب المسموعة) لتركيز ذهن رائد الفضاء وفتح قنوات الاتصال وتوجيه الأكسجين للطوارئ.',
      modelSwapNotice: 'نموذج ثلاثي الأبعاد تفاعلي للحزام (اسحب للتدوير، دحرج للتكبير)',
      metrics: {
        hr: 'معدل نبضات القلب',
        hrNominal: '60 - 80 نبضة/د',
        spo2: 'نسبة تشبع الأكسجين',
        spo2Nominal: 'SpO2 > 98%',
        temp: 'حرارة الجسم المركزية',
        resp: 'معدل التنفس',
        bp: 'ضغط الدم الشرياني',
      },
    },
    braceletSection: {
      badge: 'الطبقة الثانية // الاستشعار الكيميائي الدقيق للعرق',
      title: 'السوار الذكي (Smart Bracelet)',
      arabicTitle: 'The Smart Bracelet',
      desc: 'مزود بشرائح ميكروفلويديك مجهرية لتحليل عرق الجلد بشكل مستمر وفوري، مما يمكن النظام من التمييز الذكي بين تسارع النبض الناتج عن الكافيين والتوتر النفسي.',
      biomarkersTitle: 'مصفوفة المؤشرات الحيوية الكيميائية للعرق',
      caffeineBtn: 'جرعة كافيين',
      stressBtn: 'محاكاة توتر',
      caffeineAlertTitle: 'تأكيد امتصاص الكافيين عبر العرق',
      caffeineAlertMessage: 'رصد كافيين - إنذار كاذب مقفل / Caffeine Detected - No Alarm',
      stressAlertTitle: 'تدخل نفسي فوري لمواجهة التوتر',
      stressAlertMessage: "رصد توتر - تفعيل التوأم الرقمي بصوت الأم ورائحة النعناع / Stress Detected - Mother's Voice & Mint Scent Activated",
      modelSwapNotice: 'نموذج ثلاثي الأبعاد تفاعلي للسوار الذكي (اسحب للتدوير، دحرج للتكبير)',
      biomarkers: {
        caffeine: 'تركيز الكافيين',
        cortisol: 'الكورتيزول (التوتر)',
        hydration: 'مستوى الترطيب',
        electrolytes: 'الأملاح الكهرلية',
        lactic: 'حمض اللاكتيك',
      },
    },
    groundingSection: {
      badge: 'الدعم النفسي الذاتي المتكامل',
      title: 'هندسة "الونس" وتبديد وحشة الفضاء',
      desc: 'في الفضاء السحيق، العزلة هي العدو الخفي. منظومة "ونس" تتدخل حسياً ونفسياً بشكل آلي بمجرد رصد التوتر لاستعادة التوازن قبل أن يؤثر على سلامة الرحلة.',
      voiceTitle: 'التوأم الصوتي (صوت الأم)',
      voiceDesc: 'توليد ذبذبات صوتية مألوفة مستنسخة من تسجيلات عائلية مشفرة لتهدئة اللوزة الدماغية واستعادة الأمان الداخلي.',
      mintTitle: 'رذاذ النعناع المهدئ',
      mintDesc: 'إطلاق رذاذ مجهري من زيت النعناع داخل خوذة الرائد لتنشيط الجهاز العصبي اللاودي وخفض ضربات القلب فوراً.',
      penaltyTitle: 'العقوبة الذكية لخفض التشتت',
      penaltyDesc: 'تجميد الأجهزة الترفيهية لتصفية الانتباه حين يتسارع النبض بدون سبب عضوي، مع توجيه الرائد لإجراءات التنفس العميق.',
    },
    threeDControls: {
      dragHint: 'انقر واسحب للتدوير • دحرج العجلة للتكبير',
      modelSwapTitle: 'يمكنك استبدال النموذج بملف .glb الخاص بك',
      modelSwapCodeHint: 'عدل الكود في: src/components/3d/models/...',
    },
    footer: {
      rights: 'مشروع ونس (WENAS) - تحدي ناسا لتطبيقات الفضاء. صُمم لصمود الإنسان بين النجوم.',
      spaceAppsQuote: 'نحول وحشة الفضاء السحيق إلى أنس وأمان من خلال الذكاء الحيوي.',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [isRtl, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translationsData[language],
        isRtl,
      }}
    >
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
