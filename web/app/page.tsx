'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslation } from '@/lib/translations';
import Hero3DBackground from '@/components/Hero3DBackground';

type SupportedLang = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ar';

const AUTH_LABELS: Record<
  SupportedLang,
  {
    signIn: string;
    getStarted: string;
    joinUs: string;
  }
> = {
  en: { signIn: 'Sign In', getStarted: 'Get Started', joinUs: 'Join Us' },
  pt: { signIn: 'Entrar', getStarted: 'Começar Agora', joinUs: 'Junte-se a Nós' },
  es: { signIn: 'Iniciar Sesión', getStarted: 'Comenzar', joinUs: 'Únete a Nosotros' },
  fr: { signIn: 'Connexion', getStarted: 'Commencer', joinUs: 'Rejoignez-nous' },
  de: { signIn: 'Anmelden', getStarted: 'Loslegen', joinUs: 'Mach mit' },
  ar: { signIn: 'تسجيل الدخول', getStarted: 'ابدأ الآن', joinUs: 'انضم إلينا' }
};

export default function LandingPage() {
  const [lang, setLang] = useState<SupportedLang>('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages: { code: SupportedLang; label: string }[] = [
    { code: 'en', label: 'English (EN)' },
    { code: 'pt', label: 'Português (PT)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'fr', label: 'Français (FR)' },
    { code: 'de', label: 'Deutsch (DE)' },
    { code: 'ar', label: 'العربية (AR)' }
  ];

  const isRtl = lang === 'ar';
  const authText = AUTH_LABELS[lang] || AUTH_LABELS.en;

  const t = (key: string, fallback: string) => {
    const val = getTranslation(lang, 'landing', key);
    return val && val !== key ? val : fallback;
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans bg-black text-white"
    >
      {/* Fundo 3D (Globo) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <Hero3DBackground />
      </div>

      {/* Header / Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-6 z-20 relative">
        <div className="flex items-center gap-3">
          {/* Logotipo Original da SkillGap */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1">
            <Image
              src="/images/logo-icon.png"
              alt="Logotipo SkillGap"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Nome da Plataforma */}
          <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            SKILLGAP
          </span>
        </div>

        {/* Menu Direito: Seletor de Idiomas + Botões de Acesso */}
        <div className="flex items-center gap-3">
          {/* Seletor de Idioma */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border px-3 py-1.5 rounded-lg text-sm transition cursor-pointer bg-neutral-900/80 border-neutral-700 text-white hover:border-purple-500"
            >
              <span>🌐 {lang.toUpperCase()}</span>
            </button>

            {dropdownOpen && (
              <div
                className={`absolute ${
                  isRtl ? 'left-0' : 'right-0'
                } mt-2 w-48 border rounded-lg shadow-xl py-1 z-30 bg-neutral-900 border-neutral-700`}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full ${
                      isRtl ? 'text-right' : 'text-left'
                    } px-4 py-2 text-sm transition cursor-pointer ${
                      lang === l.code
                        ? 'text-purple-400 font-bold bg-purple-600/20'
                        : 'text-gray-300 hover:bg-purple-600/20'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Iniciar Sessão */}
          <Link
            href={`/login?lang=${lang}`}
            className="text-sm font-medium transition px-3 py-2 text-gray-300 hover:text-white"
          >
            {authText.signIn}
          </Link>

          {/* Botão de Registo */}
          <Link
            href={`/get-started?lang=${lang}`}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg shadow-purple-600/30 transition"
          >
            {authText.getStarted}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 -mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium mb-8 backdrop-blur-md bg-purple-950/40 border-purple-500/30 text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          {t('badge', 'AI-Driven Global Talent Ecosystem')}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight mb-4">
          {t('titleLine1', 'Cross-border talent &')} <br />
          <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            {t('titleLine2', 'precision matching')}
          </span>
        </h1>

        <p className="text-base md:text-lg max-w-2xl mb-10 font-normal text-gray-400">
          {t(
            'subtitle',
            'Connecting global talent with the right opportunities through intelligent matching.'
          )}
        </p>

        <div className="flex items-center justify-center w-full">
          <Link
            href={`/get-started?lang=${lang}`}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg shadow-purple-600/40 transition text-center"
          >
            {authText.joinUs}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs border-t z-10 relative text-neutral-500 border-neutral-900">
        {t('footer', '© 2026 SkillGap. All rights reserved. Global AI Recruitment Platform.')}
      </footer>
    </div>
  );
}