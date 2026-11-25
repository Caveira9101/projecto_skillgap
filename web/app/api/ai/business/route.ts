import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function callRealBusinessLLM(systemPrompt: string, userPrompt: string) {
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
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM request failed: ${errText}`);
  }

  const json = await res.json();
  const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error('Empty AI evaluation response');
  }
  return JSON.parse(raw);
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

    const { job, candidates, lang = 'en' } = await req.json();
    if (!job || !Array.isArray(candidates)) {
      return NextResponse.json({ error: 'Job and candidates are required' }, { status: 400 });
    }

    const systemPrompt = `You are SkillGap AI Talent Evaluator for recruiters. Respond in language code "${lang}".
Return ONLY a valid JSON object with this exact structure:
{
  "summary": "concise executive summary for the recruiter",
  "evaluations": [
    {
      "candidateId": "string",
      "score": 0,
      "matched": ["skill"],
      "gaps": ["skill"],
      "recommendation": "short recruiter note based strictly on provided candidate data"
    }
  ]
}`;

    const aiResult = await callRealBusinessLLM(
      systemPrompt,
      JSON.stringify({ job, candidates })
    );

    const { data: savedEval, error: saveErr } = await supabaseUser
      .from('business_ai_evaluations')
      .insert({
        company_user_id: user.id,
        job_id: String(job.id),
        job_title: String(job.title || ''),
        summary: String(aiResult?.summary || ''),
        evaluations: Array.isArray(aiResult?.evaluations) ? aiResult.evaluations : [],
        lang
      })
      .select()
      .single();

    if (saveErr) {
      return NextResponse.json({ error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ evaluationRecord: savedEval });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal Business AI error' },
      { status: 500 }
    );
  }
}