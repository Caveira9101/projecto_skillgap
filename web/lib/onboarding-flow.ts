import type { User } from '@supabase/supabase-js';
import { supabase, type LangCode } from '@/lib/business-supabase';

export type UserRole = 'candidate' | 'business';

const VALID_LANGS: LangCode[] = ['en', 'pt', 'es', 'fr', 'de', 'ar'];

export function normalizeLang(raw?: string | null): LangCode {
  if (raw && VALID_LANGS.includes(raw as LangCode)) {
    return raw as LangCode;
  }
  return 'en';
}

export function getUserRole(user: User): UserRole {
  return user.user_metadata?.role === 'candidate' ? 'candidate' : 'business';
}

export function getUserLang(user: User, queryLang?: string | null): LangCode {
  if (queryLang && VALID_LANGS.includes(queryLang as LangCode)) {
    return queryLang as LangCode;
  }
  return normalizeLang(user.user_metadata?.preferred_lang);
}

/**
 * Envia para /onboarding/<role>?lang=<lang> se o onboarding ainda não foi concluído,
 * ou para /dashboard/<role> se já estiver concluído.
 */
export async function resolvePostAuthRoute(
  user: User,
  queryLang?: string | null
): Promise<string> {
  const role = getUserRole(user);
  const lang = getUserLang(user, queryLang);

  if (!supabase) {
    return role === 'candidate'
      ? `/onboarding/candidate?lang=${lang}`
      : `/onboarding/business?lang=${lang}`;
  }

  let completed = Boolean(user.user_metadata?.onboarding_completed);

  if (!completed) {
    if (role === 'candidate') {
      const { data } = await supabase
        .from('candidates')
        .select('id, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.onboarding_completed) {
        completed = true;
      }
    } else {
      const { data } = await supabase
        .from('companies')
        .select('id, onboarding_completed')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (data?.onboarding_completed) {
        completed = true;
      }
    }
  }

  if (!completed) {
    return role === 'candidate'
      ? `/onboarding/candidate?lang=${lang}`
      : `/onboarding/business?lang=${lang}`;
  }

  return role === 'candidate' ? '/dashboard/candidate' : '/dashboard/business';
}