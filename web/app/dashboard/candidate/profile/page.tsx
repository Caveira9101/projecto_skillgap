'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Camera, Save, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

const PROFILE_EXTRA_TEXTS: Record<string, any> = {
  en: {
    subtitle: "Manage your candidate identity, profile photo, and personal information.",
    editPhoto: "Upload or Change Photo",
    uploadingPhoto: "Uploading photo...",
    saveBtn: "Save Changes",
    savingBtn: "Saving...",
    savedMsg: "Profile updated successfully.",
    errorMsg: "Could not save profile changes. Please try again.",
    availAvailable: "Available",
    availOpen: "Open to Offers",
    availUnavailable: "Unavailable",
    visPublic: "Public",
    visPrivate: "Private",
    photoHint: "JPG, PNG or WEBP. Max 5MB."
  },
  pt: {
    subtitle: "Gere a tua identidade de candidato, foto de perfil e informações pessoais.",
    editPhoto: "Carregar ou Alterar Foto",
    uploadingPhoto: "A carregar foto...",
    saveBtn: "Guardar Alterações",
    savingBtn: "A guardar...",
    savedMsg: "Perfil atualizado com sucesso.",
    errorMsg: "Não foi possível guardar as alterações. Tenta novamente.",
    availAvailable: "Disponível",
    availOpen: "Aberto a Propostas",
    availUnavailable: "Indisponível",
    visPublic: "Público",
    visPrivate: "Privado",
    photoHint: "JPG, PNG ou WEBP. Máx. 5MB."
  },
  es: {
    subtitle: "Gestiona tu identidad de candidato, foto de perfil e información personal.",
    editPhoto: "Subir o Cambiar Foto",
    uploadingPhoto: "Subiendo foto...",
    saveBtn: "Guardar Cambios",
    savingBtn: "Guardando...",
    savedMsg: "Perfil actualizado correctamente.",
    errorMsg: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
    availAvailable: "Disponible",
    availOpen: "Abierto a Ofertas",
    availUnavailable: "No disponible",
    visPublic: "Público",
    visPrivate: "Privado",
    photoHint: "JPG, PNG o WEBP. Máx. 5MB."
  },
  fr: {
    subtitle: "Gérez votre identité de candidat, photo de profil et informations personnelles.",
    editPhoto: "Importer ou Changer la Photo",
    uploadingPhoto: "Téléversement...",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    savedMsg: "Profil mis à jour avec succès.",
    errorMsg: "Impossible d'enregistrer les modifications. Réessayez.",
    availAvailable: "Disponible",
    availOpen: "À l'écoute d'opportunités",
    availUnavailable: "Indisponible",
    visPublic: "Public",
    visPrivate: "Privé",
    photoHint: "JPG, PNG ou WEBP. Max 5 Mo."
  },
  de: {
    subtitle: "Verwalten Sie Ihre Kandidatenidentität, Profilfoto und persönlichen Daten.",
    editPhoto: "Foto hochladen oder ändern",
    uploadingPhoto: "Foto wird hochgeladen...",
    saveBtn: "Änderungen speichern",
    savingBtn: "Speichern...",
    savedMsg: "Profil erfolgreich aktualisiert.",
    errorMsg: "Änderungen konnten nicht gespeichert werden. Bitte erneut versuchen.",
    availAvailable: "Verfügbar",
    availOpen: "Offen für Angebote",
    availUnavailable: "Nicht verfügbar",
    visPublic: "Öffentlich",
    visPrivate: "Privat",
    photoHint: "JPG, PNG oder WEBP. Max. 5 MB."
  },
  ar: {
    subtitle: "أدر هويتك كمرشح وصورتك الشخصية ومعلوماتك الأساسية.",
    editPhoto: "رفع أو تغيير الصورة",
    uploadingPhoto: "جاري رفع الصورة...",
    saveBtn: "حفظ التغييرات",
    savingBtn: "جاري الحفظ...",
    savedMsg: "تم تحديث الملف الشخصي بنجاح.",
    errorMsg: "تعذر حفظ التغييرات. يرجى المحاولة مرة أخرى.",
    availAvailable: "متاح",
    availOpen: "منفتح على العروض",
    availUnavailable: "غير متاح",
    visPublic: "عام",
    visPrivate: "خاص",
    photoHint: "JPG أو PNG أو WEBP. الحد الأقصى 5 ميجابايت."
  }
};

export default function CandidateProfile() {
  const { lang, t, candidate, refreshCandidate } = useDashboardLang();
  const extra = PROFILE_EXTRA_TEXTS[lang] || PROFILE_EXTRA_TEXTS['en'];
  const isRtl = lang === 'ar';
  const profile = t.profile || {};
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState<'available' | 'open' | 'unavailable'>('available');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user || !active) return;

        setUserId(user.id);
        setEmail(user.email || '');

        const { data } = await supabase
          .from('individual_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!active) return;

        setFullName(data?.full_name || user.user_metadata?.full_name || '');
        setPhone(data?.phone || user.phone || '');
        setResidence(data?.residence || '');
        setLocation(data?.location || '');
        if (data?.availability === 'open' || data?.availability === 'unavailable') {
          setAvailability(data.availability);
        } else {
          setAvailability('available');
        }
        if (data?.visibility === 'private') {
          setVisibility('private');
        } else {
          setVisibility('public');
        }
        setAvatarUrl(data?.avatar_url || user.user_metadata?.avatar_url || null);
      } catch {
        // Ignora erro de leitura inicial
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const completionPercent = (() => {
    const checks = [fullName, email, phone, residence || location, avatarUrl];
    const done = checks.filter((item) => Boolean(item && String(item).trim().length > 0)).length;
    return Math.round((done / checks.length) * 100);
  })();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null);

    if (!userId) {
      setFeedback({ type: 'error', text: 'Please sign in first before uploading a photo.' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: extra.photoHint });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', text: extra.photoHint });
      return;
    }

    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const nextUrl = publicUrlData?.publicUrl || null;
      if (!nextUrl) throw new Error('Missing public URL');

      const { error: upsertError } = await supabase
        .from('individual_profiles')
        .upsert(
          {
            user_id: userId,
            full_name: fullName.trim() || null,
            avatar_url: nextUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      setAvatarUrl(nextUrl);
      await refreshCandidate();
      setFeedback({ type: 'success', text: extra.savedMsg });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || extra.errorMsg });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!userId) {
      setFeedback({ type: 'error', text: 'Please sign in first to save profile changes.' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('individual_profiles')
        .upsert(
          {
            user_id: userId,
            full_name: fullName.trim() || null,
            phone: phone.trim() || null,
            residence: residence.trim() || null,
            location: (location.trim() || residence.trim()) || null,
            availability,
            visibility,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      await refreshCandidate();
      setFeedback({ type: 'success', text: extra.savedMsg });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || extra.errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const availabilityLabel =
    availability === 'open'
      ? extra.availOpen
      : availability === 'unavailable'
      ? extra.availUnavailable
      : extra.availAvailable;

  const visibilityLabel = visibility === 'private' ? extra.visPrivate : extra.visPublic;

  return (
    <form dir={isRtl ? 'rtl' : 'ltr'} onSubmit={handleSaveProfile} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.myProfile || 'My Profile'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">{extra.subtitle}</p>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingPhoto}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition flex items-center gap-2 disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? extra.savingBtn : extra.saveBtn}</span>
        </button>
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

      {/* Cartões Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider">
            {profile.personalData}
          </span>
          <p className="text-lg font-bold mt-1 text-white">
            {fullName || candidate?.fullName || profile.notProvided}
          </p>
        </div>
        <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider">
            {profile.location}
          </span>
          <p className="text-lg font-bold mt-1 text-white">
            {location || residence || profile.notProvided}
          </p>
        </div>
        <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider">
            {profile.availability}
          </span>
          <p className="text-lg font-bold mt-1 text-green-400">{availabilityLabel}</p>
        </div>
        <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider">
            {profile.visibility}
          </span>
          <p className="text-lg font-bold mt-1 text-purple-400">{visibilityLabel}</p>
        </div>
      </div>

      {/* Barra de Progresso do Perfil */}
      <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-purple-400 tracking-wider">
            {profile.profileStatus}
          </span>
          <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
            {completionPercent}%
          </span>
        </div>
        <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 via-indigo-500 to-green-400 h-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Secção Inferior: Dados Detalhados + Foto de Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0c0716] border border-purple-900/30 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 border border-purple-900/20 px-5 py-3 rounded-xl">
            <label htmlFor="fullName" className="text-xs text-gray-400 font-medium">
              {profile.fullName}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={profile.notProvided}
              className="bg-transparent text-sm font-semibold text-white sm:text-end focus:outline-none w-full sm:w-2/3"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 border border-purple-900/20 px-5 py-3.5 rounded-xl">
            <span className="text-xs text-gray-400 font-medium">{profile.email}</span>
            <span className="text-sm font-semibold text-gray-300">
              {email || profile.notProvided}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 border border-purple-900/20 px-5 py-3 rounded-xl">
            <label htmlFor="phone" className="text-xs text-gray-400 font-medium">
              {profile.phone}
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={profile.notProvided}
              className="bg-transparent text-sm font-semibold text-white sm:text-end focus:outline-none w-full sm:w-2/3"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 border border-purple-900/20 px-5 py-3 rounded-xl">
            <label htmlFor="residence" className="text-xs text-gray-400 font-medium">
              {profile.residence}
            </label>
            <input
              id="residence"
              type="text"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              placeholder={profile.notProvided}
              className="bg-transparent text-sm font-semibold text-white sm:text-end focus:outline-none w-full sm:w-2/3"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 border border-purple-900/20 px-5 py-3 rounded-xl">
            <label htmlFor="location" className="text-xs text-gray-400 font-medium">
              {profile.location}
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={profile.notProvided}
              className="bg-transparent text-sm font-semibold text-white sm:text-end focus:outline-none w-full sm:w-2/3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-black/40 border border-purple-900/20 px-4 py-3 rounded-xl">
              <label htmlFor="availability" className="block text-xs text-gray-400 font-medium mb-1">
                {profile.availability}
              </label>
              <select
                id="availability"
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as 'available' | 'open' | 'unavailable')
                }
                className="w-full bg-[#0c0716] border border-purple-900/30 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="available">{extra.availAvailable}</option>
                <option value="open">{extra.availOpen}</option>
                <option value="unavailable">{extra.availUnavailable}</option>
              </select>
            </div>

            <div className="bg-black/40 border border-purple-900/20 px-4 py-3 rounded-xl">
              <label htmlFor="visibility" className="block text-xs text-gray-400 font-medium mb-1">
                {profile.visibility}
              </label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                className="w-full bg-[#0c0716] border border-purple-900/30 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="public">{extra.visPublic}</option>
                <option value="private">{extra.visPrivate}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Caixa Lateral Direita: Foto de Perfil */}
        <div className="bg-[#0c0716] border border-purple-900/30 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-purple-950/60 border-2 border-purple-500/40 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-purple-300" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {fullName || profile.notProvided}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">{extra.photoHint}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={uploadingPhoto}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-xs font-semibold text-purple-200 transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{uploadingPhoto ? extra.uploadingPhoto : extra.editPhoto}</span>
          </button>
        </div>
      </div>
    </form>
  );
}