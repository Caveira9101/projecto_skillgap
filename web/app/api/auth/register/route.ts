import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role, gdprConsent } = await request.json();

    // Validação básica dos campos recebidos
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Por favor, preencha todos os campos obrigatórios.' },
        { status: 400 }
      );
    }

    // Simulação bem-sucedida para o fluxo de desenvolvimento local
    console.log('Registo simulado com sucesso para:', email, 'Role:', role);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: 'mock-user-id-' + Date.now(),
          email,
          user_metadata: { full_name: fullName, role },
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro interno ao processar o registo.' },
      { status: 500 }
    );
  }
}