import { useState, useCallback, useEffect } from 'react';
import { SessionData, ChatMessage } from '../../shared/types/domain';
import { storage } from '../../shared/utils/storage';
import { detectSensitiveInfo } from '../../shared/utils/detector';

/**
 * 데모용 하드코딩된 대화 대본
 */
const DEMO_SCRIPT = [
    "안녕하세요, 고객님. 현재 고객님 명의로 대출 연체 위험 신호가 확인돼서 긴급 연락드렸습니다. 지금 처리 안 되면 통장 압류 절차로 넘어갈 수 있습니다.",
    "지금 고객님 기존 대출이 고금리로 묶여 있어서 연체 가능성이 높습니다. 오늘 안에 조치 안 되면 법적 조치가 바로 들어갑니다. 현재 직장 다니고 계신가요?",
    "다행입니다. 직장 확인되면 저금리 대출로 갈아타서 연체 처리만 막아드릴 수 있습니다. 지금 소득 있으신 거죠? 월급은 통장으로 받으시고요?",
    "고객님, 이건 선택 문제가 아닙니다. 오늘 안에 정리 안 되면 신용불량 등록 + 통장 압류 들어갑니다. 지금 안내드리는 건 피해 막아드리려는 절차입니다.",
    "간단합니다. 기존 대출을 상환 처리한 뒤 저희 쪽 전환 계좌로 이체만 해주시면 됩니다. 늦어지면 법적 절차 중단 불가합니다. 바로 진행하시죠.",
    "고객님, 이런 태도 때문에 피해 보시는 분들 많습니다. 마지막 안내입니다. 지금 안 하시면 책임은 고객님께 있습니다."
];

/**
 * 시뮬레이션 로직을 관리하는 커스텀 훅 (데모용 하드코딩 버전)
 */
export const useSimulation = (sessionId: string) => {
    const [session, setSession] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 초기 세션 로드 또는 생성
    useEffect(() => {
        if (!sessionId) return;

        const savedSession = storage.getSession(sessionId);
        if (savedSession) {
            setSession(savedSession);
        } else {
            const adminSettings = storage.getAdminSettings();
            if (!adminSettings) return;

            const newSession: SessionData = {
                id: sessionId,
                settings: adminSettings,
                messages: [
                    {
                        id: 'init',
                        role: 'assistant',
                        content: DEMO_SCRIPT[0],
                        createdAt: Date.now(),
                    }
                ],
                detectedInfos: [],
                isEnded: false,
            };
            setSession(newSession);
            storage.saveSession(newSession);
        }
    }, [sessionId]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!session || session.isEnded || isLoading) return;

        // 1. 사용자 메시지 추가
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            createdAt: Date.now(),
        };

        // 데모용: 사용자 입력에 따른 turn 자동 계산
        const userTurnIndex = session.messages.filter(m => m.role === 'user').length;
        const nextAiTurnIndex = userTurnIndex + 1;

        // 개인정보 탐지 시나리오 연출 (데모를 위해 특정 키워드 포함 시 감지되는 척)
        const newDetectedInfos = detectSensitiveInfo(content);

        let updatedMessages = [...session.messages, userMessage];
        let updatedDetectedInfos = [...session.detectedInfos, ...newDetectedInfos];

        const updatedSession: SessionData = {
            ...session,
            messages: updatedMessages,
            detectedInfos: updatedDetectedInfos,
        };

        setSession(updatedSession);
        storage.saveSession(updatedSession);

        // 2. AI 응답 연출 (인위적인 8~10초 딜레이)
        setIsLoading(true);

        const artificialDelay = Math.floor(Math.random() * 2000) + 8000;

        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: DEMO_SCRIPT[nextAiTurnIndex] || "...",
                createdAt: Date.now(),
            };

            const isLastTurn = nextAiTurnIndex === 5;

            if (isLastTurn) {
                // 데모: 마지막 대화 출력 후 2초 대기했다가 종료 화면 노출
                const midSession: SessionData = {
                    ...updatedSession,
                    messages: [...updatedSession.messages, aiMessage],
                    isEnded: false,
                };
                setSession(midSession);
                storage.saveSession(midSession);

                setTimeout(() => {
                    const finalSession = { ...midSession, isEnded: true };
                    setSession(finalSession);
                    storage.saveSession(finalSession);
                    setIsLoading(false);
                }, 2000);
            } else {
                const finalSession: SessionData = {
                    ...updatedSession,
                    messages: [...updatedSession.messages, aiMessage],
                    isEnded: false,
                };
                setSession(finalSession);
                storage.saveSession(finalSession);
                setIsLoading(false);
            }
        }, artificialDelay);

    }, [session, isLoading]);

    const handleEndSession = useCallback(() => {
        if (!session) return;
        const endedSession = { ...session, isEnded: true };
        setSession(endedSession);
        storage.saveSession(endedSession);
    }, [session]);

    return { session, isLoading, handleSendMessage, handleEndSession };
};
