'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  MapPin,
  Layers,
  Trash2,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface JobPositionItem {
  id: string;
  title: string;
  department: string;
  location: string;
  status: string;
  required_skills: string[];
}

const JOBS_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    newJobBtn: string;
    limitBadge: string;
    unlimitedLabel: string;
    emptyState: string;
    modalTitle: string;
    jobTitleLabel: string;
    departmentLabel: string;
    locationLabel: string;
    skillsLabel: string;
    skillsPlaceholder: string;
    createBtn: string;
    cancelBtn: string;
    deleteBtn: string;
    statusActive: string;
  }
> = {
  en: {
    title: 'Job Positions',
    subtitle: 'Create and manage active job openings synced with your Supabase database.',
    newJobBtn: 'New Job Position',
    limitBadge: 'Active jobs used:',
    unlimitedLabel: 'Unlimited',
    emptyState: 'No job positions registered in Supabase yet.',
    modalTitle: 'Create Job Position',
    jobTitleLabel: 'Job Title',
    departmentLabel: 'Department',
    locationLabel: 'Location',
    skillsLabel: 'Required Skills (comma-separated)',
    skillsPlaceholder: 'e.g. Sales, Account Management, English',
    createBtn: 'Publish Job Position',
    cancelBtn: 'Cancel',
    deleteBtn: 'Remove',
    statusActive: 'Active'
  },
  pt: {
    title: 'Vagas',
    subtitle: 'Cria e gere as vagas ativas sincronizadas com a tua base de dados Supabase.',
    newJobBtn: 'Nova Vaga',
    limitBadge: 'Vagas ativas utilizadas:',
    unlimitedLabel: 'Ilimitado',
    emptyState: 'Ainda não existem vagas registadas no Supabase.',
    modalTitle: 'Criar Nova Vaga',
    jobTitleLabel: 'Título da Vaga',
    departmentLabel: 'Departamento',
    locationLabel: 'Localização',
    skillsLabel: 'Competências Exigidas (separadas por vírgula)',
    skillsPlaceholder: 'ex: Vendas, Gestão de Conta, Inglês',
    createBtn: 'Publicar Vaga',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Remover',
    statusActive: 'Ativa'
  },
  es: {
    title: 'Puestos',
    subtitle: 'Crea y gestiona las vacantes activas sincronizadas con tu base de datos Supabase.',
    newJobBtn: 'Nuevo Puesto',
    limitBadge: 'Puestos activos usados:',
    unlimitedLabel: 'Ilimitado',
    emptyState: 'Aún no hay puestos registrados en Supabase.',
    modalTitle: 'Crear Nuevo Puesto',
    jobTitleLabel: 'Título del Puesto',
    departmentLabel: 'Departamento',
    locationLabel: 'Ubicación',
    skillsLabel: 'Habilidades Requeridas (separadas por coma)',
    skillsPlaceholder: 'ej: Ventas, Gestión de Cuentas, Inglés',
    createBtn: 'Publicar Puesto',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Eliminar',
    statusActive: 'Activo'
  },
  fr: {
    title: 'Postes',
    subtitle: 'Créez et gérez les offres actives synchronisées avec votre base de données Supabase.',
    newJobBtn: 'Nouveau Poste',
    limitBadge: 'Postes actifs utilisés :',
    unlimitedLabel: 'Illimité',
    emptyState: 'Aucun poste enregistré dans Supabase pour le moment.',
    modalTitle: 'Créer un Poste',
    jobTitleLabel: 'Intitulé du Poste',
    departmentLabel: 'Département',
    locationLabel: 'Localisation',
    skillsLabel: 'Compétences Requises (séparées par des virgules)',
    skillsPlaceholder: 'ex : Vente, Gestion de Compte, Anglais',
    createBtn: 'Publier le Poste',
    cancelBtn: 'Annuler',
    deleteBtn: 'Supprimer',
    statusActive: 'Actif'
  },
  de: {
    title: 'Stellenpositionen',
    subtitle: 'Erstellen und verwalten Sie aktive Stellenanzeigen aus Ihrer Supabase-Datenbank.',
    newJobBtn: 'Neue Stelle',
    limitBadge: 'Genutzte aktive Stellen:',
    unlimitedLabel: 'Unbegrenzt',
    emptyState: 'Noch keine Stellenpositionen in Supabase registriert.',
    modalTitle: 'Neue Stelle Erstellen',
    jobTitleLabel: 'Stellentitel',
    departmentLabel: 'Abteilung',
    locationLabel: 'Standort',
    skillsLabel: 'Erforderliche Skills (kommagetrennt)',
    skillsPlaceholder: 'z.B. Vertrieb, Account Management, Englisch',
    createBtn: 'Stelle Veröffentlichen',
    cancelBtn: 'Abbrechen',
    deleteBtn: 'Entfernen',
    statusActive: 'Aktiv'
  },
  ar: {
    title: 'الوظائف الشاغرة',
    subtitle: 'أنشئ وأدر الوظائف النشطة المتزامنة مع قاعدة بيانات Supabase.',
    newJobBtn: 'وظيفة جديدة',
    limitBadge: 'الوظائف النشطة المستخدمة:',
    unlimitedLabel: 'غير محدود',
    emptyState: 'لا توجد وظائف مسجلة في Supabase حتى الآن.',
    modalTitle: 'إنشاء وظيفة جديدة',
    jobTitleLabel: 'المسمى الوظيفي',
    departmentLabel: 'القسم',
    locationLabel: 'الموقع',
    skillsLabel: 'المهارات المطلوبة (مفصولة بفاصلة)',
    skillsPlaceholder: 'مثال: المبيعات، إدارة الحسابات، الإنجليزية',
    createBtn: 'نشر الوظيفة',
    cancelBtn: 'إلغاء',
    deleteBtn: 'حذف',
    statusActive: 'نشط'
  }
};

export default function BusinessJobPositionsPage() {
  const { lang } = useBusinessDashboardLang();
  const copy = JOBS_COPY[lang] || JOBS_COPY.en;
  const isRtl = lang === 'ar';

  const [jobs, setJobs] = useState<JobPositionItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      if (!supabase) return;
      const { data } = await supabase
        .from('job_positions')
        .select('id,title,department,location,status,required_skills');
      setJobs((data as JobPositionItem[]) || []);
    }

    loadJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('job_positions')
          .insert({
            title: title.trim(),
            department: department.trim() || 'General',
            location: location.trim() || 'Remote',
            status: 'active',
            required_skills: parsedSkills
          })
          .select('id,title,department,location,status,required_skills')
          .single();

        if (data) {
          setJobs((prev) => [data as JobPositionItem, ...prev]);
        }
      }

      setTitle('');
      setDepartment('');
      setLocation('');
      setSkillsInput('');
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (supabase) {
      await supabase.from('job_positions').delete().eq('id', id);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-2 rounded-xl bg-[#0b0614] border border-purple-500/25 text-xs text-gray-300">
            {copy.limitBadge}{' '}
            <strong className="text-white">
              {jobs.length} / {copy.unlimitedLabel}
            </strong>
          </span>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-bold text-white transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{copy.newJobBtn}</span>
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-purple-400" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/35 text-[11px] font-semibold text-emerald-300">
                    {copy.statusActive}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(job.required_skills || []).map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/25 text-[11px] text-purple-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/35 hover:bg-red-950/60 border border-red-500/25 text-xs font-semibold text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{copy.deleteBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateJob}
            className="w-full max-w-md rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{copy.modalTitle}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.jobTitleLabel}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.departmentLabel}</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.locationLabel}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.skillsLabel}</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder={copy.skillsPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold cursor-pointer"
              >
                {copy.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-bold cursor-pointer"
              >
                {copy.createBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}