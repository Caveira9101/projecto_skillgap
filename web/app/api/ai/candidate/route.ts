import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function callRealLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in server environment');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM request failed: ${errText}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from LLM');
  }
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: authData, error: authErr } = await supabaseUser.auth.getUser(token);
    const user = authData?.user;
    if (authErr || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { prompt, lang = 'en' } = await req.json();
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Busca contexto real do candidato no Supabase
    const [profileRes, skillsRes, expRes, eduRes] = await Promise.all([
      supabaseUser.from('individual_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseUser.from('candidate_skills').select('name,category,level_label').eq('user_id', user.id),
      supabaseUser.from('candidate_experience').select('role_title,organization,period').eq('user_id', user.id),
      supabaseUser.from('candidate_education').select('title,institution,status').eq('user_id', user.id)
    ]);

    const contextPayload = {
      profile: profileRes.data || null,
      skills: skillsRes.data || [],
      experience: expRes.data || [],
      education: eduRes.data || []
    };

    const systemPrompt = `You are SkillGap AI Career Assistant. Always reply in language code "${lang}".
Give practical, accurate career, CV, interview, and skill-development guidance grounded strictly in the candidate's real Supabase profile data below. Do not invent facts not present in the data.
Candidate Data: ${JSON.stringify(contextPayload)}`;

    // 1. Grava mensagem do utilizador no Supabase
    const { data: savedUserMsg, error: userInsertErr } = await supabaseUser
      .from('candidate_ai_messages')
      .insert({
        user_id: user.id,
        sender: 'user',
        content: prompt.trim(),
        lang
      })
      .select()
      .single();

    if (userInsertErr) {
      return NextResponse.json({ error: userInsertErr.message }, { status: 500 });
    }

    // 2. Obtém resposta real da IA
    const aiReplyText = await callRealLLM(systemPrompt, prompt.trim());

    // 3. Grava resposta da IA no Supabase
    const { data: savedAiMsg, error: aiInsertErr } = await supabaseUser
      .from('candidate_ai_messages')
      .insert({
        user_id: user.id,
        sender: 'ai',
        content: aiReplyText,
        lang
      })
      .select()
      .single();

    if (aiInsertErr) {
      return NextResponse.json({ error: aiInsertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      userMessage: savedUserMsg,
      aiMessage: savedAiMsg
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal AI error' },
      { status: 500 }
    );
  }
}