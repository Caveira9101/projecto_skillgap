'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Plus,
  X,
  Lock
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface DevelopmentGoal {
  id: string;
  title: string;
  focus_area: string | null;
  target_timeline: string | null;
  progress: number;
}

const DEVELOPMENT_TEXTS: Record<string, any> = {
  en: {
    title: "Career Development Plan",
    subtitle: "Set milestones, track learning progress, and build long-term career readiness.",
    addBtn: "New Goal",
    cancelBtn: "Cancel",
    lockedBadge: "ADVANCED PLAN FEATURE",
    lockedTitle: "AI Career Development Plan is Exclusive to the Advanced Plan",
    lockedDesc: "Personalized AI career development plans and guided milestones are available on the Advanced plan (€79.99 / $79.99 per month).",
    upgradeBtn: "Upgrade to Advanced Plan",
    formTitle: "Add Career Development Goal",
    goalTitleLabel: "Goal / Milestone Title",
    focusAreaLabel: "Focus Area (optional)",
    timelineLabel: "Target Timeline (optional)",
    saveBtn: "Save Goal",
    savingBtn: "Saving...",
    emptyTitle: "No development goals added yet",
    emptyDesc: "Create career or learning goals to track your growth over time.",
    aiTipTitle: "SkillGap AI Growth Planner",
    aiTipText: "Break larger career goals into concrete milestones and review your progress regularly."
  },
  pt: {
    title: "Plano de Desenvolvimento Profissional",
    subtitle: "Define metas, acompanha o progresso de aprendizagem e constrói preparação a longo prazo.",
    addBtn: "Nova Meta",
    cancelBtn: "Cancelar",
    lockedBadge: "EXCLUSIVO PLANO AVANÇADO",
    lockedTitle: "O Plano de Desenvolvimento com IA é Exclusivo do Plano Avançado",
    lockedDesc: "Os planos de desenvolvimento profissional personalizados com IA e marcos guiados fazem parte do plano Avançado (€79,99 / $79,99 por mês).",
    upgradeBtn: "Subscrever Plano Avançado",
    formTitle: "Adicionar Meta de Desenvolvimento",
    goalTitleLabel: "Título da Meta / Marco",
    focusAreaLabel: "Área de Foco (opcional)",
    timelineLabel: "Prazo Previsto (opcional)",
    saveBtn: "Guardar Meta",
    savingBtn: "A guardar...",
    emptyTitle: "Ainda não adicionaste metas de desenvolvimento",
    emptyDesc: "Cria metas de carreira ou aprendizagem para acompanhar a tua evolução.",
    aiTipTitle: "Planeador de Evolução IA SkillGap",
    aiTipText: "Divide objetivos amplos em marcos concretos e revê o teu progresso com regularidade."
  },
  es: {
    title: "Plan de Desarrollo Profesional",
    subtitle: "Define hitos, sigue tu progreso de aprendizaje y fortalece tu crecimiento profesional.",
    addBtn: "Nueva Meta",
    cancelBtn: "Cancelar",
    lockedBadge: "EXCLUSIVO PLAN AVANZADO",
    lockedTitle: "El Plan de Desarrollo con IA es Exclusivo del Plan Avanzado",
    lockedDesc: "Los planes de desarrollo profesional con IA y los hitos guiados están incluidos en el plan Avanzado (€79,99 / $79,99 al mes).",
    upgradeBtn: "Actualizar al Plan Avanzado",
    formTitle: "Añadir Meta de Desarrollo",
    goalTitleLabel: "Título de la Meta / Hito",
    focusAreaLabel: "Área de Enfoque (opcional)",
    timelineLabel: "Plazo Objetivo (opcional)",
    saveBtn: "Guardar Meta",
    savingBtn: "Guardando...",
    emptyTitle: "Aún no has añadido metas de desarrollo",
    emptyDesc: "Crea metas profesionales o de formación para seguir tu evolución.",
    aiTipTitle: "Planificador de Crecimiento IA SkillGap",
    aiTipText: "Divide tus objetivos en hitos concretos y revisa tus avances con frecuencia."
  },
  fr: {
    title: "Plan de Développement Professionnel",
    subtitle: "Définissez des objectifs, suivez vos progrès et renforcez votre trajectoire.",
    addBtn: "Nouvel Objectif",
    cancelBtn: "Annuler",
    lockedBadge: "EXCLUSIF OFFRE AVANCÉ",
    lockedTitle: "Le Plan de Développement IA est Réservé à l'Offre Avancé",
    lockedDesc: "Les plans de développement professionnel personnalisés par IA et jalons guidés sont inclus dans l'offre Avancé (79,99 € / 79,99 $ par mois).",
    upgradeBtn: "Passer à l'Offre Avancé",
    formTitle: "Ajouter un Objectif de Développement",
    goalTitleLabel: "Titre de l'Objectif / Jalon",
    focusAreaLabel: "Domaine Clé (optionnel)",
    timelineLabel: "Échéance Visée (optionnel)",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    emptyTitle: "Aucun objectif de développement défini pour l'instant",
    emptyDesc: "Ajoutez des objectifs de carrière ou de formation pour suivre votre progression.",
    aiTipTitle: "Planificateur d'Évolution IA SkillGap",
    aiTipText: "Décomposez vos objectifs en étapes concrètes et suivez vos avancées régulièrement."
  },
  de: {
    title: "Beruflicher Entwicklungsplan",
    subtitle: "Setzen Sie Meilensteine, verfolgen Sie Lernfortschritte und bauen Sie Kompetenzen auf.",
    addBtn: "Neues Ziel",
    cancelBtn: "Abbrechen",
    lockedBadge: "EXKLUSIV IM TARIF ERWEITERT",
    lockedTitle: "Der KI-Entwicklungsplan ist exklusiv im Tarif Erweitert enthalten",
    lockedDesc: "Individuelle KI-Entwicklungspläne und geführte Meilensteine stehen im Tarif Erweitert (79,99 € / 79,99 $ pro Monat) zur Verfügung.",
    upgradeBtn: "Auf Tarif Erweitert wechseln",
    formTitle: "Entwicklungsziel hinzufügen",
    goalTitleLabel: "Ziel- / Meilensteintitel",
    focusAreaLabel: "Schwerpunktbereich (optional)",
    timelineLabel: "Zielzeitraum (optional)",
    saveBtn: "Ziel speichern",
    savingBtn: "Speichern...",
    emptyTitle: "Noch keine Entwicklungsziele erfasst",
    emptyDesc: "Legen Sie Karriere- oder Lernziele an, um Ihren Fortschritt zu verfolgen.",
    aiTipTitle: "SkillGap KI-Wachstumsplaner",
    aiTipText: "Unterteilen Sie größere Ziele in konkrete Schritte und prüfen Sie regelmäßig Ihren Fortschritt."
  },
  ar: {
    title: "خطة التطوير المهني",
    subtitle: "حدد الأهداف المرحلية وتابع تقدمك التعليمي وعزز جاهزيتك المهنية على المدى الطويل.",
    addBtn: "هدف جديد",
    cancelBtn: "إلغاء",
    lockedBadge: "حصري للباقة المتقدمة",
    lockedTitle: "خطة التطوير بالذكاء الاصطناعي حصرية للباقة المتقدمة",
    lockedDesc: "خطط التطوير المهني المخصصة بالذكاء الاصطناعي والمراحل الموجهة متوفرة في الباقة المتقدمة (€79.99 / $79.99 شهرياً).",
    upgradeBtn: "الترقية إلى الباقة المتقدمة",
    formTitle: "إضافة هدف تطوير مهني",
    goalTitleLabel: "عنوان الهدف / المرحلة",
    focusAreaLabel: "مجال التركيز (اختياري)",
    timelineLabel: "الإطار الزمني المستهدف (اختياري)",
    saveBtn: "حفظ الهدف",
    savingBtn: "جاري الحفظ...",
    emptyTitle: "لم تتم إضافة أهداف تطوير بعد",
    emptyDesc: "أضف أهدافاً مهنية أو تدريبية لمتابعة تطورك باستمرار.",
    aiTipTitle: "مخطط النمو بالذكاء الاصطناعي SkillGap",
    aiTipText: "قسّم الأهداف الكبيرة إلى خطوات واضحة وراجع تقدمك بشكل دوري."
  }
};

export default function CandidateDevelopmentPage() {
  const { lang, candidate } = useDashboardLang();
  const dev = DEVELOPMENT_TEXTS[lang] || DEVELOPMENT_TEXTS['en'];
  const hasAiAccess = Boolean(candidate?.hasAiAccess);

  const [userId, setUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<DevelopmentGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [goalTitle, setGoalTitle] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [targetTimeline, setTargetTimeline] = useState('');

  useEffect(() => {
    let active = true;
    async function loadGoals() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) return;
        setUserId(uid);

        const { data, error } = await supabase
          .from('development_goals')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && active) {
          setGoals(
            data.map((g: any) => ({
              id: String(g.id),
              title: g.title || g.goal_title || '',
              focus_area: g.focus_area || null,
              target_timeline: g.target_timeline || null,
              progress: typeof g.progress === 'number' ? Math.max(0, Math.min(100, g.progress)) : 0,
            }))
          );
        }
      } catch {
        setGoals([]);
      }
    }
    loadGoals();
    return () => {
      active = false;
    };
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAiAccess || !userId || !goalTitle.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('development_goals')
        .insert({
          user_id: userId,
          title: goalTitle.trim(),
          focus_area: focusArea.trim() || null,
          target_timeline: targetTimeline.trim() || null,
          progress: 0,
        })
        .select()
        .single();

      if (!error && data) {
        setGoals((prev) => [
          {
            id: String(data.id),
            title: data.title || goalTitle.trim(),
            focus_area: data.focus_area || null,
            target_timeline: data.target_timeline || null,
            progress: typeof data.progress === 'number' ? data.progress : 0,
          },
          ...prev,
        ]);
        setGoalTitle('');
        setFocusArea('');
        setTargetTimeline('');
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {dev.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{dev.subtitle}</p>
        </div>

        {hasAiAccess ? (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? dev.cancelBtn : dev.addBtn}</span>
          </button>
        ) : (
          <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wider self-start md:self-auto">
            {dev.lockedBadge}
          </span>
        )}
      </div>

      {!hasAiAccess ? (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-500/35 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">{dev.lockedTitle}</h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            {dev.lockedDesc}
          </p>
          <div className="pt-1">
            <Link
              href="/dashboard/candidate/subscriptions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{dev.upgradeBtn}</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {showForm && (
            <form
              onSubmit={handleAddGoal}
              className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-4"
            >
              <h2 className="text-base font-bold text-white">{dev.formTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{dev.goalTitleLabel}</label>
                  <input
                    type="text"
                    required
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{dev.focusAreaLabel}</label>
                  <input
                    type="text"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{dev.timelineLabel}</label>
                  <input
                    type="text"
                    value={targetTimeline}
                    onChange={(e) => setTargetTimeline(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-xs text-gray-300 hover:text-white cursor-pointer"
                >
                  {dev.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  {saving ? dev.savingBtn : dev.saveBtn}
                </button>
              </div>
            </form>
          )}

          {goals.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                      <h2 className="text-base font-bold text-white">{g.title}</h2>
                    </div>
                    <span className="text-xs font-bold text-purple-300">{g.progress}%</span>
                  </div>
                  {(g.focus_area || g.target_timeline) && (
                    <p className="text-xs text-gray-400">
                      {[g.focus_area, g.target_timeline].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  <div className="w-full bg-purple-950/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
              <h2 className="text-base font-bold text-white">{dev.emptyTitle}</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">{dev.emptyDesc}</p>
            </div>
          )}
        </>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{dev.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{dev.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}