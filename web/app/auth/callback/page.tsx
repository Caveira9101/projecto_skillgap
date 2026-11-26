'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/business-supabase';
import {
  getUserLang,
  getUserRole,
  resolvePostAuthRoute
} from '@/lib/onboarding-flow';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      if (!supabase) {
        if (!cancelled) {
          setStatus('error');
          setMessage('Supabase client is not configured.');
        }
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const errorDesc = url.searchParams.get('error_description');

      if (errorDesc) {
        if (!cancelled) {
          setStatus('error');
          setMessage(errorDesc);
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            setStatus('error');
            setMessage(error.message);
          }
          return;
        }
      }

      let {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const retry = await supabase.auth.getUser();
        user = retry.data.user;
      }

      if (!user) {
        if (!cancelled) {
          setStatus('error');
          setMessage('Unable to verify session. Please sign in again.');
        }
        return;
      }

      const role = getUserRole(user);
      const lang = getUserLang(user, searchParams.get('lang'));
      const fullName = user.user_metadata?.full_name || '';
      const companyName = user.user_metadata?.company_name || '';
      const industry = user.user_metadata?.industry || '';
      const targetRole = user.user_metadata?.target_role || '';
      const location = user.user_metadata?.location || '';

      if (role === 'business') {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (!existingCompany && (companyName || fullName)) {
          await supabase.from('companies').insert({
            owner_id: user.id,
            name: companyName || fullName,
            industry: industry || null,
            location: null,
            onboarding_completed: false
          });
        }
      } else {
        const { data: existingCandidate } = await supabase
          .from('candidates')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingCandidate && fullName) {
          await supabase.from('candidates').insert({
            user_id: user.id,
            full_name: fullName,
            role: targetRole || 'Candidate',
            location: location || '',
            onboarding_completed: false
          });
        }
      }

      const targetRoute = await resolvePostAuthRoute(user, lang);

      if (!cancelled) {
        setStatus('success');
        setMessage('Email verified! Redirecting...');
        setTimeout(() => {
          router.replace(targetRoute);
        }, 900);
      }
    }

    handleCallback();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#05020a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0b0614] border border-purple-500/30 p-8 text-center space-y-4">
        {status === 'verifying' && (
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        )}
        <h1 className="text-lg font-bold text-white">{message}</h1>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05020a] text-white flex items-center justify-center">
          Verifying...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}