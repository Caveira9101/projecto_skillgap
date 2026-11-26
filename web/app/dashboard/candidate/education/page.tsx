'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  Award,
  BookOpen,
  Trash2,
  Sparkles,
  X
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface EducationRecord {
  id: string;
  title: string;
  institution: string;
  period_or_location: string;
  credential_type: string;
  status: 'completed' | 'in_progress';
}

const EDUCATION_TEXTS: Record<string, any> = {
  en: {
    title: "Academic & Professional Education",
    subtitle: "Manage your university degrees, certifications, and specialized courses.",
    addBtn: "Add Education",
    completed: "Completed",
    inProgress: "In Progress",
    emptyTitle: "No education records yet",
    emptyDesc: "Add your degrees, diplomas, or technical courses to build a complete candidate profile.",
    formTitle: "New Education Entry",
    degreeLabel: "Degree / Course Title",
    institutionLabel: "Institution",
    metaLabel: "Period / Location",
    typeLabel: "Certification / Area",
    statusLabel: "Status",
    cancelBtn: "Cancel",
    saveBtn: "Save Entry",
    savingBtn: "Saving...",
    deleteBtn: "Delete",
    sessionError: "Session not found. Please sign in again.",
    saveError: "Could not save education record: ",
    deleteError: "Could not delete education record: ",
    aiTipTitle: "SkillGap AI Education Insight",
    aiTipText: "Keep your degrees and technical certifications up to date so matching scores reflect your real academic background."
  },
  pt: {
    title: "Educação Académica & Profissional",
    subtitle: "Gere os teus graus universitários, certificados e cursos especializados.",
    addBtn: "Adicionar Educação",
    completed: "Concluído",
    inProgress: "Em Progresso",
    emptyTitle: "Ainda sem registos de educação",
    emptyDesc: "Adiciona as tuas licenciaturas, diplomas ou cursos técnicos para completares o teu perfil.",
    formTitle: "Novo Registo Académico",
    degreeLabel: "Curso / Grau Académico",
    institutionLabel: "Instituição",
    metaLabel: "Período / Localização",
    typeLabel: "Certificação / Área",
    statusLabel: "Estado",
    cancelBtn: "Cancelar",
    saveBtn: "Guardar Registo",
    savingBtn: "A guardar...",
    deleteBtn: "Apagar",
    sessionError: "Sessão não encontrada. Inicia sessão novamente.",
    saveError: "Não foi possível guardar o registo de educação: ",
    deleteError: "Não foi possível apagar o registo de educação: ",
    aiTipTitle: "Insight de Educação IA SkillGap",
    aiTipText: "Mantém os teus graus e certificações atualizados para que a pontuação de compatibilidade reflita a tua formação real."
  },
  es: {
    title: "Educación Académica y Profesional",
    subtitle: "Gestiona tus títulos universitarios, certificados y cursos especializados.",
    addBtn: "Añadir Educación",
    completed: "Completado",
    inProgress: "En Progreso",
    emptyTitle: "Sin registros educativos aún",
    emptyDesc: "Añade tus títulos, diplomas o cursos técnicos para completar tu perfil de candidato.",
    formTitle: "Nuevo Registro Educativo",
    degreeLabel: "Título / Curso",
    institutionLabel: "Institución",
    metaLabel: "Período / Ubicación",
    typeLabel: "Certificación / Área",
    statusLabel: "Estado",
    cancelBtn: "Cancelar",
    saveBtn: "Guardar Registro",
    savingBtn: "Guardando...",
    deleteBtn: "Eliminar",
    sessionError: "Sesión no encontrada. Vuelve a iniciar sesión.",
    saveError: "No se pudo guardar el registro educativo: ",
    deleteError: "No se pudo eliminar el registro educativo: ",
    aiTipTitle: "Perspectiva de Educación IA SkillGap",
    aiTipText: "Mantén tus títulos y certificaciones al día para que el cálculo de coincidencia refleje tu formación real."
  },
  fr: {
    title: "Éducation Académique & Professionnelle",
    subtitle: "Gérez vos diplômes universitaires, certificats et cours spécialisés.",
    addBtn: "Ajouter une Éducation",
    completed: "Terminé",
    inProgress: "En Cours",
    emptyTitle: "Aucune formation enregistrée",
    emptyDesc: "Ajoutez vos diplômes, certificats ou formations techniques pour compléter votre profil.",
    formTitle: "Nouvelle Formation",
    degreeLabel: "Diplôme / Intitulé de la formation",
    institutionLabel: "Établissement",
    metaLabel: "Période / Lieu",
    typeLabel: "Certification / Domaine",
    statusLabel: "Statut",
    cancelBtn: "Annuler",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    deleteBtn: "Supprimer",
    sessionError: "Session introuvable. Veuillez vous reconnecter.",
    saveError: "Impossible d'enregistrer la formation : ",
    deleteError: "Impossible de supprimer la formation : ",
    aiTipTitle: "Aperçu de l'Éducation IA SkillGap",
    aiTipText: "Maintenez vos diplômes et certifications à jour afin que le score de correspondance reflète votre parcours réel."
  },
  de: {
    title: "Akademische & Berufliche Bildung",
    subtitle: "Verwalten Sie Ihre Universitätsabschlüsse, Zertifikate und Spezialkurse.",
    addBtn: "Bildung hinzufügen",
    completed: "Abgeschlossen",
    inProgress: "In Bearbeitung",
    emptyTitle: "Noch keine Bildungsdaten vorhanden",
    emptyDesc: "Fügen Sie Abschlüsse, Diplome oder Fachkurse hinzu, um Ihr Kandidatenprofil zu vervollständigen.",
    formTitle: "Neuer Bildungseintrag",
    degreeLabel: "Abschluss / Kursbezeichnung",
    institutionLabel: "Institution",
    metaLabel: "Zeitraum / Ort",
    typeLabel: "Zertifizierung / Bereich",
    statusLabel: "Status",
    cancelBtn: "Abbrechen",
    saveBtn: "Eintrag speichern",
    savingBtn: "Speichern...",
    deleteBtn: "Löschen",
    sessionError: "Sitzung nicht gefunden. Bitte erneut anmelden.",
    saveError: "Bildungseintrag konnte nicht gespeichert werden: ",
    deleteError: "Bildungseintrag konnte nicht gelöscht werden: ",
    aiTipTitle: "SkillGap KI-Bildungseinblick",
    aiTipText: "Halten Sie Abschlüsse und Zertifikate aktuell, damit die Matching-Bewertung Ihren tatsächlichen Hintergrund abbildet."
  },
  ar: {
    title: "التعليم الأكاديمي والمهني",
    subtitle: "أدر شهاداتك الجامعية واعتماداتك ودوراتك التخصصية.",
    addBtn: "إضافة تعليم",
    completed: "مكتمل",
    inProgress: "قيد التقدم",
    emptyTitle: "لا توجد سجلات تعليمية بعد",
    emptyDesc: "أضف شهاداتك أو دبلوماتك أو دوراتك التدريبية لإكمال ملفك الشخصي.",
    formTitle: "إدخال تعليم جديد",
    degreeLabel: "الدرجة العلمية / اسم الدورة",
    institutionLabel: "المؤسسة التعليمية",
    metaLabel: "الفترة / الموقع",
    typeLabel: "الشهادة / التخصص",
    statusLabel: "الحالة",
    cancelBtn: "إلغاء",
    saveBtn: "حفظ السجل",
    savingBtn: "جاري الحفظ...",
    deleteBtn: "حذف",
    sessionError: "لم يتم العثور على الجلسة. يرجى تسجيل الدخول مرة أخرى.",
    saveError: "تعذر حفظ سجل التعليم: ",
    deleteError: "تعذر حذف سجل التعليم: ",
    aiTipTitle: "رؤية التعليم بالذكاء الاصطناعي SkillGap",
    aiTipText: "حافظ على تحديث شهاداتك واعتماداتك ليعكس التطابق الوظيفي مؤهلاتك الفعلية."
  }
};

export default function CandidateEducationPage() {
  const { lang } = useDashboardLang();
  const ed = EDUCATION_TEXTS[lang] || EDUCATION_TEXTS['en'];

  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<EducationRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [meta, setMeta] = useState('');
  const [credentialType, setCredentialType] = useState('');
  const [status, setStatus] = useState<'completed' | 'in_progress'>('completed');

  const resolveUserId = useCallback(async (): Promise<string | null> => {
    if (userId) return userId;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user?.id) return null;
    setUserId(data.user.id);
    return data.user.id;
  }, [userId]);

  const loadEducation = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('candidate_education')
      .select('id, title, institution, period_or_location, credential_type, status')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(`${ed.saveError}${error.message}`);
      return;
    }

    if (Array.isArray(data)) {
      setItems(data as EducationRecord[]);
    }
  }, [ed.saveError]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (uid && active) {
        setUserId(uid);
        loadEducation(uid);
      }
    });
    return () => {
      active = false;
    };
  }, [loadEducation]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const uid = await resolveUserId();
    if (!uid) {
      setErrorMsg(ed.sessionError);
      return;
    }
    if (!title.trim() || !institution.trim()) return;

    setSaving(true);
    try {
      const cleanTitle = title.trim();
      const { data, error } = await supabase
        .from('candidate_education')
        .insert({
          user_id: uid,
          course_degree: cleanTitle,
          title: cleanTitle,
          institution: institution.trim(),
          period_or_location: meta.trim(),
          credential_type: credentialType.trim(),
          status,
        })
        .select('id, title, institution, period_or_location, credential_type, status')
        .single();

      if (error) {
        setErrorMsg(`${ed.saveError}${error.message}`);
        return;
      }

      if (data) {
        setItems((prev) => [data as EducationRecord, ...prev]);
        setTitle('');
        setInstitution('');
        setMeta('');
        setCredentialType('');
        setStatus('completed');
        setShowForm(false);
      }
    } catch (err: any) {
      setErrorMsg(`${ed.saveError}${err?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    const uid = await resolveUserId();
    if (!uid) {
      setErrorMsg(ed.sessionError);
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('candidate_education')
        .delete()
        .eq('id', id)
        .eq('user_id', uid);

      if (error) {
        setErrorMsg(`${ed.deleteError}${error.message}`);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setErrorMsg(`${ed.deleteError}${err?.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {ed.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{ed.subtitle}</p>
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
            <span>{showForm ? ed.cancelBtn : ed.addBtn}</span>
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
          <h2 className="text-base font-bold text-white">{ed.formTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ed.degreeLabel}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ed.institutionLabel}</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ed.metaLabel}</label>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ed.typeLabel}</label>
              <input
                type="text"
                value={credentialType}
                onChange={(e) => setCredentialType(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{ed.statusLabel}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'completed' | 'in_progress')}
                className="w-full bg-[#0c0716] border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="completed">{ed.completed}</option>
                <option value="in_progress">{ed.inProgress}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-xs text-gray-300 hover:text-white cursor-pointer"
            >
              {ed.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
            >
              {saving ? ed.savingBtn : ed.saveBtn}
            </button>
          </div>
        </form>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => {
            const isDone = item.status === 'completed';
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${
                      isDone
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-600/20'
                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20'
                    } flex items-center justify-center text-white shrink-0 shadow-lg`}
                  >
                    {isDone ? (
                      <GraduationCap className="w-6 h-6" />
                    ) : (
                      <BookOpen className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : 'bg-blue-950/60 border-blue-500/30 text-blue-400'
                      } border text-[10px] font-bold tracking-wider uppercase mb-1`}
                    >
                      {isDone ? ed.completed : ed.inProgress}
                    </span>
                    <h2 className="text-lg font-bold text-white">{item.title}</h2>
                    <p className="text-sm text-purple-300 font-medium mt-0.5">
                      {item.institution}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                      {item.period_or_location && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          <span>{item.period_or_location}</span>
                        </span>
                      )}
                      {item.credential_type && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.credential_type}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    aria-label={ed.deleteBtn}
                    title={ed.deleteBtn}
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{ed.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{ed.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{ed.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{ed.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}