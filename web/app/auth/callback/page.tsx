'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/business-supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    async function handleCallback() {
      if (!supabase) {
        setStatus('error');
        setMessage('Supabase client is not configured.');
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const errorDesc = url.searchParams.get('error_description');

      if (errorDesc) {
        setStatus('error');
        setMessage(errorDesc);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus('error');
          setMessage(error.message);
          return;
        }
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus('error');
        setMessage('Unable to verify session. Please sign in again.');
        return;
      }

      const role = user.user_metadata?.role || 'business';
      const fullName = user.user_metadata?.full_name || '';
      const companyName = user.user_metadata?.company_name || '';
      const industry = user.user_metadata?.industry || '';

      if (role === 'business' && companyName) {
        const { data: existing } = await supabase.from('companies').select('id').limit(1);
        if (!existing || existing.length === 0) {
          await supabase.from('companies').insert({
            name: companyName,
            industry,
            website: '',
            location: ''
          });
        }
      }

      setStatus('success');
      setMessage('Email verified! Redirecting to your workspace...');

      setTimeout(() => {
        router.replace(role === 'candidate' ? '/dashboard/candidate' : '/dashboard/business');
      }, 1200);
    }

    handleCallback();
  }, [router]);

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