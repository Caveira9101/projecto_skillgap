'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  MailOpen,
  Sparkles,
  MessageSquare,
  Send,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at?: string;
}

interface ChatMessageItem {
  id: string;
  candidate_user_id: string;
  sender_user_id: string;
  sender_role: 'recruiter' | 'candidate';
  sender_name: string;
  subject: string | null;
  message_text: string;
  is_read: boolean;
  created_at?: string;
  edited?: boolean;
}

interface ContextMenuState {
  messageId: string;
  x: number;
  y: number;
}

const MESSAGES_TEXTS: Record<string, any> = {
  en: {
    title: "Messages & Notifications",
    subtitle: "Chat directly with recruiters and track application updates and platform alerts.",
    markAllReadBtn: "Mark All as Read",
    refreshBtn: "Refresh",
    unreadBadge: "Unread",
    readBadge: "Read",
    markReadBtn: "Mark as Read",
    chatSectionTitle: "Recruiter Conversations",
    chatSectionSubtitle: "Direct messages between recruiters and you, stored in Supabase.",
    recruiterBadge: "Recruiter",
    youBadge: "You",
    editedBadge: "Edited",
    contextHint: "Click a sent message and right-click to edit or delete.",
    editOption: "Edit Message",
    deleteOption: "Delete Message",
    saveEditBtn: "Save Edit",
    cancelEditBtn: "Cancel",
    replyPlaceholder: "Write a reply to the recruiter...",
    sendReplyBtn: "Send Message",
    sendingBtn: "Sending...",
    emptyChatTitle: "No recruiter conversations yet",
    emptyChatDesc: "When a recruiter reaches out to you, your conversation history and replies will appear here.",
    notificationsSectionTitle: "Notifications & Alerts",
    emptyTitle: "No messages or notifications yet",
    emptyDesc: "Updates regarding your profile, applications, and company activity will appear here.",
    aiTipTitle: "SkillGap Notification & Chat Center",
    aiTipText: "Reply promptly to recruiters and check notifications regularly so you do not miss interview invitations.",
    sendError: "Could not send message. Please check your connection or Supabase table permissions.",
    updateError: "Could not update message in Supabase.",
    deleteError: "Could not delete message from Supabase."
  },
  pt: {
    title: "Mensagens & Notificações",
    subtitle: "Conversa diretamente com recrutadores e acompanha atualizações de candidaturas e alertas.",
    markAllReadBtn: "Marcar Todas como Lidas",
    refreshBtn: "Atualizar",
    unreadBadge: "Por Ler",
    readBadge: "Lida",
    markReadBtn: "Marcar como Lida",
    chatSectionTitle: "Conversas com Recrutadores",
    chatSectionSubtitle: "Mensagens diretas entre recrutadores e o teu perfil, guardadas no Supabase.",
    recruiterBadge: "Recrutador",
    youBadge: "Tu",
    editedBadge: "Editada",
    contextHint: "Clica numa mensagem enviada e clica com o botão direito para editar ou apagar.",
    editOption: "Editar Mensagem",
    deleteOption: "Apagar Mensagem",
    saveEditBtn: "Guardar Edição",
    cancelEditBtn: "Cancelar",
    replyPlaceholder: "Escreve uma resposta para o recrutador...",
    sendReplyBtn: "Enviar Mensagem",
    sendingBtn: "A enviar...",
    emptyChatTitle: "Ainda sem conversas com recrutadores",
    emptyChatDesc: "Quando um recrutador entrar em contacto contigo, o histórico da conversa e as tuas respostas aparecerão aqui.",
    notificationsSectionTitle: "Notificações & Alertas",
    emptyTitle: "Ainda sem mensagens ou notificações",
    emptyDesc: "As novidades sobre o teu perfil, candidaturas e atividade de empresas aparecerão aqui.",
    aiTipTitle: "Centro de Mensagens e Notificações SkillGap",
    aiTipText: "Responde aos recrutadores e consulta as notificações com frequência para não perderes convites de entrevista.",
    sendError: "Não foi possível enviar a mensagem. Verifica a ligação ou as políticas da tabela no Supabase.",
    updateError: "Não foi possível editar a mensagem no Supabase.",
    deleteError: "Não foi possível apagar a mensagem no Supabase."
  },
  es: {
    title: "Mensajes y Notificaciones",
    subtitle: "Chatea directamente con reclutadores y sigue novedades de postulaciones y avisos.",
    markAllReadBtn: "Marcar Todas como Leídas",
    refreshBtn: "Actualizar",
    unreadBadge: "No Leída",
    readBadge: "Leída",
    markReadBtn: "Marcar como Leída",
    chatSectionTitle: "Conversaciones con Reclutadores",
    chatSectionSubtitle: "Mensajes directos entre reclutadores y tú, guardados en Supabase.",
    recruiterBadge: "Reclutador",
    youBadge: "Tú",
    editedBadge: "Editado",
    contextHint: "Haz clic en un mensaje enviado y clic derecho para editar o eliminar.",
    editOption: "Editar Mensaje",
    deleteOption: "Eliminar Mensaje",
    saveEditBtn: "Guardar Cambio",
    cancelEditBtn: "Cancelar",
    replyPlaceholder: "Escribe una respuesta para el reclutador...",
    sendReplyBtn: "Enviar Mensaje",
    sendingBtn: "Enviando...",
    emptyChatTitle: "Aún no hay conversaciones con reclutadores",
    emptyChatDesc: "Cuando un reclutador se ponga en contacto contigo, el chat y tus respuestas aparecerán aquí.",
    notificationsSectionTitle: "Notificaciones y Avisos",
    emptyTitle: "Aún no hay mensajes ni notificaciones",
    emptyDesc: "Aquí aparecerán las novedades de tu perfil, postulaciones y actividad de empresas.",
    aiTipTitle: "Centro de Mensajes y Notificaciones SkillGap",
    aiTipText: "Responde a los reclutadores y revisa tus notificaciones con regularidad para no perder invitaciones.",
    sendError: "No se pudo enviar el mensaje. Revisa la conexión o los permisos de Supabase.",
    updateError: "No se pudo actualizar el mensaje en Supabase.",
    deleteError: "No se pudo eliminar el mensaje en Supabase."
  },
  fr: {
    title: "Messages & Notifications",
    subtitle: "Échangez directement avec les recruteurs et suivez vos candidatures et alertes.",
    markAllReadBtn: "Tout Marquer comme Lu",
    refreshBtn: "Actualiser",
    unreadBadge: "Non Lu",
    readBadge: "Lu",
    markReadBtn: "Marquer comme Lu",
    chatSectionTitle: "Conversations avec les Recruteurs",
    chatSectionSubtitle: "Messages directs entre les recruteurs et vous, enregistrés dans Supabase.",
    recruiterBadge: "Recruteur",
    youBadge: "Vous",
    editedBadge: "Modifié",
    contextHint: "Cliquez sur un message envoyé puis clic droit pour modifier ou supprimer.",
    editOption: "Modifier le Message",
    deleteOption: "Supprimer le Message",
    saveEditBtn: "Enregistrer",
    cancelEditBtn: "Annuler",
    replyPlaceholder: "Écrivez une réponse au recruteur...",
    sendReplyBtn: "Envoyer le Message",
    sendingBtn: "Envoi...",
    emptyChatTitle: "Aucune conversation avec un recruteur pour l'instant",
    emptyChatDesc: "Lorsqu'un recruteur vous contacte, l'historique des échanges et vos réponses s'afficheront ici.",
    notificationsSectionTitle: "Notifications & Alertes",
    emptyTitle: "Aucun message ou notification pour l'instant",
    emptyDesc: "Les alertes liées à votre profil, vos candidatures et les entreprises s'afficheront ici.",
    aiTipTitle: "Centre de Messagerie et Notifications SkillGap",
    aiTipText: "Répondez rapidement aux recruteurs et consultez vos notifications pour ne manquer aucune invitation.",
    sendError: "Impossible d'envoyer le message. Vérifiez la connexion ou les règles Supabase.",
    updateError: "Impossible de modifier le message dans Supabase.",
    deleteError: "Impossible de supprimer le message dans Supabase."
  },
  de: {
    title: "Nachrichten & Benachrichtigungen",
    subtitle: "Chatten Sie direkt mit Recruitern und verfolgen Sie Bewerbungsupdates und Hinweise.",
    markAllReadBtn: "Alle als gelesen markieren",
    refreshBtn: "Aktualisieren",
    unreadBadge: "Ungelesen",
    readBadge: "Gelesen",
    markReadBtn: "Als gelesen markieren",
    chatSectionTitle: "Unterhaltungen mit Recruitern",
    chatSectionSubtitle: "Direktnachrichten zwischen Recruitern und Ihnen, gespeichert in Supabase.",
    recruiterBadge: "Recruiter",
    youBadge: "Sie",
    editedBadge: "Bearbeitet",
    contextHint: "Klicken Sie auf eine gesendete Nachricht und machen Sie einen Rechtsklick zum Bearbeiten oder Löschen.",
    editOption: "Nachricht bearbeiten",
    deleteOption: "Nachricht löschen",
    saveEditBtn: "Änderung speichern",
    cancelEditBtn: "Abbrechen",
    replyPlaceholder: "Antwort an den Recruiter schreiben...",
    sendReplyBtn: "Nachricht senden",
    sendingBtn: "Wird gesendet...",
    emptyChatTitle: "Noch keine Unterhaltungen mit Recruitern",
    emptyChatDesc: "Sobald ein Recruiter Kontakt aufnimmt, erscheinen Verlauf und Antworten hier.",
    notificationsSectionTitle: "Benachrichtigungen & Hinweise",
    emptyTitle: "Noch keine Nachrichten oder Benachrichtigungen",
    emptyDesc: "Hinweise zu Ihrem Profil, Ihren Bewerbungen und Unternehmensaktivitäten erscheinen hier.",
    aiTipTitle: "SkillGap Nachrichten- & Benachrichtigungscenter",
    aiTipText: "Antworten Sie Recruitern zeitnah und prüfen Sie Benachrichtigungen regelmäßig.",
    sendError: "Nachricht konnte nicht gesendet werden. Prüfen Sie Verbindung oder Supabase-Rechte.",
    updateError: "Nachricht konnte in Supabase nicht aktualisiert werden.",
    deleteError: "Nachricht konnte in Supabase nicht gelöscht werden."
  },
  ar: {
    title: "الرسائل والإشعارات",
    subtitle: "تواصل مباشرة مع مسؤولي التوظيف وتابع تحديثات طلبات التوظيف والتنبيهات.",
    markAllReadBtn: "تحديد الكل كمقروء",
    refreshBtn: "تحديث",
    unreadBadge: "غير مقروء",
    readBadge: "مقروء",
    markReadBtn: "تحديد كمقروء",
    chatSectionTitle: "المحادثات مع مسؤولي التوظيف",
    chatSectionSubtitle: "رسائل مباشرة بين مسؤولي التوظيف وحسابك محفوظة في Supabase.",
    recruiterBadge: "مسؤول توظيف",
    youBadge: "أنت",
    editedBadge: "معدّلة",
    contextHint: "انقر على رسالة أرسلتها ثم انقر بالزر الأيمن للتعديل أو الحذف.",
    editOption: "تعديل الرسالة",
    deleteOption: "حذف الرسالة",
    saveEditBtn: "حفظ التعديل",
    cancelEditBtn: "إلغاء",
    replyPlaceholder: "اكتب رداً لمسؤول التوظيف...",
    sendReplyBtn: "إرسال الرسالة",
    sendingBtn: "جاري الإرسال...",
    emptyChatTitle: "لا توجد محادثات مع مسؤولي التوظيف بعد",
    emptyChatDesc: "عندما يتواصل معك مسؤول توظيف ستظهر المحادثة وردودك هنا.",
    notificationsSectionTitle: "الإشعارات والتنبيهات",
    emptyTitle: "لا توجد رسائل أو إشعارات بعد",
    emptyDesc: "ستظهر هنا التحديثات المتعلقة بملفك الشخصي وطلبات التوظيف ونشاط الشركات.",
    aiTipTitle: "مركز الرسائل والإشعارات SkillGap",
    aiTipText: "ردّ على مسؤولي التوظيف وتابع الإشعارات باستمرار حتى لا تفوتك دعوات المقابلات.",
    sendError: "تعذر إرسال الرسالة. تحقق من الاتصال أو صلاحيات الجدول في Supabase.",
    updateError: "تعذر تحديث الرسالة في Supabase.",
    deleteError: "تعذر حذف الرسالة من Supabase."
  }
};

export default function CandidateMessagesPage() {
  const { lang, candidate, refreshCandidate } = useDashboardLang();
  const msgT = MESSAGES_TEXTS[lang] || MESSAGES_TEXTS['en'];
  const isRtl = lang === 'ar';

  const [userId, setUserId] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string>('Candidate');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const loadAllData = async (uid: string, currentName?: string) => {
    setLoadingData(true);
    try {
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!notifErr && Array.isArray(notifData)) {
        setItems(
          notifData.map((n: any) => ({
            id: String(n.id),
            title: n.title || '',
            body: n.body || n.message || '',
            is_read: Boolean(n.is_read),
            created_at: n.created_at?.slice(0, 16).replace('T', ' '),
          }))
        );
      }

      const { data: chatData, error: chatErr } = await supabase
        .from('candidate_messages')
        .select('*')
        .eq('candidate_user_id', uid)
        .order('created_at', { ascending: true });

      if (!chatErr && Array.isArray(chatData)) {
        setMessages(
          chatData.map((m: any) => ({
            id: String(m.id),
            candidate_user_id: String(m.candidate_user_id),
            sender_user_id: String(m.sender_user_id),
            sender_role: m.sender_role === 'recruiter' ? 'recruiter' : 'candidate',
            sender_name:
              m.sender_name ||
              (m.sender_role === 'recruiter' ? msgT.recruiterBadge : currentName || candidateName),
            subject: m.subject || null,
            message_text: m.message_text || '',
            is_read: Boolean(m.is_read),
            created_at: m.created_at?.slice(0, 16).replace('T', ' '),
          }))
        );
      }
    } catch {
      // Mantém estado atual em caso de falha transitória
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function init() {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;
      if (!uid || !active) return;

      const resolvedName =
        candidate?.fullName ||
        authData?.user?.user_metadata?.full_name ||
        authData?.user?.email?.split('@')[0] ||
        'Candidate';

      setUserId(uid);
      setCandidateName(resolvedName);
      await loadAllData(uid, resolvedName);
    }

    init();
    return () => {
      active = false;
    };
  }, [candidate?.fullName]);

  const canModifyMessage = (m: ChatMessageItem) =>
    Boolean(userId && m.sender_role === 'candidate' && m.sender_user_id === userId);

  const handleMessageContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    m: ChatMessageItem
  ) => {
    if (!canModifyMessage(m)) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedMessageId(m.id);
    setContextMenu({
      messageId: m.id,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleStartEdit = (m: ChatMessageItem) => {
    setContextMenu(null);
    setSelectedMessageId(m.id);
    setEditingMessageId(m.id);
    setEditingText(m.message_text);
    setChatError(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (e: React.FormEvent, messageId: string) => {
    e.preventDefault();
    if (!userId || !editingText.trim() || savingEdit) return;

    setSavingEdit(true);
    setChatError(null);
    const updatedText = editingText.trim();

    try {
      const { error } = await supabase
        .from('candidate_messages')
        .update({ message_text: updatedText })
        .eq('id', messageId)
        .eq('candidate_user_id', userId)
        .eq('sender_user_id', userId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, message_text: updatedText, edited: true }
            : m
        )
      );
      setEditingMessageId(null);
      setEditingText('');
    } catch {
      setChatError(msgT.updateError);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!userId) return;
    setContextMenu(null);
    setChatError(null);

    try {
      const { data, error } = await supabase
        .from('candidate_messages')
        .delete()
        .eq('id', messageId)
        .eq('candidate_user_id', userId)
        .eq('sender_user_id', userId)
        .select('id');

      if (error || !data || data.length === 0) {
        throw new Error(msgT.deleteError);
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      if (selectedMessageId === messageId) setSelectedMessageId(null);
      if (editingMessageId === messageId) {
        setEditingMessageId(null);
        setEditingText('');
      }
    } catch {
      setChatError(msgT.deleteError);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !replyText.trim()) return;

    setSendingMsg(true);
    setChatError(null);
    try {
      const cleanText = replyText.trim();
      const { data, error } = await supabase
        .from('candidate_messages')
        .insert({
          candidate_user_id: userId,
          sender_user_id: userId,
          sender_role: 'candidate',
          sender_name: candidateName,
          message_text: cleanText,
          is_read: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(data.id),
            candidate_user_id: String(data.candidate_user_id),
            sender_user_id: String(data.sender_user_id),
            sender_role: data.sender_role === 'recruiter' ? 'recruiter' : 'candidate',
            sender_name: data.sender_name || candidateName,
            subject: data.subject || null,
            message_text: data.message_text || cleanText,
            is_read: Boolean(data.is_read),
            created_at: data.created_at?.slice(0, 16).replace('T', ' '),
          },
        ]);
      }

      setReplyText('');
    } catch {
      setChatError(msgT.sendError);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!userId) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    );
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId);
    await refreshCandidate();
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    await refreshCandidate();
  };

  const hasUnread = items.some((i) => !i.is_read);
  const activeContextMessage = contextMenu
    ? messages.find((m) => m.id === contextMenu.messageId) || null
    : null;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {msgT.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{msgT.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {userId && (
            <button
              type="button"
              onClick={() => loadAllData(userId)}
              disabled={loadingData}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/25 text-purple-200 font-medium text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>{msgT.refreshBtn}</span>
            </button>
          )}

          {hasUnread && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{msgT.markAllReadBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conversas diretas entre recrutadores e candidato */}
      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{msgT.chatSectionTitle}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{msgT.chatSectionSubtitle}</p>
            </div>
          </div>

          {messages.some(canModifyMessage) && (
            <span className="text-[11px] text-purple-300/80">{msgT.contextHint}</span>
          )}
        </div>

        {chatError && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{chatError}</span>
          </div>
        )}

        {messages.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pe-1">
            {messages.map((m) => {
              const isRecruiter = m.sender_role === 'recruiter';
              const modifiable = canModifyMessage(m);
              const isSelected = selectedMessageId === m.id;
              const isEditing = editingMessageId === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  onContextMenu={(e) => handleMessageContextMenu(e, m)}
                  className={`p-4 rounded-2xl border space-y-1.5 transition ${
                    isRecruiter
                      ? 'bg-indigo-950/30 border-indigo-500/30'
                      : isSelected
                      ? 'bg-purple-950/45 border-purple-400/60 ring-1 ring-purple-400/30'
                      : 'bg-purple-950/25 border-purple-500/25'
                  } ${modifiable ? 'cursor-context-menu' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isRecruiter
                            ? 'bg-indigo-900/70 text-indigo-200 border border-indigo-400/30'
                            : 'bg-purple-900/70 text-purple-200 border border-purple-400/30'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {isRecruiter ? msgT.recruiterBadge : msgT.youBadge}
                      </span>
                      <span className="text-xs font-bold text-white">{m.sender_name}</span>
                      {m.subject && (
                        <span className="text-xs text-purple-300">• {m.subject}</span>
                      )}
                      {m.edited && (
                        <span className="text-[10px] text-purple-300/80 italic">
                          ({msgT.editedBadge})
                        </span>
                      )}
                    </div>
                    {m.created_at && (
                      <span className="text-[11px] text-gray-500">{m.created_at}</span>
                    )}
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveEdit(e, m.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="pt-2 space-y-2"
                    >
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full bg-white/5 border border-purple-400/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs text-gray-300 flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>{msgT.cancelEditBtn}</span>
                        </button>
                        <button
                          type="submit"
                          disabled={savingEdit || !editingText.trim()}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                          <span>{msgT.saveEditBtn}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-xs text-gray-200 leading-relaxed">{m.message_text}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-white/5 border border-purple-500/15 text-center space-y-1.5">
            <h3 className="text-sm font-bold text-white">{msgT.emptyChatTitle}</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">{msgT.emptyChatDesc}</p>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={msgT.replyPlaceholder}
            className="flex-1 bg-white/5 border border-purple-500/25 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={sendingMsg || !replyText.trim() || !userId}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sendingMsg ? msgT.sendingBtn : msgT.sendReplyBtn}</span>
          </button>
        </form>
      </div>

      {/* Menu flutuante ao clicar com o botão direito numa mensagem enviada */}
      {contextMenu && activeContextMessage && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 min-w-44 rounded-xl bg-[#140b24] border border-purple-500/40 shadow-2xl py-1.5 text-xs"
        >
          <button
            type="button"
            onClick={() => handleStartEdit(activeContextMessage)}
            className="w-full px-3.5 py-2 text-start text-purple-100 hover:bg-purple-600/25 flex items-center gap-2 transition cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-purple-300" />
            <span>{msgT.editOption}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeleteMessage(activeContextMessage.id)}
            className="w-full px-3.5 py-2 text-start text-red-300 hover:bg-red-950/50 flex items-center gap-2 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>{msgT.deleteOption}</span>
          </button>
        </div>
      )}

      {/* Notificações e alertas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          {msgT.notificationsSectionTitle}
        </h2>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.is_read
                    ? 'bg-[#0c0716] border-purple-900/30 opacity-80'
                    : 'bg-[#0c0716] border-purple-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.is_read
                        ? 'bg-white/5 text-gray-400'
                        : 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {item.is_read ? <MailOpen className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.is_read
                            ? 'bg-white/5 text-gray-400'
                            : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {item.is_read ? msgT.readBadge : msgT.unreadBadge}
                      </span>
                      {item.created_at && (
                        <span className="text-[11px] text-gray-500">{item.created_at}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.body}</p>
                  </div>
                </div>

                {!item.is_read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/25 text-xs font-semibold text-purple-200 transition cursor-pointer self-end sm:self-center shrink-0"
                  >
                    {msgT.markReadBtn}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
            <h3 className="text-base font-bold text-white">{msgT.emptyTitle}</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">{msgT.emptyDesc}</p>
          </div>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{msgT.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{msgT.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}