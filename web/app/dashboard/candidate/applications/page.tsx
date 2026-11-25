'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface ApplicationRecord {
  id: string;
  job_title: string;
  company_name: string | null;
  status: string;
  applied_date: string | null;
  match_score: number | null;
}

const APPLICATIONS_TEXTS: Record<string, any> = {
  en: {
    title: "My Job Applications",
    subtitle: "Track submitted applications, review stages, and interview updates.",
    exploreBtn: "Find More Jobs",
    totalLabel: "Total Applications",
    totalSub: "Submitted jobs",
    inReviewLabel: "In Review",
    inReviewSub: "Active screening",
    shortlistedLabel: "Shortlisted",
    shortlistedSub: "Advanced stage",
    interviewLabel: "Interviews",
    interviewSub: "Scheduled calls",
    matchSuffix: "Match",
    emptyTitle: "No job applications submitted yet",
    emptyDesc: "Explore open opportunities and apply to positions that match your profile.",
    aiTipTitle: "SkillGap AI Application Tracker",
    aiTipText: "Keep your CV and skills updated so companies have complete context as your applications progress."
  },
  pt: {
    title: "As Minhas Candidaturas",
    subtitle: "Acompanha candidaturas submetidas, fases de análise e convites para entrevista.",
    exploreBtn: "Explorar Mais Vagas",
    totalLabel: "Total de Candidaturas",
    totalSub: "Vagas submetidas",
    inReviewLabel: "Em Análise",
    inReviewSub: "Triagem ativa",
    shortlistedLabel: "Pré-selecionado",
    shortlistedSub: "Fase avançada",
    interviewLabel: "Entrevistas",
    interviewSub: "Convites agendados",
    matchSuffix: "Match",
    emptyTitle: "Ainda não submeteste candidaturas",
    emptyDesc: "Explora as oportunidades abertas e candidata-te às vagas alinhadas com o teu perfil.",
    aiTipTitle: "Acompanhamento de Candidaturas IA SkillGap",
    aiTipText: "Mantém o teu CV e competências atualizados para que as empresas tenham contexto completo em cada etapa."
  },
  es: {
    title: "Mis Postulaciones",
    subtitle: "Sigue tus postulaciones enviadas, etapas de revisión y entrevistas.",
    exploreBtn: "Buscar Más Vacantes",
    totalLabel: "Total de Postulaciones",
    totalSub: "Vacantes enviadas",
    inReviewLabel: "En Revisión",
    inReviewSub: "Evaluación activa",
    shortlistedLabel: "Preseleccionado",
    shortlistedSub: "Etapa avanzada",
    interviewLabel: "Entrevistas",
    interviewSub: "Llamadas programadas",
    matchSuffix: "Match",
    emptyTitle: "Aún no has enviado postulaciones",
    emptyDesc: "Explora las vacantes abiertas y postúlate a puestos alineados con tu perfil.",
    aiTipTitle: "Seguimiento de Postulaciones IA SkillGap",
    aiTipText: "Mantén tu CV y habilidades al día para que las empresas cuenten con información completa en cada fase."
  },
  fr: {
    title: "Mes Candidatures",
    subtitle: "Suivez vos candidatures envoyées, les étapes d'étude et les entretiens.",
    exploreBtn: "Découvrir d'Autres Offres",
    totalLabel: "Total Candidatures",
    totalSub: "Offres soumises",
    inReviewLabel: "En Cours d'Étude",
    inReviewSub: "Présélection active",
    shortlistedLabel: "Retenu",
    shortlistedSub: "Étape avancée",
    interviewLabel: "Entretiens",
    interviewSub: "Entretiens planifiés",
    matchSuffix: "Match",
    emptyTitle: "Aucune candidature envoyée pour l'instant",
    emptyDesc: "Explorez les opportunités ouvertes et postulez aux postes adaptés à votre profil.",
    aiTipTitle: "Suivi des Candidatures IA SkillGap",
    aiTipText: "Gardez votre CV et vos compétences à jour afin que les recruteurs disposent d'un dossier complet."
  },
  de: {
    title: "Meine Bewerbungen",
    subtitle: "Verfolgen Sie eingereichte Bewerbungen, Prüfphasen und Gesprächseinladungen.",
    exploreBtn: "Weitere Stellen finden",
    totalLabel: "Bewerbungen Gesamt",
    totalSub: "Eingereichte Stellen",
    inReviewLabel: "In Prüfung",
    inReviewSub: "Aktive Sichtung",
    shortlistedLabel: "Ausgewählt",
    shortlistedSub: "Fortgeschrittene Phase",
    interviewLabel: "Interviews",
    interviewSub: "Geplante Gespräche",
    matchSuffix: "Match",
    emptyTitle: "Noch keine Bewerbungen eingereicht",
    emptyDesc: "Entdecken Sie offene Stellen und bewerben Sie sich auf passende Positionen.",
    aiTipTitle: "SkillGap KI-Bewerbungs-Tracker",
    aiTipText: "Halten Sie Lebenslauf und Fähigkeiten aktuell, damit Unternehmen vollständige Informationen erhalten."
  },
  ar: {
    title: "طلبات التوظيف الخاصة بي",
    subtitle: "تابع الطلبات المقدمة ومراحل التقييم ومواعيد المقابلات.",
    exploreBtn: "استكشاف المزيد من الوظائف",
    totalLabel: "إجمالي الطلبات",
    totalSub: "الوظائف المقدمة",
    inReviewLabel: "قيد المراجعة",
    inReviewSub: "فرز نشط",
    shortlistedLabel: "القائمة المختصرة",
    shortlistedSub: "مرحلة متقدمة",
    interviewLabel: "المقابلات",
    interviewSub: "مواعيد محددة",
    matchSuffix: "تطابق",
    emptyTitle: "لم يتم تقديم أي طلبات توظيف بعد",
    emptyDesc: "استكشف الفرص المتاحة وتقدم للوظائف المتوافقة مع ملفك الشخصي.",
    aiTipTitle: "متتبع طلبات التوظيف بالذكاء الاصطناعي SkillGap",
    aiTipText: "حافظ على تحديث سيرتك الذاتية ومهاراتك لتكون الصورة واضحة لدى أصحاب العمل."
  }
};

export default function CandidateApplicationsPage() {
  const { lang } = useDashboardLang();
  const appT = APPLICATIONS_TEXTS[lang] || APPLICATIONS_TEXTS['en'];

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId || !active) return;

        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('candidate_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && active) {
          setApplications(
            data.map((row: any) => ({
              id: String(row.id),
              job_title: row.job_title || '',
              company_name: row.company_name || null,
              status: row.status || 'in_review',
              applied_date: row.applied_date || row.created_at?.slice(0, 10) || null,
              match_score: typeof row.match_score === 'number' ? row.match_score : null,
            }))
          );
        }
      } catch {
        setApplications([]);
      }
    }

    loadApplications();
    return () => {
      active = false;
    };
  }, []);

  const totalCount = applications.length;
  const inReviewCount = applications.filter((a) => a.status === 'in_review' || a.status === 'pending').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {appT.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{appT.subtitle}</p>
        </div>
        <div>
          <Link
            href="/dashboard/candidate/opportunities"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{appT.exploreBtn}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {appT.totalLabel}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalCount}</span>
            <span className="text-xs text-purple-400 font-medium">{appT.totalSub}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {appT.inReviewLabel}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{inReviewCount}</span>
            <span className="text-xs text-amber-400 font-medium">{appT.inReviewSub}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {appT.shortlistedLabel}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{shortlistedCount}</span>
            <span className="text-xs text-emerald-400 font-medium">{appT.shortlistedSub}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {appT.interviewLabel}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{interviewCount}</span>
            <span className="text-xs text-blue-400 font-medium">{appT.interviewSub}</span>
          </div>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase">
                    {item.status}
                  </span>
                  {item.applied_date && (
                    <span className="text-xs text-gray-500">{item.applied_date}</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white">{item.job_title}</h2>
                {item.company_name && (
                  <p className="text-xs text-purple-300 font-medium mt-0.5">
                    {item.company_name}
                  </p>
                )}
              </div>

              {typeof item.match_score === 'number' && (
                <div className="self-end md:self-center px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  {item.match_score}% {appT.matchSuffix}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{appT.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{appT.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{appT.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{appT.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}