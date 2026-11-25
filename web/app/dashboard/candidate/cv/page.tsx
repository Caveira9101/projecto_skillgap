'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Plus,
  X,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface DocumentRecord {
  id: string;
  file_name: string;
  file_url: string | null;
  category: string;
  uploaded_date: string | null;
  status_label: string;
}

const CV_TEXTS: Record<string, any> = {
  en: {
    title: "CV & Documents",
    subtitle: "Upload and manage your curriculum vitae, certificates, and supporting documents.",
    uploadBtn: "Add Document",
    cancelBtn: "Cancel",
    activeDocsLabel: "Uploaded Documents",
    activeDocsSub: "Stored files",
    statusLabel: "Repository Status",
    statusSub: "Synced with profile",
    formTitle: "Add Document Record",
    fileNameLabel: "Document / File Name",
    filePickLabel: "Upload Document from Computer",
    chooseFileBtn: "Choose File",
    noFileSelected: "No file chosen",
    filePickHint: "PDF, DOC, DOCX, JPG or PNG",
    categoryLabel: "Category / Type",
    saveBtn: "Save Document",
    savingBtn: "Uploading & Saving...",
    openLink: "Open",
    emptyTitle: "No documents added yet",
    emptyDesc: "Add your CV, certificates, or references to keep your career files organized.",
    aiTipTitle: "SkillGap AI Document Analyzer",
    aiTipText: "Keep your latest CV and relevant certificates accessible so recruiters can review your qualifications quickly.",
    needFileError: "Please select a document from your computer.",
    uploadError: "Could not upload document to Supabase. Check storage bucket policies."
  },
  pt: {
    title: "CV & Documentos",
    subtitle: "Carrega e gere o teu currículo, certificados e documentos de apoio.",
    uploadBtn: "Adicionar Documento",
    cancelBtn: "Cancelar",
    activeDocsLabel: "Documentos Carregados",
    activeDocsSub: "Ficheiros guardados",
    statusLabel: "Estado do Repositório",
    statusSub: "Sincronizado com o perfil",
    formTitle: "Novo Registo de Documento",
    fileNameLabel: "Nome do Documento / Ficheiro",
    filePickLabel: "Carregar Documento do Computador",
    chooseFileBtn: "Escolher Ficheiro",
    noFileSelected: "Nenhum ficheiro selecionado",
    filePickHint: "PDF, DOC, DOCX, JPG ou PNG",
    categoryLabel: "Categoria / Tipo",
    saveBtn: "Guardar Documento",
    savingBtn: "A carregar & guardar...",
    openLink: "Abrir",
    emptyTitle: "Ainda sem documentos adicionados",
    emptyDesc: "Adiciona o teu CV, certificados ou cartas para manteres a tua documentação organizada.",
    aiTipTitle: "Analisador de Documentos IA SkillGap",
    aiTipText: "Mantém o teu CV mais recente e certificados relevantes acessíveis para facilitar a análise pelos recrutadores.",
    needFileError: "Seleciona um documento do teu computador.",
    uploadError: "Não foi possível carregar o documento para o Supabase. Verifica o bucket e as políticas."
  },
  es: {
    title: "CV y Documentos",
    subtitle: "Sube y gestiona tu currículum, certificados y documentos de respaldo.",
    uploadBtn: "Añadir Documento",
    cancelBtn: "Cancelar",
    activeDocsLabel: "Documentos Subidos",
    activeDocsSub: "Archivos guardados",
    statusLabel: "Estado del Repositorio",
    statusSub: "Sincronizado con el perfil",
    formTitle: "Nuevo Registro de Documento",
    fileNameLabel: "Nombre del Documento / Archivo",
    filePickLabel: "Subir Documento desde la Computadora",
    chooseFileBtn: "Elegir Archivo",
    noFileSelected: "Ningún archivo seleccionado",
    filePickHint: "PDF, DOC, DOCX, JPG o PNG",
    categoryLabel: "Categoría / Tipo",
    saveBtn: "Guardar Documento",
    savingBtn: "Subiendo y guardando...",
    openLink: "Abrir",
    emptyTitle: "Aún no hay documentos añadidos",
    emptyDesc: "Añade tu CV, certificados o referencias para mantener tus archivos organizados.",
    aiTipTitle: "Analizador de Documentos IA SkillGap",
    aiTipText: "Mantén tu CV actualizado y tus certificados accesibles para facilitar la revisión de tu perfil.",
    needFileError: "Selecciona un documento de tu computadora.",
    uploadError: "No se pudo subir el documento a Supabase. Revisa el bucket y las políticas."
  },
  fr: {
    title: "CV & Documents",
    subtitle: "Téléchargez et gérez votre CV, vos certificats et vos pièces justificatives.",
    uploadBtn: "Ajouter un Document",
    cancelBtn: "Annuler",
    activeDocsLabel: "Documents Ajoutés",
    activeDocsSub: "Fichiers enregistrés",
    statusLabel: "État du Dossier",
    statusSub: "Synchronisé avec le profil",
    formTitle: "Nouveau Document",
    fileNameLabel: "Nom du Document / Fichier",
    filePickLabel: "Importer un Document depuis l'Ordinateur",
    chooseFileBtn: "Choisir un Fichier",
    noFileSelected: "Aucun fichier choisi",
    filePickHint: "PDF, DOC, DOCX, JPG ou PNG",
    categoryLabel: "Catégorie / Type",
    saveBtn: "Enregistrer",
    savingBtn: "Téléversement...",
    openLink: "Ouvrir",
    emptyTitle: "Aucun document ajouté pour l'instant",
    emptyDesc: "Ajoutez votre CV, vos certificats ou attestations pour centraliser vos dossiers.",
    aiTipTitle: "Analyseur de Documents IA SkillGap",
    aiTipText: "Gardez votre CV récent et vos certificats accessibles afin que les recruteurs consultent votre dossier facilement.",
    needFileError: "Veuillez sélectionner un document depuis votre ordinateur.",
    uploadError: "Impossible de téléverser le document vers Supabase. Vérifiez le bucket et les règles."
  },
  de: {
    title: "Lebenslauf & Dokumente",
    subtitle: "Laden Sie Ihren Lebenslauf, Zertifikate und Nachweise hoch und verwalten Sie sie.",
    uploadBtn: "Dokument hinzufügen",
    cancelBtn: "Abbrechen",
    activeDocsLabel: "Hochgeladene Dokumente",
    activeDocsSub: "Gespeicherte Dateien",
    statusLabel: "Repository-Status",
    statusSub: "Mit Profil synchronisiert",
    formTitle: "Neuen Dokumenteintrag anlegen",
    fileNameLabel: "Dokument- / Dateiname",
    filePickLabel: "Dokument vom Computer hochladen",
    chooseFileBtn: "Datei auswählen",
    noFileSelected: "Keine Datei ausgewählt",
    filePickHint: "PDF, DOC, DOCX, JPG oder PNG",
    categoryLabel: "Kategorie / Typ",
    saveBtn: "Dokument speichern",
    savingBtn: "Wird hochgeladen...",
    openLink: "Öffnen",
    emptyTitle: "Noch keine Dokumente hinzugefügt",
    emptyDesc: "Fügen Sie Lebenslauf, Zertifikate oder Nachweise hinzu, um Ihre Unterlagen gebündelt zu halten.",
    aiTipTitle: "SkillGap KI-Dokumentenanalyse",
    aiTipText: "Halten Sie Ihren aktuellen Lebenslauf und relevante Nachweise griffbereit für eine schnelle Prüfung.",
    needFileError: "Bitte wählen Sie ein Dokument von Ihrem Computer aus.",
    uploadError: "Dokument konnte nicht in Supabase hochgeladen werden. Prüfen Sie Bucket und Richtlinien."
  },
  ar: {
    title: "السيرة الذاتية والمستندات",
    subtitle: "ارفع وأدر سيرتك الذاتية وشهاداتك والمستندات الداعمة.",
    uploadBtn: "إضافة مستند",
    cancelBtn: "إلغاء",
    activeDocsLabel: "المستندات المضافة",
    activeDocsSub: "الملفات المحفوظة",
    statusLabel: "حالة المستودع",
    statusSub: "متزامن مع الملف الشخصي",
    formTitle: "إضافة سجل مستند جديد",
    fileNameLabel: "اسم المستند / الملف",
    filePickLabel: "رفع مستند من الجهاز",
    chooseFileBtn: "اختيار ملف",
    noFileSelected: "لم يتم اختيار ملف",
    filePickHint: "PDF أو DOC أو DOCX أو JPG أو PNG",
    categoryLabel: "الفئة / النوع",
    saveBtn: "حفظ المستند",
    savingBtn: "جاري الرفع والحفظ...",
    openLink: "فتح",
    emptyTitle: "لم تتم إضافة مستندات بعد",
    emptyDesc: "أضف سيرتك الذاتية أو شهاداتك أو خطابات التوصية لتنظيم ملفاتك المهنية.",
    aiTipTitle: "محلل المستندات بالذكاء الاصطناعي SkillGap",
    aiTipText: "اجعل أحدث نسخة من سيرتك الذاتية وشهاداتك متاحة لتسهيل تقييم مؤهلاتك.",
    needFileError: "يرجى اختيار مستند من جهازك.",
    uploadError: "تعذر رفع المستند إلى Supabase. تحقق من الحاوية والصلاحيات."
  }
};

export default function CandidateCVPage() {
  const { lang } = useDashboardLang();
  const cv = CV_TEXTS[lang] || CV_TEXTS['en'];
  const isRtl = lang === 'ar';

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('CV');

  const loadDocuments = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('candidate_documents')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        setDocs(
          data.map((d: any) => ({
            id: String(d.id),
            file_name: d.file_name || d.title || '',
            file_url: d.file_url || null,
            category: d.category || 'CV',
            uploaded_date: d.uploaded_date || d.created_at?.slice(0, 10) || null,
            status_label: d.status_label || 'Active',
          }))
        );
      }
    } catch {
      setDocs([]);
    }
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (uid && active) {
        setUserId(uid);
        loadDocuments(uid);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrorMsg(null);
    if (!file) return;
    setSelectedFile(file);
    if (!fileName.trim()) {
      setFileName(file.name);
    }
  };

  const uploadToStorage = async (uid: string, file: File): Promise<string> => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${uid}/${Date.now()}-${safeName}`;

    const bucketsToTry = ['candidate-documents', 'avatars'];
    let lastError: any = null;

    for (const bucket of bucketsToTry) {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, { upsert: false });

      if (!uploadError) {
        const { data: pubData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);
        if (pubData?.publicUrl) {
          return pubData.publicUrl;
        }
      } else {
        lastError = uploadError;
      }
    }

    throw lastError || new Error('Upload failed');
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userId) return;
    if (!selectedFile) {
      setErrorMsg(cv.needFileError);
      return;
    }

    setSaving(true);
    try {
      const publicUrl = await uploadToStorage(userId, selectedFile);
      const finalName = fileName.trim() || selectedFile.name;
      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('candidate_documents')
        .insert({
          user_id: userId,
          file_name: finalName,
          file_url: publicUrl,
          category: category.trim() || 'CV',
          uploaded_date: today,
          status_label: 'Active',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setDocs((prev) => [
          {
            id: String(data.id),
            file_name: data.file_name || finalName,
            file_url: data.file_url || publicUrl,
            category: data.category || category.trim(),
            uploaded_date: data.uploaded_date || today,
            status_label: data.status_label || 'Active',
          },
          ...prev,
        ]);
      }

      setSelectedFile(null);
      setFileName('');
      setCategory('CV');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowForm(false);
    } catch {
      setErrorMsg(cv.uploadError);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('candidate_documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {cv.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{cv.subtitle}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setShowForm((v) => !v);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? cv.cancelBtn : cv.uploadBtn}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddDoc}
          className="p-6 rounded-2xl bg-[#0c0716] border border-purple-500/30 space-y-4"
        >
          <h2 className="text-base font-bold text-white">{cv.formTitle}</h2>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{cv.fileNameLabel}</label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">{cv.categoryLabel}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">{cv.filePickLabel}</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-2.5 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  {cv.chooseFileBtn}
                </button>
                <span className="text-xs text-gray-300 truncate">
                  {selectedFile ? selectedFile.name : cv.noFileSelected}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{cv.filePickHint}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-xs text-gray-300 hover:text-white cursor-pointer"
            >
              {cv.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
            >
              {saving ? cv.savingBtn : cv.saveBtn}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {cv.activeDocsLabel}
            </span>
            <p className="text-3xl font-extrabold text-white mt-1">{docs.length}</p>
            <p className="text-[11px] text-purple-400 mt-1">{cv.activeDocsSub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {cv.statusLabel}
            </span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{cv.statusSub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {docs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase">
                      {doc.category}
                    </span>
                    {doc.uploaded_date && (
                      <span className="text-xs text-gray-500">{doc.uploaded_date}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white">{doc.file_name}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-xs font-semibold text-purple-300 hover:text-white transition"
                  >
                    {cv.openLink}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteDoc(doc.id)}
                  className="p-2 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{cv.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{cv.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{cv.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{cv.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}