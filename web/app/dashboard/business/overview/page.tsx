'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Calendar,
  Bookmark,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface OverviewStats {
  activeJobs: number;
  totalCandidates: number;
  scheduledInterviews: number;
  shortlistedCount: number;
}

interface RecentJobRow {
  id: string;
  title: string;
  department?: string | null;
  status?: string | null;
  location?: string | null;
}

const OVERVIEW_COPY: Record<
  LangCode,
  {
    pill: string;
    title: string;
    subtitle: string;
    activeJobsCard: string;
    candidatesCard: string;
    interviewsCard: string;
    shortlistedCard: string;
    planSummaryTitle: string;
    planLimitJobs: string;
    planLimitRecruiters: string;
    planLimitCandidatesJob: string;
    manageSubscription: string;
    recentJobsTitle: string;
    viewAllJobs: string;
    emptyJobs: string;
    noDepartment: string;
    noLocation: string;
  }
> = {
  en: {
    pill: 'BUSINESS OVERVIEW',
    title: 'Company Overview',
    subtitle: 'Real-time recruitment metrics, active subscription limits, and open positions from your database.',
    activeJobsCard: 'Job Positions',
    candidatesCard: 'Registered Candidates',
    interviewsCard: 'Interviews',
    shortlistedCard: 'Shortlisted',
    planSummaryTitle: 'Active Subscription Restrictions',
    planLimitJobs: 'Max active jobs',
    planLimitRecruiters: 'Max recruiters',
    planLimitCandidatesJob: 'Candidates per job',
    manageSubscription: 'Manage Subscription',
    recentJobsTitle: 'Recent Job Positions',
    viewAllJobs: 'Open Job Positions',
    emptyJobs: 'No job positions found in Supabase yet.',
    noDepartment: 'General',
    noLocation: 'Not specified'
  },
  pt: {
    pill: 'VISÃO GERAL EMPRESARIAL',
    title: 'Visão Geral da Empresa',
    subtitle: 'Métricas em tempo real, limites da subscrição ativa e vagas registadas na base de dados.',
    activeJobsCard: 'Vagas',
    candidatesCard: 'Candidatos Registados',
    interviewsCard: 'Entrevistas',
    shortlistedCard: 'Pré-Selecionados',
    planSummaryTitle: 'Restrições da Subscrição Ativa',
    planLimitJobs: 'Máx. vagas ativas',
    planLimitRecruiters: 'Máx. recrutadores',
    planLimitCandidatesJob: 'Candidatos por vaga',
    manageSubscription: 'Gerir Subscrição',
    recentJobsTitle: 'Vagas Recentes',
    viewAllJobs: 'Ver Vagas',
    emptyJobs: 'Ainda não existem vagas registadas no Supabase.',
    noDepartment: 'Geral',
    noLocation: 'Não especificado'
  },
  es: {
    pill: 'RESUMEN EMPRESARIAL',
    title: 'Resumen de la Empresa',
    subtitle: 'Métricas en tiempo real, límites del plan activo y puestos registrados en la base de datos.',
    activeJobsCard: 'Puestos',
    candidatesCard: 'Candidatos Registrados',
    interviewsCard: 'Entrevistas',
    shortlistedCard: 'Preseleccionados',
    planSummaryTitle: 'Restricciones de la Suscripción Activa',
    planLimitJobs: 'Máx. puestos activos',
    planLimitRecruiters: 'Máx. reclutadores',
    planLimitCandidatesJob: 'Candidatos por puesto',
    manageSubscription: 'Gestionar Suscripción',
    recentJobsTitle: 'Puestos Recientes',
    viewAllJobs: 'Ver Puestos',
    emptyJobs: 'Aún no hay puestos registrados en Supabase.',
    noDepartment: 'General',
    noLocation: 'No especificado'
  },
  fr: {
    pill: 'VUE D’ENSEMBLE ENTREPRISE',
    title: 'Vue d’Ensemble de l’Entreprise',
    subtitle: 'Indicateurs en temps réel, limites de l’offre active et postes enregistrés dans la base de données.',
    activeJobsCard: 'Postes',
    candidatesCard: 'Candidats Inscrits',
    interviewsCard: 'Entretiens',
    shortlistedCard: 'Présélectionnés',
    planSummaryTitle: 'Restrictions de l’Abonnement Actif',
    planLimitJobs: 'Max. postes actifs',
    planLimitRecruiters: 'Max. recruteurs',
    planLimitCandidatesJob: 'Candidats par poste',
    manageSubscription: 'Gérer l’Abonnement',
    recentJobsTitle: 'Postes Récents',
    viewAllJobs: 'Voir les Postes',
    emptyJobs: 'Aucun poste enregistré dans Supabase pour le moment.',
    noDepartment: 'Général',
    noLocation: 'Non spécifié'
  },
  de: {
    pill: 'UNTERNEHMENSÜBERSICHT',
    title: 'Unternehmensübersicht',
    subtitle: 'Echtzeit-Kennzahlen, Limits des aktiven Tarifs und Stellenpositionen aus Ihrer Datenbank.',
    activeJobsCard: 'Stellenpositionen',
    candidatesCard: 'Registrierte Kandidaten',
    interviewsCard: 'Interviews',
    shortlistedCard: 'Auswahlliste',
    planSummaryTitle: 'Einschränkungen des Aktiven Tarifs',
    planLimitJobs: 'Max. aktive Stellen',
    planLimitRecruiters: 'Max. Recruiter',
    planLimitCandidatesJob: 'Kandidaten pro Stelle',
    manageSubscription: 'Abonnement Verwalten',
    recentJobsTitle: 'Aktuelle Stellenpositionen',
    viewAllJobs: 'Stellen Ansehen',
    emptyJobs: 'Noch keine Stellenpositionen in Supabase vorhanden.',
    noDepartment: 'Allgemein',
    noLocation: 'Nicht angegeben'
  },
  ar: {
    pill: 'نظرة عامة على الشركة',
    title: 'نظرة عامة على الشركة',
    subtitle: 'مؤشرات فورية، حدود الباقة النشطة، والوظائف المسجلة في قاعدة البيانات.',
    activeJobsCard: 'الوظائف',
    candidatesCard: 'المرشحون المسجلون',
    interviewsCard: 'المقابلات',
    shortlistedCard: 'القائمة المختصرة',
    planSummaryTitle: 'قيود الاشتراك النشط',
    planLimitJobs: 'الحد الأقصى للوظائف النشطة',
    planLimitRecruiters: 'الحد الأقصى لمسؤولي التوظيف',
    planLimitCandidatesJob: 'المرشحون لكل وظيفة',
    manageSubscription: 'إدارة الاشتراك',
    recentJobsTitle: 'أحدث الوظائف',
    viewAllJobs: 'عرض الوظائف',
    emptyJobs: 'لا توجد وظائف مسجلة في Supabase حتى الآن.',
    noDepartment: 'عام',
    noLocation: 'غير محدد'
  }
};

export default function BusinessOverviewPage() {
  const { lang, activePlan } = useBusinessDashboardLang();
  const copy = OVERVIEW_COPY[lang] || OVERVIEW_COPY.en;
  const isRtl = lang === 'ar';

  const [stats, setStats] = useState<OverviewStats>({
    activeJobs: 0,
    totalCandidates: 0,
    scheduledInterviews: 0,
    shortlistedCount: 0
  });
  const [recentJobs, setRecentJobs] = useState<RecentJobRow[]>([]);

  useEffect(() => {
    async function loadOverview() {
      if (!supabase) return;

      const [jobsRes, candRes, intRes, shortRes] = await Promise.all([
        supabase.from('job_positions').select('id,title,department,status,location').limit(5),
        supabase.from('candidates').select('id', { count: 'exact', head: true }),
        supabase.from('interviews').select('id', { count: 'exact', head: true }),
        supabase.from('shortlisted_candidates').select('id', { count: 'exact', head: true })
      ]);

      const jobsList = (jobsRes.data as RecentJobRow[]) || [];
      setRecentJobs(jobsList);
      setStats({
        activeJobs: jobsList.length,
        totalCandidates: candRes.count ?? 0,
        scheduledInterviews: intRes.count ?? 0,
        shortlistedCount: shortRes.count ?? 0
      });
    }

    loadOverview();
  }, []);

  const cards = [
    { label: copy.activeJobsCard, value: stats.activeJobs, icon: Briefcase },
    { label: copy.candidatesCard, value: stats.totalCandidates, icon: Users },
    { label: copy.interviewsCard, value: stats.scheduledInterviews, icon: Calendar },
    { label: copy.shortlistedCard, value: stats.shortlistedCount, icon: Bookmark }
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-semibold tracking-widest text-purple-300 uppercase mb-3">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>{copy.pill}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#160d29] border border-purple-500/25 flex items-center justify-center text-purple-300">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#0b0614] border border-purple-500/25 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{copy.planSummaryTitle}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/35 text-[11px] font-bold text-purple-300">
              {activePlan?.name || 'STARTER'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs border-t border-white/[0.06] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{copy.planLimitJobs}</span>
              <strong className="text-white">{activePlan?.activeJobsLimit ?? 3}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{copy.planLimitRecruiters}</span>
              <strong className="text-white">{activePlan?.recruitersLimit ?? 2}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{copy.planLimitCandidatesJob}</span>
              <strong className="text-white">{activePlan?.candidatesPerJob ?? 5}</strong>
            </div>
          </div>

          <Link
            href="/dashboard/business/subscription"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-bold text-white transition"
          >
            <span>{copy.manageSubscription}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{copy.recentJobsTitle}</h2>
            <Link
              href="/dashboard/business/job-positions"
              className="text-xs font-semibold text-purple-300 hover:text-white underline"
            >
              {copy.viewAllJobs}
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">{copy.emptyJobs}</p>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-white">{job.title}</p>
                    <p className="text-gray-400 mt-0.5">
                      {job.department || copy.noDepartment} • {job.location || copy.noLocation}
                    </p>
                  </div>
                  {job.status && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/25 text-purple-200 text-[11px]">
                      {job.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}