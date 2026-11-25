'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Sparkles,
  Plus,
  X,
  Lock
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface SkillGapItem {
  id: string;
  skill_name: string;
  target_role: string | null;
  current_level: number;
  target_level: number;
}

const SKILL_GAP_TEXTS: Record<string, any> = {
  en: {
    title: "Skill Gap Analysis",
    subtitle: "Identify priority skill gaps and track readiness against your target roles.",
    addBtn: "Add Skill Gap",
    cancelBtn: "Cancel",
    lockedBadge: "ADVANCED PLAN FEATURE",
    lockedTitle: "AI Skill Gap Identification is Exclusive to the Advanced Plan",
    lockedDesc: "Skill Gap identification, professional skill analysis, and personalized AI recommendations are exclusive to the Advanced plan (€79.99 / $79.99 per month).",
    upgradeBtn: "Upgrade to Advanced Plan",
    formTitle: "Record a Skill Gap",
    skillLabel: "Skill / Competency Name",
    roleLabel: "Target Role (optional)",
    currentLevelLabel: "Current Level (0–100%)",
    targetLevelLabel: "Target Level (0–100%)",
    saveBtn: "Save Skill Gap",
    savingBtn: "Saving...",
    currentPrefix: "Current",
    targetPrefix: "Target",
    emptyTitle: "No skill gaps recorded yet",
    emptyDesc: "Add skills you want to develop to monitor your readiness progress.",
    aiTipTitle: "SkillGap AI Readiness Insights",
    aiTipText: "Prioritize high-impact skills required by your target roles and update your progress as you practice."
  },
  pt: {
    title: "Análise de Lacuna de Competências",
    subtitle: "Identifica lacunas prioritárias e acompanha a tua preparação para os cargos pretendidos.",
    addBtn: "Adicionar Lacuna",
    cancelBtn: "Cancelar",
    lockedBadge: "EXCLUSIVO PLANO AVANÇADO",
    lockedTitle: "A Identificação de Skill Gaps com IA é Exclusiva do Plano Avançado",
    lockedDesc: "A identificação de Skill Gaps, análise de competências profissionais e recomendações personalizadas de IA são exclusivas do plano Avançado (€79,99 / $79,99 por mês).",
    upgradeBtn: "Subscrever Plano Avançado",
    formTitle: "Registar Lacuna de Competência",
    skillLabel: "Nome da Competência / Skill",
    roleLabel: "Cargo Pretendido (opcional)",
    currentLevelLabel: "Nível Atual (0–100%)",
    targetLevelLabel: "Nível Alvo (0–100%)",
    saveBtn: "Guardar Lacuna",
    savingBtn: "A guardar...",
    currentPrefix: "Atual",
    targetPrefix: "Alvo",
    emptyTitle: "Ainda sem lacunas de competências registadas",
    emptyDesc: "Adiciona competências que queres desenvolver para acompanhar a tua evolução.",
    aiTipTitle: "Insights de Preparação IA SkillGap",
    aiTipText: "Prioriza as competências mais exigidas nos cargos que pretendes e atualiza o teu progresso regularmente."
  },
  es: {
    title: "Análisis de Brecha de Habilidades",
    subtitle: "Identifica brechas prioritarias y sigue tu preparación frente a los puestos objetivo.",
    addBtn: "Añadir Brecha",
    cancelBtn: "Cancelar",
    lockedBadge: "EXCLUSIVO PLAN AVANZADO",
    lockedTitle: "La Identificación de Skill Gaps con IA es Exclusiva del Plan Avanzado",
    lockedDesc: "La identificación de Skill Gaps, el análisis de habilidades y las recomendaciones personalizadas de IA son exclusivos del plan Avanzado (€79,99 / $79,99 al mes).",
    upgradeBtn: "Actualizar al Plan Avanzado",
    formTitle: "Registrar Brecha de Habilidad",
    skillLabel: "Nombre de la Habilidad",
    roleLabel: "Puesto Objetivo (opcional)",
    currentLevelLabel: "Nivel Actual (0–100%)",
    targetLevelLabel: "Nivel Objetivo (0–100%)",
    saveBtn: "Guardar Brecha",
    savingBtn: "Guardando...",
    currentPrefix: "Actual",
    targetPrefix: "Objetivo",
    emptyTitle: "Aún no hay brechas de habilidades registradas",
    emptyDesc: "Añade habilidades que desees reforzar para seguir tu avance.",
    aiTipTitle: "Perspectivas de Preparación IA SkillGap",
    aiTipText: "Prioriza las habilidades clave para tus puestos objetivo y actualiza tu progreso con frecuencia."
  },
  fr: {
    title: "Analyse des Écarts de Compétences",
    subtitle: "Identifiez les écarts prioritaires et suivez votre préparation pour les postes visés.",
    addBtn: "Ajouter un Écart",
    cancelBtn: "Annuler",
    lockedBadge: "EXCLUSIF OFFRE AVANCÉ",
    lockedTitle: "L'Identification des Skill Gaps par IA est Réservée à l'Offre Avancé",
    lockedDesc: "L'identification des Skill Gaps, l'analyse des compétences et les recommandations IA personnalisées sont réservés à l'offre Avancé (79,99 € / 79,99 $ par mois).",
    upgradeBtn: "Passer à l'Offre Avancé",
    formTitle: "Enregistrer un Écart de Compétence",
    skillLabel: "Nom de la Compétence",
    roleLabel: "Poste Visé (optionnel)",
    currentLevelLabel: "Niveau Actuel (0–100%)",
    targetLevelLabel: "Niveau Cible (0–100%)",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    currentPrefix: "Actuel",
    targetPrefix: "Cible",
    emptyTitle: "Aucun écart de compétence enregistré pour l'instant",
    emptyDesc: "Ajoutez des compétences à renforcer pour suivre votre progression.",
    aiTipTitle: "Analyses de Préparation IA SkillGap",
    aiTipText: "Concentrez-vous sur les compétences clés de vos postes cibles et mettez à jour votre niveau."
  },
  de: {
    title: "Kompetenzlücken-Analyse",
    subtitle: "Erkennen Sie vorrangige Skill Gaps und verfolgen Sie Ihre Zielerreichung.",
    addBtn: "Skill Gap hinzufügen",
    cancelBtn: "Abbrechen",
    lockedBadge: "EXKLUSIV IM TARIF ERWEITERT",
    lockedTitle: "KI-Skill-Gap-Erkennung ist exklusiv im Tarif Erweitert enthalten",
    lockedDesc: "Skill-Gap-Erkennung, Kompetenzanalyse und individuelle KI-Empfehlungen sind exklusiv im Tarif Erweitert (79,99 € / 79,99 $ pro Monat) enthalten.",
    upgradeBtn: "Auf Tarif Erweitert wechseln",
    formTitle: "Skill Gap erfassen",
    skillLabel: "Name der Fähigkeit / Kompetenz",
    roleLabel: "Zielposition (optional)",
    currentLevelLabel: "Aktuelles Niveau (0–100%)",
    targetLevelLabel: "Zielniveau (0–100%)",
    saveBtn: "Skill Gap speichern",
    savingBtn: "Speichern...",
    currentPrefix: "Aktuell",
    targetPrefix: "Ziel",
    emptyTitle: "Noch keine Skill Gaps erfasst",
    emptyDesc: "Fügen Sie Fähigkeiten hinzu, um Ihren Fortschritt gezielt zu verfolgen.",
    aiTipTitle: "SkillGap KI-Bereitschaftseinblicke",
    aiTipText: "Konzentrieren Sie sich auf wichtige Anforderungen Ihrer Zielrollen und aktualisieren Sie Ihren Stand."
  },
  ar: {
    title: "تحليل فجوات المهارات",
    subtitle: "حدد فجوات المهارات ذات الأولوية وتابع جاهزيتك للوظائف المستهدفة.",
    addBtn: "إضافة فجوة مهارة",
    cancelBtn: "إلغاء",
    lockedBadge: "حصري للباقة المتقدمة",
    lockedTitle: "تحديد فجوات المهارات بالذكاء الاصطناعي حصري للباقة المتقدمة",
    lockedDesc: "تحديد فجوات المهارات وتحليل الكفاءات والتوصيات المخصصة بالذكاء الاصطناعي متوفرة حصرياً في الباقة المتقدمة (€79.99 / $79.99 شهرياً).",
    upgradeBtn: "الترقية إلى الباقة المتقدمة",
    formTitle: "تسجيل فجوة مهارة",
    skillLabel: "اسم المهارة أو الكفاءة",
    roleLabel: "المسمى الوظيفي المستهدف (اختياري)",
    currentLevelLabel: "المستوى الحالي (0–100%)",
    targetLevelLabel: "المستوى المستهدف (0–100%)",
    saveBtn: "حفظ الفجوة",
    savingBtn: "جاري الحفظ...",
    currentPrefix: "الحالي",
    targetPrefix: "المستهدف",
    emptyTitle: "لم يتم تسجيل فجوات مهارات بعد",
    emptyDesc: "أضف المهارات التي ترغب في تطويرها لمتابعة تقدم جاهزيتك.",
    aiTipTitle: "رؤى الجاهزية بالذكاء الاصطناعي SkillGap",
    aiTipText: "ركّز على المهارات الأكثر طلباً في أدوارك المستهدفة وحدّث مستواك باستمرار."
  }
};

export default function CandidateSkillGapPage() {
  const { lang, candidate } = useDashboardLang();
  const sg = SKILL_GAP_TEXTS[lang] || SKILL_GAP_TEXTS['en'];
  const hasAiAccess = Boolean(candidate?.hasAiAccess);

  const [userId, setUserId] = useState<string | null>(null);
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [skillName, setSkillName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [targetLevel, setTargetLevel] = useState(100);

  const clampPct = (v: number) => Math.max(0, Math.min(100, Number.isNaN(v) ? 0 : v));

  useEffect(() => {
    let active = true;
    async function loadSkillGaps() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) return;
        setUserId(uid);

        const { data, error } = await supabase
          .from('skill_gaps')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && active) {
          setGaps(
            data.map((item: any) => ({
              id: String(item.id),
              skill_name: item.skill_name || item.name || '',
              target_role: item.target_role || null,
              current_level: clampPct(Number(item.current_level ?? 0)),
              target_level: clampPct(Number(item.target_level ?? 100)),
            }))
          );
        }
      } catch {
        setGaps([]);
      }
    }
    loadSkillGaps();
    return () => {
      active = false;
    };
  }, []);

  const handleAddGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAiAccess || !userId || !skillName.trim()) return;

    setSaving(true);
    try {
      const cLvl = clampPct(currentLevel);
      const tLvl = clampPct(targetLevel);

      const { data, error } = await supabase
        .from('skill_gaps')
        .insert({
          user_id: userId,
          skill_name: skillName.trim(),
          target_role: targetRole.trim() || null,
          current_level: cLvl,
          target_level: tLvl,
        })
        .select()
        .single();

      if (!error && data) {
        setGaps((prev) => [
          {
            id: String(data.id),
            skill_name: data.skill_name || skillName.trim(),
            target_role: data.target_role || null,
            current_level: clampPct(Number(data.current_level ?? cLvl)),
            target_level: clampPct(Number(data.target_level ?? tLvl)),
          },
          ...prev,
        ]);
        setSkillName('');
        setTargetRole('');
        setCurrentLevel(0);
        setTargetLevel(100);
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
            {sg.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{sg.subtitle}</p>
        </div>

        {hasAiAccess ? (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? sg.cancelBtn : sg.addBtn}</span>
          </button>
        ) : (
          <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wider self-start md:self-auto">
            {sg.lockedBadge}
          </span>
        )}
      </div>

      {!hasAiAccess ? (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-500/35 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">{sg.lockedTitle}</h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            {sg.lockedDesc}
          </p>
          <div className="pt-1">
            <Link
              href="/dashboard/candidate/subscriptions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{sg.upgradeBtn}</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {showForm && (
            <form
              onSubmit={handleAddGap}
              className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-4"
            >
              <h2 className="text-base font-bold text-white">{sg.formTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{sg.skillLabel}</label>
                  <input
                    type="text"
                    required
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{sg.roleLabel}</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{sg.currentLevelLabel}</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(clampPct(Number(e.target.value)))}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{sg.targetLevelLabel}</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(clampPct(Number(e.target.value)))}
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
                  {sg.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  {saving ? sg.savingBtn : sg.saveBtn}
                </button>
              </div>
            </form>
          )}

          {gaps.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {gaps.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
                      <h2 className="text-base font-bold text-white">{item.skill_name}</h2>
                    </div>
                    <span className="text-xs font-semibold text-gray-300">
                      {sg.currentPrefix}: <strong className="text-white">{item.current_level}%</strong> •{' '}
                      {sg.targetPrefix}: <strong className="text-purple-300">{item.target_level}%</strong>
                    </span>
                  </div>
                  {item.target_role && (
                    <p className="text-xs text-gray-400">{item.target_role}</p>
                  )}
                  <div className="w-full bg-purple-950/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${item.current_level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
              <h2 className="text-base font-bold text-white">{sg.emptyTitle}</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">{sg.emptyDesc}</p>
            </div>
          )}
        </>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{sg.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{sg.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}