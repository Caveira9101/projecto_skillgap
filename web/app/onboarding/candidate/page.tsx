'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getTranslation } from '@/lib/translations';

export default function CandidateOnboarding() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Estados dos campos obrigatórios (Passo 1)
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [nationality, setNationality] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [spokenLanguages, setSpokenLanguages] = useState('');

  // Estados dos campos obrigatórios (Passo 2)
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [keySkills, setKeySkills] = useState('');

  // Estados da Foto (Passo 3)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Estado do CV (Passo 4)
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Estados das Preferências de Trabalho (Passo 5)
  const [workModel, setWorkModel] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  // Mensagem de erro de validação
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const queryLang = searchParams.get('lang');
    if (queryLang) {
      setLang(queryLang);
    }
  }, [searchParams]);

  const t = (key: string) => getTranslation(lang, 'candidateOnboarding', key);

  const getValidationAlert = () => {
    if (lang === 'pt') return 'Por favor, preenche todos os campos obrigatórios (*) antes de continuar.';
    if (lang === 'es') return 'Por favor, completa todos los campos obligatorios (*) antes de continuar.';
    if (lang === 'fr') return 'Veuillez remplir tous les champs obligatoires (*) avant de continuer.';
    if (lang === 'de') return 'Bitte füllen Sie alle Pflichtfelder (*) aus, bevor Sie fortfahren.';
    return 'Please fill in all required fields (*) before continuing.';
  };

  const nextStep = () => {
    setErrorMsg('');

    // Validação Passo 1
    if (step === 1) {
      if (
        !country.trim() ||
        !city.trim() ||
        !nationality.trim() ||
        !dob.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !spokenLanguages.trim()
      ) {
        setErrorMsg(getValidationAlert());
        return;
      }
    }

    // Validação Passo 2
    if (step === 2) {
      if (!primaryDomain.trim() || !keySkills.trim()) {
        setErrorMsg(getValidationAlert());
        return;
      }
    }

    // Validação Passo 3 (Foto Obrigatória)
    if (step === 3) {
      if (!photoPreview) {
        setErrorMsg(
          lang === 'pt'
            ? 'Por favor, carrega ou tira uma fotografia de perfil antes de continuar.'
            : 'Please upload or take a profile photo before continuing.'
        );
        return;
      }
    }

    // Validação Passo 4 (CV Obrigatório)
    if (step === 4) {
      if (!cvFile) {
        setErrorMsg(
          lang === 'pt'
            ? 'Por favor, carrega o teu currículo (CV) antes de continuar.'
            : 'Please upload your resume/CV before continuing.'
        );
        return;
      }
    }

    // Validação Passo 5 (Preferências de Trabalho Obrigatórias)
    if (step === 5) {
      if (!workModel || !employmentType) {
        setErrorMsg(getValidationAlert());
        return;
      }
      window.location.href = `/dashboard/candidate?lang=${lang}`;
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setErrorMsg('');
    if (step > 1) setStep(step - 1);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const inputClass = "w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition bg-neutral-900 border-neutral-800 text-white focus:border-purple-500";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans bg-black text-white">
      
      {/* Header Topo: Logotipo Original da SkillGap + Indicador de Passo */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 z-10">
        <a href={`/?lang=${lang}`} className="flex items-center gap-3">
          
          {/* Logotipo Original Exato */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1">
            <Image
              src="/images/logo-icon.png"
              alt="Logotipo SkillGap"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            SKILLGAP
          </span>
        </a>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-purple-400">
            {lang === 'pt' ? `Passo ${step} de ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          </span>
        </div>
      </div>

      {/* Card do Onboarding */}
      <div className="w-full max-w-xl border rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative bg-neutral-950/90 border-purple-500/30 shadow-purple-900/20">
        
        {/* Barra de Progresso */}
        <div className="w-full h-2 rounded-full mb-6 overflow-hidden bg-neutral-800">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Alerta de Validação */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* PASSO 1: Perfil & Localização */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('step1Title')}</h2>
              <p className="text-sm text-gray-400">{t('step1Subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">{t('countryLabel')}</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={t('countryPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{t('cityLabel')}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('cityPlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">{t('addressLabel')}</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('addressPlaceholder')}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">{t('nationalityLabel')}</label>
                <input
                  type="text"
                  required
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder={t('nationalityPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{t('dobLabel')}</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">{t('emailLabel')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{t('phoneLabel')}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">{t('languageLabel')}</label>
              <input
                type="text"
                required
                value={spokenLanguages}
                onChange={(e) => setSpokenLanguages(e.target.value)}
                placeholder={t('languagePlaceholder')}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* PASSO 2: Competências & Especialização */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('step2Title')}</h2>
              <p className="text-sm text-gray-400">{t('step2Subtitle')}</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">{t('primaryDomainLabel')}</label>
              <input
                type="text"
                required
                value={primaryDomain}
                onChange={(e) => setPrimaryDomain(e.target.value)}
                placeholder={t('primaryDomainPlaceholder')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">{t('keySkillsLabel')}</label>
              <input
                type="text"
                required
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                placeholder={t('keySkillsPlaceholder')}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* PASSO 3: Fotografia & Identidade */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('step3Title')} *</h2>
              <p className="text-sm text-gray-400">{t('step3Subtitle')}</p>
            </div>

            <div className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-purple-500/50 flex items-center justify-center overflow-hidden bg-neutral-900 text-gray-400 text-xs relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Candidate Preview" className="w-full h-full object-cover" />
              ) : (
                t('noPhoto')
              )}
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="border px-4 py-2.5 rounded-lg text-sm transition cursor-pointer bg-neutral-900 border-neutral-800 hover:border-purple-500"
              >
                {t('uploadPhoto')}
              </button>
            </div>
          </div>
        )}

        {/* PASSO 4: Currículo Obrigatório */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('step4Title')} *</h2>
              <p className="text-sm text-gray-400">{t('step4Subtitle')}</p>
            </div>

            <label className="border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer block border-neutral-800 bg-neutral-900/50 hover:border-purple-500">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
              {cvFile ? (
                <div className="text-purple-500 font-medium text-sm">📄 {cvFile.name}</div>
              ) : (
                <>
                  <p className="text-sm font-medium">{t('dragDropText')}</p>
                  <p className="text-xs text-neutral-500 mt-1">{t('fileFormats')}</p>
                </>
              )}
            </label>
          </div>
        )}

        {/* PASSO 5: Preferências de Trabalho */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('step5Title')} *</h2>
              <p className="text-sm text-gray-400">{t('step5Subtitle')}</p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-purple-400 mb-1">
                {t('workModelTitle')} *
              </p>
              <p className="text-xs text-gray-400 mb-2">{t('workModelSubtitle')}</p>
              <div className="space-y-2">
                {[
                  { id: 'remote', label: t('remoteGlobal') },
                  { id: 'hybrid', label: t('hybrid') },
                  { id: 'onsite', label: t('onsite') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkModel(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition cursor-pointer ${
                      workModel === item.id
                        ? 'border-purple-500 bg-purple-600/15 font-semibold'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        workModel === item.id ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
                      }`}
                    ></span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-purple-400 mb-1">
                {t('employmentTypeTitle')} *
              </p>
              <p className="text-xs text-gray-400 mb-2">{t('employmentTypeSubtitle')}</p>
              <div className="space-y-2">
                {[
                  { id: 'full-time', label: t('fullTime') },
                  { id: 'part-time', label: t('partTime') },
                  { id: 'contract', label: t('contract') },
                  { id: 'internship', label: t('internship') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEmploymentType(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition cursor-pointer ${
                      employmentType === item.id
                        ? 'border-purple-500 bg-purple-600/15 font-semibold'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        employmentType === item.id ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
                      }`}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-800/60">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="border px-6 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            >
              {t('back')}
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={nextStep}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white px-8 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-600/30 transition cursor-pointer"
          >
            {step === totalSteps ? t('finish') : t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
}