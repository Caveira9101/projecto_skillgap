'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'b2b' ? 'b2b' : 'b2c';
  const [accountType, setAccountType] = useState<'b2c' | 'b2b'>(initialType);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'b2b' || typeParam === 'b2c') {
      setAccountType(typeParam);
    }
  }, [searchParams]);

  return (
    <main className="relative min-h-screen bg-[#07030e] text-white flex flex-col justify-between overflow-hidden px-6 py-10">
      {/* Glow de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabeçalho Minimalista com Logótipo */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="8" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff" strokeWidth="7" />
              <circle cx="50" cy="50" r="23" fill="none" stroke="#ffffff" strokeWidth="6" />
              <path d="M 50 27 L 70 27 L 70 50 L 55 50" fill="none" stroke="#07030e" strokeWidth="8" />
              <circle cx="50" cy="50" r="11" fill="#ffffff" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            SKILLGAP
          </span>
        </Link>
        <Link href="/" className="text-xs font-medium text-purple-300 hover:text-white transition">
          &larr; Back to Home
        </Link>
      </header>

      {/* Cartão de Registo */}
      <section className="max-w-md mx-auto w-full my-auto z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#110722]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-950/80"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Create Your Account</h1>
            <p className="text-xs text-purple-300/80">
              Join the AI-driven global talent ecosystem
            </p>
          </div>

          {/* Seletor de Tipo de Conta */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-purple-950/60 border border-purple-500/20 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setAccountType('b2c')}
              className={`py-2.5 text-xs font-semibold rounded-xl transition ${
                accountType === 'b2c'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setAccountType('b2b')}
              className={`py-2.5 text-xs font-semibold rounded-xl transition ${
                accountType === 'b2b'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Business
            </button>
          </div>

          {/* Formulário de Registo */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {accountType === 'b2b' && (
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Xavier Danilo"
                className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-purple-900/50 transition transform hover:-translate-y-0.5 mt-2"
            >
              {accountType === 'b2c' ? 'Register as Candidate' : 'Register as Business'}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Rodapé */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-purple-400/50 z-10">
        &copy; 2026 SkillGap. All rights reserved.
      </footer>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07030e] text-white flex items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}