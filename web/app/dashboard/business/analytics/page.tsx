'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Briefcase,
  Users,
  Calendar,
  Bookmark,
  Layers
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface AnalyticsMetrics {
  jobsCount: number;
  candidatesCount: number;
  shortlistedCount: number;
  interviewsCount: number;
  recruitersCount: number;
  byDepartment: { department: string; count: number }[];
}

const ANALYTICS_COPY: Record<
  LangCode,
  {
    pill: string;
    title: string;
    subtitle: string;
    planReportingLabel: string;
    jobsMetric: string;
    candidatesMetric: string;
    shortlistedMetric: string;
    interviewsMetric: string;
    planQuotaTitle: string;
    jobsQuota: string;
    recruitersQuota: string;
    candidatesPerJobQuota: string;
    departmentTitle: string;
    emptyDepartments: string;
    generalDept: string;
    openingsUnit: string;
  }
> = {
  en: {
    pill: 'RECRUITMENT ANALYTICS',
    title: 'Analytics & Reporting',
    subtitle: 'Live pipeline metrics and subscription capacity usage pulled directly from Supabase.',
    planReportingLabel: 'Plan Reporting Level:',
    jobsMetric: 'Active Job Positions',
    candidatesMetric: 'Total Candidates',
    shortlistedMetric: 'Shortlisted Candidates',
    interviewsMetric: 'Scheduled Interviews',
    planQuotaTitle: 'Subscription Quota Utilization',
    jobsQuota: 'Active Job Positions Quota',
    recruitersQuota: 'Recruiters Quota',
    candidatesPerJobQuota: 'Candidates Presented per Job Limit',
    departmentTitle: 'Job Positions by Department',
    emptyDepartments: 'No department data recorded in Supabase yet.',
    generalDept: 'General',
    openingsUnit: 'jobs'
  },
  pt: {
    pill: 'ESTATÍSTICAS DE RECRUTAMENTO',
    title: 'Estatísticas e Relatórios',
    subtitle: 'Métricas em tempo real do funil e utilização da capacidade do plano lidas diretamente do Supabase.',
    planReportingLabel: 'Nível de Relatórios do Plano:',
    jobsMetric: 'Vagas Ativas',
    candidatesMetric: 'Total de Candidatos',
    shortlistedMetric: 'Candidatos Pré-Selecionados',
    interviewsMetric: 'Entrevistas Agendadas',
    planQuotaTitle: 'Utilização de Limites da Subscrição',
    jobsQuota: 'Quota de Vagas Ativas',
    recruitersQuota: 'Quota de Recrutadores',
    candidatesPerJobQuota: 'Limite de Candidatos Apresentados por Vaga',
    departmentTitle: 'Vagas por Departamento',
    emptyDepartments: 'Ainda não existem dados de departamentos no Supabase.',
    generalDept: 'Geral',
    openingsUnit: 'vagas'
  },
  es: {
    pill: 'ANALÍTICA DE RECLUTAMIENTO',
    title: 'Analítica e Informes',
    subtitle: 'Métricas en vivo del proceso y uso de capacidad del plan extraídos directamente de Supabase.',
    planReportingLabel: 'Nivel de Informes del Plan:',
    jobsMetric: 'Puestos Activos',
    candidatesMetric: 'Total de Candidatos',
    shortlistedMetric: 'Candidatos Preseleccionados',
    interviewsMetric: 'Entrevistas Programadas',
    planQuotaTitle: 'Uso de Cuotas de Suscripción',
    jobsQuota: 'Cuota de Puestos Activos',
    recruitersQuota: 'Cuota de Reclutadores',
    candidatesPerJobQuota: 'Límite de Candidatos por Puesto',
    departmentTitle: 'Puestos por Departamento',
    emptyDepartments: 'Aún no hay datos de departamentos en Supabase.',
    generalDept: 'General',
    openingsUnit: 'puestos'
  },
  fr: {
    pill: 'ANALYTIQUE RECRUTEMENT',
    title: 'Analytique et Rapports',
    subtitle: 'Indicateurs en direct et utilisation des quotas de l’offre issus directement de Supabase.',
    planReportingLabel: 'Niveau de Reporting de l’Offre :',
    jobsMetric: 'Postes Actifs',
    candidatesMetric: 'Total Candidats',
    shortlistedMetric: 'Candidats Présélectionnés',
    interviewsMetric: 'Entretiens Planifiés',
    planQuotaTitle: 'Utilisation des Quotas d’Abonnement',
    jobsQuota: 'Quota de Postes Actifs',
    recruitersQuota: 'Quota de Recruteurs',
    candidatesPerJobQuota: 'Limite de Candidats par Poste',
    departmentTitle: 'Postes par Département',
    emptyDepartments: 'Aucune donnée de département enregistrée dans Supabase.',
    generalDept: 'Général',
    openingsUnit: 'postes'
  },
  de: {
    pill: 'RECRUITING-ANALYTIK',
    title: 'Analytik & Reporting',
    subtitle: 'Live-Kennzahlen und Tarifauslastung direkt aus Ihrer Supabase-Datenbank.',
    planReportingLabel: 'Tarif-Reporting-Stufe:',
    jobsMetric: 'Aktive Stellen',
    candidatesMetric: 'Kandidaten Gesamt',
    shortlistedMetric: 'Vorgemerkte Kandidaten',
    interviewsMetric: 'Geplante Interviews',
    planQuotaTitle: 'Auslastung der Tarif-Kontingente',
    jobsQuota: 'Kontingent Aktive Stellen',
    recruitersQuota: 'Recruiter-Kontingent',
    candidatesPerJobQuota: 'Limit Kandidaten pro Stelle',
    departmentTitle: 'Stellen nach Abteilung',
    emptyDepartments: 'Noch keine Abteilungsdaten in Supabase vorhanden.',
    generalDept: 'Allgemein',
    openingsUnit: 'Stellen'
  },
  ar: {
    pill: 'تحليلات التوظيف',
    title: 'التحليلات والتقارير',
    subtitle: 'مؤشرات فورية واستهلاك حدود الباقة مستخرجة مباشرة من قاعدة بيانات Supabase.',
    planReportingLabel: 'مستوى تقارير الباقة:',
    jobsMetric: 'الوظائف النشطة',
    candidatesMetric: 'إجمالي المرشحين',
    shortlistedMetric: 'القائمة المختصرة',
    interviewsMetric: 'المقابلات المجدولة',
    planQuotaTitle: 'استهلاك حدود الاشتراك',
    jobsQuota: 'حد الوظائف النشطة',
    recruitersQuota: 'حد مسؤولي التوظيف',
    candidatesPerJobQuota: 'حد المرشحين لكل وظيفة',
    departmentTitle: 'الوظائف حسب القسم',
    emptyDepartments: 'لا توجد بيانات أقسام مسجلة في Supabase حتى الآن.',
    generalDept: 'عام',
    openingsUnit: 'وظائف'
  }
};

export default function BusinessAnalyticsPage() {
  const { lang, activePlan } = useBusinessDashboardLang();
  const copy = ANALYTICS_COPY[lang] || ANALYTICS_COPY.en;
  const isRtl = lang === 'ar';

  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    jobsCount: 0,
    candidatesCount: 0,
    shortlistedCount: 0,
    interviewsCount: 0,
    recruitersCount: 0,
    byDepartment: []
  });

  useEffect(() => {
    async function loadAnalytics() {
      if (!supabase) return;

      const [jobsRes, candRes, shortRes, intRes, teamRes] = await Promise.all([
        supabase.from('job_positions').select('id,department'),
        supabase.from('candidates').select('id', { count: 'exact', head: true }),
        supabase.from('shortlisted_candidates').select('id', { count: 'exact', head: true }),
        supabase.from('interviews').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true })
      ]);

      const jobRows = (jobsRes.data as { id: string; department?: string | null }[]) || [];
      const deptMap = new Map<string, number>();

      for (const j of jobRows) {
        const key = (j.department || copy.generalDept).trim() || copy.generalDept;
        deptMap.set(key, (deptMap.get(key) || 0) + 1);
      }

      const byDepartment = Array.from(deptMap.entries()).map(([department, count]) => ({
        department,
        count
      }));

      setMetrics({
        jobsCount: jobRows.length,
        candidatesCount: candRes.count ?? 0,
        shortlistedCount: shortRes.count ?? 0,
        interviewsCount: intRes.count ?? 0,
        recruitersCount: teamRes.count ?? 0,
        byDepartment
      });
    }

    loadAnalytics();
  }, [copy.generalDept]);

  const maxJobs = activePlan?.activeJobsLimit ?? 3;
  const maxRecruiters = activePlan?.recruitersLimit ?? 2;
  const candidatesPerJob = activePlan?.candidatesPerJob ?? 5;

  const jobsPct = Math.min(100, Math.round((metrics.jobsCount / Math.max(1, maxJobs)) * 100));
  const recruitersPct = Math.min(
    100,
    Math.round((metrics.recruitersCount / Math.max(1, maxRecruiters)) * 100)
  );

  const summaryCards = [
    { label: copy.jobsMetric, value: metrics.jobsCount, icon: Briefcase },
    { label: copy.candidatesMetric, value: metrics.candidatesCount, icon: Users },
    { label: copy.shortlistedMetric, value: metrics.shortlistedCount, icon: Bookmark },
    { label: copy.interviewsMetric, value: metrics.interviewsCount, icon: Calendar }
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-semibold tracking-widest text-purple-300 uppercase mb-3">
            <BarChart3 className="w-3 h-3 text-purple-400" />
            <span>{copy.pill}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-[#0b0614] border border-purple-500/25 text-xs text-gray-300">
          {copy.planReportingLabel}{' '}
          <strong className="text-purple-300">{activePlan?.analyticsReporting || 'Básico'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">{copy.planQuotaTitle}</h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-gray-300">
                <span>{copy.jobsQuota}</span>
                <strong className="text-white">
                  {metrics.jobsCount} / {maxJobs} ({jobsPct}%)
                </strong>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-[#6d28d9]" style={{ width: `${jobsPct}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-gray-300">
                <span>{copy.recruitersQuota}</span>
                <strong className="text-white">
                  {metrics.recruitersCount} / {maxRecruiters} ({recruitersPct}%)
                </strong>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: `${recruitersPct}%` }} />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-gray-300">
              <span>{copy.candidatesPerJobQuota}</span>
              <strong className="text-purple-300">{candidatesPerJob}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">{copy.departmentTitle}</h2>
          </div>

          {metrics.byDepartment.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">{copy.emptyDepartments}</p>
          ) : (
            <div className="space-y-3 text-xs">
              {metrics.byDepartment.map((item) => {
                const widthPct = Math.min(
                  100,
                  Math.round((item.count / Math.max(1, metrics.jobsCount)) * 100)
                );
                return (
                  <div key={item.department} className="space-y-1">
                    <div className="flex justify-between text-gray-300">
                      <span>{item.department}</span>
                      <strong className="text-white">
                        {item.count} {copy.openingsUnit}
                      </strong>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}