'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface InterviewRow {
  id: string;
  candidate_id: string | null;
  candidate_name: string;
  job_position_id: string | null;
  job_title: string;
  scheduled_at: string;
  interviewer: string;
  status: string;
}

interface SimpleCandidate {
  id: string;
  full_name: string;
  role: string;
}

interface SimpleJob {
  id: string;
  title: string;
}

const INTERVIEWS_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    scheduleBtn: string;
    emptyState: string;
    modalTitle: string;
    candidateLabel: string;
    jobLabel: string;
    dateLabel: string;
    interviewerLabel: string;
    saveBtn: string;
    cancelBtn: string;
    deleteBtn: string;
    generalRole: string;
    generalJob: string;
  }
> = {
  en: {
    title: 'Interviews',
    subtitle: 'Schedule and track candidate interviews synced with your Supabase database.',
    scheduleBtn: 'Schedule Interview',
    emptyState: 'No interviews scheduled in Supabase yet.',
    modalTitle: 'Schedule Interview',
    candidateLabel: 'Candidate',
    jobLabel: 'Job Position',
    dateLabel: 'Date & Time',
    interviewerLabel: 'Interviewer',
    saveBtn: 'Save Interview',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    generalRole: 'Candidate',
    generalJob: 'General Evaluation'
  },
  pt: {
    title: 'Entrevistas',
    subtitle: 'Agenda e acompanha as entrevistas com candidatos sincronizadas com o Supabase.',
    scheduleBtn: 'Agendar Entrevista',
    emptyState: 'Ainda não existem entrevistas agendadas no Supabase.',
    modalTitle: 'Agendar Entrevista',
    candidateLabel: 'Candidato',
    jobLabel: 'Vaga',
    dateLabel: 'Data e Hora',
    interviewerLabel: 'Entrevistador',
    saveBtn: 'Guardar Entrevista',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Eliminar',
    generalRole: 'Candidato',
    generalJob: 'Avaliação Geral'
  },
  es: {
    title: 'Entrevistas',
    subtitle: 'Programa y sigue las entrevistas con candidatos sincronizadas con Supabase.',
    scheduleBtn: 'Programar Entrevista',
    emptyState: 'Aún no hay entrevistas programadas en Supabase.',
    modalTitle: 'Programar Entrevista',
    candidateLabel: 'Candidato',
    jobLabel: 'Puesto',
    dateLabel: 'Fecha y Hora',
    interviewerLabel: 'Entrevistador',
    saveBtn: 'Guardar Entrevista',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Eliminar',
    generalRole: 'Candidato',
    generalJob: 'Evaluación General'
  },
  fr: {
    title: 'Entretiens',
    subtitle: 'Planifiez et suivez les entretiens candidats synchronisés avec Supabase.',
    scheduleBtn: 'Planifier un Entretien',
    emptyState: 'Aucun entretien planifié dans Supabase pour le moment.',
    modalTitle: 'Planifier un Entretien',
    candidateLabel: 'Candidat',
    jobLabel: 'Poste',
    dateLabel: 'Date et Heure',
    interviewerLabel: 'Recruteur / Interviewer',
    saveBtn: 'Enregistrer',
    cancelBtn: 'Annuler',
    deleteBtn: 'Supprimer',
    generalRole: 'Candidat',
    generalJob: 'Évaluation Générale'
  },
  de: {
    title: 'Interviews',
    subtitle: 'Planen und verfolgen Sie Kandidateninterviews aus Ihrer Supabase-Datenbank.',
    scheduleBtn: 'Interview Planen',
    emptyState: 'Noch keine Interviews in Supabase geplant.',
    modalTitle: 'Interview Planen',
    candidateLabel: 'Kandidat',
    jobLabel: 'Stellenposition',
    dateLabel: 'Datum & Uhrzeit',
    interviewerLabel: 'Interviewer',
    saveBtn: 'Interview Speichern',
    cancelBtn: 'Abbrechen',
    deleteBtn: 'Löschen',
    generalRole: 'Kandidat',
    generalJob: 'Allgemeine Prüfung'
  },
  ar: {
    title: 'المقابلات',
    subtitle: 'جدولة ومتابعة مقابلات المرشحين المتزامنة مع قاعدة بيانات Supabase.',
    scheduleBtn: 'جدولة مقابلة',
    emptyState: 'لا توجد مقابلات مجدولة في Supabase حتى الآن.',
    modalTitle: 'جدولة مقابلة',
    candidateLabel: 'المرشح',
    jobLabel: 'الوظيفة',
    dateLabel: 'التاريخ والوقت',
    interviewerLabel: 'المحاور',
    saveBtn: 'حفظ المقابلة',
    cancelBtn: 'إلغاء',
    deleteBtn: 'حذف',
    generalRole: 'مرشح',
    generalJob: 'تقييم عام'
  }
};

export default function BusinessInterviewsPage() {
  const { lang } = useBusinessDashboardLang();
  const copy = INTERVIEWS_COPY[lang] || INTERVIEWS_COPY.en;
  const isRtl = lang === 'ar';

  const [interviews, setInterviews] = useState<InterviewRow[]>([]);
  const [candidates, setCandidates] = useState<SimpleCandidate[]>([]);
  const [jobs, setJobs] = useState<SimpleJob[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [candidateId, setCandidateId] = useState('');
  const [jobId, setJobId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const [intRes, candRes, jobRes] = await Promise.all([
        supabase
          .from('interviews')
          .select('id,candidate_id,candidate_name,job_position_id,job_title,scheduled_at,interviewer,status')
          .order('scheduled_at', { ascending: true }),
        supabase.from('candidates').select('id,full_name,role'),
        supabase.from('job_positions').select('id,title')
      ]);

      const candList = (candRes.data as SimpleCandidate[]) || [];
      const jobList = (jobRes.data as SimpleJob[]) || [];

      setInterviews((intRes.data as InterviewRow[]) || []);
      setCandidates(candList);
      setJobs(jobList);

      if (candList[0]) setCandidateId(candList[0].id);
      if (jobList[0]) setJobId(jobList[0].id);
    }

    loadData();
  }, []);

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) return;
    setSaving(true);

    const chosenCandidate = candidates.find((c) => c.id === candidateId);
    const chosenJob = jobs.find((j) => j.id === jobId);

    const payload = {
      candidate_id: chosenCandidate?.id || null,
      candidate_name: chosenCandidate?.full_name || copy.generalRole,
      job_position_id: chosenJob?.id || null,
      job_title: chosenJob?.title || copy.generalJob,
      scheduled_at: scheduledAt,
      interviewer: interviewer.trim() || 'HR Team',
      status: 'scheduled'
    };

    try {
      if (supabase) {
        const { data } = await supabase
          .from('interviews')
          .insert(payload)
          .select('id,candidate_id,candidate_name,job_position_id,job_title,scheduled_at,interviewer,status')
          .single();

        if (data) {
          setInterviews((prev) => [...prev, data as InterviewRow]);
        }
      }

      setScheduledAt('');
      setInterviewer('');
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setInterviews((prev) => prev.filter((item) => item.id !== id));
    if (supabase) {
      await supabase.from('interviews').delete().eq('id', id);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-bold text-white transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{copy.scheduleBtn}</span>
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.emptyState}
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">{item.candidate_name}</h2>
                <p className="text-xs text-purple-300">{item.job_title}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {item.scheduled_at}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {item.interviewer}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/25 text-[11px] font-semibold text-purple-200">
                  {item.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/35 hover:bg-red-950/60 border border-red-500/25 text-xs font-semibold text-red-300 cursor-pointer"
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
            onSubmit={handleCreateInterview}
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
              <label className="text-gray-300 font-semibold">{copy.candidateLabel}</label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#080410]">
                    {c.full_name} ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.jobLabel}</label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-[#080410]">
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.dateLabel}</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.interviewerLabel}</label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none"
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
                {copy.saveBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}