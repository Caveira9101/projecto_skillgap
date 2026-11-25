'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface OpportunityItem {
  id: string;
  title: string;
  company_name: string | null;
  location: string | null;
  job_type: string | null;
  match_score: number | null;
}

const OPPORTUNITIES_TEXTS: Record<string, any> = {
  en: {
    title: "Job Opportunities",
    subtitle: "Explore open vacancies matching your profile and career goals.",
    searchPlaceholder: "Search by title, keyword, or company...",
    applyBtn: "View & Apply",
    matchSuffix: "Match",
    emptyTitle: "No job opportunities available yet",
    emptyDesc: "Check back soon as companies publish new openings, or refine your search filter.",
    aiTipTitle: "SkillGap AI Job Matcher",
    aiTipText: "Bookmark roles you are interested in and keep your profile updated to improve match accuracy."
  },
  pt: {
    title: "Oportunidades de Emprego",
    subtitle: "Explora vagas abertas compatíveis com o teu perfil e objetivos profissionais.",
    searchPlaceholder: "Pesquisar por cargo, palavra-chave ou empresa...",
    applyBtn: "Ver & Candidatar",
    matchSuffix: "Match",
    emptyTitle: "Ainda não existem vagas disponíveis",
    emptyDesc: "Volta a verificar à medida que as empresas publicam novas vagas, ou ajusta o filtro de pesquisa.",
    aiTipTitle: "Correspondência de Vagas IA SkillGap",
    aiTipText: "Guarda as vagas do teu interesse e mantém o teu perfil atualizado para melhorar a precisão da correspondência."
  },
  es: {
    title: "Oportunidades de Empleo",
    subtitle: "Explora vacantes abiertas compatibles con tu perfil y metas profesionales.",
    searchPlaceholder: "Buscar por puesto, palabra clave o empresa...",
    applyBtn: "Ver y Postular",
    matchSuffix: "Match",
    emptyTitle: "Aún no hay vacantes disponibles",
    emptyDesc: "Vuelve a consultar a medida que se publiquen nuevas ofertas o ajusta tu búsqueda.",
    aiTipTitle: "Buscador de Empleos IA SkillGap",
    aiTipText: "Guarda las vacantes que te interesen y mantén tu perfil actualizado para mejorar la coincidencia."
  },
  fr: {
    title: "Opportunités d'Emploi",
    subtitle: "Explorez les offres d'emploi correspondant à votre profil et à vos objectifs de carrière.",
    searchPlaceholder: "Rechercher par titre, mot-clé ou entreprise...",
    applyBtn: "Voir & Postuler",
    matchSuffix: "Match",
    emptyTitle: "Aucune offre d'emploi disponible pour le moment",
    emptyDesc: "Revenez bientôt lorsque de nouvelles offres seront publiées ou modifiez votre recherche.",
    aiTipTitle: "Moteur de Correspondance IA SkillGap",
    aiTipText: "Enregistrez les postes qui vous intéressent et mettez à jour votre profil pour affiner les correspondances."
  },
  de: {
    title: "Stellenangebote",
    subtitle: "Entdecken Sie offene Stellen, die zu Ihrem Profil und Ihren Karrierezielen passen.",
    searchPlaceholder: "Nach Titel, Stichwort oder Unternehmen suchen...",
    applyBtn: "Ansehen & Bewerben",
    matchSuffix: "Match",
    emptyTitle: "Derzeit sind keine Stellenangebote verfügbar",
    emptyDesc: "Schauen Sie bald wieder vorbei, wenn neue Stellen veröffentlicht werden, oder passen Sie die Suche an.",
    aiTipTitle: "SkillGap KI-Job-Matcher",
    aiTipText: "Merken Sie sich passende Stellen und halten Sie Ihr Profil aktuell, um genauere Übereinstimmungen zu erhalten."
  },
  ar: {
    title: "الفرص الوظيفية",
    subtitle: "استكشف الوظائف المتاحة المتوافقة مع ملفك الشخصي وأهدافك المهنية.",
    searchPlaceholder: "ابحث بالمسمى الوظيفي أو الكلمة المفتاحية أو الشركة...",
    applyBtn: "عرض والتقديم",
    matchSuffix: "تطابق",
    emptyTitle: "لا توجد فرص وظيفية متاحة حالياً",
    emptyDesc: "تحقق لاحقاً عند نشر الشركات لوظائف جديدة أو قم بتعديل عبارة البحث.",
    aiTipTitle: "محرك مطابقة الوظائف بالذكاء الاصطناعي SkillGap",
    aiTipText: "احفظ الوظائف التي تهمك وحدّث ملفك الشخصي باستمرار لتحسين دقة التطابق."
  }
};

export default function CandidateOpportunitiesPage() {
  const { lang } = useDashboardLang();
  const opp = OPPORTUNITIES_TEXTS[lang] || OPPORTUNITIES_TEXTS['en'];

  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<OpportunityItem[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadOpportunities() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id || null;
        if (active) setUserId(uid);

        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        let matchMap: Record<string, number> = {};
        let savedIds: string[] = [];

        if (uid) {
          const { data: matchesData } = await supabase
            .from('job_matches')
            .select('job_id, match_score')
            .eq('candidate_id', uid);

          if (Array.isArray(matchesData)) {
            matchesData.forEach((m: any) => {
              if (m.job_id && typeof m.match_score === 'number') {
                matchMap[String(m.job_id)] = m.match_score;
              }
            });
          }

          const { data: savedData } = await supabase
            .from('saved_jobs')
            .select('job_id')
            .eq('user_id', uid);

          if (Array.isArray(savedData)) {
            savedIds = savedData.map((s: any) => String(s.job_id));
          }
        }

        if (!active) return;

        const formatted: OpportunityItem[] = Array.isArray(jobsData)
          ? jobsData.map((j: any) => ({
              id: String(j.id),
              title: j.title || j.role_title || '',
              company_name: j.company_name || null,
              location: j.location || null,
              job_type: j.job_type || j.employment_type || null,
              match_score: typeof matchMap[String(j.id)] === 'number' ? matchMap[String(j.id)] : null,
            }))
          : [];

        setJobs(formatted);
        setSavedJobIds(savedIds);
      } catch {
        setJobs([]);
      }
    }

    loadOpportunities();
    return () => {
      active = false;
    };
  }, []);

  const toggleSaveJob = async (jobId: string) => {
    if (!userId) return;
    const isSaved = savedJobIds.includes(jobId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (!error) {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      }
    } else {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({ user_id: userId, job_id: jobId });

      if (!error) {
        setSavedJobIds((prev) => [...prev, jobId]);
      }
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      (job.company_name || '').toLowerCase().includes(q) ||
      (job.location || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {opp.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{opp.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0c0716] p-4 rounded-2xl border border-purple-900/40">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={opp.searchPlaceholder}
            className="w-full bg-white/5 border border-purple-500/20 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {typeof job.match_score === 'number' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                        {job.match_score}% {opp.matchSuffix}
                      </span>
                    )}
                    {job.company_name && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-[10px] font-bold text-blue-400">
                        {job.company_name}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">{job.title}</h2>
                    <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" /> {job.location}
                        </span>
                      )}
                      {job.job_type && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-blue-400" /> {job.job_type}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isSaved
                        ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                        : 'bg-white/5 border-purple-500/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <Link
                    href="/dashboard/candidate/applications"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2"
                  >
                    <span>{opp.applyBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{opp.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{opp.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{opp.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{opp.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}