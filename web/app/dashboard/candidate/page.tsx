'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Eye,
  Bookmark,
  Target,
  Sparkles,
  ArrowRight,
  Video,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useDashboardLang } from './layout';
import { supabase } from '@/lib/supabase/client';

const OVERVIEW_TEXTS: Record<string, any> = {
  en: {
    title: "Candidate Overview",
    subtitle: "Live snapshot of your profile, matches, applications, and interview allowance.",
    planBadge: "Active Plan",
    manageSubBtn: "Subscriptions",
    interviewsCardTitle: "Interviews",
    unlimitedLabel: "Unlimited",
    unlimitedDesc: "Unlimited interviews included in your active plan",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} left`,
    freeQuotaDesc: (used: number, total: number) => `${used} of ${total} interviews used on Free plan`,
    applicationsTitle: "Applications",
    applicationsSub: "Submitted applications",
    viewsTitle: "Profile Views",
    viewsSub: "Company profile visits",
    savedTitle: "Saved Jobs",
    savedSub: "Bookmarked openings",
    matchesTitle: "Job Matches",
    matchesSub: "Calculated matches",
    quickActionsTitle: "Quick Actions",
    profileAction: "Update Profile & CV",
    opportunitiesAction: "Browse Opportunities",
    matchingAction: "View Matching Score",
    aiAction: "AI Career Assistant",
    aiLockedNote: "AI tools are unlocked on the Advanced plan."
  },
  pt: {
    title: "Visão Geral do Candidato",
    subtitle: "Resumo em tempo real do teu perfil, correspondências, candidaturas e entrevistas.",
    planBadge: "Plano Ativo",
    manageSubBtn: "Subscrições",
    interviewsCardTitle: "Entrevistas",
    unlimitedLabel: "Ilimitadas",
    unlimitedDesc: "Entrevistas ilimitadas incluídas no teu plano ativo",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} restantes`,
    freeQuotaDesc: (used: number, total: number) => `${used} de ${total} entrevistas utilizadas no plano Grátis`,
    applicationsTitle: "Candidaturas",
    applicationsSub: "Candidaturas submetidas",
    viewsTitle: "Visualizações",
    viewsSub: "Consultas ao teu perfil",
    savedTitle: "Vagas Guardadas",
    savedSub: "Oportunidades favoritas",
    matchesTitle: "Correspondências",
    matchesSub: "Matches calculados",
    quickActionsTitle: "Ações Rápidas",
    profileAction: "Atualizar Perfil & CV",
    opportunitiesAction: "Explorar Vagas",
    matchingAction: "Ver Pontuação de Match",
    aiAction: "Assistente de Carreira IA",
    aiLockedNote: "As ferramentas de IA são exclusivas do plano Avançado."
  },
  es: {
    title: "Resumen del Candidato",
    subtitle: "Vista en tiempo real de tu perfil, coincidencias, postulaciones y entrevistas.",
    planBadge: "Plan Activo",
    manageSubBtn: "Suscripciones",
    interviewsCardTitle: "Entrevistas",
    unlimitedLabel: "Ilimitadas",
    unlimitedDesc: "Entrevistas ilimitadas incluidas en tu plan activo",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} disponibles`,
    freeQuotaDesc: (used: number, total: number) => `${used} de ${total} entrevistas usadas en el plan Gratis`,
    applicationsTitle: "Postulaciones",
    applicationsSub: "Postulaciones enviadas",
    viewsTitle: "Vistas del Perfil",
    viewsSub: "Visitas de empresas",
    savedTitle: "Vacantes Guardadas",
    savedSub: "Favoritos guardados",
    matchesTitle: "Coincidencias",
    matchesSub: "Matches calculados",
    quickActionsTitle: "Acciones Rápidas",
    profileAction: "Actualizar Perfil y CV",
    opportunitiesAction: "Explorar Vacantes",
    matchingAction: "Ver Puntuación de Match",
    aiAction: "Asistente de Carrera IA",
    aiLockedNote: "Las herramientas de IA son exclusivas del plan Avanzado."
  },
  fr: {
    title: "Vue d'Ensemble Candidat",
    subtitle: "Aperçu en temps réel de votre profil, correspondances, candidatures et entretiens.",
    planBadge: "Offre Active",
    manageSubBtn: "Abonnements",
    interviewsCardTitle: "Entretiens",
    unlimitedLabel: "Illimités",
    unlimitedDesc: "Entretiens illimités inclus dans votre offre active",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} restants`,
    freeQuotaDesc: (used: number, total: number) => `${used} sur ${total} entretiens utilisés avec l'offre Gratuite`,
    applicationsTitle: "Candidatures",
    applicationsSub: "Candidatures envoyées",
    viewsTitle: "Vues du Profil",
    viewsSub: "Visites d'entreprises",
    savedTitle: "Offres Sauvegardées",
    savedSub: "Opportunités enregistrées",
    matchesTitle: "Correspondances",
    matchesSub: "Matches calculés",
    quickActionsTitle: "Actions Rapides",
    profileAction: "Mettre à Jour Profil & CV",
    opportunitiesAction: "Parcourir les Offres",
    matchingAction: "Voir le Score de Match",
    aiAction: "Assistant Carrière IA",
    aiLockedNote: "Les outils IA sont réservés à l'offre Avancé."
  },
  de: {
    title: "Kandidaten-Übersicht",
    subtitle: "Aktuelle Übersicht zu Profil, Matches, Bewerbungen und Interview-Kontingent.",
    planBadge: "Aktiver Tarif",
    manageSubBtn: "Abonnements",
    interviewsCardTitle: "Interviews",
    unlimitedLabel: "Unbegrenzt",
    unlimitedDesc: "Unbegrenzte Interviews in Ihrem aktiven Tarif enthalten",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} übrig`,
    freeQuotaDesc: (used: number, total: number) => `${used} von ${total} Interviews im Gratisplan genutzt`,
    applicationsTitle: "Bewerbungen",
    applicationsSub: "Eingereichte Bewerbungen",
    viewsTitle: "Profilaufrufe",
    viewsSub: "Unternehmensbesuche",
    savedTitle: "Gespeicherte Stellen",
    savedSub: "Gemerkt für später",
    matchesTitle: "Job-Matches",
    matchesSub: "Berechnete Matches",
    quickActionsTitle: "Schnellzugriff",
    profileAction: "Profil & CV aktualisieren",
    opportunitiesAction: "Stellenangebote ansehen",
    matchingAction: "Matching-Score prüfen",
    aiAction: "KI-Karriereassistent",
    aiLockedNote: "KI-Funktionen sind exklusiv im Tarif Erweitert enthalten."
  },
  ar: {
    title: "نظرة عامة للمرشح",
    subtitle: "ملخص مباشر لملفك الشخصي والتطابقات وطلبات التوظيف والمقابلات.",
    planBadge: "الباقة النشطة",
    manageSubBtn: "الاشتراكات",
    interviewsCardTitle: "المقابلات",
    unlimitedLabel: "غير محدودة",
    unlimitedDesc: "مقابلات غير محدودة مشمولة في باقتك الحالية",
    freeQuotaLabel: (used: number, total: number) => `${Math.max(0, total - used)} / ${total} متبقية`,
    freeQuotaDesc: (used: number, total: number) => `تم استخدام ${used} من ${total} مقابلات في الباقة المجانية`,
    applicationsTitle: "طلبات التوظيف",
    applicationsSub: "الطلبات المقدمة",
    viewsTitle: "مشاهدات الملف",
    viewsSub: "زيارات الشركات لملفك",
    savedTitle: "الوظائف المحفوظة",
    savedSub: "الفرص المفضلة",
    matchesTitle: "التطابقات الوظيفية",
    matchesSub: "تطابقات محسوبة",
    quickActionsTitle: "إجراءات سريعة",
    profileAction: "تحديث الملف والسيرة الذاتية",
    opportunitiesAction: "استعراض الوظائف",
    matchingAction: "عرض نسبة التطابق",
    aiAction: "مساعد المسار المهني بالذكاء الاصطناعي",
    aiLockedNote: "أدوات الذكاء الاصطناعي متوفرة حصرياً في الباقة المتقدمة."
  }
};

export default function CandidateOverviewPage() {
  const { lang, candidate } = useDashboardLang();
  const ov = OVERVIEW_TEXTS[lang] || OVERVIEW_TEXTS['en'];

  const [applicationsCount, setApplicationsCount] = useState(0);
  const [interviewsUsed, setInterviewsUsed] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) return;

        const { count: appsC } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', uid);

        const { count: intC } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', uid)
          .eq('status', 'interview');

        const { count: viewsC } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', uid);

        const { count: savedC } = await supabase
          .from('saved_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', uid);

        const { count: matchesC } = await supabase
          .from('job_matches')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', uid);

        if (!active) return;
        setApplicationsCount(appsC || 0);
        setInterviewsUsed(intC || 0);
        setViewsCount(viewsC || 0);
        setSavedCount(savedC || 0);
        setMatchesCount(matchesC || 0);
      } catch {
        // Mantém contadores zerados se ainda não existirem registos
      }
    }

    loadMetrics();
    return () => {
      active = false;
    };
  }, []);

  const isUnlimited = Boolean(candidate?.unlimitedInterviews);
  const freeLimit = 3;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
            {ov.planBadge}: {candidate?.planTier || 'free'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1.5">
            {ov.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{ov.subtitle}</p>
        </div>

        <Link
          href="/dashboard/candidate/subscriptions"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 hover:opacity-95 transition flex items-center gap-2 self-start md:self-auto"
        >
          <span>{ov.manageSubBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cartão de Entrevistas (3 no plano Grátis vs. Ilimitadas nos planos pagos) */}
      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            {isUnlimited ? <InfinityIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {ov.interviewsCardTitle}
            </p>
            <p className="text-xl font-extrabold text-white mt-0.5">
              {isUnlimited ? ov.unlimitedLabel : ov.freeQuotaLabel(interviewsUsed, freeLimit)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isUnlimited ? ov.unlimitedDesc : ov.freeQuotaDesc(interviewsUsed, freeLimit)}
            </p>
          </div>
        </div>

        {!isUnlimited && (
          <Link
            href="/dashboard/candidate/subscriptions"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/30 text-xs font-semibold text-purple-200 transition self-start sm:self-center"
          >
            {ov.manageSubBtn}
          </Link>
        )}
      </div>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {ov.applicationsTitle}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{applicationsCount}</p>
          <p className="text-xs text-gray-400 mt-1">{ov.applicationsSub}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {ov.viewsTitle}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{viewsCount}</p>
          <p className="text-xs text-gray-400 mt-1">{ov.viewsSub}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {ov.savedTitle}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{savedCount}</p>
          <p className="text-xs text-gray-400 mt-1">{ov.savedSub}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {ov.matchesTitle}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{matchesCount}</p>
          <p className="text-xs text-gray-400 mt-1">{ov.matchesSub}</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-4">
        <h2 className="text-base font-bold text-white">{ov.quickActionsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/dashboard/candidate/profile"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>{ov.profileAction}</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
          <Link
            href="/dashboard/candidate/opportunities"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>{ov.opportunitiesAction}</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
          <Link
            href="/dashboard/candidate/matching"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span>{ov.matchingAction}</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
          <Link
            href="/dashboard/candidate/ai-assistant"
            className="p-4 rounded-xl bg-purple-950/40 hover:bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-200 flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span>{ov.aiAction}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
        </div>

        {!candidate?.hasAiAccess && (
          <p className="text-[11px] text-gray-400 pt-1">{ov.aiLockedNote}</p>
        )}
      </div>
    </div>
  );
}