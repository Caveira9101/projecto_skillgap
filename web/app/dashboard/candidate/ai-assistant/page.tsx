'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  User,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useDashboardLang } from '../layout';
import { supabase } from '@/lib/supabase/client';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const AI_ASSISTANT_TEXTS: Record<string, any> = {
  en: {
    title: "SkillGap AI Career Assistant",
    subtitle: "Real AI career advice, CV review tips, and interview preparation stored in Supabase.",
    statusBadge: "AI ACTIVE • ADVANCED",
    lockedBadge: "ADVANCED PLAN FEATURE",
    lockedTitle: "Unlock Full Artificial Intelligence Access",
    lockedDesc: "The AI Career Assistant, CV optimization, and AI interview simulations are exclusive to the Advanced plan (€79.99 / $79.99 per month).",
    upgradeBtn: "Upgrade to Advanced Plan",
    welcomePrefix: "Hello",
    welcomeBody: "I am your SkillGap AI Career Assistant. Ask me how to strengthen your profile, prepare for interviews, or prioritize skills to learn.",
    quick1: "How can I improve my profile completion?",
    quick2: "Tips to prepare for technical interviews",
    quick3: "How should I structure my CV summary?",
    inputPlaceholder: "Ask the SkillGap AI assistant...",
    sendBtn: "Send",
    sendingBtn: "Thinking...",
    aiError: "Could not get an AI response right now. Check your API key and Supabase table."
  },
  pt: {
    title: "Assistente de Carreira IA SkillGap",
    subtitle: "Aconselhamento de carreira com IA real, dicas de CV e preparação para entrevistas guardados no Supabase.",
    statusBadge: "IA ATIVA • AVANÇADO",
    lockedBadge: "EXCLUSIVO PLANO AVANÇADO",
    lockedTitle: "Desbloqueia o Acesso Completo à Inteligência Artificial",
    lockedDesc: "O Assistente de Carreira IA, análise e otimização de CV e simulações de entrevistas com IA são exclusivos do plano Avançado (€79,99 / $79,99 por mês).",
    upgradeBtn: "Subscrever Plano Avançado",
    welcomePrefix: "Olá",
    welcomeBody: "Sou o teu Assistente de Carreira IA SkillGap. Pergunta-me como reforçar o teu perfil, preparar entrevistas ou priorizar competências.",
    quick1: "Como posso melhorar a conclusão do meu perfil?",
    quick2: "Dicas para preparar entrevistas técnicas",
    quick3: "Como estruturar o resumo do meu CV?",
    inputPlaceholder: "Pergunta ao assistente IA SkillGap...",
    sendBtn: "Enviar",
    sendingBtn: "A analisar...",
    aiError: "Não foi possível obter resposta da IA agora. Verifica a chave da API e a tabela no Supabase."
  },
  es: {
    title: "Asistente de Carrera IA SkillGap",
    subtitle: "Consejos reales con IA, mejoras de CV y preparación de entrevistas guardados en Supabase.",
    statusBadge: "IA ACTIVA • AVANZADO",
    lockedBadge: "EXCLUSIVO PLAN AVANZADO",
    lockedTitle: "Desbloquea el Acceso Completo a la Inteligencia Artificial",
    lockedDesc: "El Asistente de Carrera IA, análisis de CV y simulaciones de entrevistas con IA son exclusivos del plan Avanzado (€79,99 / $79,99 al mes).",
    upgradeBtn: "Actualizar al Plan Avanzado",
    welcomePrefix: "Hola",
    welcomeBody: "Soy tu Asistente de Carrera IA SkillGap. Pregúntame cómo fortalecer tu perfil, prepararte para entrevistas o priorizar habilidades.",
    quick1: "¿Cómo mejorar el grado de avance de mi perfil?",
    quick2: "Consejos para preparar entrevistas técnicas",
    quick3: "¿Cómo redactar el resumen de mi CV?",
    inputPlaceholder: "Escribe tu consulta al asistente IA...",
    sendBtn: "Enviar",
    sendingBtn: "Pensando...",
    aiError: "No se pudo obtener respuesta de la IA. Revisa la clave de API y la tabla en Supabase."
  },
  fr: {
    title: "Assistant de Carrière IA SkillGap",
    subtitle: "Conseils IA réels, optimisation de CV et préparation aux entretiens enregistrés dans Supabase.",
    statusBadge: "IA ACTIVE • AVANCÉ",
    lockedBadge: "EXCLUSIF OFFRE AVANCÉ",
    lockedTitle: "Débloquez l'Accès Complet à l'Intelligence Artificielle",
    lockedDesc: "L'Assistant Carrière IA, l'optimisation de CV et les simulations d'entretiens IA sont réservés à l'offre Avancé (79,99 € / 79,99 $ par mois).",
    upgradeBtn: "Passer à l'Offre Avancé",
    welcomePrefix: "Bonjour",
    welcomeBody: "Je suis votre Assistant de Carrière IA SkillGap. Demandez-moi comment renforcer votre profil, préparer un entretien ou cibler des compétences.",
    quick1: "Comment améliorer la complétude de mon profil ?",
    quick2: "Conseils pour préparer un entretien technique",
    quick3: "Comment structurer le résumé de mon CV ?",
    inputPlaceholder: "Posez votre question à l'assistant IA...",
    sendBtn: "Envoyer",
    sendingBtn: "Réflexion...",
    aiError: "Impossible d'obtenir une réponse IA. Vérifiez la clé API et la table Supabase."
  },
  de: {
    title: "SkillGap KI-Karriereassistent",
    subtitle: "Echte KI-Karrierehinweise, Lebenslauf-Tipps und Interviewvorbereitung gespeichert in Supabase.",
    statusBadge: "KI AKTIV • ERWEITERT",
    lockedBadge: "EXKLUSIV IM TARIF ERWEITERT",
    lockedTitle: "Vollen Zugriff auf Künstliche Intelligenz freischalten",
    lockedDesc: "KI-Karriereassistent, KI-Lebenslaufoptimierung und KI-Interviewsimulationen sind exklusiv im Tarif Erweitert (79,99 € / 79,99 $ pro Monat) enthalten.",
    upgradeBtn: "Auf Tarif Erweitert wechseln",
    welcomePrefix: "Hallo",
    welcomeBody: "Ich bin Ihr SkillGap KI-Karriereassistent. Fragen Sie mich, wie Sie Ihr Profil schärfen, Interviews vorbereiten oder Fähigkeiten priorisieren können.",
    quick1: "Wie kann ich meinen Profilfortschritt verbessern?",
    quick2: "Tipps zur Vorbereitung auf technische Interviews",
    quick3: "Wie strukturiere ich mein Lebenslauf-Profil?",
    inputPlaceholder: "Stellen Sie dem KI-Assistenten eine Frage...",
    sendBtn: "Senden",
    sendingBtn: "Denke nach...",
    aiError: "Keine KI-Antwort erhalten. Prüfen Sie API-Schlüssel und Supabase-Tabelle."
  },
  ar: {
    title: "مساعد المسار المهني بالذكاء الاصطناعي SkillGap",
    subtitle: "نصائح مهنية حقيقية بالذكاء الاصطناعي وتحسين السيرة والمقابلات محفوظة في Supabase.",
    statusBadge: "الذكاء الاصطناعي نشط • الباقة المتقدمة",
    lockedBadge: "حصري للباقة المتقدمة",
    lockedTitle: "افتح الوصول الكامل إلى أدوات الذكاء الاصطناعي",
    lockedDesc: "مساعد المسار المهني وتحليل السيرة الذاتية ومحاكاة المقابلات بالذكاء الاصطناعي متوفرة حصرياً في الباقة المتقدمة (€79.99 / $79.99 شهرياً).",
    upgradeBtn: "الترقية إلى الباقة المتقدمة",
    welcomePrefix: "مرحباً",
    welcomeBody: "أنا مساعد المسار المهني بالذكاء الاصطناعي SkillGap. اسألني عن تطوير ملفك أو التحضير للمقابلات أو ترتيب أولويات المهارات.",
    quick1: "كيف يمكنني تحسين اكتمال ملفي الشخصي؟",
    quick2: "نصائح للاستعداد للمقابلات التقنية",
    quick3: "كيف أصيغ نبذة السيرة الذاتية بشكل فعال؟",
    inputPlaceholder: "اكتب سؤالك لمساعد الذكاء الاصطناعي...",
    sendBtn: "إرسال",
    sendingBtn: "جاري التحليل...",
    aiError: "تعذر الحصول على رد من الذكاء الاصطناعي. تحقق من مفتاح API وجدول Supabase."
  }
};

export default function CandidateAIAssistantPage() {
  const { lang, candidate } = useDashboardLang();
  const ai = AI_ASSISTANT_TEXTS[lang] || AI_ASSISTANT_TEXTS['en'];
  const hasAiAccess = Boolean(candidate?.hasAiAccess);
  const isRtl = lang === 'ar';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadChatHistory() {
      const welcome: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        text: `${ai.welcomePrefix}${candidate?.fullName ? ` ${candidate.fullName}` : ''}! ${ai.welcomeBody}`,
      };

      try {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData?.user?.id;
        if (!uid || !active) {
          setMessages([welcome]);
          return;
        }

        const { data, error } = await supabase
          .from('candidate_ai_messages')
          .select('id, sender, content')
          .eq('user_id', uid)
          .order('created_at', { ascending: true });

        if (!active) return;

        if (!error && Array.isArray(data) && data.length > 0) {
          setMessages(
            data.map((row: any) => ({
              id: String(row.id),
              sender: row.sender === 'user' ? 'user' : 'ai',
              text: row.content || '',
            }))
          );
        } else {
          setMessages([welcome]);
        }
      } catch {
        if (active) setMessages([welcome]);
      }
    }

    loadChatHistory();
    return () => {
      active = false;
    };
  }, [lang, candidate?.fullName]);

  const handleSendMessage = async (textToSend?: string) => {
    if (!hasAiAccess || sending) return;
    const content = (textToSend ?? inputText).trim();
    if (!content) return;

    setSending(true);
    setErrorMsg(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const res = await fetch('/api/ai/candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ prompt: content, lang }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || ai.aiError);
      }

      const added: ChatMessage[] = [];
      if (payload?.userMessage) {
        added.push({
          id: String(payload.userMessage.id),
          sender: 'user',
          text: payload.userMessage.content,
        });
      }
      if (payload?.aiMessage) {
        added.push({
          id: String(payload.aiMessage.id),
          sender: 'ai',
          text: payload.aiMessage.content,
        });
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== 'welcome');
        return [...filtered, ...added];
      });

      if (!textToSend) setInputText('');
    } catch (err: any) {
      setErrorMsg(err?.message || ai.aiError);
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {ai.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{ai.subtitle}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wider self-start md:self-auto">
          {hasAiAccess ? ai.statusBadge : ai.lockedBadge}
        </span>
      </div>

      {!hasAiAccess ? (
        <div className="p-8 rounded-2xl bg-[#0c0716] border border-purple-500/35 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">{ai.lockedTitle}</h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            {ai.lockedDesc}
          </p>
          <div className="pt-1">
            <Link
              href="/dashboard/candidate/subscriptions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{ai.upgradeBtn}</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[ai.quick1, ai.quick2, ai.quick3].map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={sending}
                onClick={() => handleSendMessage(q)}
                className="px-3.5 py-2 rounded-xl bg-[#0c0716] border border-purple-500/25 hover:border-purple-500/50 text-xs text-purple-200 transition cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#0c0716] border border-purple-900/40 space-y-4">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pe-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-purple-600/30 border border-purple-500/40 text-white'
                        : 'bg-white/5 border border-purple-500/15 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-3 border-t border-purple-900/30 flex items-center gap-3"
            >
              <input
                type="text"
                disabled={sending}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={ai.inputPlaceholder}
                className="flex-1 bg-white/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 hover:opacity-95 transition cursor-pointer disabled:opacity-60"
              >
                <span>{sending ? ai.sendingBtn : ai.sendBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}