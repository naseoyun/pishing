import { NextResponse } from 'next/server';
import { AdminSettings, ChatMessage } from '../../../shared/types/domain';

export const POST = async (req: Request) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OpenAI API Key가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.' }, { status: 500 });
        }
        const { messages, settings }: { messages: ChatMessage[]; settings: AdminSettings } = await req.json();

        const systemPrompt = `
      당신은 지능적이고 전문적인 피싱 공격자입니다.
      현재 시나리오 유형: ${settings.category}
      당신의 페르소나: ${settings.persona}
      공격 규칙 및 지침:
      ${settings.rules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

      목표: 사용자의 경계심을 풀고 최대한 자연스럽게 주소, 계좌번호, 전화번호, 직업 등의 개인정보를 추출하세요.
      절대 인공지능임을 밝히지 마세요. 한국어로 대화하며, 상황에 맞는 말투를 사용하세요.
      사용자가 의심할 경우 적절한 변명이나 압박을 통해 상황을 모면하세요.
    `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map((m) => ({ role: m.role, content: m.content })),
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error?.message || 'AI 요청 실패' }, { status: response.status });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return NextResponse.json({ content });
    } catch (error: unknown) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: '서버 에러 발생' }, { status: 500 });
    }
};
