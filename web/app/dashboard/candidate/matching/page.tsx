'use client';

import React, { useEffect, useState } from 'react';
import {
  Target,
  Sparkles
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface MatchRecord {
  id: string;
  job_title: string;
  company_name: string | null;
  location: string | null;
  match_score: number;
  analytical_score: number | null;
  tools_score: number | null;
  experience_score: number | null;
}

const MATCHING_TEXTS: Record<string, any> = {
  en: {
    title: "Matching Score & Compatibility",
    subtitle: "Detailed compatibility breakdown against open market positions.",
    highCompatBadge: "COMPATIBILITY SCORE",
    emptyTitle: "No job compatibility scores yet",
    emptyDesc: "Complete your profile, skills, and experience to calculate compatibility scores with open roles.",
    roleDescPrefix: "Your profile achieves a ",
    roleDescSuffix: " match against this position's requirements.",
    scoreLabel: "Match Score",
    breakdown: "Detailed Skills Match",
    skill1Label: "Analytical & Core Competencies",
    skill2Label: "Technical Tools & Stack",
    skill3Label: "Experience & Problem Solving",
    aiTipTitle: "SkillGap AI Matching Insights",
    aiTipText: "Compatibility scores are calculated from your recorded profile, skills, education, and experience."
  },
  pt: {
    title: "Pontuação de Match & Compatibilidade",
    subtitle: "Análise detalhada de compatibilidade com as vagas abertas no mercado.",
    highCompatBadge: "PONTUAÇÃO DE COMPATIBILIDADE",
    emptyTitle: "Ainda sem pontuações de compatibilidade",
    emptyDesc: "Completa o teu perfil, competências e experiência para calcular pontuações de match com vagas abertas.",
    roleDescPrefix: "O teu perfil atinge uma correspondência de ",
    roleDescSuffix: " com os requisitos desta posição.",
    scoreLabel: "Pontuação de Match",
    breakdown: "Detalhe de Compatibilidade de Competências",
    skill1Label: "Competências Analíticas & Base",
    skill2Label: "Ferramentas Técnicas & Stack",
    skill3Label: "Experiência & Resolução de Problemas",
    aiTipTitle: "Insights de Correspondência IA SkillGap",
    aiTipText: "As pontuações de compatibilidade baseiam-se no teu perfil, competências, formação e experiência registados."
  },
  es: {
    title: "Puntuación de Match y Compatibilidad",
    subtitle: "Desglose detallado de compatibilidad con las vacantes abiertas del mercado.",
    highCompatBadge: "PUNTUACIÓN DE COMPATIBILIDAD",
    emptyTitle: "Aún sin puntuaciones de compatibilidad",
    emptyDesc: "Completa tu perfil, habilidades y experiencia para calcular la compatibilidad con vacantes abiertas.",
    roleDescPrefix: "Tu perfil alcanza una coincidencia de ",
    roleDescSuffix: " con los requisitos de este puesto.",
    scoreLabel: "Puntuación de Match",
    breakdown: "Desglose Detallado de Habilidades",
    skill1Label: "Habilidades Analíticas y Base",
    skill2Label: "Herramientas Técnicas y Stack",
    skill3Label: "Experiencia y Resolución de Problemas",
    aiTipTitle: "Perspectivas de Coincidencia IA SkillGap",
    aiTipText: "Las puntuaciones de coincidencia se calculan a partir de tu perfil, habilidades, educación y experiencia."
  },
  fr: {
    title: "Score de Correspondance & Compatibilité",
    subtitle: "Analyse détaillée de compatibilité avec les postes ouverts sur le marché.",
    highCompatBadge: "SCORE DE COMPATIBILITÉ",
    emptyTitle: "Aucun score de correspondance disponible",
    emptyDesc: "Complétez votre profil, vos compétences et votre expérience pour calculer votre compatibilité avec des postes.",
    roleDescPrefix: "Votre profil atteint une correspondance de ",
    roleDescSuffix: " avec les critères de ce poste.",
    scoreLabel: "Score de Match",
    breakdown: "Détail des Compétences",
    skill1Label: "Compétences Analytiques & Fondamentaux",
    skill2Label: "Outils Techniques & Stack",
    skill3Label: "Expérience & Résolution de Problèmes",
    aiTipTitle: "Analyses de Correspondance IA SkillGap",
    aiTipText: "Les scores de correspondance sont calculés à partir de votre profil, vos compétences, votre formation et votre expérience."
  },
  de: {
    title: "Matching-Score & Kompatibilität",
    subtitle: "Detaillierte Kompatibilitätsaufschlüsselung für offene Marktpositionen.",
    highCompatBadge: "KOMPATIBILITÄTS-SCORE",
    emptyTitle: "Noch keine Kompatibilitätswerte vorhanden",
    emptyDesc: "Vervollständigen Sie Profil, Fähigkeiten und Erfahrung, um Matching-Werte für Stellen zu berechnen.",
    roleDescPrefix: "Ihr Profil erreicht eine Übereinstimmung von ",
    roleDescSuffix: " mit den Anforderungen dieser Position.",
    scoreLabel: "Matching-Score",
    breakdown: "Detaillierte Kompetenzübereinstimmung",
    skill1Label: "Analytische & Fachliche Grundlagen",
    skill2Label: "Technische Tools & Stack",
    skill3Label: "Erfahrung & Problemlösung",
    aiTipTitle: "SkillGap KI-Matching-Einblicke",
    aiTipText: "Matching-Werte basieren auf Ihrem hinterlegten Profil, Ihren Fähigkeiten, Ihrer Ausbildung und Ihrer Erfahrung."
  },
  ar: {
    title: "نسبة التطابق والتوافق",
    subtitle: "تحليل تفصيلي للتوافق مع الوظائف المتاحة في السوق.",
    highCompatBadge: "درجة التوافق",
    emptyTitle: "لا توجد درجات توافق وظيفي بعد",
    emptyDesc: "أكمل ملفك الشخصي ومهاراتك وخبراتك لحساب نسب التطابق مع الوظائف المتاحة.",
    roleDescPrefix: "يحقق ملفك الشخصي نسبة توافق تبلغ ",
    roleDescSuffix: " مع متطلبات هذه الوظيفة.",
    scoreLabel: "نسبة التطابق",
    breakdown: "تفاصيل توافق المهارات",
    skill1Label: "المهارات التحليلية والأساسية",
    skill2Label: "الأدوات التقنية والمنظومة",
    skill3Label: "الخبرة وحل المشكلات",
    aiTipTitle: "رؤى التطابق بالذكاء الاصطناعي SkillGap",
    aiTipText: "يتم احتساب نسب التطابق بناءً على ملفك الشخصي ومهاراتك وتعليمك وخبراتك المسجلة."
  }
};

export default function CandidateMatchingPage() {
  const { lang } = useDashboardLang();
  const match = MATCHING_TEXTS[lang] || MATCHING_TEXTS['en'];

  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId || !active) return;

        const { data, error } = await supabase
          .from('job_matches')
          .select('*')
          .eq('candidate_id', userId)
          .order('match_score', { ascending: false });

        if (!error && Array.isArray(data) && active) {
          setMatches(data as MatchRecord[]);
          setSelectedIndex(0);
        }
      } catch {
        setMatches([]);
      }
    }

    loadMatches();
    return () => {
      active = false;
    };
  }, []);

  const current = matches[selectedIndex] || null;
  const clampPct = (val: number | null | undefined) =>
    typeof val === 'number' ? Math.max(0, Math.min(100, val)) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {match.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{match.subtitle}</p>
        </div>

        {matches.length > 1 && (
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="bg-[#0c0716] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none"
          >
            {matches.map((m, idx) => (
              <option key={m.id} value={idx}>
                {m.job_title} ({m.match_score}%)
              </option>
            ))}
          </select>
        )}
      </div>

      {current ? (
        <>
          <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 text-center md:text-start">
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider">
                {match.highCompatBadge}
              </span>
              <h2 className="text-2xl font-bold text-white">{current.job_title}</h2>
              <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                {match.roleDescPrefix}
                <strong className="text-white">{clampPct(current.match_score)}%</strong>
                {match.roleDescSuffix}
              </p>
              {(current.company_name || current.location) && (
                <p className="text-xs text-purple-300">
                  {[current.company_name, current.location].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-purple-950/40 border border-emerald-500/30 shrink-0 min-w-[180px]">
              <span className="text-4xl font-extrabold text-emerald-400">
                {clampPct(current.match_score)}%
              </span>
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mt-1">
                {match.scoreLabel}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span>{match.breakdown}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white">{match.skill1Label}</span>
                  <span className="text-emerald-400">{clampPct(current.analytical_score)}%</span>
                </div>
                <div className="w-full bg-purple-950/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                    style={{ width: `${clampPct(current.analytical_score)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white">{match.skill2Label}</span>
                  <span className="text-emerald-400">{clampPct(current.tools_score)}%</span>
                </div>
                <div className="w-full bg-purple-950/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-purple-500 h-full rounded-full"
                    style={{ width: `${clampPct(current.tools_score)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white">{match.skill3Label}</span>
                  <span className="text-blue-400">{clampPct(current.experience_score)}%</span>
                </div>
                <div className="w-full bg-purple-950/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${clampPct(current.experience_score)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{match.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{match.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{match.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{match.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}