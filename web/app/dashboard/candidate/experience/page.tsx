'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Briefcase,
  Plus,
  Building,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface ExperienceRecord {
  id: string;
  role_title: string;
  organization: string;
  period: string;
  description: string;
  is_current: boolean;
}

const EXPERIENCE_TEXTS: Record<string, any> = {
  en: {
    title: "Professional Experience",
    subtitle: "Manage your career history, roles, and major achievements.",
    addBtn: "Add Experience",
    currentBadge: "Current",
    emptyTitle: "No experience records yet",
    emptyDesc: "Add your roles, internships, or freelance work to highlight your track record.",
    formTitle: "New Experience Entry",
    roleLabel: "Role / Job Title",
    orgLabel: "Company / Organization",
    periodLabel: "Period",
    descLabel: "Key Responsibilities & Achievements",
    currentLabel: "Current role",
    cancelBtn: "Cancel",
    saveBtn: "Save Experience",
    savingBtn: "Saving...",
    deleteBtn: "Delete",
    sessionError: "Session not found. Please sign in again.",
    saveError: "Could not save experience record: ",
    deleteError: "Could not delete experience record: ",
    aiTipTitle: "SkillGap AI Experience Insight",
    aiTipText: "Clear descriptions of your roles and responsibilities help recruiters and AI matching evaluate your practical fit."
  },
  pt: {
    title: "Experiência Profissional",
    subtitle: "Gere o teu histórico profissional, funções e principais realizações.",
    addBtn: "Adicionar Experiência",
    currentBadge: "Atual",
    emptyTitle: "Ainda sem experiências registadas",
    emptyDesc: "Adiciona as tuas funções, estágios ou trabalhos para mostrar o teu percurso.",
    formTitle: "Nova Experiência Profissional",
    roleLabel: "Cargo / Função",
    orgLabel: "Empresa / Organização",
    periodLabel: "Período",
    descLabel: "Principais Responsabilidades & Conquistas",
    currentLabel: "Função atual",
    cancelBtn: "Cancelar",
    saveBtn: "Guardar Experiência",
    savingBtn: "A guardar...",
    deleteBtn: "Apagar",
    sessionError: "Sessão não encontrada. Inicia sessão novamente.",
    saveError: "Não foi possível guardar a experiência: ",
    deleteError: "Não foi possível apagar a experiência: ",
    aiTipTitle: "Insight de Experiência IA SkillGap",
    aiTipText: "Descrições claras das tuas funções e resultados ajudam recrutadores e a IA a avaliar o teu enquadramento prático."
  },
  es: {
    title: "Experiencia Profesional",
    subtitle: "Gestiona tu historial profesional, puestos y principales logros.",
    addBtn: "Añadir Experiencia",
    currentBadge: "Actual",
    emptyTitle: "Sin experiencias registradas aún",
    emptyDesc: "Añade tus puestos, prácticas o proyectos para mostrar tu trayectoria.",
    formTitle: "Nueva Experiencia Profesional",
    roleLabel: "Puesto / Rol",
    orgLabel: "Empresa / Organización",
    periodLabel: "Período",
    descLabel: "Responsabilidades y Logros Principales",
    currentLabel: "Puesto actual",
    cancelBtn: "Cancelar",
    saveBtn: "Guardar Experiencia",
    savingBtn: "Guardando...",
    deleteBtn: "Eliminar",
    sessionError: "Sesión no encontrada. Vuelve a iniciar sesión.",
    saveError: "No se pudo guardar la experiencia: ",
    deleteError: "No se pudo eliminar la experiencia: ",
    aiTipTitle: "Perspectiva de Experiencia IA SkillGap",
    aiTipText: "Las descripciones claras de tus funciones ayudan a reclutadores y a la IA a evaluar tu encaje práctico."
  },
  fr: {
    title: "Expérience Professionnelle",
    subtitle: "Gérez votre parcours professionnel, vos rôles et vos réalisations majeures.",
    addBtn: "Ajouter une Expérience",
    currentBadge: "En cours",
    emptyTitle: "Aucune expérience enregistrée",
    emptyDesc: "Ajoutez vos postes, stages ou missions pour présenter votre parcours.",
    formTitle: "Nouvelle Expérience Professionnelle",
    roleLabel: "Poste / Fonction",
    orgLabel: "Entreprise / Organisation",
    periodLabel: "Période",
    descLabel: "Responsabilités & Réalisations Clés",
    currentLabel: "Poste actuel",
    cancelBtn: "Annuler",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    deleteBtn: "Supprimer",
    sessionError: "Session introuvable. Veuillez vous reconnecter.",
    saveError: "Impossible d'enregistrer l'expérience : ",
    deleteError: "Impossible de supprimer l'expérience : ",
    aiTipTitle: "Aperçu de l'Expérience IA SkillGap",
    aiTipText: "Des descriptions précises de vos missions aident les recruteurs et l'IA à évaluer votre adéquation concrète."
  },
  de: {
    title: "Berufserfahrung",
    subtitle: "Verwalten Sie Ihre Karrieregeschichte, Rollen und wichtigsten Erfolge.",
    addBtn: "Erfahrung hinzufügen",
    currentBadge: "Aktuell",
    emptyTitle: "Noch keine Berufserfahrung hinterlegt",
    emptyDesc: "Fügen Sie Positionen, Praktika oder Projekte hinzu, um Ihren Werdegang darzustellen.",
    formTitle: "Neue Berufserfahrung",
    roleLabel: "Position / Rolle",
    orgLabel: "Unternehmen / Organisation",
    periodLabel: "Zeitraum",
    descLabel: "Wichtige Aufgaben & Erfolge",
    currentLabel: "Aktuelle Position",
    cancelBtn: "Abbrechen",
    saveBtn: "Erfahrung speichern",
    savingBtn: "Speichern...",
    deleteBtn: "Löschen",
    sessionError: "Sitzung nicht gefunden. Bitte erneut anmelden.",
    saveError: "Erfahrung konnte nicht gespeichert werden: ",
    deleteError: "Erfahrung konnte nicht gelöscht werden: ",
    aiTipTitle: "SkillGap KI-Erfahrungseinblick",
    aiTipText: "Klare Beschreibungen Ihrer Aufgaben helfen Recruitern und der KI, Ihre praktische Passung einzuschätzen."
  },
  ar: {
    title: "الخبرة المهنية",
    subtitle: "أدر سجلك المهني وأدوارك الوظيفية وأبرز إنجازاتك.",
    addBtn: "إضافة خبرة",
    currentBadge: "حالي",
    emptyTitle: "لا توجد خبرات مسجلة بعد",
    emptyDesc: "أضف مناصبك أو تدريباتك أو مشاريعك لإبراز مسارك المهني.",
    formTitle: "إضافة خبرة مهنية جديدة",
    roleLabel: "المسمى الوظيفي / الدور",
    orgLabel: "الشركة / المؤسسة",
    periodLabel: "الفترة الزمنية",
    descLabel: "المسؤوليات والإنجازات الرئيسية",
    currentLabel: "المنصب الحالي",
    cancelBtn: "إلغاء",
    saveBtn: "حفظ الخبرة",
    savingBtn: "جاري الحفظ...",
    deleteBtn: "حذف",
    sessionError: "لم يتم العثور على الجلسة. يرجى تسجيل الدخول مرة أخرى.",
    saveError: "تعذر حفظ الخبرة: ",
    deleteError: "تعذر حذف الخبرة: ",
    aiTipTitle: "رؤية الخبرة بالذكاء الاصطناعي SkillGap",
    aiTipText: "يساعد الوصف الواضح لمهامك وإنجازاتك أصحاب العمل والذكاء الاصطناعي على تقييم ملاءمتك العملية."
  }
};

export default function CandidateExperiencePage() {
  const { lang } = useDashboardLang();
  const ex = EXPERIENCE_TEXTS[lang] || EXPERIENCE_TEXTS['en'];

  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<ExperienceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [roleTitle, setRoleTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  const resolveUserId = useCallback(async (): Promise<string | null> => {
    if (userId) return userId;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user?.id) return null;
    setUserId(data.user.id);
    return data.user.id;
  }, [userId]);

  const loadExperience = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('candidate_experience')
      .select('id, role_title, organization, period, description, is_current')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(`${ex.saveError}${error.message}`);
      return;
    }

    if (Array.isArray(data)) {
      setItems(data as ExperienceRecord[]);
    }
  }, [ex.saveError]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (uid && active) {
        setUserId(uid);
        loadExperience(uid);
      }
    });
    return () => {
      active = false;
    };
  }, [loadExperience]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const uid = await resolveUserId();
    if (!uid) {
      setErrorMsg(ex.sessionError);
      return;
    }
    if (!roleTitle.trim() || !organization.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('candidate_experience')
        .insert({
          user_id: uid,
          role_title: roleTitle.trim(),
          organization: organization.trim(),
          period: period.trim(),
          description: description.trim(),
          is_current: isCurrent,
        })
        .select('id, role_title, organization, period, description, is_current')
        .single();

      if (error) {
        setErrorMsg(`${ex.saveError}${error.message}`);
        return;
      }

      if (data) {
        setItems((prev) => [data as ExperienceRecord, ...prev]);
        setRoleTitle('');
        setOrganization('');
        setPeriod('');
        setDescription('');
        setIsCurrent(false);
        setShowForm(false);
      }
    } catch (err: any) {
      setErrorMsg(`${ex.saveError}${err?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    const uid = await resolveUserId();
    if (!uid) {
      setErrorMsg(ex.sessionError);
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('candidate_experience')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);

      if (error) {
        setErrorMsg(`${ex.deleteError}${error.message}`);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setErrorMsg(`${ex.deleteError}${err?.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {ex.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{ex.subtitle}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setShowForm((v) => !v);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? ex.cancelBtn : ex.addBtn}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-4"
        >
          <h2 className="text-base font-bold text-white">{ex.formTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ex.roleLabel}</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ex.orgLabel}</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">{ex.periodLabel}</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">{ex.descLabel}</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded border-purple-500/40 bg-white/5"
              />
              <span>{ex.currentLabel}</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-xs text-gray-300 hover:text-white cursor-pointer"
            >
              {ex.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
            >
              {saving ? ex.savingBtn : ex.saveBtn}
            </button>
          </div>
        </form>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${
                    item.is_current
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-600/20'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-600 shadow-blue-600/20'
                  } flex items-center justify-center text-white shrink-0 shadow-lg`}
                >
                  {item.is_current ? (
                    <Briefcase className="w-6 h-6" />
                  ) : (
                    <Building className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.period && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-bold tracking-wider text-purple-300 uppercase">
                        {item.period}
                      </span>
                    )}
                    {item.is_current && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                        {ex.currentBadge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white">{item.role_title}</h2>
                  <p className="text-sm text-purple-300 font-medium mt-0.5">
                    {item.organization}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  aria-label={ex.deleteBtn}
                  title={ex.deleteBtn}
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{ex.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{ex.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{ex.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{ex.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}