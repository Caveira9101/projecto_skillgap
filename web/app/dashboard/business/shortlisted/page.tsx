'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, Trash2, User, MessageSquare, Send, X } from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface IndividualProfileRow {
  id: string;
  user_id?: string | null;
  full_name?: string | null;
  headline?: string | null;
  role?: string | null;
  location?: string | null;
  experience_years?: number | null;
  skills?: string[] | null;
}

interface ShortlistedRow {
  id: string;
  candidate_id: string;
  candidate_user_id: string;
  job_position_id: string | null;
  full_name: string;
  role: string;
  location: string;
  experience_years: number;
  skills: string[];
}

const SHORTLISTED_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    emptyState: string;
    removeBtn: string;
    messageBtn: string;
    years: string;
    candidateFallback: string;
    roleFallback: string;
    modalTitle: string;
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
    title: 'Shortlisted',
    subtitle: 'Review and manage candidates shortlisted for open positions in your Supabase database.',
    emptyState: 'No shortlisted candidates found in Supabase yet.',
    removeBtn: 'Remove',
    messageBtn: 'Message',
    years: 'years',
    candidateFallback: 'Candidate',
    roleFallback: 'Open to Opportunities',
    modalTitle: 'Send Direct Message',
    subjectPlaceholder: 'Subject (optional, e.g. Interview Invitation)',
    messagePlaceholder: 'Write a message to this candidate...',
    sendBtn: 'Send Message',
    sendingBtn: 'Sending...',
    sentSuccess: 'Message sent to candidate.',
    sendError: 'Could not send message. Check Supabase permissions for candidate_messages.',
    defaultRecruiterName: 'Recruiter'
  },
  pt: {
    title: 'Pré-Selecionados',
    subtitle: 'Revê e gere os candidatos pré-selecionados para vagas abertas na base de dados Supabase.',
    emptyState: 'Ainda não existem candidatos pré-selecionados no Supabase.',
    removeBtn: 'Remover',
    messageBtn: 'Mensagem',
    years: 'anos',
    candidateFallback: 'Candidato',
    roleFallback: 'Disponível para oportunidades',
    modalTitle: 'Enviar Mensagem Direta',
    subjectPlaceholder: 'Assunto (opcional, ex: Convite para Entrevista)',
    messagePlaceholder: 'Escreve uma mensagem para este candidato...',
    sendBtn: 'Enviar Mensagem',
    sendingBtn: 'A enviar...',
    sentSuccess: 'Mensagem enviada ao candidato.',
    sendError: 'Não foi possível enviar a mensagem. Verifica as permissões de candidate_messages no Supabase.',
    defaultRecruiterName: 'Recrutador'
  },
  es: {
    title: 'Preseleccionados',
    subtitle: 'Revisa y gestiona los candidatos preseleccionados para puestos abiertos en Supabase.',
    emptyState: 'Aún no hay candidatos preseleccionados en Supabase.',
    removeBtn: 'Eliminar',
    messageBtn: 'Mensaje',
    years: 'años',
    candidateFallback: 'Candidato',
    roleFallback: 'Disponible',
    modalTitle: 'Enviar Mensaje Directo',
    subjectPlaceholder: 'Asunto (opcional, ej: Invitación a Entrevista)',
    messagePlaceholder: 'Escribe un mensaje para este candidato...',
    sendBtn: 'Enviar Mensaje',
    sendingBtn: 'Enviando...',
    sentSuccess: 'Mensaje enviado al candidato.',
    sendError: 'No se pudo enviar el mensaje. Revisa los permisos de candidate_messages en Supabase.',
    defaultRecruiterName: 'Reclutador'
  },
  fr: {
    title: 'Présélectionnés',
    subtitle: 'Consultez et gérez les candidats présélectionnés pour vos postes ouverts dans Supabase.',
    emptyState: 'Aucun candidat présélectionné dans Supabase pour le moment.',
    removeBtn: 'Retirer',
    messageBtn: 'Message',
    years: 'ans',
    candidateFallback: 'Candidat',
    roleFallback: 'À l’écoute d’opportunités',
    modalTitle: 'Envoyer un Message Direct',
    subjectPlaceholder: 'Objet (optionnel, ex: Invitation à un entretien)',
    messagePlaceholder: 'Écrivez un message à ce candidat...',
    sendBtn: 'Envoyer le Message',
    sendingBtn: 'Envoi...',
    sentSuccess: 'Message envoyé au candidat.',
    sendError: "Impossible d'envoyer le message. Vérifiez les permissions de candidate_messages dans Supabase.",
    defaultRecruiterName: 'Recruteur'
  },
  de: {
    title: 'Auswahlliste',
    subtitle: 'Prüfen und verwalten Sie vorgemerkte Kandidaten für offene Stellen in Supabase.',
    emptyState: 'Noch keine vorgemerkten Kandidaten in Supabase vorhanden.',
    removeBtn: 'Entfernen',
    messageBtn: 'Nachricht',
    years: 'Jahre',
    candidateFallback: 'Kandidat',
    roleFallback: 'Offen für Stellen',
    modalTitle: 'Direktnachricht Senden',
    subjectPlaceholder: 'Betreff (optional, z.B. Einladung zum Gespräch)',
    messagePlaceholder: 'Schreiben Sie eine Nachricht an diesen Kandidaten...',
    sendBtn: 'Nachricht Senden',
    sendingBtn: 'Wird gesendet...',
    sentSuccess: 'Nachricht an Kandidaten gesendet.',
    sendError: 'Nachricht konnte nicht gesendet werden. Prüfen Sie die Rechte für candidate_messages in Supabase.',
    defaultRecruiterName: 'Recruiter'
  },
  ar: {
    title: 'القائمة المختصرة',
    subtitle: 'راجع وأدر المرشحين المدرجين في القائمة المختصرة للوظائف المفتوحة في Supabase.',
    emptyState: 'لا يوجد مرشحون في القائمة المختصرة في Supabase حتى الآن.',
    removeBtn: 'إزالة',
    messageBtn: 'رسالة',
    years: 'سنوات',
    candidateFallback: 'مرشح',
    roleFallback: 'متاح للفرص',
    modalTitle: 'إرسال رسالة مباشرة',
    subjectPlaceholder: 'الموضوع (اختياري، مثال: دعوة لمقابلة)',
    messagePlaceholder: 'اكتب رسالة لهذا المرشح...',
    sendBtn: 'إرسال الرسالة',
    sendingBtn: 'جاري الإرسال...',
    sentSuccess: 'تم إرسال الرسالة إلى المرشح.',
    sendError: 'تعذر إرسال الرسالة. تحقق من صلاحيات جدول candidate_messages في Supabase.',
    defaultRecruiterName: 'مسؤول التوظيف'
  }
};

export default function BusinessShortlistedPage() {
  const { lang, companyName } = useBusinessDashboardLang();
  const copy = SHORTLISTED_COPY[lang] || SHORTLISTED_COPY.en;
  const isRtl = lang === 'ar';

  const [items, setItems] = useState<ShortlistedRow[]>([]);
  const [targetCandidate, setTargetCandidate] = useState<ShortlistedRow | null>(null);
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    async function loadShortlisted() {
      if (!supabase) return;

      const { data: shortRows } = await supabase
        .from('shortlisted_candidates')
        .select('id,candidate_id,job_position_id');

      const list =
        (shortRows as { id: string; candidate_id: string; job_position_id: string | null }[]) || [];
      if (list.length === 0) {
        setItems([]);
        return;
      }

      const { data: profRows } = await supabase
        .from('individual_profiles')
        .select('*');

      const profileByKey = new Map<string, IndividualProfileRow>();
      ((profRows as IndividualProfileRow[]) || []).forEach((p) => {
        if (p.id) profileByKey.set(String(p.id), p);
        if (p.user_id) profileByKey.set(String(p.user_id), p);
      });

      const merged: ShortlistedRow[] = list.map((r) => {
        const key = String(r.candidate_id);
        const p = profileByKey.get(key);
        const resolvedUserId = String(p?.user_id || p?.id || r.candidate_id);

        return {
          id: r.id,
          candidate_id: r.candidate_id,
          candidate_user_id: resolvedUserId,
          job_position_id: r.job_position_id,
          full_name: p?.full_name?.trim() || copy.candidateFallback,
          role: p?.headline?.trim() || p?.role?.trim() || copy.roleFallback,
          location: p?.location?.trim() || '—',
          experience_years: Number(p?.experience_years ?? 0),
          skills: Array.isArray(p?.skills) ? p.skills : []
        };
      });

      setItems(merged);
    }

    loadShortlisted();
  }, [copy.candidateFallback, copy.roleFallback]);

  const handleRemove = async (rowId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== rowId));
    if (supabase) {
      await supabase.from('shortlisted_candidates').delete().eq('id', rowId);
    }
  };

  const openMessageModal = (item: ShortlistedRow) => {
    setTargetCandidate(item);
    setSubject('');
    setMessageText('');
    setFeedback(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCandidate || !messageText.trim() || !supabase || sending) return;

    setSending(true);
    setFeedback(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const recipientUserId = targetCandidate.candidate_user_id || targetCandidate.candidate_id;
      const senderUserId = authData?.user?.id || recipientUserId;

      const { error } = await supabase.from('candidate_messages').insert({
        candidate_user_id: recipientUserId,
        sender_user_id: senderUserId,
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
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">{item.full_name}</h2>
                      <p className="text-xs text-purple-300">{item.role}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-[11px] font-semibold text-purple-200">
                    <Bookmark className="w-3 h-3" />
                    {copy.title}
                  </span>
                </div>

                <p className="text-xs text-gray-400">
                  {item.location} • {item.experience_years} {copy.years}
                </p>

                {item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/25 text-[11px] text-purple-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openMessageModal(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-semibold text-white cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{copy.messageBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/35 hover:bg-red-950/60 border border-red-500/25 text-xs font-semibold text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{copy.removeBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {targetCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendMessage}
            className="w-full max-w-md rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-3 text-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{copy.modalTitle}</h3>
                <p className="text-purple-300">{targetCandidate.full_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setTargetCandidate(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
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
      )}
    </div>
  );
}