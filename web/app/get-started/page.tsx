'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  User,
  Mail,
  Lock,
  Briefcase,
  MapPin,
  Globe,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';

const SIX_LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'ar', label: 'AR' }
];

type AccountRole = 'business' | 'candidate';

const SIGNUP_COPY: Record<
  LangCode,
  {
    signInNav: string;
    getStartedNav: string;
    badge: string;
    title: string;
    subtitle: string;
    businessTab: string;
    candidateTab: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyNameLabel: string;
    companyNamePlaceholder: string;
    industryLabel: string;
    industryPlaceholder: string;
    targetRoleLabel: string;
    targetRolePlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    haveAccount: string;
    signInLink: string;
    verifyTitle: string;
    verifyBodyPrefix: string;
    verifyBodySuffix: string;
    goToLoginBtn: string;
  }
> = {
  en: {
    signInNav: 'Sign In',
    getStartedNav: 'Get Started',
    badge: 'CREATE YOUR ACCOUNT',
    title: 'Join the SkillGap Ecosystem',
    subtitle: 'Create a verified account to hire top talent with AI or unlock global career opportunities.',
    businessTab: 'I am a Company',
    candidateTab: 'I am a Candidate',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Sarah Jenkins',
    emailLabel: 'Email Address (Verification Required)',
    emailPlaceholder: 'you@company.com',
    companyNameLabel: 'Company Name',
    companyNamePlaceholder: 'e.g. Acme Global Tech',
    industryLabel: 'Industry / Sector',
    industryPlaceholder: 'e.g. Fintech, Software, Healthcare',
    targetRoleLabel: 'Primary Role / Title',
    targetRolePlaceholder: 'e.g. Senior Data Analyst',
    locationLabel: 'Country / City',
    locationPlaceholder: 'e.g. Lisbon, London, Remote',
    passwordLabel: 'Create Password (min. 8 characters)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Create Account & Send Verification',
    submittingBtn: 'Creating account...',
    haveAccount: 'Already have a verified account?',
    signInLink: 'Sign In',
    verifyTitle: 'Verify your email address',
    verifyBodyPrefix: 'We sent a confirmation link to',
    verifyBodySuffix: 'Please open your inbox and click the link to activate your account before signing in.',
    goToLoginBtn: 'Go to Sign In'
  },
  pt: {
    signInNav: 'Entrar',
    getStartedNav: 'Começar Agora',
    badge: 'CRIA A TUA CONTA',
    title: 'Junta-te ao Ecossistema SkillGap',
    subtitle: 'Cria uma conta verificada para contratar talentos com IA ou aceder a oportunidades globais.',
    businessTab: 'Sou Empresa',
    candidateTab: 'Sou Candidato',
    fullNameLabel: 'Nome Completo',
    fullNamePlaceholder: 'ex: Ana Silva',
    emailLabel: 'Endereço de E-mail (Verificação Obrigatória)',
    emailPlaceholder: 'nome@empresa.com',
    companyNameLabel: 'Nome da Empresa',
    companyNamePlaceholder: 'ex: TechGlobal Lda',
    industryLabel: 'Setor de Atividade',
    industryPlaceholder: 'ex: Tecnologia, Banca, Saúde',
    targetRoleLabel: 'Cargo / Área Principal',
    targetRolePlaceholder: 'ex: Analista de Dados Sénior',
    locationLabel: 'País / Cidade',
    locationPlaceholder: 'ex: Maputo, Lisboa, Remoto',
    passwordLabel: 'Criar Palavra-passe (mín. 8 caracteres)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Criar Conta e Enviar Verificação',
    submittingBtn: 'A criar conta...',
    haveAccount: 'Já tens uma conta verificada?',
    signInLink: 'Entrar',
    verifyTitle: 'Verifica o teu endereço de e-mail',
    verifyBodyPrefix: 'Enviámos um link de confirmação para',
    verifyBodySuffix: 'Abre a tua caixa de entrada e clica no link para ativar a conta antes de entrar.',
    goToLoginBtn: 'Ir para Entrar'
  },
  es: {
    signInNav: 'Iniciar Sesión',
    getStartedNav: 'Comenzar',
    badge: 'CREA TU CUENTA',
    title: 'Únete al Ecosistema SkillGap',
    subtitle: 'Crea una cuenta verificada para contratar talento con IA o acceder a oportunidades globales.',
    businessTab: 'Soy Empresa',
    candidateTab: 'Soy Candidato',
    fullNameLabel: 'Nombre Completo',
    fullNamePlaceholder: 'ej. Carlos Mendoza',
    emailLabel: 'Correo Electrónico (Verificación Obligatoria)',
    emailPlaceholder: 'tu@empresa.com',
    companyNameLabel: 'Nombre de la Empresa',
    companyNamePlaceholder: 'ej. Innovación Global S.A.',
    industryLabel: 'Sector / Industria',
    industryPlaceholder: 'ej. Software, Finanzas, Salud',
    targetRoleLabel: 'Puesto / Área Principal',
    targetRolePlaceholder: 'ej. Ingeniero Full-Stack',
    locationLabel: 'País / Ciudad',
    locationPlaceholder: 'ej. Madrid, Bogotá, Remoto',
    passwordLabel: 'Crear Contraseña (mín. 8 caracteres)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Crear Cuenta y Enviar Verificación',
    submittingBtn: 'Creando cuenta...',
    haveAccount: '¿Ya tienes una cuenta verificada?',
    signInLink: 'Iniciar Sesión',
    verifyTitle: 'Verifica tu correo electrónico',
    verifyBodyPrefix: 'Enviamos un enlace de confirmación a',
    verifyBodySuffix: 'Abre tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
    goToLoginBtn: 'Ir a Iniciar Sesión'
  },
  fr: {
    signInNav: 'Connexion',
    getStartedNav: 'Commencer',
    badge: 'CRÉEZ VOTRE COMPTE',
    title: 'Rejoignez l’Écosystème SkillGap',
    subtitle: 'Créez un compte vérifié pour recruter avec l’IA ou accéder à des opportunités mondiales.',
    businessTab: 'Je suis une Entreprise',
    candidateTab: 'Je suis un Candidat',
    fullNameLabel: 'Nom Complet',
    fullNamePlaceholder: 'ex. Claire Dupont',
    emailLabel: 'Adresse E-mail (Vérification Requise)',
    emailPlaceholder: 'vous@entreprise.com',
    companyNameLabel: 'Nom de l’Entreprise',
    companyNamePlaceholder: 'ex. Horizon Tech SAS',
    industryLabel: 'Secteur d’Activité',
    industryPlaceholder: 'ex. Logiciel, Finance, Santé',
    targetRoleLabel: 'Poste / Domaine Principal',
    targetRolePlaceholder: 'ex. Data Scientist Senior',
    locationLabel: 'Pays / Ville',
    locationPlaceholder: 'ex. Paris, Montréal, Télétravail',
    passwordLabel: 'Créer un Mot de passe (min. 8 caractères)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Créer le Compte et Vérifier',
    submittingBtn: 'Création en cours...',
    haveAccount: 'Vous avez déjà un compte vérifié ?',
    signInLink: 'Connexion',
    verifyTitle: 'Vérifiez votre adresse e-mail',
    verifyBodyPrefix: 'Nous avons envoyé un lien de confirmation à',
    verifyBodySuffix: 'Ouvrez votre boîte mail et cliquez sur le lien pour activer votre compte.',
    goToLoginBtn: 'Aller à la Connexion'
  },
  de: {
    signInNav: 'Anmelden',
    getStartedNav: 'Loslegen',
    badge: 'KONTO ERSTELLEN',
    title: 'Werden Sie Teil von SkillGap',
    subtitle: 'Erstellen Sie ein verifiziertes Konto für KI-Recruiting oder globale Karrierechancen.',
    businessTab: 'Ich bin ein Unternehmen',
    candidateTab: 'Ich bin ein Kandidat',
    fullNameLabel: 'Vollständiger Name',
    fullNamePlaceholder: 'z.B. Lukas Weber',
    emailLabel: 'E-Mail-Adresse (Bestätigung Erforderlich)',
    emailPlaceholder: 'sie@unternehmen.de',
    companyNameLabel: 'Unternehmensname',
    companyNamePlaceholder: 'z.B. NordTech GmbH',
    industryLabel: 'Branche',
    industryPlaceholder: 'z.B. Software, Finanzen, Gesundheit',
    targetRoleLabel: 'Hauptposition / Fachbereich',
    targetRolePlaceholder: 'z.B. Senior Software Engineer',
    locationLabel: 'Land / Stadt',
    locationPlaceholder: 'z.B. Berlin, München, Remote',
    passwordLabel: 'Passwort erstellen (mind. 8 Zeichen)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'Konto Erstellen & Bestätigung Senden',
    submittingBtn: 'Konto wird erstellt...',
    haveAccount: 'Haben Sie bereits ein bestätigtes Konto?',
    signInLink: 'Anmelden',
    verifyTitle: 'Bestätigen Sie Ihre E-Mail-Adresse',
    verifyBodyPrefix: 'Wir haben einen Bestätigungslink gesendet an',
    verifyBodySuffix: 'Bitte öffnen Sie Ihr Postfach und klicken Sie auf den Link, um Ihr Konto zu aktivieren.',
    goToLoginBtn: 'Zur Anmeldung'
  },
  ar: {
    signInNav: 'تسجيل الدخول',
    getStartedNav: 'ابدأ الآن',
    badge: 'أنشئ حسابك',
    title: 'انضم إلى منظومة SkillGap',
    subtitle: 'أنشئ حساباً موثقاً للتوظيف بالذكاء الاصطناعي أو الوصول إلى فرص عالمية.',
    businessTab: 'أنا شركة',
    candidateTab: 'أنا مرشح',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'مثال: أحمد المنصور',
    emailLabel: 'البريد الإلكتروني (التحقق مطلوب)',
    emailPlaceholder: 'name@company.com',
    companyNameLabel: 'اسم الشركة',
    companyNamePlaceholder: 'مثال: شركة التقنية العالمية',
    industryLabel: 'القطاع / المجال',
    industryPlaceholder: 'مثال: البرمجيات، المالية، الرعاية الصحية',
    targetRoleLabel: 'المسمى الوظيفي الرئيسي',
    targetRolePlaceholder: 'مثال: محلل بيانات أول',
    locationLabel: 'الدولة / المدينة',
    locationPlaceholder: 'مثال: دبي، الرياض، عن بُعد',
    passwordLabel: 'إنشاء كلمة مرور (8 أحرف على الأقل)',
    passwordPlaceholder: '••••••••',
    submitBtn: 'إنشاء الحساب وإرسال رابط التحقق',
    submittingBtn: 'جارٍ إنشاء الحساب...',
    haveAccount: 'لديك حساب موثق بالفعل؟',
    signInLink: 'تسجيل الدخول',
    verifyTitle: 'تحقق من بريدك الإلكتروني',
    verifyBodyPrefix: 'لقد أرسلنا رابط تأكيد إلى',
    verifyBodySuffix: 'يرجى فتح بريدك الإلكتروني والنقر على الرابط لتفعيل حسابك قبل تسجيل الدخول.',
    goToLoginBtn: 'الانتقال إلى تسجيل الدخول'
  }
};

function GetStartedContent() {
  const searchParams = useSearchParams();
  const initialLang = (searchParams.get('lang') as LangCode) || 'en';
  const initialRole = searchParams.get('role') === 'candidate' ? 'candidate' : 'business';

  const [lang, setLang] = useState<LangCode>(
    SIX_LANGUAGES.some((l) => l.code === initialLang) ? initialLang : 'en'
  );
  const [role, setRole] = useState<AccountRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const copy = SIGNUP_COPY[lang] || SIGNUP_COPY.en;
  const isRtl = lang === 'ar';

  useEffect(() => {
    const qLang = searchParams.get('lang') as LangCode;
    if (qLang && SIX_LANGUAGES.some((l) => l.code === qLang)) {
      setLang(qLang);
    }
    const qRole = searchParams.get('role');
    if (qRole === 'candidate' || qRole === 'business') {
      setRole(qRole);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!supabase) {
        setErrorMsg('Supabase is not configured. Check .env.local.');
        return;
      }

      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }

      const metadata =
        role === 'business'
          ? {
              role: 'business',
              full_name: fullName.trim(),
              company_name: companyName.trim(),
              industry: industry.trim(),
              preferred_lang: lang
            }
          : {
              role: 'candidate',
              full_name: fullName.trim(),
              target_role: targetRole.trim(),
              location: location.trim(),
              preferred_lang: lang
            };

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setVerificationSent(true);
    } finally {
      setLoading(false);
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
            className="text-xs font-semibold text-gray-300 hover:text-white px-2.5 py-1.5"
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

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-2xl bg-[#0b0614] border border-purple-500/30 shadow-[0_0_50px_-15px_rgba(124,58,237,0.45)] p-7 space-y-6">
          {verificationSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">{copy.verifyTitle}</h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {copy.verifyBodyPrefix} <strong className="text-purple-300">{email}</strong>.{' '}
                {copy.verifyBodySuffix}
              </p>
              <div className="pt-2">
                <Link
                  href={`/login?lang=${lang}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-bold text-white transition"
                >
                  <span>{copy.goToLoginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-bold tracking-widest text-purple-300 uppercase">
                  {copy.badge}
                </span>
                <h1 className="text-2xl font-extrabold text-white">{copy.title}</h1>
                <p className="text-xs text-gray-400">{copy.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-1 rounded-xl bg-[#080410] border border-white/[0.08] text-xs">
                <button
                  type="button"
                  onClick={() => setRole('business')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition cursor-pointer ${
                    role === 'business'
                      ? 'bg-[#6d28d9] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{copy.businessTab}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition cursor-pointer ${
                    role === 'candidate'
                      ? 'bg-[#6d28d9] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{copy.candidateTab}</span>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold">{copy.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={copy.fullNamePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

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

                {role === 'business' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-semibold">
                        {copy.companyNameLabel}
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder={copy.companyNamePlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-semibold">
                        {copy.industryLabel}
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                        <input
                          type="text"
                          required
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          placeholder={copy.industryPlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-semibold">
                        {copy.targetRoleLabel}
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                        <input
                          type="text"
                          required
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder={copy.targetRolePlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-semibold">
                        {copy.locationLabel}
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={copy.locationPlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold">{copy.passwordLabel}</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
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
                  <p className="rounded-xl bg-red-950/40 border border-red-500/35 p-3 text-red-300">
                    {errorMsg}
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
                {copy.haveAccount}{' '}
                <Link
                  href={`/login?lang=${lang}`}
                  className="text-purple-300 hover:text-white font-semibold underline"
                >
                  {copy.signInLink}
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05020a]" />}>
      <GetStartedContent />
    </Suspense>
  );
}