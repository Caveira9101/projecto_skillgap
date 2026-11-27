'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Building2,
  Upload,
  Trash2,
  Eye,
  Save,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  Layers,
  Award,
  HeartHandshake,
  Users,
  Briefcase,
  ShieldCheck,
  Languages as LanguagesIcon,
  Check,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

export interface LeadershipMember {
  id: string;
  fullName: string;
  position: string;
  department: string;
  photoUrl: string;
  bio: string;
  linkedin: string;
  responsibilities: string;
  verified: boolean;
}

export interface ProductServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  website: string;
  features: string;
}

export interface GalleryMediaItem {
  id: string;
  category:
    | 'Office Spaces'
    | 'Workstations'
    | 'Meeting Rooms'
    | 'Company Events'
    | 'Team Activities'
    | 'Facilities';
  caption: string;
  imageUrl: string;
}

export interface AchievementCertItem {
  id: string;
  title: string;
  category: 'Award' | 'Certification' | 'Licence' | 'Partnership' | 'Project' | 'Milestone';
  issuingOrg: string;
  issueDate: string;
  expiryDate: string;
  description: string;
  documentUrl: string;
  verificationUrl: string;
  status:
    | 'Not Submitted'
    | 'Verification Pending'
    | 'Verified'
    | 'Verification Rejected'
    | 'Additional Information Required';
}

export interface SocialInitiativeItem {
  id: string;
  title: string;
  category:
    | 'Community Projects'
    | 'Environmental Initiatives'
    | 'Social Impact'
    | 'Inclusion Programmes'
    | 'Volunteering Activities'
    | 'Sustainability Projects';
  description: string;
  imageUrl: string;
  date: string;
  externalLink: string;
}

export type BenefitCategoryKey =
  | 'financial'
  | 'health'
  | 'growth'
  | 'flexibility'
  | 'career'
  | 'additional';

export interface CompanyProfileData {
  officialName: string;
  commercialName: string;
  tagline: string;
  industry: string;
  companyType: string;
  yearFounded: string;
  companySize: string;
  website: string;
  officialEmail: string;
  businessPhone: string;
  country: string;
  provinceState: string;
  city: string;
  physicalAddress: string;

  overview: string;
  ourStory: string;
  mission: string;
  vision: string;
  coreValues: string;
  whatWeDo: string;
  ourImpact: string;

  workEnvironmentDesc: string;
  leadershipStyle: string;
  teamCollaboration: string;
  diversityInclusion: string;
  professionalGrowth: string;
  workLifeBalance: string;
  learningCulture: string;
  innovationCulture: string;
  cultureTags: string[];
  cultureInPractice: string;

  totalEmployees: string;
  departmentsList: string;
  geographicalPresence: string;
  internationalTeams: string;
  orgStructure: string;
  leadership: LeadershipMember[];

  productsServices: ProductServiceItem[];

  workModel: 'On-site' | 'Remote' | 'Hybrid' | 'Flexible Working';
  gallery: GalleryMediaItem[];

  benefits: Record<BenefitCategoryKey, string[]>;
  benefitConditions: string;

  achievements: AchievementCertItem[];
  socialInitiatives: SocialInitiativeItem[];

  teamPermissions: {
    viewProfile: boolean;
    editProfile: boolean;
    manageMedia: boolean;
    manageVerificationDocs: boolean;
    publishProfile: boolean;
  };
}

export type SectionKey =
  | 'identity'
  | 'about'
  | 'culture'
  | 'leadership'
  | 'products'
  | 'environment'
  | 'benefits'
  | 'achievements'
  | 'social';

const DEFAULT_PROFILE_DATA: CompanyProfileData = {
  officialName: '',
  commercialName: '',
  tagline: '',
  industry: '',
  companyType: '',
  yearFounded: '',
  companySize: '',
  website: '',
  officialEmail: '',
  businessPhone: '',
  country: '',
  provinceState: '',
  city: '',
  physicalAddress: '',
  overview: '',
  ourStory: '',
  mission: '',
  vision: '',
  coreValues: '',
  whatWeDo: '',
  ourImpact: '',
  workEnvironmentDesc: '',
  leadershipStyle: '',
  teamCollaboration: '',
  diversityInclusion: '',
  professionalGrowth: '',
  workLifeBalance: '',
  learningCulture: '',
  innovationCulture: '',
  cultureTags: [],
  cultureInPractice: '',
  totalEmployees: '',
  departmentsList: '',
  geographicalPresence: '',
  internationalTeams: '',
  orgStructure: '',
  leadership: [],
  productsServices: [],
  workModel: 'Hybrid',
  gallery: [],
  benefits: {
    financial: [],
    health: [],
    growth: [],
    flexibility: [],
    career: [],
    additional: []
  },
  benefitConditions: '',
  achievements: [],
  socialInitiatives: [],
  teamPermissions: {
    viewProfile: true,
    editProfile: true,
    manageMedia: true,
    manageVerificationDocs: true,
    publishProfile: true
  }
};

const DEFAULT_VISIBILITY: Record<SectionKey, boolean> = {
  identity: true,
  about: true,
  culture: true,
  leadership: true,
  products: true,
  environment: true,
  benefits: true,
  achievements: true,
  social: true
};

const CULTURE_TAG_SUGGESTIONS = [
  'Innovation',
  'Collaboration',
  'Flexibility',
  'Professional Growth',
  'Diversity',
  'Remote Friendly',
  'Continuous Learning',
  'Teamwork',
  'Accountability',
  'Creativity'
];

const BENEFIT_OPTIONS: Record<BenefitCategoryKey, string[]> = {
  financial: ['Performance Bonus', 'Equity / Stock Options', 'Transport Allowance', 'Meal Allowance'],
  health: ['Private Health Insurance', 'Dental & Vision Care', 'Mental Health Support', 'Wellness Stipend'],
  growth: ['Training Budget', 'Conference Sponsorship', 'Certification Support', 'Language Courses'],
  flexibility: ['Flexible Hours', 'Remote Work Days', 'Compressed Workweek', 'Paid Sabbatical'],
  career: ['Mentorship Programme', 'Internal Mobility', 'Leadership Track', 'Clear Career Ladder'],
  additional: ['Relocation Support', 'Parental Leave', 'Laptop & Home Office Kit', 'Team Retreats']
};

const UI_COPY: Record<LangCode, Record<string, string>> = {
  en: {
    title: 'Company Profile',
    subtitle: 'Build a complete, credible institutional presentation for candidates before they apply.',
    saveDraft: 'Save as Draft',
    saving: 'Saving...',
    publish: 'Publish Profile',
    unpublish: 'Unpublish Profile',
    previewTab: 'Public Profile Preview',
    editTab: 'Edit Profile',
    aiTab: 'SkillGap AI Assistant',
    strengthTitle: 'Company Profile Strength',
    published: 'Published',
    draft: 'Draft',
    verificationStatus: 'Verification Status',
    missingInfo: 'Missing Information',
    completeSections: 'Completed Sections',
    incompleteSections: 'Incomplete Sections',
    recommendations: 'Recommendations',
    uploadLogo: 'Upload Company Logo',
    uploadCover: 'Upload Cover Image',
    removeImage: 'Remove Image',
    savedSuccess: 'Company profile saved to Supabase.',
    publishedSuccess: 'Company profile is now live for candidates.',
    unpublishedSuccess: 'Company profile set back to draft.',
    errorPrefix: 'Error: ',
    aiBuilderTitle: 'AI Profile Builder & Completeness Analysis',
    aiWriterTitle: 'AI Writing Assistant (Editable Suggestions Only)',
    aiTranslateTitle: 'AI Translation (Review & Approve Before Applying)',
    polishBtn: 'Polish & Structure Text',
    acceptSuggestion: 'Accept Suggestion',
    rejectSuggestion: 'Reject',
    translateBtn: 'Generate Translation',
    approveTranslation: 'Approve & Apply to Field',
    publicWarning: 'Review the public summary below. Private contact details (phone/internal notes) are never exposed publicly.',
    addItem: 'Add',
    deleteItem: 'Delete',
    confirmDelete: 'Confirm deletion of this item?'
  },
  pt: {
    title: 'Perfil da Empresa',
    subtitle: 'Constrói uma apresentação institucional completa e credível para os candidatos antes de se candidatarem.',
    saveDraft: 'Guardar Rascunho',
    saving: 'A guardar...',
    publish: 'Publicar Perfil',
    unpublish: 'Despublicar Perfil',
    previewTab: 'Pré-visualização Pública',
    editTab: 'Editar Perfil',
    aiTab: 'Assistente SkillGap AI',
    strengthTitle: 'Força do Perfil da Empresa',
    published: 'Publicado',
    draft: 'Rascunho',
    verificationStatus: 'Estado de Verificação',
    missingInfo: 'Informações em Falta',
    completeSections: 'Secções Completas',
    incompleteSections: 'Secções Incompletas',
    recommendations: 'Recomendações',
    uploadLogo: 'Carregar Logótipo',
    uploadCover: 'Carregar Imagem de Capa',
    removeImage: 'Remover Imagem',
    savedSuccess: 'Perfil da empresa guardado no Supabase.',
    publishedSuccess: 'O perfil da empresa está agora público para candidatos.',
    unpublishedSuccess: 'O perfil da empresa voltou ao estado de rascunho.',
    errorPrefix: 'Erro: ',
    aiBuilderTitle: 'Construtor IA de Perfil & Análise de Completude',
    aiWriterTitle: 'Assistente de Escrita IA (Apenas Sugestões Editáveis)',
    aiTranslateTitle: 'Tradução IA (Rever e Aprovar Antes de Aplicar)',
    polishBtn: 'Melhorar e Organizar Texto',
    acceptSuggestion: 'Aceitar Sugestão',
    rejectSuggestion: 'Rejeitar',
    translateBtn: 'Gerar Tradução',
    approveTranslation: 'Aprovar e Aplicar no Campo',
    publicWarning: 'Revê o resumo público abaixo. Dados privados não são expostos na versão pública.',
    addItem: 'Adicionar',
    deleteItem: 'Apagar',
    confirmDelete: 'Confirmar a eliminação deste item?'
  },
  es: {
    title: 'Perfil de Empresa',
    subtitle: 'Crea una presentación institucional completa y creíble para los candidatos.',
    saveDraft: 'Guardar Borrador',
    saving: 'Guardando...',
    publish: 'Publicar Perfil',
    unpublish: 'Despublicar Perfil',
    previewTab: 'Vista Previa Pública',
    editTab: 'Editar Perfil',
    aiTab: 'Asistente SkillGap AI',
    strengthTitle: 'Nivel de Completitud del Perfil',
    published: 'Publicado',
    draft: 'Borrador',
    verificationStatus: 'Estado de Verificación',
    missingInfo: 'Información Faltante',
    completeSections: 'Secciones Completas',
    incompleteSections: 'Secciones Incompletas',
    recommendations: 'Recomendaciones',
    uploadLogo: 'Subir Logotipo',
    uploadCover: 'Subir Imagen de Portada',
    removeImage: 'Eliminar Imagen',
    savedSuccess: 'Perfil empresarial guardado en Supabase.',
    publishedSuccess: 'El perfil empresarial ya está publicado.',
    unpublishedSuccess: 'El perfil empresarial volvió a borrador.',
    errorPrefix: 'Error: ',
    aiBuilderTitle: 'Constructor IA de Perfil y Análisis',
    aiWriterTitle: 'Asistente de Redacción IA (Sugerencias Editables)',
    aiTranslateTitle: 'Traducción IA (Revisar y Aprobar)',
    polishBtn: 'Mejorar y Organizar Texto',
    acceptSuggestion: 'Aceptar Sugerencia',
    rejectSuggestion: 'Rechazar',
    translateBtn: 'Generar Traducción',
    approveTranslation: 'Aprobar y Aplicar',
    publicWarning: 'Revisa el resumen público. La información privada nunca se muestra públicamente.',
    addItem: 'Añadir',
    deleteItem: 'Eliminar',
    confirmDelete: '¿Confirmar la eliminación de este elemento?'
  },
  fr: {
    title: 'Profil Entreprise',
    subtitle: 'Présentez votre identité institutionnelle, votre culture et vos engagements aux candidats.',
    saveDraft: 'Enregistrer Brouillon',
    saving: 'Enregistrement...',
    publish: 'Publier le Profil',
    unpublish: 'Dépublier le Profil',
    previewTab: 'Aperçu Public',
    editTab: 'Modifier le Profil',
    aiTab: 'Assistant SkillGap AI',
    strengthTitle: 'Solidité du Profil Entreprise',
    published: 'Publié',
    draft: 'Brouillon',
    verificationStatus: 'Statut de Vérification',
    missingInfo: 'Informations Manquantes',
    completeSections: 'Sections Complètes',
    incompleteSections: 'Sections Incomplètes',
    recommendations: 'Recommandations',
    uploadLogo: 'Téléverser le Logo',
    uploadCover: 'Téléverser la Couverture',
    removeImage: 'Supprimer l’Image',
    savedSuccess: 'Profil entreprise enregistré dans Supabase.',
    publishedSuccess: 'Le profil entreprise est maintenant publié.',
    unpublishedSuccess: 'Le profil entreprise est repassé en brouillon.',
    errorPrefix: 'Erreur : ',
    aiBuilderTitle: 'Assistant Profil IA & Complétude',
    aiWriterTitle: 'Assistant Rédaction IA (Suggestions Modifiables)',
    aiTranslateTitle: 'Traduction IA (Vérifier et Approuver)',
    polishBtn: 'Améliorer et Structurer',
    acceptSuggestion: 'Accepter la Suggestion',
    rejectSuggestion: 'Rejeter',
    translateBtn: 'Générer la Traduction',
    approveTranslation: 'Approuver et Appliquer',
    publicWarning: 'Vérifiez le résumé public. Les données privées ne sont jamais affichées publiquement.',
    addItem: 'Ajouter',
    deleteItem: 'Supprimer',
    confirmDelete: 'Confirmer la suppression de cet élément ?'
  },
  de: {
    title: 'Unternehmensprofil',
    subtitle: 'Gestalten Sie eine glaubwürdige Unternehmenspräsentation für potenzielle Bewerber.',
    saveDraft: 'Als Entwurf speichern',
    saving: 'Speichern...',
    publish: 'Profil veröffentlichen',
    unpublish: 'Veröffentlichung aufheben',
    previewTab: 'Öffentliche Vorschau',
    editTab: 'Profil bearbeiten',
    aiTab: 'SkillGap AI Assistent',
    strengthTitle: 'Profilstärke des Unternehmens',
    published: 'Veröffentlicht',
    draft: 'Entwurf',
    verificationStatus: 'Verifizierungsstatus',
    missingInfo: 'Fehlende Informationen',
    completeSections: 'Vollständige Bereiche',
    incompleteSections: 'Unvollständige Bereiche',
    recommendations: 'Empfehlungen',
    uploadLogo: 'Logo hochladen',
    uploadCover: 'Titelbild hochladen',
    removeImage: 'Bild entfernen',
    savedSuccess: 'Unternehmensprofil in Supabase gespeichert.',
    publishedSuccess: 'Das Unternehmensprofil ist jetzt veröffentlicht.',
    unpublishedSuccess: 'Das Unternehmensprofil ist wieder ein Entwurf.',
    errorPrefix: 'Fehler: ',
    aiBuilderTitle: 'KI-Profil-Assistent & Vollständigkeit',
    aiWriterTitle: 'KI-Schreibassistent (Nur bearbeitbare Vorschläge)',
    aiTranslateTitle: 'KI-Übersetzung (Prüfen & Freigeben)',
    polishBtn: 'Text verbessern & gliedern',
    acceptSuggestion: 'Vorschlag übernehmen',
    rejectSuggestion: 'Verwerfen',
    translateBtn: 'Übersetzung erstellen',
    approveTranslation: 'Freigeben & Übernehmen',
    publicWarning: 'Prüfen Sie die öffentliche Zusammenfassung. Private Daten werden niemals öffentlich angezeigt.',
    addItem: 'Hinzufügen',
    deleteItem: 'Löschen',
    confirmDelete: 'Diesen Eintrag wirklich löschen?'
  },
  ar: {
    title: 'ملف الشركة',
    subtitle: 'أنشئ عرضاً مؤسسياً متكاملاً وموثوقاً للمرشحين قبل التقديم على الوظائف.',
    saveDraft: 'حفظ كمسودة',
    saving: 'جاري الحفظ...',
    publish: 'نشر الملف',
    unpublish: 'إلغاء النشر',
    previewTab: 'المعاينة العامة',
    editTab: 'تعديل الملف',
    aiTab: 'مساعد SkillGap AI',
    strengthTitle: 'قوة ملف الشركة',
    published: 'منشور',
    draft: 'مسودة',
    verificationStatus: 'حالة التحقق',
    missingInfo: 'معلومات ناقصة',
    completeSections: 'الأقسام المكتملة',
    incompleteSections: 'الأقسام غير المكتملة',
    recommendations: 'التوصيات',
    uploadLogo: 'رفع الشعار',
    uploadCover: 'رفع صورة الغلاف',
    removeImage: 'إزالة الصورة',
    savedSuccess: 'تم حفظ ملف الشركة في Supabase.',
    publishedSuccess: 'أصبح ملف الشركة متاحاً للعامة.',
    unpublishedSuccess: 'تمت إعادة ملف الشركة إلى مسودة.',
    errorPrefix: 'خطأ: ',
    aiBuilderTitle: 'منشئ الملف بالذكاء الاصطناعي وتحليل الاكتمال',
    aiWriterTitle: 'مساعد الكتابة بالذكاء الاصطناعي (اقتراحات قابلة للتعديل)',
    aiTranslateTitle: 'الترجمة بالذكاء الاصطناعي (مراجعة واعتماد)',
    polishBtn: 'تحسين وتنظيم النص',
    acceptSuggestion: 'قبول الاقتراح',
    rejectSuggestion: 'رفض',
    translateBtn: 'إنشاء الترجمة',
    approveTranslation: 'اعتماد وتطبيق',
    publicWarning: 'راجع الملخص العام. لا يتم عرض البيانات الخاصة للعامة أبداً.',
    addItem: 'إضافة',
    deleteItem: 'حذف',
    confirmDelete: 'تأكيد حذف هذا العنصر؟'
  }
};

function cleanTextForAi(raw: string): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (!collapsed) return '';
  return collapsed.charAt(0).toUpperCase() + collapsed.slice(1);
}

export default function BusinessCompanyProfilePage() {
  const { lang, refreshSubscription } = useBusinessDashboardLang();
  const tx = UI_COPY[lang] || UI_COPY.en;

  const [userId, setUserId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [profile, setProfile] = useState<CompanyProfileData>(DEFAULT_PROFILE_DATA);
  const [visibility, setVisibility] = useState<Record<SectionKey, boolean>>(DEFAULT_VISIBILITY);
  const [isPublished, setIsPublished] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('Not Submitted');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'ai'>('edit');
  const [activeSection, setActiveSection] = useState<SectionKey>('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<'logo' | 'cover' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Sub-formulários dinâmicos
  const [leaderDraft, setLeaderDraft] = useState({
    fullName: '',
    position: '',
    department: '',
    photoUrl: '',
    bio: '',
    linkedin: '',
    responsibilities: '',
    verified: false
  });
  const [productDraft, setProductDraft] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    website: '',
    features: ''
  });
  const [galleryDraft, setGalleryDraft] = useState<{
    category: GalleryMediaItem['category'];
    caption: string;
    imageUrl: string;
  }>({
    category: 'Office Spaces',
    caption: '',
    imageUrl: ''
  });
  const [achievementDraft, setAchievementDraft] = useState<{
    title: string;
    category: AchievementCertItem['category'];
    issuingOrg: string;
    issueDate: string;
    expiryDate: string;
    description: string;
    documentUrl: string;
    verificationUrl: string;
    status: AchievementCertItem['status'];
  }>({
    title: '',
    category: 'Certification',
    issuingOrg: '',
    issueDate: '',
    expiryDate: '',
    description: '',
    documentUrl: '',
    verificationUrl: '',
    status: 'Not Submitted'
  });
  const [socialDraft, setSocialDraft] = useState<{
    title: string;
    category: SocialInitiativeItem['category'];
    description: string;
    imageUrl: string;
    date: string;
    externalLink: string;
  }>({
    title: '',
    category: 'Community Projects',
    description: '',
    imageUrl: '',
    date: '',
    externalLink: ''
  });

  // Assistente IA: sugestão editável e tradução para revisão
  const [aiTargetField, setAiTargetField] = useState<keyof CompanyProfileData>('overview');
  const [editableAiSuggestion, setEditableAiSuggestion] = useState<string>('');
  const [translateLang, setTranslateLang] = useState<LangCode>('en');
  const [translatedDraft, setTranslatedDraft] = useState<string>('');

  const persistRow = useCallback(
    async (
      uid: string,
      nextProfile: CompanyProfileData,
      nextLogo: string,
      nextCover: string,
      nextVis: Record<SectionKey, boolean>,
      nextPublished: boolean
    ) => {
      if (!supabase) throw new Error('Supabase client unavailable');
      const { error } = await supabase.from('business_company_profiles').upsert(
        {
          user_id: uid,
          logo_url: nextLogo,
          cover_url: nextCover,
          profile_data: nextProfile,
          section_visibility: nextVis,
          is_published: nextPublished,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
      if (error) throw new Error(error.message);

      if (nextProfile.officialName.trim()) {
        await supabase
          .from('companies')
          .update({ name: nextProfile.officialName.trim() })
          .eq('owner_id', uid);
      }
      await refreshSubscription();
    },
    [refreshSubscription]
  );

  useEffect(() => {
    let active = true;
    async function init() {
      setLoading(true);
      try {
        if (!supabase) return;
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!user || !active) return;
        setUserId(user.id);

        const { data: row } = await supabase
          .from('business_company_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (row && active) {
          setLogoUrl(row.logo_url || '');
          setCoverUrl(row.cover_url || '');
          setIsPublished(Boolean(row.is_published));
          setVerificationStatus(row.verification_status || 'Not Submitted');
          setProfile({
            ...DEFAULT_PROFILE_DATA,
            ...(row.profile_data || {}),
            benefits: {
              ...DEFAULT_PROFILE_DATA.benefits,
              ...((row.profile_data && row.profile_data.benefits) || {})
            },
            teamPermissions: {
              ...DEFAULT_PROFILE_DATA.teamPermissions,
              ...((row.profile_data && row.profile_data.teamPermissions) || {})
            }
          });
          setVisibility({
            ...DEFAULT_VISIBILITY,
            ...(row.section_visibility || {})
          });
        } else if (active) {
          const { data: comp } = await supabase
            .from('companies')
            .select('name, industry')
            .eq('owner_id', user.id)
            .maybeSingle();
          if (comp) {
            setProfile((prev) => ({
              ...prev,
              officialName: comp.name || '',
              commercialName: comp.name || '',
              industry: comp.industry || ''
            }));
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const uploadMediaFile = async (
    file: File,
    folder: string,
    onDone: (url: string) => void,
    kind: 'logo' | 'cover' | null = null
  ) => {
    setFeedback(null);
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Only image files are allowed.` });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Image size must be 4MB or less.` });
      return;
    }
    if (!supabase || !userId) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Authenticated user required.` });
      return;
    }
    setUploadingKind(kind);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${userId}/${folder}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('company-media').upload(path, file, {
        upsert: true
      });
      if (error) throw new Error(error.message);
      const {
        data: { publicUrl }
      } = supabase.storage.from('company-media').getPublicUrl(path);
      onDone(publicUrl);
    } catch (err: any) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}${err?.message || 'Upload failed'}` });
    } finally {
      setUploadingKind(null);
    }
  };

  const strength = useMemo(() => {
    const sectionChecks: { key: SectionKey; label: string; filled: boolean; hint: string }[] = [
      {
        key: 'identity',
        label: 'Company Identity',
        filled: Boolean(profile.officialName.trim() && profile.industry.trim() && profile.country.trim()),
        hint: 'Add Official Company Name, Industry, and Country.'
      },
      {
        key: 'about',
        label: 'About the Company',
        filled: Boolean(profile.overview.trim() && profile.mission.trim() && profile.vision.trim()),
        hint: 'Fill Company Overview, Mission, and Vision.'
      },
      {
        key: 'culture',
        label: 'Company Culture',
        filled: Boolean(profile.workEnvironmentDesc.trim() || profile.cultureTags.length > 0),
        hint: 'Describe Work Environment or select Culture Tags.'
      },
      {
        key: 'leadership',
        label: 'Leadership & Team',
        filled: Boolean(profile.totalEmployees.trim() || profile.leadership.length > 0),
        hint: 'Add total employees or a leadership member.'
      },
      {
        key: 'products',
        label: 'Products & Services',
        filled: profile.productsServices.length > 0,
        hint: 'Add at least one product or service.'
      },
      {
        key: 'environment',
        label: 'Work Environment',
        filled: Boolean(profile.workModel && (profile.gallery.length > 0 || logoUrl)),
        hint: 'Confirm work model and upload logo or workspace gallery media.'
      },
      {
        key: 'benefits',
        label: 'Benefits & Employee Experience',
        filled: Object.values(profile.benefits).some((arr) => arr.length > 0),
        hint: 'Select at least one benefit offered to employees.'
      },
      {
        key: 'achievements',
        label: 'Achievements & Certifications',
        filled: profile.achievements.length > 0,
        hint: 'Add certifications, awards, or milestones.'
      },
      {
        key: 'social',
        label: 'Social Responsibility & Sustainability',
        filled: profile.socialInitiatives.length > 0,
        hint: 'Add a community or sustainability initiative.'
      }
    ];

    const completed = sectionChecks.filter((s) => s.filled);
    const incomplete = sectionChecks.filter((s) => !s.filled);
    const pct = Math.round((completed.length / sectionChecks.length) * 100);
    return { pct, completed, incomplete };
  }, [profile, logoUrl]);

  const handleSave = async (publishState = isPublished) => {
    setFeedback(null);
    if (!supabase || !userId) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Sign in required.` });
      return;
    }
    setSaving(true);
    try {
      await persistRow(userId, profile, logoUrl, coverUrl, visibility, publishState);
      setIsPublished(publishState);
      setFeedback({
        type: 'ok',
        text: publishState ? tx.publishedSuccess : tx.savedSuccess
      });
    } catch (err: any) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}${err?.message || 'Save failed'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    const nextState = !isPublished;
    await handleSave(nextState);
    if (!nextState) {
      setFeedback({ type: 'ok', text: tx.unpublishedSuccess });
    }
  };

  const toggleBenefit = (cat: BenefitCategoryKey, label: string) => {
    setProfile((prev) => {
      const current = prev.benefits[cat] || [];
      const exists = current.includes(label);
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          [cat]: exists ? current.filter((x) => x !== label) : [...current, label]
        }
      };
    });
  };

  const toggleCultureTag = (tag: string) => {
    setProfile((prev) => {
      const exists = prev.cultureTags.includes(tag);
      return {
        ...prev,
        cultureTags: exists ? prev.cultureTags.filter((t) => t !== tag) : [...prev.cultureTags, tag]
      };
    });
  };

  const generateEditableAiProposal = () => {
    const rawVal = String(profile[aiTargetField] || '');
    setEditableAiSuggestion(cleanTextForAi(rawVal));
  };

  const applyAcceptedAiSuggestion = () => {
    if (!editableAiSuggestion.trim()) return;
    setProfile((prev) => ({
      ...prev,
      [aiTargetField]: editableAiSuggestion
    }));
    setEditableAiSuggestion('');
  };

  const generateTranslationDraft = () => {
    const sourceText = String(profile[aiTargetField] || '').trim();
    if (!sourceText) {
      setTranslatedDraft('');
      return;
    }
    setTranslatedDraft(`[${translateLang.toUpperCase()}] ${sourceText}`);
  };

  const approveTranslatedDraft = () => {
    if (!translatedDraft.trim()) return;
    const cleaned = translatedDraft.replace(/^\[[A-Z]{2}\]\s*/i, '');
    setProfile((prev) => ({
      ...prev,
      [aiTargetField]: cleaned
    }));
    setTranslatedDraft('');
  };

  const sectionsMeta: { key: SectionKey; label: string; icon: React.ElementType }[] = [
    { key: 'identity', label: '4.1 Company Identity', icon: Building2 },
    { key: 'about', label: '4.2 About the Company', icon: Sparkles },
    { key: 'culture', label: '4.3 Company Culture', icon: Users },
    { key: 'leadership', label: '4.4 Leadership & Team', icon: Briefcase },
    { key: 'products', label: '4.5 Products & Services', icon: Layers },
    { key: 'environment', label: '4.6 Work Environment', icon: Building2 },
    { key: 'benefits', label: '4.7 Benefits & Experience', icon: Award },
    { key: 'achievements', label: '4.8 Achievements & Certs', icon: ShieldCheck },
    { key: 'social', label: '4.9 Social & Sustainability', icon: HeartHandshake }
  ];

  if (loading) {
    return <div className="py-10 text-xs text-gray-400">Loading Company Profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho principal e ações */}
      <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white">{tx.title}</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isPublished
                  ? 'bg-emerald-950/60 border-emerald-500/35 text-emerald-300'
                  : 'bg-purple-950/60 border-purple-500/35 text-purple-300'
              }`}
            >
              {isPublished ? tx.published : tx.draft}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#150b29] border border-indigo-500/30 text-indigo-200">
              {tx.verificationStatus}: {verificationStatus}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{tx.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            {tx.editTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tx.aiTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{tx.previewTab}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(isPublished)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-purple-500/30 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? tx.saving : tx.saveDraft}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleTogglePublish}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {isPublished ? tx.unpublish : tx.publish}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'ok'
              ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300'
              : 'bg-red-950/40 border-red-500/35 text-red-300'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Company Profile Strength */}
      <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-white">{tx.strengthTitle}</h2>
          <span className="text-sm font-extrabold text-purple-300">{strength.pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
            style={{ width: `${strength.pct}%` }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-emerald-300 mb-1">
              {tx.completeSections} ({strength.completed.length})
            </p>
            <p className="text-gray-400">
              {strength.completed.map((c) => c.label).join(', ') || '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-amber-300 mb-1">
              {tx.incompleteSections} ({strength.incomplete.length})
            </p>
            <p className="text-gray-400">
              {strength.incomplete.map((c) => c.label).join(', ') || '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-purple-300 mb-1">{tx.recommendations}</p>
            <p className="text-gray-400">
              {strength.incomplete[0]?.hint || 'Profile core sections are complete.'}
            </p>
          </div>
        </div>
      </div>

      {/* MODO 1: EDIÇÃO POR SECÇÕES */}
      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-1.5">
            {sectionsMeta.map(({ key, label, icon: Icon }) => {
              const active = activeSection === key;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs transition ${
                    active
                      ? 'bg-[#6d28d9]/25 border-purple-500 text-white font-semibold'
                      : 'bg-[#0c0716] border-white/[0.06] text-gray-300 hover:border-purple-500/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSection(key)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                  <button
                    type="button"
                    title="Toggle public visibility"
                    onClick={() => setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                      visibility[key]
                        ? 'bg-emerald-950/70 text-emerald-300'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {visibility[key] ? 'Public' : 'Hidden'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-9 rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-5 text-xs">
            {activeSection === 'identity' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.1 Company Identity</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo Upload */}
                  <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/25 space-y-2.5">
                    <p className="font-semibold text-white">Company Logo</p>
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="w-16 h-16 rounded-xl object-contain bg-white/5 border border-purple-500/30 p-1"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingKind === 'logo' ? tx.saving : tx.uploadLogo}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              uploadMediaFile(
                                f,
                                'logos',
                                (url) => {
                                  setLogoUrl(url);
                                  if (userId) {
                                    persistRow(
                                      userId,
                                      profile,
                                      url,
                                      coverUrl,
                                      visibility,
                                      isPublished
                                    ).catch(() => {});
                                  }
                                },
                                'logo'
                              );
                            }
                          }}
                        />
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{tx.removeImage}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cover Upload */}
                  <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/25 space-y-2.5">
                    <p className="font-semibold text-white">Cover Image</p>
                    {coverUrl && (
                      <img
                        src={coverUrl}
                        alt="Company Cover"
                        className="w-full h-16 rounded-xl object-cover border border-purple-500/30"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingKind === 'cover' ? tx.saving : tx.uploadCover}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              uploadMediaFile(
                                f,
                                'covers',
                                (url) => setCoverUrl(url),
                                'cover'
                              );
                            }
                          }}
                        />
                      </label>
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={() => setCoverUrl('')}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{tx.removeImage}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['officialName', 'Official Company Name'],
                    ['commercialName', 'Commercial Name'],
                    ['tagline', 'Company Tagline'],
                    ['industry', 'Industry'],
                    ['companyType', 'Company Type'],
                    ['yearFounded', 'Year Founded'],
                    ['companySize', 'Company Size'],
                    ['website', 'Website'],
                    ['officialEmail', 'Official E-mail'],
                    ['businessPhone', 'Business Phone'],
                    ['country', 'Country'],
                    ['provinceState', 'Province/State'],
                    ['city', 'City'],
                    ['physicalAddress', 'Physical Address']
                  ].map(([fieldKey, labelText]) => (
                    <div key={fieldKey}>
                      <label className="block text-gray-400 mb-1">{labelText}</label>
                      <input
                        type="text"
                        value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            [fieldKey]: e.target.value
                          }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.2 About the Company</h3>
                {[
                  ['overview', 'Company Overview'],
                  ['ourStory', 'Our Story'],
                  ['mission', 'Mission'],
                  ['vision', 'Vision'],
                  ['coreValues', 'Core Values'],
                  ['whatWeDo', 'What We Do'],
                  ['ourImpact', 'Our Impact']
                ].map(([fieldKey, labelText]) => (
                  <div key={fieldKey}>
                    <label className="block text-gray-400 mb-1">{labelText}</label>
                    <textarea
                      rows={3}
                      value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          [fieldKey]: e.target.value
                        }))
                      }
                      className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'culture' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.3 Company Culture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['workEnvironmentDesc', 'Work Environment'],
                    ['leadershipStyle', 'Leadership Style'],
                    ['teamCollaboration', 'Team Collaboration'],
                    ['diversityInclusion', 'Diversity & Inclusion'],
                    ['professionalGrowth', 'Professional Growth'],
                    ['workLifeBalance', 'Work-Life Balance'],
                    ['learningCulture', 'Learning Culture'],
                    ['innovationCulture', 'Innovation Culture']
                  ].map(([fieldKey, labelText]) => (
                    <div key={fieldKey}>
                      <label className="block text-gray-400 mb-1">{labelText}</label>
                      <textarea
                        rows={2}
                        value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            [fieldKey]: e.target.value
                          }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Culture Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {CULTURE_TAG_SUGGESTIONS.map((tag) => {
                      const active = profile.cultureTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleCultureTag(tag)}
                          className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${
                            active
                              ? 'bg-purple-600/35 border-purple-400 text-white font-semibold'
                              : 'bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Our Culture in Practice</label>
                  <textarea
                    rows={3}
                    value={profile.cultureInPractice}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, cultureInPractice: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {activeSection === 'leadership' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.4 Leadership & Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['totalEmployees', 'Total Number of Employees'],
                    ['departmentsList', 'Departments'],
                    ['geographicalPresence', 'Geographical Presence'],
                    ['internationalTeams', 'International Teams'],
                    ['orgStructure', 'Organisational Structure']
                  ].map(([k, lbl]) => (
                    <div key={k}>
                      <label className="block text-gray-400 mb-1">{lbl}</label>
                      <input
                        type="text"
                        value={String(profile[k as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, [k]: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/20 space-y-3">
                  <p className="font-semibold text-white">Leadership Member</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={leaderDraft.fullName}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, fullName: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={leaderDraft.position}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, position: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      value={leaderDraft.department}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, department: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn Profile URL"
                      value={leaderDraft.linkedin}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, linkedin: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Responsibilities"
                      value={leaderDraft.responsibilities}
                      onChange={(e) =>
                        setLeaderDraft({ ...leaderDraft, responsibilities: e.target.value })
                      }
                      className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Professional Biography"
                      value={leaderDraft.bio}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, bio: e.target.value })}
                      className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!leaderDraft.fullName.trim() || !leaderDraft.position.trim()) return;
                      setProfile((prev) => ({
                        ...prev,
                        leadership: [
                          ...prev.leadership,
                          { ...leaderDraft, id: crypto.randomUUID() }
                        ]
                      }));
                      setLeaderDraft({
                        fullName: '',
                        position: '',
                        department: '',
                        photoUrl: '',
                        bio: '',
                        linkedin: '',
                        responsibilities: '',
                        verified: false
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{tx.addItem}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {profile.leadership.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {m.fullName} — {m.position}
                        </p>
                        <p className="text-gray-400">
                          {m.department} • {m.verified ? 'Verified' : 'Declared by Company'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm(tx.confirmDelete)) return;
                          setProfile((prev) => ({
                            ...prev,
                            leadership: prev.leadership.filter((x) => x.id !== m.id)
                          }));
                        }}
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.5 Products & Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Product/Service Name"
                    value={productDraft.name}
                    onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={productDraft.category}
                    onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Website"
                    value={productDraft.website}
                    onChange={(e) => setProductDraft({ ...productDraft, website: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Key Features"
                    value={productDraft.features}
                    onChange={(e) => setProductDraft({ ...productDraft, features: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={productDraft.description}
                    onChange={(e) =>
                      setProductDraft({ ...productDraft, description: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!productDraft.name.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      productsServices: [
                        ...prev.productsServices,
                        { ...productDraft, id: crypto.randomUUID() }
                      ]
                    }));
                    setProductDraft({
                      name: '',
                      category: '',
                      description: '',
                      imageUrl: '',
                      website: '',
                      features: ''
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.productsServices.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {p.name} ({p.category})
                        </p>
                        <p className="text-gray-400">{p.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm(tx.confirmDelete)) return;
                          setProfile((prev) => ({
                            ...prev,
                            productsServices: prev.productsServices.filter((x) => x.id !== p.id)
                          }));
                        }}
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'environment' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">4.6 Work Environment</h3>
                <div>
                  <label className="block text-gray-400 mb-1">General Work Model</label>
                  <select
                    value={profile.workModel}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        workModel: e.target.value as CompanyProfileData['workModel']
                      }))
                    }
                    className="bg-[#080410] border border-purple-500/30 rounded-xl px-3.5 py-2 text-white"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Flexible Working">Flexible Working</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={galleryDraft.category}
                    onChange={(e) =>
                      setGalleryDraft({
                        ...galleryDraft,
                        category: e.target.value as GalleryMediaItem['category']
                      })
                    }
                    className="bg-[#080410] border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  >
                    {[
                      'Office Spaces',
                      'Workstations',
                      'Meeting Rooms',
                      'Company Events',
                      'Team Activities',
                      'Facilities'
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Caption"
                    value={galleryDraft.caption}
                    onChange={(e) =>
                      setGalleryDraft({ ...galleryDraft, caption: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-purple-600/30 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{tx.uploadLogo}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          uploadMediaFile(f, 'gallery', (url) => {
                            setProfile((prev) => ({
                              ...prev,
                              gallery: [
                                ...prev.gallery,
                                {
                                  id: crypto.randomUUID(),
                                  category: galleryDraft.category,
                                  caption: galleryDraft.caption || galleryDraft.category,
                                  imageUrl: url
                                }
                              ]
                            }));
                            setGalleryDraft({ ...galleryDraft, caption: '', imageUrl: '' });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.gallery.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl bg-[#080410] border border-white/[0.06] p-2.5 space-y-2"
                    >
                      <img
                        src={g.imageUrl}
                        alt={g.caption}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-300 truncate">
                          {g.category}: {g.caption}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setProfile((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((x) => x.id !== g.id)
                            }))
                          }
                          className="text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'benefits' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">
                  4.7 Benefits & Employee Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(BENEFIT_OPTIONS) as BenefitCategoryKey[]).map((catKey) => (
                    <div
                      key={catKey}
                      className="p-3.5 rounded-xl bg-[#080410] border border-white/[0.06] space-y-2"
                    >
                      <p className="font-bold text-purple-200 capitalize">{catKey}</p>
                      {BENEFIT_OPTIONS[catKey].map((opt) => {
                        const checked = (profile.benefits[catKey] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            className="flex items-center gap-2 text-gray-300 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleBenefit(catKey, opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">
                    Conditions or Role Restrictions
                  </label>
                  <textarea
                    rows={2}
                    value={profile.benefitConditions}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, benefitConditions: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {activeSection === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">
                  4.8 Achievements & Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={achievementDraft.title}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, title: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organisation"
                    value={achievementDraft.issuingOrg}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, issuingOrg: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Issue Date"
                    value={achievementDraft.issueDate}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, issueDate: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Expiry Date (if applicable)"
                    value={achievementDraft.expiryDate}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, expiryDate: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Verification URL"
                    value={achievementDraft.verificationUrl}
                    onChange={(e) =>
                      setAchievementDraft({
                        ...achievementDraft,
                        verificationUrl: e.target.value
                      })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!achievementDraft.title.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      achievements: [
                        ...prev.achievements,
                        {
                          ...achievementDraft,
                          id: crypto.randomUUID(),
                          status: 'Verification Pending'
                        }
                      ]
                    }));
                    setAchievementDraft({
                      title: '',
                      category: 'Certification',
                      issuingOrg: '',
                      issueDate: '',
                      expiryDate: '',
                      description: '',
                      documentUrl: '',
                      verificationUrl: '',
                      status: 'Not Submitted'
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.achievements.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {a.title} — {a.status}
                        </p>
                        <p className="text-gray-400">
                          {a.issuingOrg} • {a.issueDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile((prev) => ({
                            ...prev,
                            achievements: prev.achievements.filter((x) => x.id !== a.id)
                          }))
                        }
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'social' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">
                  4.9 Social Responsibility & Sustainability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={socialDraft.title}
                    onChange={(e) => setSocialDraft({ ...socialDraft, title: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={socialDraft.date}
                    onChange={(e) => setSocialDraft({ ...socialDraft, date: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="External Link"
                    value={socialDraft.externalLink}
                    onChange={(e) =>
                      setSocialDraft({ ...socialDraft, externalLink: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={socialDraft.description}
                    onChange={(e) =>
                      setSocialDraft({ ...socialDraft, description: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!socialDraft.title.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      socialInitiatives: [
                        ...prev.socialInitiatives,
                        { ...socialDraft, id: crypto.randomUUID() }
                      ]
                    }));
                    setSocialDraft({
                      title: '',
                      category: 'Community Projects',
                      description: '',
                      imageUrl: '',
                      date: '',
                      externalLink: ''
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.socialInitiatives.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">{s.title}</p>
                        <p className="text-gray-400">{s.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile((prev) => ({
                            ...prev,
                            socialInitiatives: prev.socialInitiatives.filter((x) => x.id !== s.id)
                          }))
                        }
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODO 2: SKILLGAP AI ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">{tx.aiWriterTitle}</h3>
            <div>
              <label className="block text-gray-400 mb-1">Target Field</label>
              <select
                value={aiTargetField}
                onChange={(e) =>
                  setAiTargetField(e.target.value as keyof CompanyProfileData)
                }
                className="w-full bg-[#080410] border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              >
                <option value="overview">Company Overview</option>
                <option value="ourStory">Our Story</option>
                <option value="mission">Mission</option>
                <option value="vision">Vision</option>
                <option value="coreValues">Core Values</option>
                <option value="whatWeDo">What We Do</option>
                <option value="ourImpact">Our Impact</option>
                <option value="cultureInPractice">Our Culture in Practice</option>
              </select>
            </div>
            <button
              type="button"
              onClick={generateEditableAiProposal}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold cursor-pointer"
            >
              {tx.polishBtn}
            </button>

            {editableAiSuggestion !== '' && (
              <div className="p-3.5 rounded-xl bg-[#080410] border border-purple-500/30 space-y-2.5">
                <textarea
                  rows={4}
                  value={editableAiSuggestion}
                  onChange={(e) => setEditableAiSuggestion(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-2.5 text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={applyAcceptedAiSuggestion}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{tx.acceptSuggestion}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAiSuggestion('')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{tx.rejectSuggestion}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">{tx.aiTranslateTitle}</h3>
            <div className="flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4 text-purple-400" />
              <select
                value={translateLang}
                onChange={(e) => setTranslateLang(e.target.value as LangCode)}
                className="bg-[#080410] border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              >
                <option value="en">EN</option>
                <option value="pt">PT</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="ar">AR</option>
              </select>
              <button
                type="button"
                onClick={generateTranslationDraft}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold cursor-pointer"
              >
                {tx.translateBtn}
              </button>
            </div>
            {translatedDraft && (
              <div className="p-3.5 rounded-xl bg-[#080410] border border-indigo-500/30 space-y-2.5">
                <textarea
                  rows={4}
                  value={translatedDraft}
                  onChange={(e) => setTranslatedDraft(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-2.5 text-white"
                />
                <button
                  type="button"
                  onClick={approveTranslatedDraft}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer"
                >
                  {tx.approveTranslation}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODO 3: PRÉ-VISUALIZAÇÃO PÚBLICA */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 overflow-hidden text-xs">
          <div className="px-6 py-3 bg-purple-950/40 border-b border-purple-500/20 text-purple-200">
            {tx.publicWarning}
          </div>
          {coverUrl && (
            <img src={coverUrl} alt="Cover" className="w-full h-44 object-cover" />
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-16 h-16 rounded-2xl object-contain bg-white/5 border border-purple-500/30 p-1.5"
                />
              )}
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {profile.commercialName || profile.officialName || 'Company Name'}
                </h3>
                <p className="text-purple-300">
                  {profile.industry} • {[profile.city, profile.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            {visibility.about && profile.overview && (
              <div>
                <h4 className="font-bold text-white mb-1">Overview</h4>
                <p className="text-gray-300 leading-relaxed">{profile.overview}</p>
              </div>
            )}

            {visibility.about && (profile.mission || profile.vision) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.mission && (
                  <div className="p-4 rounded-xl bg-[#080410] border border-white/[0.06]">
                    <h4 className="font-bold text-white mb-1">Mission</h4>
                    <p className="text-gray-300">{profile.mission}</p>
                  </div>
                )}
                {profile.vision && (
                  <div className="p-4 rounded-xl bg-[#080410] border border-white/[0.06]">
                    <h4 className="font-bold text-white mb-1">Vision</h4>
                    <p className="text-gray-300">{profile.vision}</p>
                  </div>
                )}
              </div>
            )}

            {visibility.culture && profile.cultureTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.cultureTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}