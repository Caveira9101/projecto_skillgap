'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Eye,
  Bookmark,
  MapPin
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface CompanyInteraction {
  id: string;
  company_name: string;
  location: string | null;
  sector: string | null;
  interaction_type: 'viewed' | 'saved';
}

const COMPANIES_TEXTS: Record<string, any> = {
  en: {
    title: "Interested Companies",
    subtitle: "Companies and recruiters tracking or saving your professional profile.",
    viewsLabel: "Profile Views",
    viewsSuffix: "Views",
    viewsSub: "Recorded profile visits",
    savedByLabel: "Saved by Recruiter",
    savedSuffix: "Companies",
    savedBySub: "Profiles bookmarked by companies",
    savedFavBadge: "Saved to Favorites",
    viewedBadge: "Profile Viewed",
    emptyTitle: "No company interactions yet",
    emptyDesc: "Once companies view or bookmark your profile, they will appear here automatically.",
    aiTipTitle: "SkillGap AI Recruiter Radar",
    aiTipText: "Keeping your profile complete and visible increases the likelihood of recruiters discovering your background."
  },
  pt: {
    title: "Empresas Interessadas",
    subtitle: "Empresas e recrutadores a acompanhar ou guardar o teu perfil profissional.",
    viewsLabel: "Visualizações do Perfil",
    viewsSuffix: "Visualizações",
    viewsSub: "Visitas registadas no perfil",
    savedByLabel: "Guardado por Recrutador",
    savedSuffix: "Empresas",
    savedBySub: "Perfis guardados por empresas",
    savedFavBadge: "Guardado nos Favoritos",
    viewedBadge: "Perfil Consultado",
    emptyTitle: "Ainda sem interações de empresas",
    emptyDesc: "Assim que as empresas consultarem ou guardarem o teu perfil, aparecerão aqui automaticamente.",
    aiTipTitle: "Radar de Recrutadores IA SkillGap",
    aiTipText: "Manter o teu perfil completo e visível aumenta a probabilidade de recrutadores encontrarem o teu percurso."
  },
  es: {
    title: "Empresas Interesadas",
    subtitle: "Empresas y reclutadores que siguen o guardan tu perfil profesional.",
    viewsLabel: "Vistas del Perfil",
    viewsSuffix: "Vistas",
    viewsSub: "Visitas registradas al perfil",
    savedByLabel: "Guardado por Reclutador",
    savedSuffix: "Empresas",
    savedBySub: "Perfiles guardados por empresas",
    savedFavBadge: "Guardado en Favoritos",
    viewedBadge: "Perfil Consultado",
    emptyTitle: "Aún no hay interacciones de empresas",
    emptyDesc: "Cuando las empresas vean o guarden tu perfil, aparecerán aquí automáticamente.",
    aiTipTitle: "Radar de Reclutadores IA SkillGap",
    aiTipText: "Mantener tu perfil completo y visible aumenta la probabilidad de que los reclutadores encuentren tu trayectoria."
  },
  fr: {
    title: "Entreprises Intéressées",
    subtitle: "Entreprises et recruteurs suivant ou sauvegardant votre profil professionnel.",
    viewsLabel: "Vues du Profil",
    viewsSuffix: "Vues",
    viewsSub: "Visites enregistrées sur le profil",
    savedByLabel: "Sauvegardé par un Recruteur",
    savedSuffix: "Entreprises",
    savedBySub: "Profils enregistrés par des entreprises",
    savedFavBadge: "Enregistré dans les Favoris",
    viewedBadge: "Profil Consulté",
    emptyTitle: "Aucune interaction d'entreprise pour l'instant",
    emptyDesc: "Lorsqu'une entreprise consulte ou enregistre votre profil, elle apparaîtra ici automatiquement.",
    aiTipTitle: "Radar de Recruteurs IA SkillGap",
    aiTipText: "Garder votre profil complet et visible augmente vos chances d'être repéré par les recruteurs."
  },
  de: {
    title: "Interessierte Unternehmen",
    subtitle: "Unternehmen und Personalvermittler, die Ihr Berufsprofil verfolgen oder speichern.",
    viewsLabel: "Profilaufrufe",
    viewsSuffix: "Aufrufe",
    viewsSub: "Registrierte Profilbesuche",
    savedByLabel: "Vom Recruiter gespeichert",
    savedSuffix: "Unternehmen",
    savedBySub: "Von Unternehmen gespeicherte Profile",
    savedFavBadge: "Zu Favoriten hinzugefügt",
    viewedBadge: "Profil angesehen",
    emptyTitle: "Noch keine Unternehmensinteraktionen",
    emptyDesc: "Sobald Unternehmen Ihr Profil ansehen oder speichern, erscheinen sie hier automatisch.",
    aiTipTitle: "SkillGap KI-Recruiter-Radar",
    aiTipText: "Ein vollständiges und sichtbares Profil erhöht die Chancen, von passenden Recruitern gefunden zu werden."
  },
  ar: {
    title: "الشركات المهتمة",
    subtitle: "الشركات ومسؤولو التوظيف الذين يتابعون أو يحفظون ملفك المهني.",
    viewsLabel: "مشاهدات الملف الشخصي",
    viewsSuffix: "مشاهدات",
    viewsSub: "الزيارات المسجلة للملف الشخصي",
    savedByLabel: "تم الحفظ بواسطة مسؤول توظيف",
    savedSuffix: "شركات",
    savedBySub: "ملفات محفوظة لدى الشركات",
    savedFavBadge: "محفوظ في المفضلة",
    viewedBadge: "تمت مشاهدة الملف",
    emptyTitle: "لا توجد تفاعلات من الشركات بعد",
    emptyDesc: "عندما تقوم الشركات بعرض أو حفظ ملفك الشخصي، ستظهر هنا تلقائياً.",
    aiTipTitle: "رادار التوظيف بالذكاء الاصطناعي SkillGap",
    aiTipText: "الحفاظ على اكتمال ملفك الشخصي وظهوره يزيد من فرص وصول مسؤولي التوظيف إليك."
  }
};

export default function CandidateCompaniesPage() {
  const { lang } = useDashboardLang();
  const comp = COMPANIES_TEXTS[lang] || COMPANIES_TEXTS['en'];

  const [viewsCount, setViewsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [interactions, setInteractions] = useState<CompanyInteraction[]>([]);

  useEffect(() => {
    let active = true;

    async function loadCompanies() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId || !active) return;

        const { data: rows } = await supabase
          .from('profile_views')
          .select('*')
          .eq('candidate_id', userId)
          .order('created_at', { ascending: false });

        if (!active) return;

        const list: CompanyInteraction[] = Array.isArray(rows)
          ? rows.map((r: any) => ({
              id: String(r.id),
              company_name: r.company_name || '',
              location: r.location || null,
              sector: r.sector || null,
              interaction_type: r.interaction_type === 'saved' ? 'saved' : 'viewed',
            }))
          : [];

        const savedList = list.filter((item) => item.interaction_type === 'saved');

        setViewsCount(list.length);
        setSavedCount(savedList.length);
        setInteractions(list);
      } catch {
        setViewsCount(0);
        setSavedCount(0);
        setInteractions([]);
      }
    }

    loadCompanies();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {comp.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{comp.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {comp.viewsLabel}
            </span>
            <p className="text-2xl font-extrabold text-white mt-1">
              {viewsCount} {comp.viewsSuffix}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1">{comp.viewsSub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {comp.savedByLabel}
            </span>
            <p className="text-2xl font-extrabold text-white mt-1">
              {savedCount} {comp.savedSuffix}
            </p>
            <p className="text-[11px] text-blue-400 mt-1">{comp.savedBySub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {interactions.length > 0 ? (
        <div className="space-y-4">
          {interactions.map((item) => {
            const isSaved = item.interaction_type === 'saved';
            const initials = (item.company_name || 'SG').slice(0, 4).toUpperCase();

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 hover:border-purple-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${
                      isSaved
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20'
                        : 'bg-gradient-to-br from-fuchsia-600 to-purple-600 shadow-purple-600/20'
                    } flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${
                          isSaved
                            ? 'bg-blue-950/60 border-blue-500/30 text-blue-400'
                            : 'bg-fuchsia-950/60 border-fuchsia-500/30 text-fuchsia-300'
                        } border text-[10px] font-bold uppercase`}
                      >
                        {isSaved ? comp.savedFavBadge : comp.viewedBadge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">{item.company_name}</h2>
                    <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" /> {item.location}
                        </span>
                      )}
                      {item.sector && <span>{item.sector}</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-900/40 text-center space-y-2">
          <h2 className="text-base font-bold text-white">{comp.emptyTitle}</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{comp.emptyDesc}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{comp.aiTipTitle}</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{comp.aiTipText}</p>
        </div>
      </div>
    </div>
  );
}