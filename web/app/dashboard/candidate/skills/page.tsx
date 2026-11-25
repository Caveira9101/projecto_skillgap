'use client';

import React, { useEffect, useState } from 'react';
import {
  Award,
  Plus,
  Sparkles,
  Zap,
  Trash2,
  X
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface SkillRecord {
  id: string;
  name: string;
  details: string;
  level_label: string;
  category: 'technical' | 'soft';
}

const SKILLS_TEXTS: Record<string, any> = {
  en: {
    title: "Skills & Expertise",
    subtitle: "Manage your technical and soft skills aligned with market demand.",
    addBtn: "Add Skill",
    cancelBtn: "Cancel",
    technical: "Technical Skills",
    soft: "Soft Skills",
    countSuffix: "Listed",
    emptyTechnical: "No technical skills added yet.",
    emptySoft: "No soft skills added yet.",
    formTitle: "New Skill",
    categoryLabel: "Category",
    nameLabel: "Skill Name",
    levelLabel: "Proficiency / Level",
    detailsLabel: "Notes / Tools / Context",
    saveBtn: "Save Skill",
    savingBtn: "Saving...",
    aiTipTitle: "SkillGap AI Skills Insight",
    aiTipText: "Keep your technical and soft skills accurate so matching and skill-gap analysis reflect your real capabilities."
  },
  pt: {
    title: "Competências & Especialização",
    subtitle: "Gere as tuas competências técnicas e comportamentais alinhadas com o mercado.",
    addBtn: "Adicionar Competência",
    cancelBtn: "Cancelar",
    technical: "Competências Técnicas",
    soft: "Competências Comportamentais",
    countSuffix: "Registadas",
    emptyTechnical: "Ainda não adicionaste competências técnicas.",
    emptySoft: "Ainda não adicionaste competências comportamentais.",
    formTitle: "Nova Competência",
    categoryLabel: "Categoria",
    nameLabel: "Nome da Competência",
    levelLabel: "Nível / Domínio",
    detailsLabel: "Detalhes / Ferramentas / Contexto",
    saveBtn: "Guardar Competência",
    savingBtn: "A guardar...",
    aiTipTitle: "Insight de Competências IA SkillGap",
    aiTipText: "Mantém as tuas competências técnicas e comportamentais atualizadas para que o match e a análise de lacunas reflitam as tuas capacidades reais."
  },
  es: {
    title: "Habilidades y Especialización",
    subtitle: "Gestiona tus habilidades técnicas y blandas alineadas con la demanda del mercado.",
    addBtn: "Añadir Habilidad",
    cancelBtn: "Cancelar",
    technical: "Habilidades Técnicas",
    soft: "Habilidades Blandas",
    countSuffix: "Registradas",
    emptyTechnical: "Aún no has añadido habilidades técnicas.",
    emptySoft: "Aún no has añadido habilidades blandas.",
    formTitle: "Nueva Habilidad",
    categoryLabel: "Categoría",
    nameLabel: "Nombre de la Habilidad",
    levelLabel: "Nivel / Dominio",
    detailsLabel: "Detalles / Herramientas / Contexto",
    saveBtn: "Guardar Habilidad",
    savingBtn: "Guardando...",
    aiTipTitle: "Perspectiva de Habilidades IA SkillGap",
    aiTipText: "Mantén tus habilidades técnicas y blandas al día para que el análisis de coincidencia y brechas refleje tus capacidades reales."
  },
  fr: {
    title: "Compétences & Spécialisation",
    subtitle: "Gérez vos compétences techniques et comportementales selon la demande du marché.",
    addBtn: "Ajouter une Compétence",
    cancelBtn: "Annuler",
    technical: "Compétences Techniques",
    soft: "Compétences Comportementales",
    countSuffix: "Enregistrées",
    emptyTechnical: "Aucune compétence technique ajoutée pour l'instant.",
    emptySoft: "Aucune compétence comportementale ajoutée pour l'instant.",
    formTitle: "Nouvelle Compétence",
    categoryLabel: "Catégorie",
    nameLabel: "Nom de la Compétence",
    levelLabel: "Niveau / Maîtrise",
    detailsLabel: "Détails / Outils / Contexte",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    aiTipTitle: "Aperçu des Compétences IA SkillGap",
    aiTipText: "Gardez vos compétences à jour afin que l'analyse de correspondance et d'écart reflète vos capacités réelles."
  },
  de: {
    title: "Fähigkeiten & Spezialisierung",
    subtitle: "Verwalten Sie Ihre fachlichen und sozialen Kompetenzen passend zum Marktbedarf.",
    addBtn: "Fähigkeit hinzufügen",
    cancelBtn: "Abbrechen",
    technical: "Technische Fähigkeiten",
    soft: "Soziale Kompetenzen",
    countSuffix: "Erfasst",
    emptyTechnical: "Noch keine technischen Fähigkeiten hinzugefügt.",
    emptySoft: "Noch keine sozialen Kompetenzen hinzugefügt.",
    formTitle: "Neue Fähigkeit",
    categoryLabel: "Kategorie",
    nameLabel: "Bezeichnung der Fähigkeit",
    levelLabel: "Niveau / Kenntnisstand",
    detailsLabel: "Details / Tools / Kontext",
    saveBtn: "Fähigkeit speichern",
    savingBtn: "Speichern...",
    aiTipTitle: "SkillGap KI-Fähigkeitseinblick",
    aiTipText: "Halten Sie Ihre Fähigkeiten aktuell, damit Matching und Kompetenzlücken-Analyse Ihre tatsächlichen Stärken abbilden."
  },
  ar: {
    title: "المهارات والخبرات",
    subtitle: "أدر مهاراتك التقنية والشخصية بما يتوافق مع متطلبات سوق العمل.",
    addBtn: "إضافة مهارة",
    cancelBtn: "إلغاء",
    technical: "المهارات التقنية",
    soft: "المهارات الشخصية",
    countSuffix: "مسجلة",
    emptyTechnical: "لم تتم إضافة مهارات تقنية بعد.",
    emptySoft: "لم تتم إضافة مهارات شخصية بعد.",
    formTitle: "إضافة مهارة جديدة",
    categoryLabel: "التصنيف",
    nameLabel: "اسم المهارة",
    levelLabel: "المستوى / الإتقان",
    detailsLabel: "التفاصيل / الأدوات / السياق",
    saveBtn: "حفظ المهارة",
    savingBtn: "جاري الحفظ...",
    aiTipTitle: "رؤية المهارات بالذكاء الاصطناعي SkillGap",
    aiTipText: "حافظ على تحديث مهاراتك لتعكس تحليلات التطابق والفجوات قدراتك الفعلية بدقة."
  }
};

export default function CandidateSkillsPage() {
  const { lang } = useDashboardLang();
  const sk = SKILLS_TEXTS[lang] || SKILLS_TEXTS['en'];

  const [userId, setUserId] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState<'technical' | 'soft'>('technical');
  const [name, setName] = useState('');
  const [levelLabel, setLevelLabel] = useState('');
  const [details, setDetails] = useState('');

  const loadSkills = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('candidate_skills')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        setSkills(data as SkillRecord[]);
      }
    } catch {
      setSkills([]);
    }
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (uid && active) {
        setUserId(uid);
        loadSkills(uid);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !name.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('candidate_skills')
        .insert({
          user_id: userId,
          category,
          name: name.trim(),
          level_label: levelLabel.trim(),
          details: details.trim(),
        })
        .select()
        .single();

      if (!error && data) {
        setSkills((prev) => [data as SkillRecord, ...prev]);
        setName('');
        setLevelLabel('');
        setDetails('');
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('candidate_skills')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setSkills((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const technicalSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {sk.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{sk.subtitle}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? sk.cancelBtn : sk.addBtn}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddSkill}
          className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-4"
        >
          <h2 className="text-base font-bold text-white">{sk.formTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{sk.categoryLabel}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'technical' | 'soft')}
                className="w-full bg-[#0c0716] border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="technical">{sk.technical}</option>
                <option value="soft">{sk.soft}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{sk.nameLabel}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{sk.levelLabel}</label>
              <input
                type="text"
                value={levelLabel}
                onChange={(e) => setLevelLabel(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{sk.detailsLabel}</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
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
              {sk.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
            >
              {saving ? sk.savingBtn : sk.saveBtn}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>{sk.technical}</span>
            </h3>
            <span className="text-xs text-purple-400 font-semibold">
              {technicalSkills.length} {sk.countSuffix}
            </span>
          </div>

          {technicalSkills.length > 0 ? (
            <div className="space-y-3">
              {technicalSkills.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-purple-500/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    {item.details && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.details}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.level_label && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        {item.level_label}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(item.id)}
                      className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4">{sk.emptyTechnical}</p>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-fuchsia-400" />
              <span>{sk.soft}</span>
            </h3>
            <span className="text-xs text-fuchsia-400 font-semibold">
              {softSkills.length} {sk.countSuffix}
            </span>
          </div>

          {softSkills.length > 0 ? (
            <div className="space-y-3">
              {softSkills.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-purple-500/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    {item.details && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.details}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.level_label && (
                      <span className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold">
                        {item.level_label}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(item.id)}
                      className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4">{sk.emptySoft}</p>
          )}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{sk.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{sk.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}