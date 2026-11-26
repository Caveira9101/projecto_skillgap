'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Globe, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { resolvePostAuthRoute } from '@/lib/onboarding-flow';

const SIX_LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'ar', label: 'AR' }
];

const LOGIN_COPY: Record<
  LangCode,
  {
    signInNav: string;
    getStartedNav: string;
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    noAccount: string;
    createAccountLink: string;
    resendVerification: string;
    resentSuccess: string;
    unconfirmedHint: string;
  }
> = {
  en: {
    signInNav: 'Sign In',
    getStartedNav: 'Get Started',
    badge: 'WELCOME BACK',
    title: 'Sign in to SkillGap',
    subtitle: 'Access your AI recruitment workspace or career dashboard.',
    emailLabel: 'Work or Personal Email',
    emailPlaceholder: 'you@company.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    submitBtn: 'Sign In',
    submittingBtn: 'Signing in...',
    noAccount: "Don't have an account yet?",
    createAccountLink: 'Get Started',
    resendVerification: 'Resend verification email',
    resentSuccess: 'Verification link resent! Please check your inbox.',
    unconfirmedHint: 'Your email is not verified yet. Check your inbox or resend the link below.'
  },
  pt: {
    signInNav: 'Entrar',
    getStartedNav: 'Começar Agora',
    badge: 'BEM-VINDO DE VOLTA',
    title: 'Entrar na SkillGap',
    subtitle: 'Acede ao teu painel empresarial de recrutamento com IA ou perfil de candidato.',
    emailLabel: 'E-mail Profissional ou Pessoal',
    emailPlaceholder: 'nome@empresa.com',
    passwordLabel: 'Palavra-passe',
    passwordPlaceholder: 'Introduz a tua palavra-passe',
    submitBtn: 'Entrar',
    submittingBtn: 'A entrar...',
    noAccount: 'Ainda não tens uma conta?',
    createAccountLink: 'Começar Agora',
    resendVerification: 'Reenviar e-mail de verificação',
    resentSuccess: 'Link de verificação reenviado! Verifica a tua caixa de entrada.',
    unconfirmedHint: 'O teu e-mail ainda não foi verificado. Confirma na caixa de entrada ou reenvia abaixo.'
  },
  es: {
    signInNav: 'Iniciar Sesión',
    getStartedNav: 'Comenzar',
    badge: 'BIENVENIDO DE NUEVO',
    title: 'Inicia sesión en SkillGap',
    subtitle: 'Accede a tu panel de reclutamiento con IA o perfil profesional.',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@empresa.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Introduce tu contraseña',
    submitBtn: 'Iniciar Sesión',
    submittingBtn: 'Iniciando...',
    noAccount: '¿Aún no tienes una cuenta?',
    createAccountLink: 'Comenzar',
    resendVerification: 'Reenviar correo de verificación',
    resentSuccess: '¡Enlace reenviado! Revisa tu bandeja de entrada.',
    unconfirmedHint: 'Tu correo aún no está verificado. Revisa tu bandeja de entrada o reenvíalo.'
  },
  fr: {
    signInNav: 'Connexion',
    getStartedNav: 'Commencer',
    badge: 'BON RETOUR',
    title: 'Connectez-vous à SkillGap',
    subtitle: 'Accédez à votre espace de recrutement IA ou votre profil candidat.',
    emailLabel: 'Adresse E-mail',
    emailPlaceholder: 'vous@entreprise.com',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    submitBtn: 'Connexion',
    submittingBtn: 'Connexion...',
    noAccount: 'Vous n’avez pas encore de compte ?',
    createAccountLink: 'Commencer',
    resendVerification: 'Renvoyer l’e-mail de vérification',
    resentSuccess: 'Lien de vérification renvoyé ! Vérifiez votre boîte mail.',
    unconfirmedHint: 'Votre e-mail n’est pas encore vérifié. Vérifiez votre boîte mail ou renvoyez le lien.'
  },
  de: {
    signInNav: 'Anmelden',
    getStartedNav: 'Loslegen',
    badge: 'WILLKOMMEN ZURÜCK',
    title: 'Bei SkillGap anmelden',
    subtitle: 'Greifen Sie auf Ihren KI-Recruiting-Bereich oder Ihr Kandidatenprofil zu.',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'sie@unternehmen.de',
    passwordLabel: 'Passwort',
    passwordPlaceholder: 'Passwort eingeben',
    submitBtn: 'Anmelden',
    submittingBtn: 'Anmeldung...',
    noAccount: 'Noch kein Konto vorhanden?',
    createAccountLink: 'Loslegen',
    resendVerification: 'Bestätigungs-E-Mail erneut senden',
    resentSuccess: 'Bestätigungslink erneut gesendet! Bitte Posteingang prüfen.',
    unconfirmedHint: 'Ihre E-Mail wurde noch nicht bestätigt. Bitte prüfen Sie Ihr Postfach.'
  },
  ar: {
    signInNav: 'تسجيل الدخول',
    getStartedNav: 'ابدأ الآن',
    badge: 'مرحباً بعودتك',
    title: 'تسجيل الدخول إلى SkillGap',
    subtitle: 'ادخل إلى مساحة التوظيف بالذكاء الاصطناعي أو لوحة المرشحين.',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@company.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    submitBtn: 'تسجيل الدخول',
    submittingBtn: 'جارٍ الدخول...',
    noAccount: 'ليس لديك حساب بعد؟',
    createAccountLink: 'ابدأ الآن',
    resendVerification: 'إعادة إرسال بريد التحقق',
    resentSuccess: 'تمت إعادة إرسال رابط التحقق! يرجى فحص بريدك الإلكتروني.',
    unconfirmedHint: 'لم يتم تأكيد بريدك الإلكتروني بعد. يرجى التحقق من بريدك أو إعادة الإرسال.'
  }
};

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLang = (searchParams.get('lang') as LangCode) || 'en';
  const [lang, setLang] = useState<LangCode>(
    SIX_LANGUAGES.some((l) => l.code === initialLang) ? initialLang : 'en'
  );

  const copy = LOGIN_COPY[lang] || LOGIN_COPY.en;
  const isRtl = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resentNotice, setResentNotice] = useState(false);

  useEffect(() => {
    const qLang = searchParams.get('lang') as LangCode;
    if (qLang && SIX_LANGUAGES.some((l) => l.code === qLang)) {
      setLang(qLang);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setNeedsVerification(false);
    setResentNotice(false);

    try {
      if (!supabase) {
        setErrorMsg('Supabase is not configured. Check .env.local.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setNeedsVerification(true);
          setErrorMsg(copy.unconfirmedHint);
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (!data.user) {
        setErrorMsg('Unable to load user session.');
        return;
      }

      const destination = await resolvePostAuthRoute(data.user, lang);
      router.push(destination);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!supabase || !email.trim()) return;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (!error) {
      setResentNotice(true);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#05020a] text-white flex flex-col font-sans"
    >
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-center p-1">
            <Image
              src="/images/logo-icon.png"
              alt="SkillGap Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            SKILLGAP
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e081a] border border-purple-500/25">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {SIX_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0e081a] text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/login?lang=${lang}`}
            className="text-xs font-semibold text-purple-300 hover:text-white px-2.5 py-1.5"
          >
            {copy.signInNav}
          </Link>

          <Link
            href={`/get-started?lang=${lang}`}
            className="px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-bold text-white transition"
          >
            {copy.getStartedNav}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-[#0b0614] border border-purple-500/30 shadow-[0_0_50px_-15px_rgba(124,58,237,0.45)] p-7 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-bold tracking-widest text-purple-300 uppercase">
              {copy.badge}
            </span>
            <h1 className="text-2xl font-extrabold text-white">{copy.title}</h1>
            <p className="text-xs text-gray-400">{copy.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-gray-300 font-semibold">{copy.emailLabel}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-300 font-semibold">{copy.passwordLabel}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={copy.passwordPlaceholder}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-950/40 border border-red-500/35 p-3 text-red-300 space-y-2">
                <p>{errorMsg}</p>
                {needsVerification && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="underline font-bold text-purple-300 hover:text-white cursor-pointer"
                  >
                    {copy.resendVerification}
                  </button>
                )}
              </div>
            )}

            {resentNotice && (
              <p className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{copy.resentSuccess}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{loading ? copy.submittingBtn : copy.submitBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            {copy.noAccount}{' '}
            <Link
              href={`/get-started?lang=${lang}`}
              className="text-purple-300 hover:text-white font-semibold underline"
            >
              {copy.createAccountLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05020a]" />}>
      <LoginFormContent />
    </Suspense>
  );
}