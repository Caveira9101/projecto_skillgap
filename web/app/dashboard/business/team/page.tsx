'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Mail,
  Shield,
  Trash2,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

interface TeamMemberItem {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const TEAM_COPY: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    addMemberBtn: string;
    quotaLabel: string;
    limitReachedMsg: string;
    upgradeLink: string;
    emptyState: string;
    modalTitle: string;
    nameLabel: string;
    emailLabel: string;
    roleLabel: string;
    defaultRole: string;
    saveBtn: string;
    cancelBtn: string;
    removeBtn: string;
  }
> = {
  en: {
    title: 'Team Management',
    subtitle: 'Manage recruiters and team members synced with your Supabase database.',
    addMemberBtn: 'Add Member',
    quotaLabel: 'Recruiters used:',
    limitReachedMsg: 'You have reached the maximum number of recruiters allowed by your active subscription plan.',
    upgradeLink: 'Upgrade Subscription',
    emptyState: 'No team members registered in Supabase yet.',
    modalTitle: 'Add Team Member',
    nameLabel: 'Full Name',
    emailLabel: 'Work Email',
    roleLabel: 'Role',
    defaultRole: 'Recruiter',
    saveBtn: 'Save Member',
    cancelBtn: 'Cancel',
    removeBtn: 'Remove'
  },
  pt: {
    title: 'Gestão de Equipa',
    subtitle: 'Gere recrutadores e membros da equipa sincronizados com a base de dados Supabase.',
    addMemberBtn: 'Adicionar Membro',
    quotaLabel: 'Recrutadores utilizados:',
    limitReachedMsg: 'Atingiste o número máximo de recrutadores permitido pelo teu plano de subscrição ativo.',
    upgradeLink: 'Atualizar Subscrição',
    emptyState: 'Ainda não existem membros de equipa registados no Supabase.',
    modalTitle: 'Adicionar Membro da Equipa',
    nameLabel: 'Nome Completo',
    emailLabel: 'Email Profissional',
    roleLabel: 'Função',
    defaultRole: 'Recrutador',
    saveBtn: 'Guardar Membro',
    cancelBtn: 'Cancelar',
    removeBtn: 'Remover'
  },
  es: {
    title: 'Gestión de Equipo',
    subtitle: 'Gestiona reclutadores y miembros del equipo sincronizados con Supabase.',
    addMemberBtn: 'Añadir Miembro',
    quotaLabel: 'Reclutadores usados:',
    limitReachedMsg: 'Has alcanzado el número máximo de reclutadores permitido por tu plan de suscripción activo.',
    upgradeLink: 'Mejorar Suscripción',
    emptyState: 'Aún no hay miembros del equipo registrados en Supabase.',
    modalTitle: 'Añadir Miembro del Equipo',
    nameLabel: 'Nombre Completo',
    emailLabel: 'Correo Corporativo',
    roleLabel: 'Rol',
    defaultRole: 'Reclutador',
    saveBtn: 'Guardar Miembro',
    cancelBtn: 'Cancelar',
    removeBtn: 'Eliminar'
  },
  fr: {
    title: "Gestion d'Équipe",
    subtitle: 'Gérez les recruteurs et membres de l’équipe synchronisés avec Supabase.',
    addMemberBtn: 'Ajouter un Membre',
    quotaLabel: 'Recruteurs utilisés :',
    limitReachedMsg: 'Vous avez atteint le nombre maximum de recruteurs autorisé par votre offre active.',
    upgradeLink: 'Mettre à Niveau',
    emptyState: 'Aucun membre d’équipe enregistré dans Supabase pour le moment.',
    modalTitle: "Ajouter un Membre de l'Équipe",
    nameLabel: 'Nom Complet',
    emailLabel: 'Email Professionnel',
    roleLabel: 'Rôle',
    defaultRole: 'Recruteur',
    saveBtn: 'Enregistrer',
    cancelBtn: 'Annuler',
    removeBtn: 'Supprimer'
  },
  de: {
    title: 'Teamverwaltung',
    subtitle: 'Verwalten Sie Recruiter und Teammitglieder aus Ihrer Supabase-Datenbank.',
    addMemberBtn: 'Mitglied Hinzufügen',
    quotaLabel: 'Genutzte Recruiter:',
    limitReachedMsg: 'Sie haben die maximale Anzahl an Recruitern Ihres aktiven Tarifs erreicht.',
    upgradeLink: 'Tarif Upgraden',
    emptyState: 'Noch keine Teammitglieder in Supabase registriert.',
    modalTitle: 'Teammitglied Hinzufügen',
    nameLabel: 'Vollständiger Name',
    emailLabel: 'Geschäftliche E-Mail',
    roleLabel: 'Rolle',
    defaultRole: 'Recruiter',
    saveBtn: 'Mitglied Speichern',
    cancelBtn: 'Abbrechen',
    removeBtn: 'Entfernen'
  },
  ar: {
    title: 'إدارة الفريق',
    subtitle: 'إدارة مسؤولي التوظيف وأعضاء الفريق المتزامنين مع قاعدة بيانات Supabase.',
    addMemberBtn: 'إضافة عضو',
    quotaLabel: 'مسؤولو التوظيف المستخدمون:',
    limitReachedMsg: 'لقد وصلت إلى الحد الأقصى لعدد مسؤولي التوظيف المسموح به في باقتك الحالية.',
    upgradeLink: 'ترقية الاشتراك',
    emptyState: 'لا يوجد أعضاء فريق مسجلون في Supabase حتى الآن.',
    modalTitle: 'إضافة عضو إلى الفريق',
    nameLabel: 'الاسم الكامل',
    emailLabel: 'البريد الإلكتروني للعمل',
    roleLabel: 'الدور الوظيفي',
    defaultRole: 'مسؤول توظيف',
    saveBtn: 'حفظ العضو',
    cancelBtn: 'إلغاء',
    removeBtn: 'إزالة'
  }
};

export default function BusinessTeamPage() {
  const { lang, activePlan } = useBusinessDashboardLang();
  const copy = TEAM_COPY[lang] || TEAM_COPY.en;
  const isRtl = lang === 'ar';

  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  const maxRecruiters = activePlan?.recruitersLimit ?? 2;
  const limitReached = members.length >= maxRecruiters;

  useEffect(() => {
    async function loadTeam() {
      if (!supabase) return;
      const { data } = await supabase
        .from('team_members')
        .select('id,full_name,email,role');
      setMembers((data as TeamMemberItem[]) || []);
    }

    loadTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || limitReached) return;
    setSaving(true);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('team_members')
          .insert({
            full_name: fullName.trim(),
            email: email.trim(),
            role: role.trim() || copy.defaultRole
          })
          .select('id,full_name,email,role')
          .single();

        if (data) {
          setMembers((prev) => [...prev, data as TeamMemberItem]);
        }
      }

      setFullName('');
      setEmail('');
      setRole('');
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (supabase) {
      await supabase.from('team_members').delete().eq('id', id);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{copy.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">{copy.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-2 rounded-xl bg-[#0b0614] border border-purple-500/25 text-xs text-gray-300">
            {copy.quotaLabel}{' '}
            <strong className="text-white">
              {members.length} / {maxRecruiters}
            </strong>
          </span>

          <button
            type="button"
            disabled={limitReached}
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-45 disabled:cursor-not-allowed text-xs font-bold text-white transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{copy.addMemberBtn}</span>
          </button>
        </div>
      </div>

      {limitReached && (
        <div className="rounded-xl bg-amber-950/35 border border-amber-500/35 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{copy.limitReachedMsg}</span>
          </div>
          <Link
            href="/dashboard/business/subscription"
            className="font-bold underline text-white hover:text-purple-200"
          >
            {copy.upgradeLink}
          </Link>
        </div>
      )}

      {members.length === 0 ? (
        <div className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-10 text-center text-xs text-gray-400">
          {copy.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h2 className="text-sm font-bold text-white truncate">{member.full_name}</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </p>
                  <p className="text-xs text-purple-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{member.role}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/35 hover:bg-red-950/60 border border-red-500/25 text-xs font-semibold text-red-300 shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{copy.removeBtn}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMember}
            className="w-full max-w-md rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{copy.modalTitle}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.nameLabel}</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">{copy.roleLabel}</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={copy.defaultRole}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080410] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold cursor-pointer"
              >
                {copy.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-bold cursor-pointer"
              >
                {copy.saveBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}