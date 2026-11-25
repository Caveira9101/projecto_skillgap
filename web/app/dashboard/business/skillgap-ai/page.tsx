'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, Briefcase, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface AiJobItem {
  id: string;
  title: string;
  required_skills: string[] | null;
}

interface AiCandidateItem {
  id: string;
  full_name: string;
  role: string;
  location: string;
  skills: string[] | null;
}

interface EvaluatedCandidateRow extends AiCandidateItem {
  matched: string[];
  gaps: string[];
  score: number;
  recommendation?: string;
}

const AI_PAGE_COPY: Record<
  LangCode,
  {
    pill: string;
    title: string;
    subtitle: string;
    planDepthLabel: string;
    selectJobLabel: string;
    runAiBtn: string;
    runningAiBtn: string;
    noJobsState: string;
    noCandidatesState: string;
    capLabel: string;
    matchedLabel: string;
    gapLabel: string;
    matchScoreLabel: string;
    aiError: string;
  }
> = {
  en: {
    pill: 'SKILLGAP AI ASSISTANT',
    title: 'SkillGap AI Evaluation',
    subtitle: 'Real AI evaluation of skill overlap and skill gaps stored in Supabase.',
    planDepthLabel: 'SkillGap Analysis Tier:',
    selectJobLabel: 'Target Job Position',
    runAiBtn: 'Run AI Evaluation & Save',
    runningAiBtn: 'Evaluating with AI...',
    noJobsState: 'No job positions found in Supabase.',
    noCandidatesState: 'No candidates found in Supabase.',
    capLabel: 'Shown candidates capped by active plan:',
    matchedLabel: 'Matched Skills',
    gapLabel: 'Skill Gaps',
    matchScoreLabel: 'Match',
    aiError: 'Could not run AI evaluation. Check API key and Supabase table.'
  },
  pt: {
    pill: 'ASSISTENTE SKILLGAP AI',
    title: 'Avaliação SkillGap AI',
    subtitle: 'Avaliação real por IA de correspondência e lacunas de competências guardada no Supabase.',
    planDepthLabel: 'Nível de SkillGap Analysis:',
    selectJobLabel: 'Vaga Alvo',
    runAiBtn: 'Executar Avaliação IA & Guardar',
    runningAiBtn: 'A avaliar com IA...',
    noJobsState: 'Nenhuma vaga encontrada no Supabase.',
    noCandidatesState: 'Nenhum candidato encontrado no Supabase.',
    capLabel: 'Candidatos apresentados limitados pelo plano ativo:',
    matchedLabel: 'Competências Correspondentes',
    gapLabel: 'Lacunas (Skill Gaps)',
    matchScoreLabel: 'Compatibilidade',
    aiError: 'Não foi possível executar a avaliação IA. Verifica a chave da API e a tabela no Supabase.'
  },
  es: {
    pill: 'ASISTENTE SKILLGAP AI',
    title: 'Evaluación SkillGap AI',
    subtitle: 'Evaluación real con IA de coincidencia y brechas de habilidades guardada en Supabase.',
    planDepthLabel: 'Nivel de SkillGap Analysis:',
    selectJobLabel: 'Puesto Objetivo',
    runAiBtn: 'Ejecutar Evaluación IA y Guardar',
    runningAiBtn: 'Evaluando con IA...',
    noJobsState: 'No se encontraron puestos en Supabase.',
    noCandidatesState: 'No se encontraron candidatos en Supabase.',
    capLabel: 'Candidatos mostrados limitados por el plan activo:',
    matchedLabel: 'Habilidades Coincidentes',
    gapLabel: 'Brechas (Skill Gaps)',
    matchScoreLabel: 'Compatibilidad',
    aiError: 'No se pudo ejecutar la evaluación IA. Revisa la clave de API y la tabla en Supabase.'
  },
  fr: {
    pill: 'ASSISTANT SKILLGAP AI',
    title: 'Évaluation SkillGap AI',
    subtitle: 'Évaluation réelle par IA des correspondances et écarts enregistrée dans Supabase.',
    planDepthLabel: 'Niveau SkillGap Analysis :',
    selectJobLabel: 'Poste Ciblé',
    runAiBtn: 'Lancer l’Évaluation IA & Enregistrer',
    runningAiBtn: 'Évaluation IA en cours...',
    noJobsState: 'Aucun poste trouvé dans Supabase.',
    noCandidatesState: 'Aucun candidat trouvé dans Supabase.',
    capLabel: 'Candidats affichés limités par l’offre active :',
    matchedLabel: 'Compétences Validées',
    gapLabel: 'Écarts (Skill Gaps)',
    matchScoreLabel: 'Adéquation',
    aiError: 'Impossible de lancer l’évaluation IA. Vérifiez la clé API et la table Supabase.'
  },
  de: {
    pill: 'SKILLGAP AI-ASSISTENT',
    title: 'SkillGap AI-Auswertung',
    subtitle: 'Echte KI-Auswertung von Skill-Matches und Skill-Gaps gespeichert in Supabase.',
    planDepthLabel: 'SkillGap Analysis-Stufe:',
    selectJobLabel: 'Zielstelle',
    runAiBtn: 'KI-Bewertung starten & speichern',
    runningAiBtn: 'KI bewertet...',
    noJobsState: 'Keine Stellenpositionen in Supabase gefunden.',
    noCandidatesState: 'Keine Kandidaten in Supabase gefunden.',
    capLabel: 'Angezeigte Kandidaten durch aktiven Tarif begrenzt:',
    matchedLabel: 'Passende Skills',
    gapLabel: 'Skill-Gaps',
    matchScoreLabel: 'Passung',
    aiError: 'KI-Bewertung fehlgeschlagen. Prüfen Sie API-Schlüssel und Supabase-Tabelle.'
  },
  ar: {
    pill: 'مساعد SKILLGAP AI',
    title: 'تقييم SkillGap AI',
    subtitle: 'تقييم حقيقي بالذكاء الاصطناعي لتوافق المهارات وفجواتها محفوظ في Supabase.',
    planDepthLabel: 'مستوى تحليل الفجوات:',
    selectJobLabel: 'الوظيفة المستهدفة',
    runAiBtn: 'تشغيل تقييم الذكاء الاصطناعي وحفظه',
    runningAiBtn: 'جاري التقييم بالذكاء الاصطناعي...',
    noJobsState: 'لا توجد وظائف في Supabase.',
    noCandidatesState: 'لا يوجد مرشحون في Supabase.',
    capLabel: 'المرشحون المعروضون مقيدون بالباقة النشطة:',
    matchedLabel: 'المهارات المتطابقة',
    gapLabel: 'فجوات المهارات',
    matchScoreLabel: 'التوافق',
    aiError: 'تعذر تشغيل تقييم الذكاء الاصطناعي. تحقق من مفتاح API وجدول Supabase.'
  }
};

export default function BusinessSkillGapAiPage() {
  const { lang, activePlan } = useBusinessDashboardLang();
  const copy = AI_PAGE_COPY[lang] || AI_PAGE_COPY.en;
  const isRtl = lang === 'ar';

  const [jobs, setJobs] = useState<AiJobItem[]>([]);
  const [candidates, setCandidates] = useState<AiCandidateItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiRows, setAiRows] = useState<EvaluatedCandidateRow[] | null>(null);
  const [runningAi, setRunningAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAiData() {
      if (!supabase) return;

      const [jobsRes, candRes] = await Promise.all([
        supabase.from('job_positions').select('id,title,required_skills'),
        supabase.from('candidates').select('id,full_name,role,location,skills')
      ]);

      const jobList = (jobsRes.data as AiJobItem[]) || [];
      const candList = (candRes.data as AiCandidateItem[]) || [];

      setJobs(jobList);
      setCandidates(candList);
      if (jobList[0]) {
        setSelectedJobId(jobList[0].id);
      }
    }

    loadAiData();
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const maxCandidates = activePlan?.candidatesPerJob ?? 5;
  const cappedCandidates = useMemo(
    () => candidates.slice(0, maxCandidates),
    [candidates, maxCandidates]
  );

  useEffect(() => {
    let active = true;

    async function loadLatestSavedEvaluation() {
      if (!supabase || !selectedJobId) {
        if (active) {
          setAiRows(null);
          setAiSummary('');
        }
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;
      if (!uid || !active) return;

      const { data, error } = await supabase
        .from('business_ai_evaluations')
        .select('summary, evaluations')
        .eq('company_user_id', uid)
        .eq('job_id', String(selectedJobId))
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active || error || !data) {
        if (active) {
          setAiRows(null);
          setAiSummary('');
        }
        return;
      }

      const evalMap = new Map<string, any>();
      if (Array.isArray(data.evaluations)) {
        data.evaluations.forEach((ev: any) => {
          if (ev?.candidateId) evalMap.set(String(ev.candidateId), ev);
        });
      }

      const merged: EvaluatedCandidateRow[] = cappedCandidates.map((cand) => {
        const match = evalMap.get(String(cand.id));
        return {
          ...cand,
          matched: Array.isArray(match?.matched) ? match.matched : [],
          gaps: Array.isArray(match?.gaps) ? match.gaps : [],
          score: typeof match?.score === 'number' ? match.score : 0,
          recommendation: match?.recommendation || '',
        };
      });

      setAiSummary(data.summary || '');
      setAiRows(merged);
    }

    loadLatestSavedEvaluation();
    return () => {
      active = false;
    };
  }, [selectedJobId, cappedCandidates]);

  const handleRunAiEvaluation = async () => {
    if (!supabase || !selectedJob || cappedCandidates.length === 0 || runningAi) return;

    setRunningAi(true);
    setErrorMsg(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const res = await fetch('/api/ai/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          job: selectedJob,
          candidates: cappedCandidates,
          lang,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || copy.aiError);
      }

      const rec = payload?.evaluationRecord;
      const evalMap = new Map<string, any>();
      if (Array.isArray(rec?.evaluations)) {
        rec.evaluations.forEach((ev: any) => {
          if (ev?.candidateId) evalMap.set(String(ev.candidateId), ev);
        });
      }

      const merged: EvaluatedCandidateRow[] = cappedCandidates.map((cand) => {
        const match = evalMap.get(String(cand.id));
        return {
          ...cand,
          matched: Array.isArray(match?.matched) ? match.matched : [],
          gaps: Array.isArray(match?.gaps) ? match.gaps : [],
          score: typeof match?.score === 'number' ? match.score : 0,
          recommendation: match?.recommendation || '',
        };
      });

      setAiSummary(rec?.summary || '');
      setAiRows(merged);
    } catch (err: any) {
      setErrorMsg(err?.message || copy.aiError);
    } finally {
      setRunningAi(false);
    }
  };

  const displayedCandidates: EvaluatedCandidateRow[] = aiRows ?? [];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-semibold tracking-widest text-purple-300 uppercase mb-3">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{copy.pill}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-[#0b0614] border border-purple-500/25 text-xs text-gray-300">
          {copy.planDepthLabel}{' '}
          <strong className="text-purple-300">{activePlan?.skillGapAnalysis || 'Básico'}</strong>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
          <label className="text-xs font-semibold text-white">{copy.selectJobLabel}</label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {jobs.length > 0 ? (
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#130a24] border border-purple-500/35 text-xs font-medium text-white focus:outline-none"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id} className="bg-[#0d0718]">
                  {job.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-gray-400">{copy.noJobsState}</span>
          )}

          <button
            type="button"
            disabled={runningAi || !selectedJob || cappedCandidates.length === 0}
            onClick={handleRunAiEvaluation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 hover:opacity-95 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{runningAi ? copy.runningAiBtn : copy.runAiBtn}</span>
          </button>

          <span className="text-xs text-purple-300">
            {copy.capLabel} <strong>{maxCandidates}</strong>
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {aiSummary && (
        <div className="rounded-2xl bg-[#130a24] border border-purple-500/30 p-4 text-xs text-purple-100 leading-relaxed">
          {aiSummary}
        </div>
      )}

      {cappedCandidates.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.noCandidatesState}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedCandidates.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white">{item.full_name}</h2>
                  <p className="text-xs text-gray-400">
                    {item.role} • {item.location}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/35 text-xs font-bold text-purple-200">
                  {copy.matchScoreLabel}: {item.score}%
                </span>
              </div>

              {item.recommendation && (
                <p className="text-xs text-gray-300 leading-relaxed">{item.recommendation}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs">
                <div className="space-y-1.5">
                  <p className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{copy.matchedLabel}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.matched.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/25 text-[11px] text-emerald-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{copy.gapLabel}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.gaps.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/25 text-[11px] text-amber-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}