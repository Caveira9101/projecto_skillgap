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
  X,
  FileText,
  ExternalLink,
  Phone,
  Home,
  Sparkles,
  CheckCircle2
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
  residence?: string | null;
  phone?: string | null;
  share_contact_permission?: boolean | null;
  availability?: string | null;
  visibility?: string | null;
  avatar_url?: string | null;
  experience_years?: number | null;
  education?: unknown;
  experience?: unknown;
  languages?: unknown;
  skills?: unknown;
}

interface CandidateEducationItem {
  id?: string;
  user_id?: string | null;
  course_degree?: string | null;
  title?: string | null;
  institution?: string | null;
  period_location?: string | null;
  period_or_location?: string | null;
  certification_area?: string | null;
  credential_type?: string | null;
  status?: string | null;
}

interface CandidateExperienceItem {
  id?: string;
  user_id?: string | null;
  role_title?: string | null;
  company_name?: string | null;
  organization?: string | null;
  period?: string | null;
  period_location?: string | null;
  responsibilities?: string | null;
  description?: string | null;
  is_current?: boolean | null;
}

interface CandidateDocumentItem {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  category?: string | null;
  uploaded_date?: string | null;
  status_label?: string | null;
}

interface CandidateRecord {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  location: string;
  residence: string;
  phone: string;
  share_contact_permission: boolean;
  availability: string;
  avatar_url: string;
  experience_years: number;
  educationSummary: string;
  educationList: CandidateEducationItem[];
  experienceList: CandidateExperienceItem[];
  documentsList: CandidateDocumentItem[];
  languages: string[];
  skills: string[];
  bio?: string;
}

function normalizeStringArray(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          return String(obj.name ?? obj.label ?? obj.title ?? obj.skill ?? obj.language ?? '').trim();
        }
        return '';
      })
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      return normalizeStringArray(JSON.parse(trimmed));
    } catch {
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  if (typeof raw === 'object') {
    return Object.values(raw as Record<string, unknown>)
      .map((v) => String(v ?? '').trim())
      .filter(Boolean);
  }
  return [];
}

function parseJsonArray<T>(raw: unknown): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
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
    residenceLabel: string;
    availabilityLabel: string;
    phoneLabel: string;
    educationLabel: string;
    experienceLabel: string;
    skillsLabel: string;
    documentsLabel: string;
    languagesLabel: string;
    bioLabel: string;
    currentRoleBadge: string;
    openDocument: string;
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
    subtitle: 'Browse and manage detailed candidate profiles from Supabase.',
    searchPlaceholder: 'Search by name, role, location, education, or skill...',
    emptyState: 'No candidate profiles found in individual_profiles.',
    years: 'years',
    viewProfile: 'View Profile',
    shortlist: 'Shortlist',
    shortlisted: 'Shortlisted',
    locationLabel: 'Location',
    residenceLabel: 'Residence',
    availabilityLabel: 'Availability',
    phoneLabel: 'Phone',
    educationLabel: 'Education',
    experienceLabel: 'Experience',
    skillsLabel: 'Skills',
    documentsLabel: 'Documents & CV',
    languagesLabel: 'Languages',
    bioLabel: 'Summary / Bio',
    currentRoleBadge: 'Current',
    openDocument: 'Open',
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
    subtitle: 'Consulta e gere os perfis detalhados dos candidatos no Supabase.',
    searchPlaceholder: 'Pesquisar por nome, cargo, localização, formação ou competência...',
    emptyState: 'Nenhum perfil de candidato encontrado em individual_profiles.',
    years: 'anos',
    viewProfile: 'Ver Perfil',
    shortlist: 'Pré-selecionar',
    shortlisted: 'Pré-selecionado',
    locationLabel: 'Localização',
    residenceLabel: 'Residência',
    availabilityLabel: 'Disponibilidade',
    phoneLabel: 'Telefone',
    educationLabel: 'Formação Académica',
    experienceLabel: 'Experiência Profissional',
    skillsLabel: 'Competências',
    documentsLabel: 'Documentos e CV',
    languagesLabel: 'Idiomas',
    bioLabel: 'Resumo / Bio',
    currentRoleBadge: 'Atual',
    openDocument: 'Abrir',
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
    subtitle: 'Consulta y gestiona perfiles detallados de candidatos en Supabase.',
    searchPlaceholder: 'Buscar por nombre, puesto, ubicación, formación o habilidad...',
    emptyState: 'No se encontraron perfiles en individual_profiles.',
    years: 'años',
    viewProfile: 'Ver Perfil',
    shortlist: 'Preseleccionar',
    shortlisted: 'Preseleccionado',
    locationLabel: 'Ubicación',
    residenceLabel: 'Residencia',
    availabilityLabel: 'Disponibilidad',
    phoneLabel: 'Teléfono',
    educationLabel: 'Educación',
    experienceLabel: 'Experiencia',
    skillsLabel: 'Habilidades',
    documentsLabel: 'Documentos y CV',
    languagesLabel: 'Idiomas',
    bioLabel: 'Resumen / Bio',
    currentRoleBadge: 'Actual',
    openDocument: 'Abrir',
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
    subtitle: 'Consultez et gérez les profils détaillés des candidats dans Supabase.',
    searchPlaceholder: 'Rechercher par nom, poste, lieu, formation ou compétence...',
    emptyState: 'Aucun profil trouvé dans individual_profiles.',
    years: 'ans',
    viewProfile: 'Voir le Profil',
    shortlist: 'Présélectionner',
    shortlisted: 'Présélectionné',
    locationLabel: 'Localisation',
    residenceLabel: 'Résidence',
    availabilityLabel: 'Disponibilité',
    phoneLabel: 'Téléphone',
    educationLabel: 'Formation',
    experienceLabel: 'Expérience',
    skillsLabel: 'Compétences',
    documentsLabel: 'Documents et CV',
    languagesLabel: 'Langues',
    bioLabel: 'Résumé / Bio',
    currentRoleBadge: 'Actuel',
    openDocument: 'Ouvrir',
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
    subtitle: 'Detaillierte Kandidatenprofile aus Supabase einsehen und verwalten.',
    searchPlaceholder: 'Nach Name, Rolle, Standort, Ausbildung oder Skill suchen...',
    emptyState: 'Keine Profile in individual_profiles gefunden.',
    years: 'Jahre',
    viewProfile: 'Profil Ansehen',
    shortlist: 'Vormerken',
    shortlisted: 'Vorgemerkt',
    locationLabel: 'Standort',
    residenceLabel: 'Wohnort',
    availabilityLabel: 'Verfügbarkeit',
    phoneLabel: 'Telefon',
    educationLabel: 'Ausbildung',
    experienceLabel: 'Erfahrung',
    skillsLabel: 'Fähigkeiten',
    documentsLabel: 'Dokumente & Lebenslauf',
    languagesLabel: 'Sprachen',
    bioLabel: 'Kurzprofil / Bio',
    currentRoleBadge: 'Aktuell',
    openDocument: 'Öffnen',
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
    subtitle: 'استعرض وأدر ملفات المرشحين التفصيلية من Supabase.',
    searchPlaceholder: 'ابحث بالاسم أو المسمى الوظيفي أو الموقع أو التعليم أو المهارة...',
    emptyState: 'لا توجد ملفات في individual_profiles.',
    years: 'سنوات',
    viewProfile: 'عرض الملف',
    shortlist: 'إضافة للقائمة المختصرة',
    shortlisted: 'في القائمة المختصرة',
    locationLabel: 'الموقع',
    residenceLabel: 'السكن',
    availabilityLabel: 'التوفر',
    phoneLabel: 'الهاتف',
    educationLabel: 'التعليم',
    experienceLabel: 'الخبرة العملية',
    skillsLabel: 'المهارات',
    documentsLabel: 'المستندات والسيرة الذاتية',
    languagesLabel: 'اللغات',
    bioLabel: 'نبذة',
    currentRoleBadge: 'الحالي',
    openDocument: 'فتح',
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
    let active = true;

    async function loadData() {
      if (!supabase) return;

      const [profRes, shortRes, eduRes, expRes, docRes] = await Promise.all([
        supabase.from('individual_profiles').select('*'),
        supabase.from('shortlisted_candidates').select('candidate_id'),
        supabase.from('candidate_education').select('*'),
        supabase.from('candidate_experience').select('*'),
        supabase.from('candidate_documents').select('*')
      ]);

      if (!active) return;

      const rows = (profRes.data as IndividualProfileRow[]) || [];
      const eduRows = (eduRes.data as CandidateEducationItem[]) || [];
      const expRows = (expRes.data as CandidateExperienceItem[]) || [];
      const docRows = (docRes.data as CandidateDocumentItem[]) || [];

      const eduByUser = new Map<string, CandidateEducationItem[]>();
      for (const item of eduRows) {
        if (!item.user_id) continue;
        const list = eduByUser.get(item.user_id) || [];
        list.push(item);
        eduByUser.set(item.user_id, list);
      }

      const expByUser = new Map<string, CandidateExperienceItem[]>();
      for (const item of expRows) {
        if (!item.user_id) continue;
        const list = expByUser.get(item.user_id) || [];
        list.push(item);
        expByUser.set(item.user_id, list);
      }

      const docByUser = new Map<string, CandidateDocumentItem[]>();
      for (const item of docRows) {
        if (!item.user_id) continue;
        const list = docByUser.get(item.user_id) || [];
        list.push(item);
        docByUser.set(item.user_id, list);
      }

      const mapped: CandidateRecord[] = rows.map((p) => {
        const uid = p.user_id || p.id;
        const fromEduTable = eduByUser.get(uid) || [];
        const fallbackEdu = parseJsonArray<CandidateEducationItem>(p.education);
        const educationList = fromEduTable.length > 0 ? fromEduTable : fallbackEdu;

        const fromExpTable = expByUser.get(uid) || [];
        const fallbackExp = parseJsonArray<CandidateExperienceItem>(p.experience);
        const experienceList = fromExpTable.length > 0 ? fromExpTable : fallbackExp;

        const documentsList = docByUser.get(uid) || [];
        const languages = normalizeStringArray(p.languages);
        const skills = normalizeStringArray(p.skills);

        const firstEdu = educationList[0];
        const educationSummary = firstEdu
          ? [firstEdu.course_degree || firstEdu.title, firstEdu.institution]
              .filter(Boolean)
              .join(' — ') || '—'
          : typeof p.education === 'string' && p.education.trim()
            ? p.education.trim()
            : '—';

        const computedYears =
          Number(p.experience_years ?? 0) > 0
            ? Number(p.experience_years)
            : experienceList.length;

        return {
          id: uid,
          user_id: uid,
          full_name: p.full_name?.trim() || copy.candidateFallback,
          role: p.headline?.trim() || p.role?.trim() || copy.roleFallback,
          location: p.location?.trim() || '—',
          residence: p.residence?.trim() || '—',
          phone: p.phone?.trim() || '',
          share_contact_permission: Boolean(p.share_contact_permission),
          availability: p.availability?.trim() || '—',
          avatar_url: p.avatar_url?.trim() || '',
          experience_years: computedYears,
          educationSummary,
          educationList,
          experienceList,
          documentsList,
          languages,
          skills,
          bio: p.bio?.trim() || undefined
        };
      });

      setCandidates(mapped);
      setShortlistedIds(
        ((shortRes.data as { candidate_id: string }[]) || []).map((r) => r.candidate_id)
      );
    }

    loadData();
    return () => {
      active = false;
    };
  }, [copy.candidateFallback, copy.roleFallback]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => {
      const eduText = c.educationList
        .flatMap((e) => [e.course_degree, e.title, e.institution, e.certification_area, e.credential_type])
        .filter(Boolean);
      const expText = c.experienceList
        .flatMap((e) => [e.role_title, e.company_name, e.organization, e.description, e.responsibilities])
        .filter(Boolean);
      return [
        c.full_name,
        c.role,
        c.location,
        c.residence,
        c.availability,
        c.educationSummary,
        c.bio || '',
        ...eduText,
        ...expText,
        ...c.languages,
        ...c.skills
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
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
                    <div className="flex items-center gap-3 min-w-0">
                      {cand.avatar_url ? (
                        <img
                          src={cand.avatar_url}
                          alt={cand.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500/30 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-white truncate">{cand.full_name}</h2>
                        <p className="text-xs text-purple-300 truncate">{cand.role}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(cand.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
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
                    {cand.location} • {cand.experience_years} {copy.years} • {cand.availability}
                  </p>

                  {cand.educationSummary !== '—' && (
                    <p className="text-xs text-gray-300 truncate">
                      <span className="text-gray-400">{copy.educationLabel}: </span>
                      {cand.educationSummary}
                    </p>
                  )}

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
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-5 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedCandidate.avatar_url ? (
                  <img
                    src={selectedCandidate.avatar_url}
                    alt={selectedCandidate.full_name}
                    className="w-12 h-12 rounded-full object-cover border border-purple-500/35 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1a0d33] border border-purple-500/35 flex items-center justify-center text-purple-300 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCandidate.full_name}</h3>
                  <p className="text-purple-300">{selectedCandidate.role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-3 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  <strong>{copy.locationLabel}:</strong> {selectedCandidate.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  <strong>{copy.residenceLabel}:</strong> {selectedCandidate.residence}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  <strong>{copy.availabilityLabel}:</strong> {selectedCandidate.availability}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  <strong>{copy.languagesLabel}:</strong>{' '}
                  {selectedCandidate.languages.length > 0
                    ? selectedCandidate.languages.join(', ')
                    : '—'}
                </span>
              </div>
              {selectedCandidate.share_contact_permission && selectedCandidate.phone && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>
                    <strong>{copy.phoneLabel}:</strong> {selectedCandidate.phone}
                  </span>
                </div>
              )}
            </div>

            {selectedCandidate.bio && (
              <div className="space-y-1 border-t border-white/[0.06] pt-3">
                <p className="font-semibold text-white">{copy.bioLabel}</p>
                <p className="text-gray-300 leading-relaxed">{selectedCandidate.bio}</p>
              </div>
            )}

            <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{copy.skillsLabel}</span>
              </div>
              {selectedCandidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/25 text-purple-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">—</p>
              )}
            </div>

            <div className="space-y-2 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>{copy.experienceLabel}</span>
              </div>
              {selectedCandidate.experienceList.length > 0 ? (
                <div className="space-y-2">
                  {selectedCandidate.experienceList.map((exp, idx) => {
                    const company = exp.company_name || exp.organization;
                    const periodInfo = exp.period_location || exp.period;
                    const details = exp.description || exp.responsibilities;
                    return (
                      <div
                        key={exp.id || idx}
                        className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-white">
                            {exp.role_title || copy.roleFallback}
                          </span>
                          {exp.is_current && (
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/35 text-emerald-300 text-[10px]">
                              {copy.currentRoleBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-purple-300">
                          {[company, periodInfo].filter(Boolean).join(' • ') || '—'}
                        </p>
                        {details && <p className="text-gray-300 leading-relaxed">{details}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400">—</p>
              )}
            </div>

            <div className="space-y-2 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>{copy.educationLabel}</span>
              </div>
              {selectedCandidate.educationList.length > 0 ? (
                <div className="space-y-2">
                  {selectedCandidate.educationList.map((edu, idx) => {
                    const degree = edu.course_degree || edu.title;
                    const periodLoc = edu.period_or_location || edu.period_location;
                    const extra = [edu.credential_type, edu.certification_area, periodLoc, edu.status]
                      .filter(Boolean)
                      .join(' • ');
                    return (
                      <div
                        key={edu.id || idx}
                        className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] space-y-1"
                      >
                        <p className="font-bold text-white">{degree || '—'}</p>
                        <p className="text-purple-300">{edu.institution || '—'}</p>
                        {extra && <p className="text-gray-400">{extra}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-300">{selectedCandidate.educationSummary}</p>
              )}
            </div>

            {selectedCandidate.documentsList.length > 0 && (
              <div className="space-y-2 border-t border-white/[0.06] pt-3">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>{copy.documentsLabel}</span>
                </div>
                <div className="space-y-1.5">
                  {selectedCandidate.documentsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">
                          {doc.file_name} {doc.category ? `(${doc.category})` : ''}
                        </p>
                        <p className="text-gray-400">
                          {[doc.status_label, doc.uploaded_date].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/30 border border-purple-400/35 text-purple-200 hover:text-white shrink-0"
                        >
                          <span>{copy.openDocument}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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