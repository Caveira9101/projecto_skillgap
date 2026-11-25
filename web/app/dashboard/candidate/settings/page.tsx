'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  LifeBuoy,
  Send,
  Lock,
  Sparkles
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  created_at?: string;
}

const SETTINGS_TEXTS: Record<string, any> = {
  en: {
    title: "Settings & Preferences",
    subtitle: "Configure your job preferences, visibility, notifications, and priority support.",
    saveBtn: "Save Preferences",
    savingBtn: "Saving...",
    savedMsg: "Preferences saved successfully.",
    errorMsg: "Could not save preferences. Please try again.",
    availSection: "Availability & Visibility",
    availStatusLabel: "Availability Status",
    availAvailable: "Available Immediately",
    availOpen: "Open to Opportunities",
    availUnavailable: "Not Actively Looking",
    profileVisLabel: "Profile Visibility",
    visPublic: "Public to Verified Companies",
    visPrivate: "Hidden from Search",
    notifSection: "Notifications & Alerts",
    notifMatchTitle: "Job Match Alerts",
    notifMatchDesc: "Notify me when new roles match my profile",
    notifViewsTitle: "Recruiter Profile Views",
    notifViewsDesc: "Notify me when companies view or save my profile",
    notifAppsTitle: "Application Status Updates",
    notifAppsDesc: "Notify me when my application stage changes",
    prefSection: "Career & Role Preferences",
    targetRoleLabel: "Target Role / Headline",
    targetRolePlaceholder: "e.g. Data Analyst, Software Engineer",
    preferredLocLabel: "Preferred Location",
    preferredLocPlaceholder: "e.g. Maputo, Matola, Remote",
    salaryExpLabel: "Expected Salary / Compensation",
    salaryExpPlaceholder: "Optional",
    supportTitle: "Priority Support",
    supportSubtitle: "Dedicated assistance channel for Normal and Advanced subscribers.",
    supportLockedTitle: "Priority Support Available on Paid Plans",
    supportLockedDesc: "Priority support is included in the Normal and Advanced plans. Upgrade your subscription to open support tickets.",
    upgradeBtn: "View Subscription Plans",
    ticketSubjectLabel: "Subject",
    ticketCategoryLabel: "Category",
    catBilling: "Billing & Subscription",
    catAccount: "Account & Profile",
    catTechnical: "Technical & AI Tools",
    ticketMessageLabel: "How can we help?",
    ticketSubmitBtn: "Submit Support Request",
    ticketSubmittingBtn: "Sending...",
    ticketSentMsg: "Support request submitted successfully.",
    ticketErrorMsg: "Could not submit your request. Please try again.",
    ticketsHistoryTitle: "My Support Requests",
    emptyTickets: "No support requests submitted yet."
  },
  pt: {
    title: "Definições & Preferências",
    subtitle: "Configura as tuas preferências profissionais, visibilidade, alertas e suporte prioritário.",
    saveBtn: "Guardar Preferências",
    savingBtn: "A guardar...",
    savedMsg: "Preferências guardadas com sucesso.",
    errorMsg: "Não foi possível guardar as preferências. Tenta novamente.",
    availSection: "Disponibilidade & Visibilidade",
    availStatusLabel: "Estado de Disponibilidade",
    availAvailable: "Disponível de Imediato",
    availOpen: "Aberto a Oportunidades",
    availUnavailable: "Não Ativo na Procura",
    profileVisLabel: "Visibilidade do Perfil",
    visPublic: "Visível para Empresas Verificadas",
    visPrivate: "Oculto na Pesquisa",
    notifSection: "Notificações & Alertas",
    notifMatchTitle: "Alertas de Compatibilidade",
    notifMatchDesc: "Avisar quando surgirem vagas compatíveis com o meu perfil",
    notifViewsTitle: "Visualizações por Recrutadores",
    notifViewsDesc: "Avisar quando empresas consultarem ou guardarem o meu perfil",
    notifAppsTitle: "Atualizações de Candidatura",
    notifAppsDesc: "Avisar quando o estado de uma candidatura mudar",
    prefSection: "Preferências de Carreira & Função",
    targetRoleLabel: "Cargo Pretendido / Título",
    targetRolePlaceholder: "Ex.: Analista de Dados, Engenheiro de Software",
    preferredLocLabel: "Localização Preferencial",
    preferredLocPlaceholder: "Ex.: Maputo, Matola, Remoto",
    salaryExpLabel: "Pretensão Salarial",
    salaryExpPlaceholder: "Opcional",
    supportTitle: "Suporte Prioritário",
    supportSubtitle: "Canal de apoio dedicado para subscritores dos planos Normal e Avançado.",
    supportLockedTitle: "Suporte Disponível nos Planos Pagos",
    supportLockedDesc: "O suporte prioritário está incluído nos planos Normal e Avançado. Atualiza a tua subscrição para abrir pedidos de suporte.",
    upgradeBtn: "Ver Planos de Subscrição",
    ticketSubjectLabel: "Assunto",
    ticketCategoryLabel: "Categoria",
    catBilling: "Faturação & Subscrição",
    catAccount: "Conta & Perfil",
    catTechnical: "Ferramentas Técnicas & IA",
    ticketMessageLabel: "Como podemos ajudar?",
    ticketSubmitBtn: "Enviar Pedido de Suporte",
    ticketSubmittingBtn: "A enviar...",
    ticketSentMsg: "Pedido de suporte enviado com sucesso.",
    ticketErrorMsg: "Não foi possível enviar o pedido. Tenta novamente.",
    ticketsHistoryTitle: "Os Meus Pedidos de Suporte",
    emptyTickets: "Ainda não submeteste pedidos de suporte."
  },
  es: {
    title: "Ajustes y Preferencias",
    subtitle: "Configura tus preferencias laborales, visibilidad, alertas y soporte prioritario.",
    saveBtn: "Guardar Preferencias",
    savingBtn: "Guardando...",
    savedMsg: "Preferencias guardadas correctamente.",
    errorMsg: "No se pudieron guardar las preferencias. Inténtalo de nuevo.",
    availSection: "Disponibilidad y Visibilidad",
    availStatusLabel: "Estado de Disponibilidad",
    availAvailable: "Disponible de Inmediato",
    availOpen: "Abierto a Oportunidades",
    availUnavailable: "Sin Búsqueda Activa",
    profileVisLabel: "Visibilidad del Perfil",
    visPublic: "Visible para Empresas Verificadas",
    visPrivate: "Oculto en Búsquedas",
    notifSection: "Notificaciones y Alertas",
    notifMatchTitle: "Alertas de Compatibilidad",
    notifMatchDesc: "Avisarme cuando haya vacantes acordes a mi perfil",
    notifViewsTitle: "Visitas de Reclutadores",
    notifViewsDesc: "Avisarme cuando las empresas vean o guarden mi perfil",
    notifAppsTitle: "Cambios en Postulaciones",
    notifAppsDesc: "Avisarme cuando cambie el estado de una postulación",
    prefSection: "Preferencias de Carrera y Puesto",
    targetRoleLabel: "Puesto Objetivo / Titular",
    targetRolePlaceholder: "Ej.: Analista de Datos, Desarrollador",
    preferredLocLabel: "Ubicación Preferida",
    preferredLocPlaceholder: "Ej.: Maputo, Matola, Remoto",
    salaryExpLabel: "Expectativa Salarial",
    salaryExpPlaceholder: "Opcional",
    supportTitle: "Soporte Prioritario",
    supportSubtitle: "Canal de asistencia dedicado para planes Normal y Avanzado.",
    supportLockedTitle: "Soporte Disponible en Planes de Pago",
    supportLockedDesc: "El soporte prioritario está incluido en los planes Normal y Avanzado. Mejora tu suscripción para enviar consultas.",
    upgradeBtn: "Ver Planes de Suscripción",
    ticketSubjectLabel: "Asunto",
    ticketCategoryLabel: "Categoría",
    catBilling: "Facturación y Suscripción",
    catAccount: "Cuenta y Perfil",
    catTechnical: "Herramientas Técnicas e IA",
    ticketMessageLabel: "¿Cómo podemos ayudarte?",
    ticketSubmitBtn: "Enviar Solicitud de Soporte",
    ticketSubmittingBtn: "Enviando...",
    ticketSentMsg: "Solicitud de soporte enviada correctamente.",
    ticketErrorMsg: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    ticketsHistoryTitle: "Mis Solicitudes de Soporte",
    emptyTickets: "Aún no has enviado solicitudes de soporte."
  },
  fr: {
    title: "Paramètres & Préférences",
    subtitle: "Configurez vos préférences professionnelles, votre visibilité, vos alertes et le support prioritaire.",
    saveBtn: "Enregistrer les Préférences",
    savingBtn: "Enregistrement...",
    savedMsg: "Préférences enregistrées avec succès.",
    errorMsg: "Impossible d'enregistrer les préférences. Réessayez.",
    availSection: "Disponibilité & Visibilité",
    availStatusLabel: "Statut de Disponibilité",
    availAvailable: "Disponible Immédiatement",
    availOpen: "À l'Écoute d'Opportunités",
    availUnavailable: "En Veille",
    profileVisLabel: "Visibilité du Profil",
    visPublic: "Visible par les Entreprises Vérifiées",
    visPrivate: "Masqué de la Recherche",
    notifSection: "Notifications & Alertes",
    notifMatchTitle: "Alertes de Correspondance",
    notifMatchDesc: "M'avertir lorsqu'un poste correspond à mon profil",
    notifViewsTitle: "Vues par les Recruteurs",
    notifViewsDesc: "M'avertir lorsqu'une entreprise consulte ou enregistre mon profil",
    notifAppsTitle: "Suivi des Candidatures",
    notifAppsDesc: "M'avertir lors de l'évolution d'une candidature",
    prefSection: "Préférences de Poste & Carrière",
    targetRoleLabel: "Poste Visé / Titre",
    targetRolePlaceholder: "Ex. : Analyste Données, Ingénieur Logiciel",
    preferredLocLabel: "Lieu Souhaité",
    preferredLocPlaceholder: "Ex. : Maputo, Matola, Télétravail",
    salaryExpLabel: "Prétentions Salariales",
    salaryExpPlaceholder: "Optionnel",
    supportTitle: "Support Prioritaire",
    supportSubtitle: "Canal d'assistance dédié aux offres Normal et Avancé.",
    supportLockedTitle: "Support Réservé aux Offres Payantes",
    supportLockedDesc: "Le support prioritaire est inclus dans les offres Normal et Avancé. Mettez à niveau votre abonnement pour ouvrir un ticket.",
    upgradeBtn: "Voir les Offres d'Abonnement",
    ticketSubjectLabel: "Objet",
    ticketCategoryLabel: "Catégorie",
    catBilling: "Facturation & Abonnement",
    catAccount: "Compte & Profil",
    catTechnical: "Outils Techniques & IA",
    ticketMessageLabel: "Comment pouvons-nous vous aider ?",
    ticketSubmitBtn: "Envoyer la Demande",
    ticketSubmittingBtn: "Envoi...",
    ticketSentMsg: "Demande de support envoyée avec succès.",
    ticketErrorMsg: "Impossible d'envoyer la demande. Réessayez.",
    ticketsHistoryTitle: "Mes Demandes de Support",
    emptyTickets: "Aucune demande de support envoyée pour l'instant."
  },
  de: {
    title: "Einstellungen & Präferenzen",
    subtitle: "Konfigurieren Sie Karrierepräferenzen, Sichtbarkeit, Benachrichtigungen und Prioritäts-Support.",
    saveBtn: "Einstellungen speichern",
    savingBtn: "Speichern...",
    savedMsg: "Einstellungen erfolgreich gespeichert.",
    errorMsg: "Einstellungen konnten nicht gespeichert werden. Bitte erneut versuchen.",
    availSection: "Verfügbarkeit & Sichtbarkeit",
    availStatusLabel: "Verfügbarkeitsstatus",
    availAvailable: "Sofort verfügbar",
    availOpen: "Offen für Angebote",
    availUnavailable: "Derzeit nicht aktiv suchend",
    profileVisLabel: "Profilsichtbarkeit",
    visPublic: "Sichtbar für geprüfte Unternehmen",
    visPrivate: "In der Suche ausgeblendet",
    notifSection: "Benachrichtigungen & Hinweise",
    notifMatchTitle: "Matching-Benachrichtigungen",
    notifMatchDesc: "Benachrichtigen, wenn passende Stellen verfügbar sind",
    notifViewsTitle: "Profilaufrufe durch Recruiter",
    notifViewsDesc: "Benachrichtigen, wenn Unternehmen mein Profil ansehen oder speichern",
    notifAppsTitle: "Bewerbungsstatus-Updates",
    notifAppsDesc: "Benachrichtigen, wenn sich der Status einer Bewerbung ändert",
    prefSection: "Karriere- & Stellenpräferenzen",
    targetRoleLabel: "Zielposition / Titel",
    targetRolePlaceholder: "z. B. Data Analyst, Softwareentwickler",
    preferredLocLabel: "Bevorzugter Standort",
    preferredLocPlaceholder: "z. B. Maputo, Matola, Remote",
    salaryExpLabel: "Gehaltsvorstellung",
    salaryExpPlaceholder: "Optional",
    supportTitle: "Prioritäts-Support",
    supportSubtitle: "Direkter Support-Kanal für Normal- und Erweitert-Abonnenten.",
    supportLockedTitle: "Support in Bezahltarifen verfügbar",
    supportLockedDesc: "Der Prioritäts-Support ist in den Tarifen Normal und Erweitert enthalten. Wechseln Sie den Tarif, um Tickets zu eröffnen.",
    upgradeBtn: "Abonnementpläne ansehen",
    ticketSubjectLabel: "Betreff",
    ticketCategoryLabel: "Kategorie",
    catBilling: "Abrechnung & Abonnement",
    catAccount: "Konto & Profil",
    catTechnical: "Technische Tools & KI",
    ticketMessageLabel: "Wie können wir helfen?",
    ticketSubmitBtn: "Support-Anfrage senden",
    ticketSubmittingBtn: "Wird gesendet...",
    ticketSentMsg: "Support-Anfrage erfolgreich gesendet.",
    ticketErrorMsg: "Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.",
    ticketsHistoryTitle: "Meine Support-Anfragen",
    emptyTickets: "Noch keine Support-Anfragen vorhanden."
  },
  ar: {
    title: "الإعدادات والتفضيلات",
    subtitle: "اضبط تفضيلاتك المهنية ومستوى الظهور والتنبيهات والدعم ذو الأولوية.",
    saveBtn: "حفظ التفضيلات",
    savingBtn: "جاري الحفظ...",
    savedMsg: "تم حفظ التفضيلات بنجاح.",
    errorMsg: "تعذر حفظ التفضيلات. يرجى المحاولة مرة أخرى.",
    availSection: "التوفر والظهور",
    availStatusLabel: "حالة التوفر",
    availAvailable: "متاح فوراً",
    availOpen: "منفتح على الفرص",
    availUnavailable: "غير متاح حالياً",
    profileVisLabel: "ظهور الملف الشخصي",
    visPublic: "مرئي للشركات الموثوقة",
    visPrivate: "مخفي عن البحث",
    notifSection: "الإشعارات والتنبيهات",
    notifMatchTitle: "تنبيهات التطابق الوظيفي",
    notifMatchDesc: "إشعاري عند توفر وظائف متوافقة مع ملفي",
    notifViewsTitle: "مشاهدات مسؤولي التوظيف",
    notifViewsDesc: "إشعاري عند قيام الشركات بعرض أو حفظ ملفي",
    notifAppsTitle: "تحديثات حالة الطلبات",
    notifAppsDesc: "إشعاري عند تغير حالة طلب التوظيف",
    prefSection: "تفضيلات المسار والوظيفة",
    targetRoleLabel: "المسمى الوظيفي المستهدف",
    targetRolePlaceholder: "مثال: محلل بيانات، مهندس برمجيات",
    preferredLocLabel: "الموقع المفضل",
    preferredLocPlaceholder: "مثال: مابوتو، ماتولا، عن بُعد",
    salaryExpLabel: "الراتب المتوقع",
    salaryExpPlaceholder: "اختياري",
    supportTitle: "الدعم ذو الأولوية",
    supportSubtitle: "قناة دعم مخصصة لمشتركي الباقتين العادية والمتقدمة.",
    supportLockedTitle: "الدعم متاح في الخطط المدفوعة",
    supportLockedDesc: "يتوفر الدعم ذو الأولوية في الباقتين العادية والمتقدمة. قم بترقية اشتراكك لفتح تذاكر الدعم.",
    upgradeBtn: "عرض باقات الاشتراك",
    ticketSubjectLabel: "الموضوع",
    ticketCategoryLabel: "الفئة",
    catBilling: "الفوترة والاشتراك",
    catAccount: "الحساب والملف الشخصي",
    catTechnical: "الأدوات التقنية والذكاء الاصطناعي",
    ticketMessageLabel: "كيف يمكننا مساعدتك؟",
    ticketSubmitBtn: "إرسال طلب الدعم",
    ticketSubmittingBtn: "جاري الإرسال...",
    ticketSentMsg: "تم إرسال طلب الدعم بنجاح.",
    ticketErrorMsg: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
    ticketsHistoryTitle: "طلبات الدعم الخاصة بي",
    emptyTickets: "لم يتم إرسال أي طلبات دعم بعد."
  }
};

export default function CandidateSettingsPage() {
  const { lang, candidate } = useDashboardLang();
  const st = SETTINGS_TEXTS[lang] || SETTINGS_TEXTS['en'];
  const isPaid = Boolean(candidate?.isPaidPlan);

  const [userId, setUserId] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'open' | 'unavailable'>('available');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyViews, setNotifyViews] = useState(true);
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [targetRole, setTargetRole] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('billing');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketFeedback, setTicketFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSettingsAndTickets() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) return;
        setUserId(uid);

        const { data } = await supabase
          .from('candidate_settings')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle();

        if (active && data) {
          if (data.availability_status === 'open' || data.availability_status === 'unavailable') {
            setAvailabilityStatus(data.availability_status);
          } else {
            setAvailabilityStatus('available');
          }
          if (data.profile_visibility === 'private') {
            setProfileVisibility('private');
          } else {
            setProfileVisibility('public');
          }
          setNotifyMatches(typeof data.notify_matches === 'boolean' ? data.notify_matches : true);
          setNotifyViews(typeof data.notify_views === 'boolean' ? data.notify_views : true);
          setNotifyApplications(typeof data.notify_applications === 'boolean' ? data.notify_applications : true);
          setTargetRole(data.target_role || '');
          setPreferredLocation(data.preferred_location || '');
          setSalaryExpectation(data.salary_expectation || '');
        }

        const { data: ticketRows, error: ticketErr } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (active && !ticketErr && Array.isArray(ticketRows)) {
          setTickets(
            ticketRows.map((t: any) => ({
              id: String(t.id),
              subject: t.subject || '',
              category: t.category || 'billing',
              message: t.message || '',
              status: t.status || 'open',
              created_at: t.created_at?.slice(0, 10),
            }))
          );
        }
      } catch {
        // Ignora erro de leitura inicial
      }
    }

    loadSettingsAndTickets();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setFeedback(null);
    try {
      const { error } = await supabase
        .from('candidate_settings')
        .upsert(
          {
            user_id: userId,
            availability_status: availabilityStatus,
            profile_visibility: profileVisibility,
            notify_matches: notifyMatches,
            notify_views: notifyViews,
            notify_applications: notifyApplications,
            target_role: targetRole.trim() || null,
            preferred_location: preferredLocation.trim() || null,
            salary_expectation: salaryExpectation.trim() || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
      setFeedback({ type: 'success', text: st.savedMsg });
    } catch {
      setFeedback({ type: 'error', text: st.errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaid || !userId || !ticketSubject.trim() || !ticketMessage.trim()) return;

    setSubmittingTicket(true);
    setTicketFeedback(null);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          subject: ticketSubject.trim(),
          category: ticketCategory,
          message: ticketMessage.trim(),
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTickets((prev) => [
          {
            id: String(data.id),
            subject: data.subject || ticketSubject.trim(),
            category: data.category || ticketCategory,
            message: data.message || ticketMessage.trim(),
            status: data.status || 'open',
            created_at: data.created_at?.slice(0, 10),
          },
          ...prev,
        ]);
      }

      setTicketSubject('');
      setTicketMessage('');
      setTicketFeedback({ type: 'success', text: st.ticketSentMsg });
    } catch {
      setTicketFeedback({ type: 'error', text: st.ticketErrorMsg });
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {st.title}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{st.subtitle}</p>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? st.savingBtn : st.saveBtn}</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-5">
            <h2 className="text-base font-bold text-white">{st.availSection}</h2>

            <div>
              <label className="block text-xs text-gray-400 mb-2">{st.availStatusLabel}</label>
              <select
                value={availabilityStatus}
                onChange={(e) =>
                  setAvailabilityStatus(e.target.value as 'available' | 'open' | 'unavailable')
                }
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="available" className="bg-[#0c0716]">{st.availAvailable}</option>
                <option value="open" className="bg-[#0c0716]">{st.availOpen}</option>
                <option value="unavailable" className="bg-[#0c0716]">{st.availUnavailable}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">{st.profileVisLabel}</label>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="public" className="bg-[#0c0716]">{st.visPublic}</option>
                <option value="private" className="bg-[#0c0716]">{st.visPrivate}</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-5">
            <h2 className="text-base font-bold text-white">{st.notifSection}</h2>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">{st.notifMatchTitle}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{st.notifMatchDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyMatches}
                onChange={(e) => setNotifyMatches(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">{st.notifViewsTitle}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{st.notifViewsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyViews}
                onChange={(e) => setNotifyViews(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">{st.notifAppsTitle}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{st.notifAppsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifyApplications}
                onChange={(e) => setNotifyApplications(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-4">
          <h2 className="text-base font-bold text-white">{st.prefSection}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{st.targetRoleLabel}</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={st.targetRolePlaceholder}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{st.preferredLocLabel}</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder={st.preferredLocPlaceholder}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{st.salaryExpLabel}</label>
              <input
                type="text"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                placeholder={st.salaryExpPlaceholder}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Secção Integrada de Suporte Prioritário (Planos Normal & Avançado) */}
      <div id="support" className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{st.supportTitle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{st.supportSubtitle}</p>
          </div>
        </div>

        {!isPaid ? (
          <div className="p-6 rounded-xl bg-white/5 border border-purple-500/20 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{st.supportLockedTitle}</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              {st.supportLockedDesc}
            </p>
            <div className="pt-1">
              <Link
                href="/dashboard/candidate/subscriptions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{st.upgradeBtn}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {ticketFeedback && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                  ticketFeedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}
              >
                {ticketFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{ticketFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{st.ticketSubjectLabel}</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">{st.ticketCategoryLabel}</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-[#0c0716] border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="billing">{st.catBilling}</option>
                    <option value="account">{st.catAccount}</option>
                    <option value="technical">{st.catTechnical}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">{st.ticketMessageLabel}</label>
                <textarea
                  rows={3}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-2 hover:opacity-95 transition cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingTicket ? st.ticketSubmittingBtn : st.ticketSubmitBtn}</span>
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-purple-900/30 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {st.ticketsHistoryTitle}
              </h3>
              {tickets.length > 0 ? (
                <div className="space-y-2.5">
                  {tickets.map((tItem) => (
                    <div
                      key={tItem.id}
                      className="p-4 rounded-xl bg-white/5 border border-purple-500/15 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white">{tItem.subject}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                          {tItem.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{tItem.message}</p>
                      {tItem.created_at && (
                        <p className="text-[10px] text-gray-500">{tItem.created_at}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">{st.emptyTickets}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}