'use client';

import React, { useEffect, useState } from 'react';
import {
  Check,
  Sparkles,
  CreditCard,
  Landmark,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Infinity as InfinityIcon,
  X
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

type BillingCurrency = 'EUR' | 'USD';
type PaymentMethod = 'card' | 'bank_transfer' | 'apple_pay' | 'google_pay';
type PlanTier = 'free' | 'normal' | 'advanced';

interface SubscriptionRecord {
  plan_tier: PlanTier;
  currency: BillingCurrency;
  payment_method: PaymentMethod | null;
  status: string;
  updated_at?: string;
}

const SUBSCRIPTION_TEXTS: Record<string, any> = {
  en: {
    title: "Subscription Plans & Billing",
    subtitle: "Choose the plan that fits your career stage. Same price in EUR or USD.",
    currentPlanBadge: "CURRENT PLAN",
    activeStatus: "Active",
    monthlySuffix: "/ month",
    unlimitedInterviews: "Unlimited interviews",
    threeInterviews: "3 interviews included",
    selectFreeBtn: "Activate Free Plan",
    selectPaidBtn: "Subscribe Now",
    currentBtn: "Current Plan",
    checkoutTitle: "Complete Subscription",
    selectedPlanLabel: "Selected Plan",
    totalAmountLabel: "Amount to Pay",
    currencyLabel: "Currency (1:1 parity)",
    paymentMethodLabel: "Payment Method",
    methodCard: "Credit / Debit Card",
    methodBank: "Bank Transfer",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "Cardholder / Account Reference",
    cardHolderPlaceholder: "Full name or transfer reference",
    cardNumberLabel: "Card / Account Details",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "Confirm Subscription",
    processingBtn: "Processing...",
    cancelBtn: "Cancel",
    savedMsg: "Your subscription has been updated successfully.",
    errorMsg: "Could not complete the subscription update. Please try again.",
    comparisonTitle: "Plan Comparison",
    featureCol: "Features",
    interviewsRow: "Interviews",
    aiRow: "Artificial Intelligence Suite",
    matchingRow: "Company Matching",
    cvRow: "CV & Profile Tools",
    aiIncluded: "Full AI Access",
    aiExcluded: "Not Included",
    basicMatch: "Basic",
    normalMatch: "Standard",
    smartMatch: "AI Smart Match",
    plans: {
      free: {
        name: "Free",
        price: 0,
        tagline: "Basic access to discover SkillGap",
        features: [
          "3 interviews included",
          "Professional profile creation",
          "CV upload",
          "Job search & viewing open roles",
          "Company information lookup",
          "Application tracking",
          "Basic platform access",
          "No Artificial Intelligence access"
        ]
      },
      normal: {
        name: "Normal",
        price: 19.99,
        tagline: "For candidates actively seeking opportunities",
        features: [
          "Unlimited interviews",
          "Everything in Free plan",
          "Full access to job opportunities",
          "Standard matching with companies",
          "Complete professional profile",
          "Application history",
          "Recruitment process tracking",
          "No Artificial Intelligence access"
        ]
      },
      advanced: {
        name: "Advanced",
        price: 79.99,
        tagline: "Full career experience with advanced AI tools",
        features: [
          "Unlimited interviews",
          "Everything in Normal plan",
          "Full Artificial Intelligence access",
          "AI CV analysis & optimization",
          "AI interview preparation & simulations",
          "Professional skill analysis & Skill Gap detection",
          "Personalized career & job recommendations",
          "Career development plan, advanced reports & priority support"
        ]
      }
    }
  },
  pt: {
    title: "Planos de Subscrição & Pagamentos",
    subtitle: "Escolhe o plano ideal para a tua carreira. Mesmo preço em EUR ou USD.",
    currentPlanBadge: "PLANO ATUAL",
    activeStatus: "Ativo",
    monthlySuffix: "/ mês",
    unlimitedInterviews: "Entrevistas ilimitadas",
    threeInterviews: "3 entrevistas incluídas",
    selectFreeBtn: "Ativar Plano Grátis",
    selectPaidBtn: "Subscrever Agora",
    currentBtn: "Plano Atual",
    checkoutTitle: "Concluir Subscrição",
    selectedPlanLabel: "Plano Selecionado",
    totalAmountLabel: "Valor a Pagar",
    currencyLabel: "Moeda (paridade 1:1)",
    paymentMethodLabel: "Método de Pagamento",
    methodCard: "Cartão de Crédito / Débito",
    methodBank: "Transferência Bancária",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "Titular / Referência de Pagamento",
    cardHolderPlaceholder: "Nome completo ou referência",
    cardNumberLabel: "Dados do Cartão / Conta",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "Confirmar Subscrição",
    processingBtn: "A processar...",
    cancelBtn: "Cancelar",
    savedMsg: "A tua subscrição foi atualizada com sucesso.",
    errorMsg: "Não foi possível atualizar a subscrição. Tenta novamente.",
    comparisonTitle: "Comparação dos Planos",
    featureCol: "Funcionalidades",
    interviewsRow: "Entrevistas",
    aiRow: "Inteligência Artificial",
    matchingRow: "Matching com Empresas",
    cvRow: "Perfil & CV",
    aiIncluded: "Acesso Completo IA",
    aiExcluded: "Sem IA",
    basicMatch: "Básico",
    normalMatch: "Normal",
    smartMatch: "Inteligente (IA)",
    plans: {
      free: {
        name: "Grátis",
        price: 0,
        tagline: "Acesso básico para descobrir a SkillGap",
        features: [
          "3 entrevistas incluídas",
          "Criação de perfil profissional",
          "Upload de CV",
          "Pesquisa e visualização de vagas disponíveis",
          "Consulta de informações das empresas",
          "Acompanhamento de candidaturas",
          "Acesso básico à plataforma",
          "Sem acesso à Inteligência Artificial"
        ]
      },
      normal: {
        name: "Normal",
        price: 19.99,
        tagline: "Para candidatos que procuram oportunidades profissionais",
        features: [
          "Entrevistas ilimitadas",
          "Todas as funcionalidades do plano Grátis",
          "Acesso a oportunidades de emprego",
          "Matching normal com empresas",
          "Perfil profissional completo",
          "Histórico de candidaturas",
          "Acompanhamento de processos de recrutamento",
          "Sem acesso à Inteligência Artificial"
        ]
      },
      advanced: {
        name: "Avançado",
        price: 79.99,
        tagline: "Experiência profissional com ferramentas avançadas de IA",
        features: [
          "Entrevistas ilimitadas",
          "Todas as funcionalidades do plano Normal",
          "Acesso completo à Inteligência Artificial",
          "Análise e otimização de CV com IA",
          "Preparação e simulações de entrevistas com IA",
          "Análise de competências e identificação de Skill Gaps",
          "Recomendações personalizadas de carreira e emprego",
          "Plano de desenvolvimento, relatórios avançados e suporte prioritário"
        ]
      }
    }
  },
  es: {
    title: "Planes de Suscripción y Pagos",
    subtitle: "Elige el plan ideal para tu carrera. Mismo precio en EUR o USD.",
    currentPlanBadge: "PLAN ACTUAL",
    activeStatus: "Activo",
    monthlySuffix: "/ mes",
    unlimitedInterviews: "Entrevistas ilimitadas",
    threeInterviews: "3 entrevistas incluidas",
    selectFreeBtn: "Activar Plan Gratis",
    selectPaidBtn: "Suscribirse Ahora",
    currentBtn: "Plan Actual",
    checkoutTitle: "Completar Suscripción",
    selectedPlanLabel: "Plan Seleccionado",
    totalAmountLabel: "Importe a Pagar",
    currencyLabel: "Moneda (paridad 1:1)",
    paymentMethodLabel: "Método de Pago",
    methodCard: "Tarjeta de Crédito / Débito",
    methodBank: "Transferencia Bancaria",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "Titular / Referencia de Pago",
    cardHolderPlaceholder: "Nombre completo o referencia",
    cardNumberLabel: "Datos de Tarjeta / Cuenta",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "Confirmar Suscripción",
    processingBtn: "Procesando...",
    cancelBtn: "Cancelar",
    savedMsg: "Tu suscripción se actualizó correctamente.",
    errorMsg: "No se pudo actualizar la suscripción. Inténtalo de nuevo.",
    comparisonTitle: "Comparación de Planes",
    featureCol: "Funcionalidades",
    interviewsRow: "Entrevistas",
    aiRow: "Inteligencia Artificial",
    matchingRow: "Matching con Empresas",
    cvRow: "Perfil y CV",
    aiIncluded: "IA Completa",
    aiExcluded: "Sin IA",
    basicMatch: "Básico",
    normalMatch: "Normal",
    smartMatch: "Inteligente con IA",
    plans: {
      free: {
        name: "Gratis",
        price: 0,
        tagline: "Acceso básico para descubrir SkillGap",
        features: [
          "3 entrevistas incluidas",
          "Creación de perfil profesional",
          "Subida de CV",
          "Búsqueda y visualización de vacantes",
          "Consulta de información de empresas",
          "Seguimiento de postulaciones",
          "Acceso básico a la plataforma",
          "Sin acceso a Inteligencia Artificial"
        ]
      },
      normal: {
        name: "Normal",
        price: 19.99,
        tagline: "Para candidatos que buscan oportunidades profesionales",
        features: [
          "Entrevistas ilimitadas",
          "Todas las funciones del plan Gratis",
          "Acceso a oportunidades de empleo",
          "Matching normal con empresas",
          "Perfil profesional completo",
          "Historial de postulaciones",
          "Seguimiento de procesos de selección",
          "Sin acceso a Inteligencia Artificial"
        ]
      },
      advanced: {
        name: "Avanzado",
        price: 79.99,
        tagline: "Experiencia profesional con herramientas avanzadas de IA",
        features: [
          "Entrevistas ilimitadas",
          "Todas las funciones del plan Normal",
          "Acceso completo a Inteligencia Artificial",
          "Análisis y optimización de CV con IA",
          "Preparación y simulaciones de entrevistas con IA",
          "Análisis de competencias y detección de Skill Gaps",
          "Recomendaciones personalizadas de carrera y empleo",
          "Plan de desarrollo, informes avanzados y soporte prioritario"
        ]
      }
    }
  },
  fr: {
    title: "Offres d'Abonnement & Paiements",
    subtitle: "Choisissez l'offre adaptée à votre parcours. Même tarif en EUR ou USD.",
    currentPlanBadge: "OFFRE ACTUELLE",
    activeStatus: "Actif",
    monthlySuffix: "/ mois",
    unlimitedInterviews: "Entretiens illimités",
    threeInterviews: "3 entretiens inclus",
    selectFreeBtn: "Activer l'Offre Gratuite",
    selectPaidBtn: "S'abonner",
    currentBtn: "Offre Actuelle",
    checkoutTitle: "Finaliser l'Abonnement",
    selectedPlanLabel: "Offre Sélectionnée",
    totalAmountLabel: "Montant à Payer",
    currencyLabel: "Devise (parité 1:1)",
    paymentMethodLabel: "Moyen de Paiement",
    methodCard: "Carte de Crédit / Débit",
    methodBank: "Virement Bancaire",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "Titulaire / Référence de Paiement",
    cardHolderPlaceholder: "Nom complet ou référence",
    cardNumberLabel: "Coordonnées Carte / Compte",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "Confirmer l'Abonnement",
    processingBtn: "Traitement...",
    cancelBtn: "Annuler",
    savedMsg: "Votre abonnement a bien été mis à jour.",
    errorMsg: "Impossible de mettre à jour l'abonnement. Réessayez.",
    comparisonTitle: "Comparatif des Offres",
    featureCol: "Fonctionnalités",
    interviewsRow: "Entretiens",
    aiRow: "Intelligence Artificielle",
    matchingRow: "Matching Entreprises",
    cvRow: "Profil & CV",
    aiIncluded: "IA Complète",
    aiExcluded: "Sans IA",
    basicMatch: "Basique",
    normalMatch: "Standard",
    smartMatch: "IA Intelligente",
    plans: {
      free: {
        name: "Gratuit",
        price: 0,
        tagline: "Accès de base pour découvrir SkillGap",
        features: [
          "3 entretiens inclus",
          "Création de profil professionnel",
          "Téléversement de CV",
          "Recherche et consultation des offres",
          "Consultation des informations entreprises",
          "Suivi des candidatures",
          "Accès de base à la plateforme",
          "Sans accès à l'Intelligence Artificielle"
        ]
      },
      normal: {
        name: "Normal",
        price: 19.99,
        tagline: "Pour les candidats actifs en recherche d'opportunités",
        features: [
          "Entretiens illimités",
          "Toutes les fonctionnalités de l'offre Gratuite",
          "Accès aux opportunités d'emploi",
          "Matching standard avec les entreprises",
          "Profil professionnel complet",
          "Historique des candidatures",
          "Suivi des processus de recrutement",
          "Sans accès à l'Intelligence Artificielle"
        ]
      },
      advanced: {
        name: "Avancé",
        price: 79.99,
        tagline: "Expérience professionnelle avec outils IA avancés",
        features: [
          "Entretiens illimités",
          "Toutes les fonctionnalités de l'offre Normal",
          "Accès complet à l'Intelligence Artificielle",
          "Analyse et optimisation de CV par IA",
          "Préparation et simulations d'entretiens par IA",
          "Analyse des compétences et détection des Skill Gaps",
          "Recommandations personnalisées de carrière et d'emploi",
          "Plan de développement, rapports avancés et support prioritaire"
        ]
      }
    }
  },
  de: {
    title: "Abonnementpläne & Zahlung",
    subtitle: "Wählen Sie den passenden Tarif. Gleicher Preis in EUR oder USD.",
    currentPlanBadge: "AKTUELLER PLAN",
    activeStatus: "Aktiv",
    monthlySuffix: "/ Monat",
    unlimitedInterviews: "Unbegrenzte Interviews",
    threeInterviews: "3 Interviews inklusive",
    selectFreeBtn: "Gratisplan aktivieren",
    selectPaidBtn: "Jetzt abonnieren",
    currentBtn: "Aktueller Plan",
    checkoutTitle: "Abonnement abschließen",
    selectedPlanLabel: "Gewählter Plan",
    totalAmountLabel: "Zahlungsbetrag",
    currencyLabel: "Währung (1:1 Parität)",
    paymentMethodLabel: "Zahlungsmethode",
    methodCard: "Kredit- / Debitkarte",
    methodBank: "Banküberweisung",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "Kontoinhaber / Zahlungsreferenz",
    cardHolderPlaceholder: "Vollständiger Name oder Referenz",
    cardNumberLabel: "Karten- / Kontodaten",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "Abonnement bestätigen",
    processingBtn: "Wird verarbeitet...",
    cancelBtn: "Abbrechen",
    savedMsg: "Ihr Abonnement wurde erfolgreich aktualisiert.",
    errorMsg: "Abonnement konnte nicht aktualisiert werden. Bitte erneut versuchen.",
    comparisonTitle: "Tarifvergleich",
    featureCol: "Funktionen",
    interviewsRow: "Interviews",
    aiRow: "Künstliche Intelligenz",
    matchingRow: "Unternehmens-Matching",
    cvRow: "Profil & Lebenslauf",
    aiIncluded: "Volle KI-Funktionen",
    aiExcluded: "Keine KI",
    basicMatch: "Basis",
    normalMatch: "Standard",
    smartMatch: "KI-Smart-Match",
    plans: {
      free: {
        name: "Gratis",
        price: 0,
        tagline: "Basiszugang zum Entdecken von SkillGap",
        features: [
          "3 Interviews inklusive",
          "Erstellung eines Berufsprofils",
          "Lebenslauf-Upload",
          "Stellensuche und Ansicht offener Stellen",
          "Einsicht in Unternehmensinformationen",
          "Bewerbungsverfolgung",
          "Basiszugang zur Plattform",
          "Kein Zugriff auf Künstliche Intelligenz"
        ]
      },
      normal: {
        name: "Normal",
        price: 19.99,
        tagline: "Für Kandidaten auf aktiver Stellensuche",
        features: [
          "Unbegrenzte Interviews",
          "Alle Funktionen des Gratisplans",
          "Zugang zu Stellenangeboten",
          "Standard-Matching mit Unternehmen",
          "Vollständiges Berufsprofil",
          "Bewerbungshistorie",
          "Verfolgung von Bewerbungsprozessen",
          "Kein Zugriff auf Künstliche Intelligenz"
        ]
      },
      advanced: {
        name: "Erweitert",
        price: 79.99,
        tagline: "Karriereerlebnis mit erweiterten KI-Werkzeugen",
        features: [
          "Unbegrenzte Interviews",
          "Alle Funktionen des Normalplans",
          "Voller Zugriff auf Künstliche Intelligenz",
          "KI-Lebenslaufanalyse & -optimierung",
          "KI-Interviewvorbereitung & -simulationen",
          "Kompetenzanalyse & Skill-Gap-Erkennung",
          "Personalisierte Karriere- & Jobempfehlungen",
          "Entwicklungsplan, erweiterte Berichte & Priority-Support"
        ]
      }
    }
  },
  ar: {
    title: "باقات الاشتراك والدفع",
    subtitle: "اختر الباقة المناسبة لمسارك المهني. نفس السعر باليورو أو الدولار.",
    currentPlanBadge: "الباقة الحالية",
    activeStatus: "نشط",
    monthlySuffix: "/ شهر",
    unlimitedInterviews: "مقابلات غير محدودة",
    threeInterviews: "3 مقابلات مشمولة",
    selectFreeBtn: "تفعيل الباقة المجانية",
    selectPaidBtn: "اشترك الآن",
    currentBtn: "الباقة الحالية",
    checkoutTitle: "إتمام الاشتراك",
    selectedPlanLabel: "الباقة المختارة",
    totalAmountLabel: "المبلغ المستحق",
    currencyLabel: "العملة (تسعير متساوٍ)",
    paymentMethodLabel: "وسيلة الدفع",
    methodCard: "بطاقة ائتمان / خصم",
    methodBank: "تحويل بنكي",
    methodApplePay: "Apple Pay",
    methodGooglePay: "Google Pay",
    cardHolderLabel: "اسم صاحب الحساب / مرجع الدفع",
    cardHolderPlaceholder: "الاسم الكامل أو رقم المرجع",
    cardNumberLabel: "بيانات البطاقة / الحساب",
    cardNumberPlaceholder: "•••• •••• •••• ••••",
    confirmPayBtn: "تأكيد الاشتراك",
    processingBtn: "جاري المعالجة...",
    cancelBtn: "إلغاء",
    savedMsg: "تم تحديث اشتراكك بنجاح.",
    errorMsg: "تعذر تحديث الاشتراك. يرجى المحاولة مرة أخرى.",
    comparisonTitle: "مقارنة الباقات",
    featureCol: "المزايا",
    interviewsRow: "المقابلات",
    aiRow: "الذكاء الاصطناعي",
    matchingRow: "المطابقة مع الشركات",
    cvRow: "الملف الشخصي والسيرة الذاتية",
    aiIncluded: "ذكاء اصطناعي كامل",
    aiExcluded: "بدون ذكاء اصطناعي",
    basicMatch: "أساسي",
    normalMatch: "قياسي",
    smartMatch: "مطابقة ذكية بالذكاء الاصطناعي",
    plans: {
      free: {
        name: "مجاني",
        price: 0,
        tagline: "وصول أساسي لاستكشاف منصة SkillGap",
        features: [
          "3 مقابلات مشمولة",
          "إنشاء ملف مهني",
          "رفع السيرة الذاتية",
          "البحث عن الوظائف واستعراض الفرص المتاحة",
          "الاطلاع على معلومات الشركات",
          "متابعة طلبات التوظيف",
          "وصول أساسي إلى المنصة",
          "بدون وصول إلى الذكاء الاصطناعي"
        ]
      },
      normal: {
        name: "عادي",
        price: 19.99,
        tagline: "للمرشحين الباحثين بنشاط عن فرص مهنية",
        features: [
          "مقابلات غير محدودة",
          "جميع مزايا الباقة المجانية",
          "الوصول إلى الفرص الوظيفية",
          "مطابقة قياسية مع الشركات",
          "ملف مهني متكامل",
          "سجل طلبات التوظيف",
          "متابعة مراحل التوظيف",
          "بدون وصول إلى الذكاء الاصطناعي"
        ]
      },
      advanced: {
        name: "متقدم",
        price: 79.99,
        tagline: "تجربة مهنية بأدوات ذكاء اصطناعي متقدمة",
        features: [
          "مقابلات غير محدودة",
          "جميع مزايا الباقة العادية",
          "وصول كامل إلى الذكاء الاصطناعي",
          "تحليل وتحسين السيرة الذاتية بالذكاء الاصطناعي",
          "التحضير ومحاكاة المقابلات بالذكاء الاصطناعي",
          "تحليل المهارات وتحديد فجوات المهارات",
          "توصيات مخصصة للمسار المهني والوظائف",
          "خطة تطوير مهني وتقارير متقدمة ودعم ذو أولوية"
        ]
      }
    }
  }
};

function formatAmount(amount: number, currency: BillingCurrency): string {
  const symbol = currency === 'EUR' ? '€' : '$';
  const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${symbol}${formatted}`;
}

export default function CandidateSubscriptionsPage() {
  const { lang } = useDashboardLang();
  const sub = SUBSCRIPTION_TEXTS[lang] || SUBSCRIPTION_TEXTS['en'];

  const [userId, setUserId] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<PlanTier>('free');
  const [currency, setCurrency] = useState<BillingCurrency>('EUR');
  const [checkoutTier, setCheckoutTier] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [holderRef, setHolderRef] = useState('');
  const [accountRef, setAccountRef] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    async function loadSub() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) return;
        setUserId(uid);

        const { data } = await supabase
          .from('candidate_subscriptions')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle();

        if (!active || !data) return;

        const record = data as SubscriptionRecord;
        if (record.plan_tier === 'normal' || record.plan_tier === 'advanced' || record.plan_tier === 'free') {
          setCurrentTier(record.plan_tier);
        }
        if (record.currency === 'USD' || record.currency === 'EUR') {
          setCurrency(record.currency);
        }
        if (record.payment_method) {
          setPaymentMethod(record.payment_method);
        }
      } catch {
        // Mantém plano padrão 'free' se ainda não houver registo
      }
    }
    loadSub();
    return () => {
      active = false;
    };
  }, []);

  const persistSubscription = async (tier: PlanTier, method: PaymentMethod | null) => {
    setSaving(true);
    setFeedback(null);
    try {
      if (userId) {
        const { error } = await supabase
          .from('candidate_subscriptions')
          .upsert(
            {
              user_id: userId,
              plan_tier: tier,
              currency,
              payment_method: method,
              status: 'active',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
      }

      setCurrentTier(tier);
      setCheckoutTier(null);
      setHolderRef('');
      setAccountRef('');
      setFeedback({ type: 'success', text: sub.savedMsg });
    } catch {
      setFeedback({ type: 'error', text: sub.errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handlePlanAction = (tier: PlanTier) => {
    setFeedback(null);
    if (tier === 'free') {
      persistSubscription('free', null);
      return;
    }
    setCheckoutTier(tier);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    persistSubscription(checkoutTier, paymentMethod);
  };

  const activePlanObj = checkoutTier ? sub.plans[checkoutTier] : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho & Seletor de Moeda (EUR / USD com mesmo preço) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold tracking-wider">
              {sub.currentPlanBadge}: {sub.plans[currentTier]?.name}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">{sub.activeStatus}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {sub.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{sub.subtitle}</p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="text-[11px] text-gray-400 font-medium">{sub.currencyLabel}</span>
          <div className="inline-flex rounded-xl bg-[#0c0716] border border-purple-500/30 p-1">
            {(['EUR', 'USD'] as BillingCurrency[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currency === curr
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {curr === 'EUR' ? 'EUR (€)' : 'USD ($)'}
              </button>
            ))}
          </div>
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

      {/* Cartões dos 3 Planos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['free', 'normal', 'advanced'] as PlanTier[]).map((tier) => {
          const plan = sub.plans[tier];
          const isCurrent = currentTier === tier;
          const isAdvanced = tier === 'advanced';
          const isUnlimited = tier === 'normal' || tier === 'advanced';

          return (
            <div
              key={tier}
              className={`p-6 rounded-2xl bg-[#0c0716] border transition flex flex-col justify-between relative overflow-hidden ${
                isAdvanced
                  ? 'border-purple-500/50 shadow-lg shadow-purple-900/20'
                  : isCurrent
                  ? 'border-emerald-500/40'
                  : 'border-purple-900/40 hover:border-purple-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  {isUnlimited ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                      <InfinityIcon className="w-3 h-3" />
                      <span>{sub.unlimitedInterviews}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                      <span>{sub.threeInterviews}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 min-h-[32px]">{plan.tagline}</p>

                <div className="mt-5 mb-6 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">
                    {formatAmount(plan.price, currency)}
                  </span>
                  <span className="text-xs text-gray-400">{sub.monthlySuffix}</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isAdvanced ? 'text-purple-400' : 'text-emerald-400'
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent || saving}
                onClick={() => handlePlanAction(tier)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 cursor-default'
                    : isAdvanced
                    ? 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 hover:opacity-95'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
                }`}
              >
                {isAdvanced && !isCurrent && <Sparkles className="w-4 h-4" />}
                <span>
                  {isCurrent
                    ? sub.currentBtn
                    : tier === 'free'
                    ? sub.selectFreeBtn
                    : sub.selectPaidBtn}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Formulário de Pagamento (Cartão Crédito/Débito, Transferência Bancária, Apple Pay, Google Pay) */}
      {checkoutTier && activePlanObj && (
        <form
          onSubmit={handleConfirmCheckout}
          className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/40 space-y-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{sub.checkoutTitle}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {sub.selectedPlanLabel}:{' '}
                <strong className="text-purple-300">{activePlanObj.name}</strong> •{' '}
                {sub.totalAmountLabel}:{' '}
                <strong className="text-emerald-400">
                  {formatAmount(activePlanObj.price, currency)} {sub.monthlySuffix}
                </strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutTier(null)}
              className="p-2 rounded-xl bg-white/5 border border-purple-500/20 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2.5">{sub.paymentMethodLabel}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'card', label: sub.methodCard, icon: CreditCard },
                { id: 'bank_transfer', label: sub.methodBank, icon: Landmark },
                { id: 'apple_pay', label: sub.methodApplePay, icon: Smartphone },
                { id: 'google_pay', label: sub.methodGooglePay, icon: Smartphone },
              ].map((m) => {
                const IconComp = m.icon;
                const activeMethod = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                      activeMethod
                        ? 'bg-purple-600/25 border-purple-500 text-white'
                        : 'bg-white/5 border-purple-500/15 text-gray-300 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{sub.cardHolderLabel}</label>
              <input
                type="text"
                value={holderRef}
                onChange={(e) => setHolderRef(e.target.value)}
                placeholder={sub.cardHolderPlaceholder}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{sub.cardNumberLabel}</label>
              <input
                type="text"
                value={accountRef}
                onChange={(e) => setAccountRef(e.target.value)}
                placeholder={sub.cardNumberPlaceholder}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>EUR (€) & USD ($) • {sub.methodCard}, {sub.methodBank}, Apple Pay, Google Pay</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCheckoutTier(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-xs text-gray-300 hover:text-white cursor-pointer"
              >
                {sub.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 cursor-pointer disabled:opacity-60"
              >
                {saving ? sub.processingBtn : sub.confirmPayBtn}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tabela Comparativa */}
      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 overflow-x-auto">
        <h2 className="text-base font-bold text-white mb-4">{sub.comparisonTitle}</h2>
        <table className="w-full text-start border-collapse text-xs">
          <thead>
            <tr className="border-b border-purple-900/40 text-gray-400">
              <th className="py-3 pe-4 text-start font-semibold">{sub.featureCol}</th>
              <th className="py-3 px-4 text-start font-semibold">{sub.plans.free.name}</th>
              <th className="py-3 px-4 text-start font-semibold">{sub.plans.normal.name}</th>
              <th className="py-3 ps-4 text-start font-semibold text-purple-300">
                {sub.plans.advanced.name}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20 text-gray-300">
            <tr>
              <td className="py-3 pe-4 font-medium text-white">{sub.interviewsRow}</td>
              <td className="py-3 px-4">{sub.threeInterviews}</td>
              <td className="py-3 px-4 text-emerald-400 font-semibold">{sub.unlimitedInterviews}</td>
              <td className="py-3 ps-4 text-emerald-400 font-semibold">{sub.unlimitedInterviews}</td>
            </tr>
            <tr>
              <td className="py-3 pe-4 font-medium text-white">{sub.matchingRow}</td>
              <td className="py-3 px-4">{sub.basicMatch}</td>
              <td className="py-3 px-4">{sub.normalMatch}</td>
              <td className="py-3 ps-4 text-purple-300 font-semibold">{sub.smartMatch}</td>
            </tr>
            <tr>
              <td className="py-3 pe-4 font-medium text-white">{sub.aiRow}</td>
              <td className="py-3 px-4 text-gray-500">{sub.aiExcluded}</td>
              <td className="py-3 px-4 text-gray-500">{sub.aiExcluded}</td>
              <td className="py-3 ps-4 text-purple-300 font-semibold">{sub.aiIncluded}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}