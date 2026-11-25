'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Bookmark,
  MessageSquare,
  Send,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface IndividualProfileRow {
  id: string;
  user_id?: string | null;
  full_name?: string | null;
  headline?: string | null;
  bio?: string | null;
  role?: string | null;
  location?: string | null;
  experience_years?: number | null;
  education?: string | null;
  languages?: string[] | null;
  skills?: string[] | null;
}

interface CandidateRecord {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  location: string;
  experience_years: number;
  education: string;
  languages: string[];
  skills: string[];
  bio?: string;
}

const CANDIDATES_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    emptyState: string;
    years: string;
    viewProfile: string;
    shortlist: string;
    shortlisted: string;
    locationLabel: string;
    educationLabel: string;
    languagesLabel: string;
    bioLabel: string;
    candidateFallback: string;
    roleFallback: string;
    messageSectionTitle: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    sentSuccess: string;
    sendError: string;
    defaultRecruiterName: string;
  }
> = {
  en: {
    title: 'Candidates',
    subtitle: 'Browse and manage candidate profiles from individual_profiles in Supabase.',
    searchPlaceholder: 'Search by name, role, location, or skill...',
    emptyState: 'No candidate profiles found in individual_profiles.',
    years: 'years',
    viewProfile: 'View Profile',
    shortlist: 'Shortlist',
    shortlisted: 'Shortlisted',
    locationLabel: 'Location',
    educationLabel: 'Education',
    languagesLabel: 'Languages',
    bioLabel: 'Bio',
    candidateFallback: 'Candidate',
    roleFallback: 'Open to Opportunities',
    messageSectionTitle: 'Send Direct Message',
    subjectPlaceholder: 'Subject (optional, e.g. Interview Invitation)',
    messagePlaceholder: 'Write a message to this candidate...',
    sendBtn: 'Send Message',
    sendingBtn: 'Sending...',
    sentSuccess: 'Message sent to candidate.',
    sendError: 'Could not send message. Check Supabase table/policies for candidate_messages.',
    defaultRecruiterName: 'Recruiter'
  },
  pt: {
    title: 'Candidatos',
    subtitle: 'Consulta e gere os perfis de candidatos vindos de individual_profiles no Supabase.',
    searchPlaceholder: 'Pesquisar por nome, cargo, localização ou competência...',
    emptyState: 'Nenhum perfil de candidato encontrado em individual_profiles.',
    years: 'anos',
    viewProfile: 'Ver Perfil',
    shortlist: 'Pré-selecionar',
    shortlisted: 'Pré-selecionado',
    locationLabel: 'Localização',
    educationLabel: 'Formação',
    languagesLabel: 'Idiomas',
    bioLabel: 'Resumo',
    candidateFallback: 'Candidato',
    roleFallback: 'Disponível para oportunidades',
    messageSectionTitle: 'Enviar Mensagem Direta',
    subjectPlaceholder: 'Assunto (opcional, ex: Convite para Entrevista)',
    messagePlaceholder: 'Escreve uma mensagem para este candidato...',
    sendBtn: 'Enviar Mensagem',
    sendingBtn: 'A enviar...',
    sentSuccess: 'Mensagem enviada ao candidato.',
    sendError: 'Não foi possível enviar a mensagem. Verifica a tabela/políticas de candidate_messages no Supabase.',
    defaultRecruiterName: 'Recrutador'
  },
  es: {
    title: 'Candidatos',
    subtitle: 'Consulta y gestiona los perfiles desde individual_profiles en Supabase.',
    searchPlaceholder: 'Buscar por nombre, puesto, ubicación o habilidad...',
    emptyState: 'No se encontraron perfiles en individual_profiles.',
    years: 'años',
    viewProfile: 'Ver Perfil',
    shortlist: 'Preseleccionar',
    shortlisted: 'Preseleccionado',
    locationLabel: 'Ubicación',
    educationLabel: 'Educación',
    languagesLabel: 'Idiomas',
    bioLabel: 'Perfil',
    candidateFallback: 'Candidato',
    roleFallback: 'Disponible',
    messageSectionTitle: 'Enviar Mensaje Directo',
    subjectPlaceholder: 'Asunto (opcional, ej: Invitación a Entrevista)',
    messagePlaceholder: 'Escribe un mensaje para este candidato...',
    sendBtn: 'Enviar Mensaje',
    sendingBtn: 'Enviando...',
    sentSuccess: 'Mensaje enviado al candidato.',
    sendError: 'No se pudo enviar el mensaje. Revisa candidate_messages en Supabase.',
    defaultRecruiterName: 'Reclutador'
  },
  fr: {
    title: 'Candidats',
    subtitle: 'Consultez les profils depuis individual_profiles dans Supabase.',
    searchPlaceholder: 'Rechercher par nom, poste, lieu ou compétence...',
    emptyState: 'Aucun profil trouvé dans individual_profiles.',
    years: 'ans',
    viewProfile: 'Voir le Profil',
    shortlist: 'Présélectionner',
    shortlisted: 'Présélectionné',
    locationLabel: 'Localisation',
    educationLabel: 'Formation',
    languagesLabel: 'Langues',
    bioLabel: 'Bio',
    candidateFallback: 'Candidat',
    roleFallback: 'À l’écoute d’opportunités',
    messageSectionTitle: 'Envoyer un Message Direct',
    subjectPlaceholder: 'Objet (optionnel, ex: Invitation à un entretien)',
    messagePlaceholder: 'Écrivez un message à ce candidat...',
    sendBtn: 'Envoyer le Message',
    sendingBtn: 'Envoi...',
    sentSuccess: 'Message envoyé au candidat.',
    sendError: "Impossible d'envoyer le message. Vérifiez candidate_messages dans Supabase.",
    defaultRecruiterName: 'Recruteur'
  },
  de: {
    title: 'Kandidaten',
    subtitle: 'Profile aus individual_profiles in Supabase verwalten.',
    searchPlaceholder: 'Nach Name, Rolle, Standort oder Skill suchen...',
    emptyState: 'Keine Profile in individual_profiles gefunden.',
    years: 'Jahre',
    viewProfile: 'Profil Ansehen',
    shortlist: 'Vormerken',
    shortlisted: 'Vorgemerkt',
    locationLabel: 'Standort',
    educationLabel: 'Ausbildung',
    languagesLabel: 'Sprachen',
    bioLabel: 'Bio',
    candidateFallback: 'Kandidat',
    roleFallback: 'Offen für Stellen',
    messageSectionTitle: 'Direktnachricht Senden',
    subjectPlaceholder: 'Betreff (optional, z.B. Einladung zum Gespräch)',
    messagePlaceholder: 'Schreiben Sie eine Nachricht an diesen Kandidaten...',
    sendBtn: 'Nachricht Senden',
    sendingBtn: 'Wird gesendet...',
    sentSuccess: 'Nachricht an Kandidaten gesendet.',
    sendError: 'Nachricht konnte nicht gesendet werden. Prüfen Sie candidate_messages in Supabase.',
    defaultRecruiterName: 'Recruiter'
  },
  ar: {
    title: 'المرشحون',
    subtitle: 'استعرض ملفات المرشحين من individual_profiles في Supabase.',
    searchPlaceholder: 'ابحث بالاسم أو المسمى الوظيفي أو الموقع أو المهارة...',
    emptyState: 'لا توجد ملفات في individual_profiles.',
    years: 'سنوات',
    viewProfile: 'عرض الملف',
    shortlist: 'إضافة للقائمة المختصرة',
    shortlisted: 'في القائمة المختصرة',
    locationLabel: 'الموقع',
    educationLabel: 'التعليم',
    languagesLabel: 'اللغات',
    bioLabel: 'نبذة',
    candidateFallback: 'مرشح',
    roleFallback: 'متاح للفرص',
    messageSectionTitle: 'إرسال رسالة مباشرة',
    subjectPlaceholder: 'الموضوع (اختياري، مثال: دعوة لمقابلة)',
    messagePlaceholder: 'اكتب رسالة لهذا المرشح...',
    sendBtn: 'إرسال الرسالة',
    sendingBtn: 'جاري الإرسال...',
    sentSuccess: 'تم إرسال الرسالة إلى المرشح.',
    sendError: 'تعذر إرسال الرسالة. تحقق من جدول candidate_messages في Supabase.',
    defaultRecruiterName: 'مسؤول التوظيف'
  }
};

export default function BusinessCandidatesPage() {
  const { lang, companyName } = useBusinessDashboardLang();
  const copy = CANDIDATES_COPY[lang] || CANDIDATES_COPY.en;
  const isRtl = lang === 'ar';

  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);

  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;

      const [profRes, shortRes] = await Promise.all([
        supabase.from('individual_profiles').select('*'),
        supabase.from('shortlisted_candidates').select('candidate_id')
      ]);

      const rows = (profRes.data as IndividualProfileRow[]) || [];
      const mapped: CandidateRecord[] = rows.map((p) => {
        const uid = p.user_id || p.id;
        return {
          id: uid,
          user_id: uid,
          full_name: p.full_name?.trim() || copy.candidateFallback,
          role: p.headline?.trim() || p.role?.trim() || copy.roleFallback,
          location: p.location?.trim() || '—',
          experience_years: Number(p.experience_years ?? 0),
          education: p.education?.trim() || '—',
          languages: Array.isArray(p.languages) ? p.languages : [],
          skills: Array.isArray(p.skills) ? p.skills : [],
          bio: p.bio || undefined
        };
      });

      setCandidates(mapped);
      setShortlistedIds(
        ((shortRes.data as { candidate_id: string }[]) || []).map((r) => r.candidate_id)
      );
    }

    loadData();
  }, [copy.candidateFallback, copy.roleFallback]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) =>
      [
        c.full_name,
        c.role,
        c.location,
        c.education,
        c.bio || '',
        ...(c.languages || []),
        ...(c.skills || [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [candidates, searchTerm]);

  const toggleShortlist = async (candidateId: string) => {
    const exists = shortlistedIds.includes(candidateId);
    setShortlistedIds((prev) =>
      exists ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );

    if (supabase) {
      if (exists) {
        await supabase.from('shortlisted_candidates').delete().eq('candidate_id', candidateId);
      } else {
        await supabase.from('shortlisted_candidates').insert({ candidate_id: candidateId });
      }
    }
  };

  const openCandidateModal = (cand: CandidateRecord) => {
    setSelectedCandidate(cand);
    setSubject('');
    setMessageText('');
    setFeedback(null);
  };

  const handleSendMessageToCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !messageText.trim() || !supabase || sending) return;

    setSending(true);
    setFeedback(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const targetCandidateUserId = selectedCandidate.user_id || selectedCandidate.id;
      const senderId = authData?.user?.id || targetCandidateUserId;

      const { error } = await supabase.from('candidate_messages').insert({
        candidate_user_id: targetCandidateUserId,
        sender_user_id: senderId,
        sender_role: 'recruiter',
        sender_name: companyName || copy.defaultRecruiterName,
        subject: subject.trim() || null,
        message_text: messageText.trim(),
        is_read: false
      });

      if (error) throw error;

      setSubject('');
      setMessageText('');
      setFeedback({ type: 'ok', text: copy.sentSuccess });
    } catch {
      setFeedback({ type: 'err', text: copy.sendError });
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            className={`w-4 h-4 text-gray-400 top-1/2 -translate-y-1/2 absolute ${
              isRtl ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className={`w-full py-2.5 rounded-xl bg-[#0b0614] border border-purple-500/25 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 ${
              isRtl ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
            }`}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((cand) => {
            const saved = shortlistedIds.includes(cand.id);
            return (
              <div
                key={cand.id}
                className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">{cand.full_name}</h2>
                        <p className="text-xs text-purple-300">{cand.role}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(cand.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        saved
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{saved ? copy.shortlisted : copy.shortlist}</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400">
                    {cand.location} • {cand.experience_years} {copy.years}
                  </p>

                  {cand.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cand.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/25 text-[11px] text-purple-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex justify-end">
                  <button
                    type="button"
                    onClick={() => openCandidateModal(cand)}
                    className="px-3.5 py-2 rounded-lg bg-[#0d0718] border border-purple-500/45 text-xs font-semibold text-white hover:border-purple-400 cursor-pointer"
                  >
                    {copy.viewProfile}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCandidate.full_name}</h3>
                <p className="text-purple-300">{selectedCandidate.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 border-t border-white/[0.06] pt-3 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  <strong>{copy.locationLabel}:</strong> {selectedCandidate.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  <strong>{copy.educationLabel}:</strong> {selectedCandidate.education}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  <strong>{copy.languagesLabel}:</strong>{' '}
                  {selectedCandidate.languages.length > 0 ? selectedCandidate.languages.join(', ') : '—'}
                </span>
              </div>
              {selectedCandidate.bio && (
                <div className="flex items-start gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400 mt-0.5" />
                  <span>
                    <strong>{copy.bioLabel}:</strong> {selectedCandidate.bio}
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessageToCandidate}
              className="space-y-2.5 border-t border-white/[0.06] pt-3"
            >
              <div className="flex items-center gap-1.5 font-semibold text-purple-200">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>{copy.messageSectionTitle}</span>
              </div>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={copy.subjectPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-[#080410] border border-purple-500/25 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />

              <textarea
                rows={3}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={copy.messagePlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-[#080410] border border-purple-500/25 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
              />

              {feedback && (
                <p
                  className={
                    feedback.type === 'ok' ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'
                  }
                >
                  {feedback.text}
                </p>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? copy.sendingBtn : copy.sendBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}