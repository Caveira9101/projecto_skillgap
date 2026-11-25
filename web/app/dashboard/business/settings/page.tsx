'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Save,
  LifeBuoy,
  Send,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Mail,
  Monitor,
  Layers
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

type DeliveryChannel = 'platform' | 'email' | 'both';

interface NotificationPreferences {
  channel: DeliveryChannel;
  aiMatches: boolean;
  newApplications: boolean;
  interviewReminders: boolean;
  teamUpdates: boolean;
  billingAndLimits: boolean;
  weeklyAnalytics: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  channel: 'both',
  aiMatches: true,
  newApplications: true,
  interviewReminders: true,
  teamUpdates: true,
  billingAndLimits: true,
  weeklyAnalytics: false
};

const SETTINGS_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    companySectionTitle: string;
    companyNameLabel: string;
    websiteLabel: string;
    industryLabel: string;
    locationLabel: string;
    saveCompanyBtn: string;
    savedCompanyMsg: string;
    notificationsSectionTitle: string;
    notificationsSubtitle: string;
    deliveryChannelLabel: string;
    channels: Record<DeliveryChannel, string>;
    notificationItems: {
      aiMatches: { title: string; desc: string };
      newApplications: { title: string; desc: string };
      interviewReminders: { title: string; desc: string };
      teamUpdates: { title: string; desc: string };
      billingAndLimits: { title: string; desc: string };
      weeklyAnalytics: { title: string; desc: string };
    };
    saveNotificationsBtn: string;
    savedNotificationsMsg: string;
    supportSectionTitle: string;
    supportSubtitle: string;
    planSupportLabel: string;
    planSlaLabel: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendTicketBtn: string;
    ticketSentMsg: string;
  }
> = {
  en: {
    title: 'Settings',
    subtitle: 'Configure your company profile, notification preferences, and access business support.',
    companySectionTitle: 'Company Profile',
    companyNameLabel: 'Company Name',
    websiteLabel: 'Website',
    industryLabel: 'Industry',
    locationLabel: 'Location',
    saveCompanyBtn: 'Save Changes',
    savedCompanyMsg: 'Company settings updated.',
    notificationsSectionTitle: 'Notification Preferences',
    notificationsSubtitle: 'Choose which recruitment alerts to receive and where they should be delivered.',
    deliveryChannelLabel: 'Delivery Channel',
    channels: {
      platform: 'Platform Only',
      email: 'Email Only',
      both: 'Both (Platform & Email)'
    },
    notificationItems: {
      aiMatches: {
        title: 'AI Candidate Matches',
        desc: 'Notify when SkillGap AI identifies high-fit candidates for open roles.'
      },
      newApplications: {
        title: 'Candidate Activity & Shortlists',
        desc: 'Notify when candidates are shortlisted or update their availability.'
      },
      interviewReminders: {
        title: 'Interview Schedules & Reminders',
        desc: 'Receive alerts for upcoming interviews and schedule changes.'
      },
      teamUpdates: {
        title: 'Team & Recruiter Activity',
        desc: 'Notify when recruiters join the workspace or change job pipelines.'
      },
      billingAndLimits: {
        title: 'Subscription, Billing & Plan Quotas',
        desc: 'Alerts for invoices, renewals, and reaching job or recruiter plan limits.'
      },
      weeklyAnalytics: {
        title: 'Weekly Recruitment Digest',
        desc: 'Summary of hiring funnel performance and department metrics.'
      }
    },
    saveNotificationsBtn: 'Save Notification Settings',
    savedNotificationsMsg: 'Notification preferences saved.',
    supportSectionTitle: 'Business Support',
    supportSubtitle: 'Need help with your account, subscription limits, or recruitment workflows? Send a support request.',
    planSupportLabel: 'Included Support Tier:',
    planSlaLabel: 'SLA:',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'e.g. Question about plan limits or billing',
    messageLabel: 'Message',
    messagePlaceholder: 'Describe how our support team can assist your company...',
    sendTicketBtn: 'Send Support Request',
    ticketSentMsg: 'Your support request has been submitted.'
  },
  pt: {
    title: 'Definições',
    subtitle: 'Configura o perfil da empresa, preferências de notificações e acesso ao suporte.',
    companySectionTitle: 'Perfil da Empresa',
    companyNameLabel: 'Nome da Empresa',
    websiteLabel: 'Website',
    industryLabel: 'Setor',
    locationLabel: 'Localização',
    saveCompanyBtn: 'Guardar Alterações',
    savedCompanyMsg: 'Definições da empresa atualizadas.',
    notificationsSectionTitle: 'Preferências de Notificações',
    notificationsSubtitle: 'Ativa ou desativa cada alerta e escolhe o canal de receção.',
    deliveryChannelLabel: 'Canal de Receção',
    channels: {
      platform: 'Apenas na Plataforma',
      email: 'Apenas por E-mail',
      both: 'Ambos (Plataforma e E-mail)'
    },
    notificationItems: {
      aiMatches: {
        title: 'Novos Matches de IA',
        desc: 'Notificar quando a SkillGap AI encontrar candidatos compatíveis para vagas ativas.'
      },
      newApplications: {
        title: 'Atividade de Candidatos e Pré-Seleção',
        desc: 'Notificar quando candidatos forem pré-selecionados ou atualizarem disponibilidade.'
      },
      interviewReminders: {
        title: 'Agendamento e Lembretes de Entrevistas',
        desc: 'Receber alertas sobre entrevistas marcadas e alterações de horário.'
      },
      teamUpdates: {
        title: 'Equipa e Recrutadores',
        desc: 'Notificar quando novos recrutadores entrarem ou alterarem vagas.'
      },
      billingAndLimits: {
        title: 'Subscrição, Faturação e Limites do Plano',
        desc: 'Alertas de faturas, renovações e proximidade dos limites de vagas ou recrutadores.'
      },
      weeklyAnalytics: {
        title: 'Resumo Semanal de Estatísticas',
        desc: 'Relatório semanal de desempenho do funil de recrutamento por departamento.'
      }
    },
    saveNotificationsBtn: 'Guardar Notificações',
    savedNotificationsMsg: 'Preferências de notificações guardadas.',
    supportSectionTitle: 'Suporte para Empresas',
    supportSubtitle: 'Precisas de ajuda com a conta, limites do plano ou fluxos de recrutamento? Envia um pedido de suporte.',
    planSupportLabel: 'Nível de Suporte Incluído:',
    planSlaLabel: 'SLA:',
    subjectLabel: 'Assunto',
    subjectPlaceholder: 'ex: Dúvida sobre limites do plano ou faturação',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Descreve como a nossa equipa de suporte pode ajudar a tua empresa...',
    sendTicketBtn: 'Enviar Pedido de Suporte',
    ticketSentMsg: 'O teu pedido de suporte foi enviado.'
  },
  es: {
    title: 'Ajustes',
    subtitle: 'Configura el perfil de tu empresa, notificaciones y acceso al soporte empresarial.',
    companySectionTitle: 'Perfil de Empresa',
    companyNameLabel: 'Nombre de la Empresa',
    websiteLabel: 'Sitio Web',
    industryLabel: 'Sector',
    locationLabel: 'Ubicación',
    saveCompanyBtn: 'Guardar Cambios',
    savedCompanyMsg: 'Ajustes de la empresa actualizados.',
    notificationsSectionTitle: 'Preferencias de Notificaciones',
    notificationsSubtitle: 'Activa o desactiva cada alerta y elige dónde recibirlas.',
    deliveryChannelLabel: 'Canal de Entrega',
    channels: {
      platform: 'Solo en la Plataforma',
      email: 'Solo por Correo',
      both: 'Ambos (Plataforma y Correo)'
    },
    notificationItems: {
      aiMatches: {
        title: 'Nuevos Matches de IA',
        desc: 'Notificar cuando SkillGap AI identifique candidatos compatibles para puestos activos.'
      },
      newApplications: {
        title: 'Actividad de Candidatos y Preselección',
        desc: 'Notificar cuando los candidatos sean preseleccionados o actualicen su estado.'
      },
      interviewReminders: {
        title: 'Recordatorios de Entrevistas',
        desc: 'Recibir alertas de próximas entrevistas y cambios de horario.'
      },
      teamUpdates: {
        title: 'Equipo y Reclutadores',
        desc: 'Notificar cuando se unan reclutadores o modifiquen vacantes.'
      },
      billingAndLimits: {
        title: 'Suscripción, Facturación y Límites del Plan',
        desc: 'Alertas de facturas, renovaciones y límites de puestos o reclutadores.'
      },
      weeklyAnalytics: {
        title: 'Resumen Semanal de Analítica',
        desc: 'Resumen semanal del rendimiento de contratación por departamento.'
      }
    },
    saveNotificationsBtn: 'Guardar Notificaciones',
    savedNotificationsMsg: 'Preferencias de notificaciones guardadas.',
    supportSectionTitle: 'Soporte para Empresas',
    supportSubtitle: '¿Necesitas ayuda con tu cuenta, límites del plan o flujos de reclutamiento? Envía una solicitud.',
    planSupportLabel: 'Nivel de Soporte Incluido:',
    planSlaLabel: 'SLA:',
    subjectLabel: 'Asunto',
    subjectPlaceholder: 'ej: Consulta sobre límites del plan o facturación',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Describe cómo puede ayudarte nuestro equipo de soporte...',
    sendTicketBtn: 'Enviar Solicitud de Soporte',
    ticketSentMsg: 'Tu solicitud de soporte ha sido enviada.'
  },
  fr: {
    title: 'Paramètres',
    subtitle: 'Configurez votre entreprise, vos préférences de notification et le support.',
    companySectionTitle: 'Profil Entreprise',
    companyNameLabel: 'Nom de l’Entreprise',
    websiteLabel: 'Site Web',
    industryLabel: 'Secteur',
    locationLabel: 'Localisation',
    saveCompanyBtn: 'Enregistrer les Modifications',
    savedCompanyMsg: 'Paramètres de l’entreprise mis à jour.',
    notificationsSectionTitle: 'Préférences de Notifications',
    notificationsSubtitle: 'Activez ou désactivez chaque alerte et choisissez le canal de réception.',
    deliveryChannelLabel: 'Canal de Réception',
    channels: {
      platform: 'Plateforme Uniquement',
      email: 'E-mail Uniquement',
      both: 'Les Deux (Plateforme et E-mail)'
    },
    notificationItems: {
      aiMatches: {
        title: 'Nouveaux Matches IA',
        desc: 'Notifier lorsque SkillGap AI identifie des candidats compatibles.'
      },
      newApplications: {
        title: 'Activité Candidats & Présélection',
        desc: 'Notifier lors de la présélection ou mise à jour d’un candidat.'
      },
      interviewReminders: {
        title: 'Rappels d’Entretiens',
        desc: 'Recevoir des alertes pour les entretiens planifiés ou modifiés.'
      },
      teamUpdates: {
        title: 'Équipe et Recruteurs',
        desc: 'Notifier lorsqu’un recruteur rejoint l’espace ou modifie un poste.'
      },
      billingAndLimits: {
        title: 'Abonnement, Facturation et Quotas',
        desc: 'Alertes sur les factures, renouvellements et limites de l’offre.'
      },
      weeklyAnalytics: {
        title: 'Résumé Hebdomadaire Analytique',
        desc: 'Synthèse hebdomadaire des performances de recrutement.'
      }
    },
    saveNotificationsBtn: 'Enregistrer les Notifications',
    savedNotificationsMsg: 'Préférences de notification enregistrées.',
    supportSectionTitle: 'Support Entreprises',
    supportSubtitle: 'Besoin d’aide sur votre compte, les limites de l’offre ou le recrutement ? Envoyez une demande.',
    planSupportLabel: 'Niveau de Support Inclus :',
    planSlaLabel: 'SLA :',
    subjectLabel: 'Objet',
    subjectPlaceholder: 'ex : Question sur les limites de l’offre ou la facturation',
    messageLabel: 'Message',
    messagePlaceholder: 'Décrivez comment notre équipe support peut aider votre entreprise...',
    sendTicketBtn: 'Envoyer la Demande',
    ticketSentMsg: 'Votre demande de support a bien été envoyée.'
  },
  de: {
    title: 'Einstellungen',
    subtitle: 'Konfigurieren Sie Unternehmensprofil, Benachrichtigungen und Business-Support.',
    companySectionTitle: 'Unternehmensprofil',
    companyNameLabel: 'Unternehmensname',
    websiteLabel: 'Website',
    industryLabel: 'Branche',
    locationLabel: 'Standort',
    saveCompanyBtn: 'Änderungen Speichern',
    savedCompanyMsg: 'Unternehmenseinstellungen aktualisiert.',
    notificationsSectionTitle: 'Benachrichtigungseinstellungen',
    notificationsSubtitle: 'Aktivieren oder deaktivieren Sie Benachrichtigungen und wählen Sie den Empfangskanal.',
    deliveryChannelLabel: 'Empfangskanal',
    channels: {
      platform: 'Nur auf der Plattform',
      email: 'Nur per E-Mail',
      both: 'Beides (Plattform & E-Mail)'
    },
    notificationItems: {
      aiMatches: {
        title: 'Neue KI-Matches',
        desc: 'Benachrichtigen, wenn SkillGap AI passende Kandidaten findet.'
      },
      newApplications: {
        title: 'Kandidatenaktivität & Auswahlliste',
        desc: 'Benachrichtigen bei Vormerkungen oder Statusänderungen von Kandidaten.'
      },
      interviewReminders: {
        title: 'Interview-Erinnerungen',
        desc: 'Hinweise zu anstehenden Interviews und Terminänderungen.'
      },
      teamUpdates: {
        title: 'Team- & Recruiter-Aktivität',
        desc: 'Benachrichtigen, wenn Recruiter beitreten oder Stellen bearbeiten.'
      },
      billingAndLimits: {
        title: 'Abonnement, Abrechnung & Tariflimits',
        desc: 'Hinweise zu Rechnungen, Verlängerungen und erreichten Tarifgrenzen.'
      },
      weeklyAnalytics: {
        title: 'Wöchentlicher Recruiting-Bericht',
        desc: 'Wöchentliche Zusammenfassung der Kennzahlen nach Abteilung.'
      }
    },
    saveNotificationsBtn: 'Benachrichtigungen Speichern',
    savedNotificationsMsg: 'Benachrichtigungseinstellungen gespeichert.',
    supportSectionTitle: 'Business-Support',
    supportSubtitle: 'Benötigen Sie Unterstützung zu Konto, Tariflimits oder Recruiting-Workflows? Senden Sie eine Anfrage.',
    planSupportLabel: 'Enthaltene Support-Stufe:',
    planSlaLabel: 'SLA:',
    subjectLabel: 'Betreff',
    subjectPlaceholder: 'z.B. Frage zu Tariflimits oder Abrechnung',
    messageLabel: 'Nachricht',
    messagePlaceholder: 'Beschreiben Sie Ihr Anliegen für unser Support-Team...',
    sendTicketBtn: 'Support-Anfrage Senden',
    ticketSentMsg: 'Ihre Support-Anfrage wurde gesendet.'
  },
  ar: {
    title: 'الإعدادات',
    subtitle: 'اضبط ملف شركتك وتفضيلات الإشعارات وادخل إلى قسم دعم الشركات.',
    companySectionTitle: 'ملف الشركة',
    companyNameLabel: 'اسم الشركة',
    websiteLabel: 'الموقع الإلكتروني',
    industryLabel: 'القطاع',
    locationLabel: 'الموقع',
    saveCompanyBtn: 'حفظ التغييرات',
    savedCompanyMsg: 'تم تحديث إعدادات الشركة.',
    notificationsSectionTitle: 'تفضيلات الإشعارات',
    notificationsSubtitle: 'فعّل أو عطّل كل إشعار واختر وسيلة الاستلام المفضلة.',
    deliveryChannelLabel: 'وسيلة استلام الإشعارات',
    channels: {
      platform: 'المنصة فقط',
      email: 'البريد الإلكتروني فقط',
      both: 'كلاهما (المنصة والبريد الإلكتروني)'
    },
    notificationItems: {
      aiMatches: {
        title: 'تطابقات الذكاء الاصطناعي الجديدة',
        desc: 'إشعار عند العثور على مرشحين مناسبين للوظائف النشطة عبر SkillGap AI.'
      },
      newApplications: {
        title: 'نشاط المرشحين والقائمة المختصرة',
        desc: 'إشعار عند إضافة مرشح للقائمة المختصرة أو تحديث حالته.'
      },
      interviewReminders: {
        title: 'تذكيرات وجدولة المقابلات',
        desc: 'استلام تنبيهات بالمقابلات القادمة وأي تغييرات في المواعيد.'
      },
      teamUpdates: {
        title: 'تحديثات الفريق ومسؤولي التوظيف',
        desc: 'إشعار عند انضمام مسؤول توظيف جديد أو تعديل الوظائف.'
      },
      billingAndLimits: {
        title: 'الاشتراك والفوترة وحدود الباقة',
        desc: 'تنبيهات الفواتير والتجديد والاقتراب من حدود الوظائف أو مسؤولي التوظيف.'
      },
      weeklyAnalytics: {
        title: 'الملخص الأسبوعي للإحصاءات',
        desc: 'تقرير أسبوعي لأداء التوظيف ومؤشرات الأقسام.'
      }
    },
    saveNotificationsBtn: 'حفظ إعدادات الإشعارات',
    savedNotificationsMsg: 'تم حفظ تفضيلات الإشعارات.',
    supportSectionTitle: 'دعم الشركات',
    supportSubtitle: 'هل تحتاج إلى مساعدة بخصوص الحساب أو حدود الباقة أو التوظيف؟ أرسل طلب دعم.',
    planSupportLabel: 'مستوى الدعم المضمن:',
    planSlaLabel: 'اتفاقية مستوى الخدمة (SLA):',
    subjectLabel: 'الموضوع',
    subjectPlaceholder: 'مثال: استفسار حول حدود الباقة أو الفوترة',
    messageLabel: 'الرسالة',
    messagePlaceholder: 'اشرح كيف يمكن لفريق الدعم مساعدة شركتك...',
    sendTicketBtn: 'إرسال طلب الدعم',
    ticketSentMsg: 'تم إرسال طلب الدعم بنجاح.'
  }
};

type NotificationToggleKey = Exclude<keyof NotificationPreferences, 'channel'>;

const TOGGLE_KEYS: NotificationToggleKey[] = [
  'aiMatches',
  'newApplications',
  'interviewReminders',
  'teamUpdates',
  'billingAndLimits',
  'weeklyAnalytics'
];

export default function BusinessSettingsPage() {
  const { lang, activePlan, refreshSubscription } = useBusinessDashboardLang();
  const copy = SETTINGS_COPY[lang] || SETTINGS_COPY.en;
  const isRtl = lang === 'ar';

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);
  const [companySavedNotice, setCompanySavedNotice] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSavedNotice, setPrefsSavedNotice] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendingTicket, setSendingTicket] = useState(false);
  const [ticketSentNotice, setTicketSentNotice] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      if (!supabase) return;

      const { data } = await supabase
        .from('companies')
        .select('id,name,website,industry,location')
        .limit(1);

      const row = data?.[0] as
        | {
            id: string;
            name?: string | null;
            website?: string | null;
            industry?: string | null;
            location?: string | null;
          }
        | undefined;

      if (row) {
        setCompanyId(row.id);
        setName(row.name || '');
        setWebsite(row.website || '');
        setIndustry(row.industry || '');
        setLocation(row.location || '');

        const { data: notifData } = await supabase
          .from('company_notification_settings')
          .select(
            'channel,ai_matches,new_applications,interview_reminders,team_updates,billing_and_limits,weekly_analytics'
          )
          .eq('company_id', row.id)
          .limit(1);

        const nRow = notifData?.[0] as
          | {
              channel?: DeliveryChannel;
              ai_matches?: boolean;
              new_applications?: boolean;
              interview_reminders?: boolean;
              team_updates?: boolean;
              billing_and_limits?: boolean;
              weekly_analytics?: boolean;
            }
          | undefined;

        if (nRow) {
          setPrefs({
            channel:
              nRow.channel === 'platform' || nRow.channel === 'email' || nRow.channel === 'both'
                ? nRow.channel
                : 'both',
            aiMatches: nRow.ai_matches ?? true,
            newApplications: nRow.new_applications ?? true,
            interviewReminders: nRow.interview_reminders ?? true,
            teamUpdates: nRow.team_updates ?? true,
            billingAndLimits: nRow.billing_and_limits ?? true,
            weeklyAnalytics: nRow.weekly_analytics ?? false
          });
        }
      }
    }

    loadSettings();
  }, []);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanySavedNotice(false);
    setCompanyError(null);

    try {
      if (!supabase) {
        setCompanyError('Supabase client is not initialized. Check .env.local.');
        return;
      }

      const payload = {
        name: name.trim(),
        website: website.trim(),
        industry: industry.trim(),
        location: location.trim()
      };

      if (companyId) {
        const { error } = await supabase.from('companies').update(payload).eq('id', companyId);
        if (error) {
          setCompanyError(error.message);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from('companies')
          .insert(payload)
          .select('id')
          .single();
        if (error) {
          setCompanyError(error.message);
          return;
        }
        if (data?.id) setCompanyId(data.id);
      }

      await refreshSubscription();
      setCompanySavedNotice(true);
    } finally {
      setSavingCompany(false);
    }
  };

  const handleTogglePref = (key: NotificationToggleKey) => {
    setPrefsSavedNotice(false);
    setPrefsError(null);
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsSavedNotice(false);
    setPrefsError(null);

    try {
      if (!supabase) {
        setPrefsError('Supabase client is not initialized. Check .env.local.');
        return;
      }

      const { error } = await supabase.from('company_notification_settings').upsert(
        {
          company_id: companyId,
          channel: prefs.channel,
          ai_matches: prefs.aiMatches,
          new_applications: prefs.newApplications,
          interview_reminders: prefs.interviewReminders,
          team_updates: prefs.teamUpdates,
          billing_and_limits: prefs.billingAndLimits,
          weekly_analytics: prefs.weeklyAnalytics,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'company_id' }
      );

      if (error) {
        setPrefsError(error.message);
        return;
      }

      setPrefsSavedNotice(true);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSendingTicket(true);
    setTicketSentNotice(false);
    setTicketError(null);

    try {
      if (!supabase) {
        setTicketError('Supabase client is not initialized. Check .env.local.');
        return;
      }

      const { error } = await supabase.from('support_tickets').insert({
        company_id: companyId,
        company_name: name.trim() || null,
        plan_id: activePlan?.id || 'starter',
        subject: subject.trim(),
        message: message.trim(),
        status: 'open'
      });

      if (error) {
        setTicketError(error.message);
        return;
      }

      setSubject('');
      setMessage('');
      setTicketSentNotice(true);
    } finally {
      setSendingTicket(false);
    }
  };

  const channelIcons: Record<DeliveryChannel, React.ComponentType<{ className?: string }>> = {
    platform: Monitor,
    email: Mail,
    both: Layers
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
      </div>

      {/* Secção 1: Preferências de Notificações */}
      <form
        onSubmit={handleSaveNotifications}
        className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-6 space-y-5 text-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">{copy.notificationsSectionTitle}</h2>
            </div>
            <p className="text-gray-400 mt-1">{copy.notificationsSubtitle}</p>
          </div>
        </div>

        {/* Escolha do canal: Plataforma, E-mail ou Ambos */}
        <div className="space-y-2">
          <label className="block text-gray-300 font-semibold">{copy.deliveryChannelLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['platform', 'email', 'both'] as DeliveryChannel[]).map((ch) => {
              const Icon = channelIcons[ch];
              const active = prefs.channel === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => {
                    setPrefsSavedNotice(false);
                    setPrefsError(null);
                    setPrefs((prev) => ({ ...prev, channel: ch }));
                  }}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#1a0d33] border-purple-400 text-white shadow-sm'
                      : 'bg-[#080410] border-white/[0.08] text-gray-400 hover:border-purple-500/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{copy.channels[ch]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de notificações ativáveis/desativáveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {TOGGLE_KEYS.map((key) => {
            const enabled = prefs[key];
            const itemCopy = copy.notificationItems[key];
            return (
              <div
                key={key}
                onClick={() => handleTogglePref(key)}
                className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition cursor-pointer ${
                  enabled
                    ? 'bg-[#0f081d] border-purple-500/35'
                    : 'bg-[#080410] border-white/[0.06] opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{itemCopy.title}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{itemCopy.desc}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePref(key);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition cursor-pointer ${
                    enabled ? 'bg-[#6d28d9]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      enabled
                        ? isRtl
                          ? '-translate-x-6'
                          : 'translate-x-6'
                        : isRtl
                        ? '-translate-x-1'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <div className="space-y-1">
            {prefsSavedNotice && (
              <p className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{copy.savedNotificationsMsg}</span>
              </p>
            )}
            {prefsError && <p className="text-red-400 font-semibold">{prefsError}</p>}
          </div>

          <button
            type="submit"
            disabled={savingPrefs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-xs font-bold text-white transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{copy.saveNotificationsBtn}</span>
          </button>
        </div>
      </form>

      {/* Secção 2 e 3: Perfil da Empresa & Suporte para Empresas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleSaveCompany}
          className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-6 space-y-4 text-xs"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">{copy.companySectionTitle}</h2>
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">{copy.companyNameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">{copy.websiteLabel}</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">{copy.industryLabel}</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
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

          {companySavedNotice && (
            <p className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{copy.savedCompanyMsg}</span>
            </p>
          )}
          {companyError && <p className="text-red-400 font-semibold">{companyError}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingCompany}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-xs font-bold text-white transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{copy.saveCompanyBtn}</span>
            </button>
          </div>
        </form>

        <form
          onSubmit={handleSendSupport}
          className="rounded-2xl bg-[#0b0614] border border-purple-500/25 p-6 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">{copy.supportSectionTitle}</h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/35 text-[11px] font-bold text-purple-200">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              {activePlan?.name || 'STARTER'}
            </span>
          </div>

          <p className="text-gray-400 leading-relaxed">{copy.supportSubtitle}</p>

          <div className="rounded-xl bg-[#080410] border border-white/[0.06] p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-gray-400">{copy.planSupportLabel} </span>
              <strong className="text-white">{activePlan?.support || 'Email'}</strong>
            </div>
            <div>
              <span className="text-gray-400">{copy.planSlaLabel} </span>
              <strong className="text-purple-300">{activePlan?.sla || '—'}</strong>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">{copy.subjectLabel}</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={copy.subjectPlaceholder}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">{copy.messageLabel}</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={copy.messagePlaceholder}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400"
            />
          </div>

          {ticketSentNotice && (
            <p className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{copy.ticketSentMsg}</span>
            </p>
          )}
          {ticketError && <p className="text-red-400 font-semibold">{ticketError}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={sendingTicket}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-xs font-bold text-white transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{copy.sendTicketBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}