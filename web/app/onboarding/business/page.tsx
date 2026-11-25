'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

const businessTranslations: Record<string, any> = {
  en: {
    portalBadge: "Business Portal",
    stepOf: (curr: number) => `Step ${curr} of 3`,
    corpTitle: "Corporate Profile",
    corpDesc: "Tell us about your organization to calibrate our AI matching engine and dynamic pricing.",
    nameLabel: "Company Name *",
    namePlaceholder: "e.g., Horizon Tech Solutions",
    indLabel: "Industry / Sector *",
    indPlaceholder: "e.g., FinTech, EdTech, Energy",
    sizeLabel: "Team & Recruiter Size *",
    sizes: [
      '1–10 employees',
      '11–50 employees',
      '51–200 employees',
      '201–500 employees',
      '501–1,000 employees',
      '1,001–5,000 employees',
      '5,001+ employees'
    ],
    hiringTitle: "Hiring Parameters",
    hiringDesc: "Define your talent reach and preferred experience level.",
    reachLabel: "Talent Geographic Reach",
    reaches: ['Cross-border / Global', 'Local / Regional Only', 'Hybrid (Local + Remote)'],
    seniorityLabel: "Target Seniority Level",
    seniorities: ['Junior / Entry-Level', 'Mid-Level & Senior', 'Lead / Principal / Executive', 'All Levels'],
    aiTitle: "AI Matching Criteria",
    aiDesc: "Specify your immediate hiring needs for instant talent discovery.",
    roleLabel: "Priority Role Title *",
    rolePlaceholder: "e.g., Senior Full-Stack Developer, Data Analyst",
    skillsLabel: "Must-Have Skills / Stack (Comma separated) *",
    skillsPlaceholder: "e.g., Next.js, TypeScript, Python, SQL",
    aiNotice: "Our AI engine has analyzed your team tier. Subscription pricing and tailored recruiter licenses will be dynamically billed based on your selection.",
    back: "Back",
    continue: "Continue",
    complete: "Generate AI Dashboard & Pricing",
    errorMsg: "Please fill in all required fields (*) before continuing."
  },
  pt: {
    portalBadge: "Portal Empresarial",
    stepOf: (curr: number) => `Passo ${curr} de 3`,
    corpTitle: "Perfil Corporativo",
    corpDesc: "Conta-nos sobre a tua organização para calibrar o motor de IA e o preçário dinâmico.",
    nameLabel: "Nome da Empresa *",
    namePlaceholder: "ex: Horizon Tech Solutions",
    indLabel: "Setor de Atividade *",
    indPlaceholder: "ex: FinTech, EdTech, Energia",
    sizeLabel: "Dimensão da Equipa & Recrutadores *",
    sizes: [
      '1–10 colaboradores',
      '11–50 colaboradores',
      '51–200 colaboradores',
      '201–500 colaboradores',
      '501–1.000 colaboradores',
      '1.001–5.000 colaboradores',
      '5.001+ colaboradores'
    ],
    hiringTitle: "Parâmetros de Contratação",
    hiringDesc: "Define o alcance dos talentos e o nível de experiência preferido.",
    reachLabel: "Alcance Geográfico de Talentos",
    reaches: ['Transfronteiriço / Global', 'Apenas Local / Regional', 'Híbrido (Local + Remoto)'],
    seniorityLabel: "Nível de Senioridade Alvo",
    seniorities: ['Júnior / Nível Inicial', 'Pleno & Sênior', 'Líder / Principal / Executivo', 'Todos os Níveis'],
    aiTitle: "Critérios de Correspondência por IA",
    aiDesc: "Especifica as tuas necessidades imediatas de contratação para descoberta instantânea de talentos.",
    roleLabel: "Título da Vaga Prioritária *",
    rolePlaceholder: "ex: Desenvolvedor Full-Stack Sênior, Analista de Dados",
    skillsLabel: "Competências / Stack Obrigatórias (Separadas por vírgula) *",
    skillsPlaceholder: "ex: Next.js, TypeScript, Python, SQL",
    aiNotice: "O nosso motor de IA registou o teu escalão de equipa. O preçário de subscrição e as licenças de recrutadores serão faturados dinamicamente com base nesta seleção.",
    back: "Voltar",
    continue: "Continuar",
    complete: "Gerir Painel de IA & Preçário",
    errorMsg: "Por favor, preenche todos os campos obrigatórios (*) antes de continuar."
  },
  es: {
    portalBadge: "Portal de Empresas",
    stepOf: (curr: number) => `Paso ${curr} de 3`,
    corpTitle: "Perfil Corporativo",
    corpDesc: "Cuéntanos sobre tu organización y tamaño de equipo.",
    nameLabel: "Nombre de la Empresa *",
    namePlaceholder: "ej., Horizon Tech",
    indLabel: "Industria / Sector *",
    indPlaceholder: "ej., FinTech, EdTech",
    sizeLabel: "Tamaño del Equipo y Reclutadores *",
    sizes: [
      '1–10 empleados',
      '11–50 empleados',
      '51–200 empleados',
      '201–500 empleados',
      '501–1,000 empleados',
      '1,001–5,000 empleados',
      '5,001+ empleados'
    ],
    hiringTitle: "Parámetros de Contratación",
    hiringDesc: "Define el alcance del talento.",
    reachLabel: "Alcance Geográfico",
    reaches: ['Transfronterizo / Global', 'Solo Local / Regional', 'Híbrido'],
    seniorityLabel: "Nivel de Senioridad",
    seniorities: ['Junior', 'Mid & Senior', 'Lead / Exec', 'Todos los niveles'],
    aiTitle: "Criterios de IA",
    aiDesc: "Especifica tus necesidades.",
    roleLabel: "Título del Puesto *",
    rolePlaceholder: "ej., Desarrollador Full-Stack",
    skillsLabel: "Habilidades Imprescindibles *",
    skillsPlaceholder: "ej., React, Python",
    aiNotice: "El sistema calculará el precio de suscripción según el tamaño del equipo.",
    back: "Atrás",
    continue: "Continuar",
    complete: "Generar Panel y Precios",
    errorMsg: "Por favor, completa todos los campos obligatorios (*)."
  },
  fr: {
    portalBadge: "Portail Entreprise",
    stepOf: (curr: number) => `Étape ${curr} sur 3`,
    corpTitle: "Profil de l'Entreprise",
    corpDesc: "Parlez-nous de votre organisation.",
    nameLabel: "Nom de l'Entreprise *",
    namePlaceholder: "ex., Horizon Tech",
    indLabel: "Secteur d'Activité *",
    indPlaceholder: "ex., FinTech, EdTech",
    sizeLabel: "Taille de l'Équipe & Recruteurs *",
    sizes: [
      '1–10 employés',
      '11–50 employés',
      '51–200 employés',
      '201–500 employés',
      '501–1,000 employés',
      '1,001–5,000 employés',
      '5,001+ employés'
    ],
    hiringTitle: "Paramètres de Recrutement",
    hiringDesc: "Définissez votre portée de talents.",
    reachLabel: "Portée Géographique",
    reaches: ['Transfrontalier / Global', 'Local uniquement', 'Hybride'],
    seniorityLabel: "Niveau d'Expérience",
    seniorities: ['Junior', 'Intermédiaire & Senior', 'Lead / Exécutif', 'Tous niveaux'],
    aiTitle: "Critères de Correspondance IA",
    aiDesc: "Spécifiez vos besoins de recrutement.",
    roleLabel: "Intitulé du Poste *",
    rolePlaceholder: "ex., Développeur Full-Stack",
    skillsLabel: "Compétences Requises *",
    skillsPlaceholder: "ex., React, Python",
    aiNotice: "Notre IA calculera la tarification en fonction de la taille de votre équipe.",
    back: "Retour",
    continue: "Continuer",
    complete: "Générer le Tableau de Bord",
    errorMsg: "Veuillez remplir tous les champs obligatoires (*)."
  },
  de: {
    portalBadge: "Unternehmensportal",
    stepOf: (curr: number) => `Schritt ${curr} von 3`,
    corpTitle: "Unternehmensprofil",
    corpDesc: "Erzählen Sie uns von Ihrer Organisation.",
    nameLabel: "Unternehmensname *",
    namePlaceholder: "z.B. Horizon Tech",
    indLabel: "Branche / Sektor *",
    indPlaceholder: "z.B. FinTech, EdTech",
    sizeLabel: "Team- & Recruitergröße *",
    sizes: [
      '1–10 Mitarbeiter',
      '11–50 Mitarbeiter',
      '51–200 Mitarbeiter',
      '201–500 Mitarbeiter',
      '501–1.000 Mitarbeiter',
      '1.001–5.000 Mitarbeiter',
      '5.001+ Mitarbeiter'
    ],
    hiringTitle: "Einstellungsparameter",
    hiringDesc: "Definieren Sie Ihre Talentreichweite.",
    reachLabel: "Geografische Reichweite",
    reaches: ['Grenzüberschreitend / Global', 'Nur Lokal', 'Hybrid'],
    seniorityLabel: "Ziel-Seniorität",
    seniorities: ['Junior', 'Mid & Senior', 'Lead / Executive', 'Alle Stufen'],
    aiTitle: "KI-Matching-Kriterien",
    aiDesc: "Geben Sie Ihren Bedarf an.",
    roleLabel: "Rollenbezeichnung *",
    rolePlaceholder: "z.B. Full-Stack Developer",
    skillsLabel: "Erforderliche Fähigkeiten *",
    skillsPlaceholder: "z.B. React, Python",
    aiNotice: "Die Abonnementpreise werden basierend auf Ihrer Teamgröße berechnet.",
    back: "Zurück",
    continue: "Weiter",
    complete: "Dashboard generieren",
    errorMsg: "Bitte füllen Sie alle Pflichtfelder (*) aus."
  }
};

function BusinessOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang') || 'en';
  const t = businessTranslations[langParam] || businessTranslations['en'];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: t.sizes[0],
    hiringScope: t.reaches[0],
    seniorityLevel: t.seniorities[1],
    coreSkills: '',
    roleTitle: '',
  });

  const handleNext = () => {
    if (step === 1 && (!formData.companyName.trim() || !formData.industry.trim())) {
      alert(t.errorMsg);
      return;
    }
    if (step === 3 && (!formData.roleTitle.trim() || !formData.coreSkills.trim())) {
      alert(t.errorMsg);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (!formData.roleTitle.trim() || !formData.coreSkills.trim()) {
      alert(t.errorMsg);
      return;
    }
    router.push(`/dashboard/business?lang=${langParam}`);
  };

  return (
    <main className="relative min-h-screen bg-[#07030e] text-white flex flex-col justify-between overflow-hidden px-6 py-10 font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <Link href={`/?lang=${langParam}`} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1">
            <Image
              src="/images/logo-icon.png"
              alt="Logotipo SkillGap"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            SKILLGAP
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold uppercase tracking-wider">
            {t.portalBadge}
          </span>
          <span className="text-xs text-purple-300/70 font-medium">
            {t.stepOf(step)}
          </span>
        </div>
      </header>

      <section className="max-w-lg mx-auto w-full my-auto z-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#110722]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-950/90"
        >
          <div className="w-full bg-purple-950/80 h-1.5 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t.corpTitle}</h2>
                  <p className="text-xs text-purple-300/80">{t.corpDesc}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.nameLabel}</label>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.indLabel}</label>
                  <input
                    type="text"
                    placeholder={t.indPlaceholder}
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.sizeLabel}</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#180a30] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition cursor-pointer"
                  >
                    {t.sizes.map((sz: string) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t.hiringTitle}</h2>
                  <p className="text-xs text-purple-300/80">{t.hiringDesc}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-2">{t.reachLabel}</label>
                  <div className="space-y-2.5">
                    {t.reaches.map((scope: string) => (
                      <label
                        key={scope}
                        onClick={() => setFormData({ ...formData, hiringScope: scope })}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                          formData.hiringScope === scope
                            ? 'border-indigo-500 bg-indigo-900/30 text-white'
                            : 'border-purple-500/20 bg-purple-950/20 text-purple-300 hover:border-purple-500/50'
                        }`}
                      >
                        <span className="text-sm font-medium">{scope}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.hiringScope === scope ? 'border-indigo-400 bg-indigo-600' : 'border-purple-500/40'}`}>
                          {formData.hiringScope === scope && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.seniorityLabel}</label>
                  <select
                    value={formData.seniorityLevel}
                    onChange={(e) => setFormData({ ...formData, seniorityLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#180a30] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition cursor-pointer"
                  >
                    {t.seniorities.map((sen: string) => (
                      <option key={sen} value={sen}>{sen}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{t.aiTitle}</h2>
                  <p className="text-xs text-purple-300/80">{t.aiDesc}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.roleLabel}</label>
                  <input
                    type="text"
                    placeholder={t.rolePlaceholder}
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1.5">{t.skillsLabel}</label>
                  <input
                    type="text"
                    placeholder={t.skillsPlaceholder}
                    value={formData.coreSkills}
                    onChange={(e) => setFormData({ ...formData, coreSkills: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200 leading-relaxed">
                  {t.aiNotice}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-purple-900/40">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
              >
                {t.back}
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition cursor-pointer"
              >
                {t.continue}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition cursor-pointer"
              >
                {t.complete}
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-purple-400/60 z-10">
        © 2026 SkillGap. All rights reserved.
      </footer>
    </main>
  );
}

export default function BusinessOnboarding() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07030e] text-white flex items-center justify-center">Loading...</div>}>
      <BusinessOnboardingContent />
    </Suspense>
  );
}