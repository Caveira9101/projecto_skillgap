'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe } from 'lucide-react';

export type NavLangCode = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ar';

interface NavbarProps {
  lang?: NavLangCode;
  onLangChange?: (newLang: NavLangCode) => void;
}

const SIX_LANGUAGES: { code: NavLangCode; label: string; fullLabel: string }[] = [
  { code: 'en', label: 'EN', fullLabel: 'English (EN)' },
  { code: 'pt', label: 'PT', fullLabel: 'Português (PT)' },
  { code: 'es', label: 'ES', fullLabel: 'Español (ES)' },
  { code: 'fr', label: 'FR', fullLabel: 'Français (FR)' },
  { code: 'de', label: 'DE', fullLabel: 'Deutsch (DE)' },
  { code: 'ar', label: 'AR', fullLabel: 'العربية (AR)' }
];

const NAV_COPY: Record<
  NavLangCode,
  {
    signIn: string;
    getStarted: string;
  }
> = {
  en: { signIn: 'Sign In', getStarted: 'Get Started' },
  pt: { signIn: 'Entrar', getStarted: 'Começar Agora' },
  es: { signIn: 'Iniciar Sesión', getStarted: 'Comenzar' },
  fr: { signIn: 'Connexion', getStarted: 'Commencer' },
  de: { signIn: 'Anmelden', getStarted: 'Loslegen' },
  ar: { signIn: 'تسجيل الدخول', getStarted: 'ابدأ الآن' }
};

export default function Navbar({ lang: externalLang, onLangChange }: NavbarProps) {
  const [internalLang, setInternalLang] = useState<NavLangCode>('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLang = externalLang ?? internalLang;
  const isRtl = activeLang === 'ar';
  const copy = NAV_COPY[activeLang] || NAV_COPY.en;

  const handleSelectLang = (code: NavLangCode) => {
    if (onLangChange) {
      onLangChange(code);
    } else {
      setInternalLang(code);
    }
    setDropdownOpen(false);
  };

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex items-center justify-between px-6 sm:px-8 py-5 z-20 relative"
    >
      <Link href={`/?lang=${activeLang}`} className="flex items-center gap-3">
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

        <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
          SKILLGAP
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer bg-neutral-900/80 border-neutral-700 text-white hover:border-purple-500"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>{activeLang.toUpperCase()}</span>
          </button>

          {dropdownOpen && (
            <div
              className={`absolute ${
                isRtl ? 'left-0' : 'right-0'
              } mt-2 w-48 border rounded-lg shadow-xl py-1 z-30 bg-neutral-900 border-neutral-700`}
            >
              {SIX_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelectLang(l.code)}
                  className={`w-full ${
                    isRtl ? 'text-right' : 'text-left'
                  } px-4 py-2 text-xs sm:text-sm transition cursor-pointer ${
                    activeLang === l.code
                      ? 'text-purple-400 font-bold bg-purple-600/20'
                      : 'text-gray-300 hover:bg-purple-600/20'
                  }`}
                >
                  {l.fullLabel}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/login?lang=${activeLang}`}
          className="text-xs sm:text-sm font-medium transition px-3 py-2 text-gray-300 hover:text-white"
        >
          {copy.signIn}
        </Link>

        <Link
          href={`/get-started?lang=${activeLang}`}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-purple-600/30 transition"
        >
          {copy.getStarted}
        </Link>
      </div>
    </header>
  );
}