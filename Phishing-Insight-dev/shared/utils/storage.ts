import { AdminSettings, SessionData } from '../types/domain';

const STORAGE_KEYS = {
    ADMIN_SETTINGS: 'pi_admin_settings',
    SESSION_PREFIX: 'pi_session_',
    CURRENT_SESSION_ID: 'pi_current_session_id',
} as const;

/**
 * LocalStorage 추상화 유틸리티
 */
export const storage = {
    /**
     * 관리자 설정을 저장합니다.
     */
    saveAdminSettings: (settings: AdminSettings): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
    },

    /**
     * 관리자 설정을 불러옵니다.
     */
    getAdminSettings: (): AdminSettings | null => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
        return data ? JSON.parse(data) : null;
    },

    /**
     * 세션 데이터를 저장합니다.
     */
    saveSession: (session: SessionData): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(`${STORAGE_KEYS.SESSION_PREFIX}${session.id}`, JSON.stringify(session));

        // 세션 기록 리스트 업데이트
        const sessionList = storage.getSessionList();
        if (!sessionList.includes(session.id)) {
            localStorage.setItem('pi_session_list', JSON.stringify([...sessionList, session.id]));
        }
    },

    /**
     * 세션 데이터를 불러옵니다.
     */
    getSession: (sessionId: string): SessionData | null => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(`${STORAGE_KEYS.SESSION_PREFIX}${sessionId}`);
        return data ? JSON.parse(data) : null;
    },

    /**
     * 모든 세션 ID 리스트를 가져옵니다.
     */
    getSessionList: (): string[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem('pi_session_list');
        return data ? JSON.parse(data) : [];
    },

    /**
     * 현재 활성화된 세션 ID를 저장합니다.
     */
    setCurrentSessionId: (sessionId: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION_ID, sessionId);
    },

    /**
     * 현재 활성화된 세션 ID를 불러옵니다.
     */
    getCurrentSessionId: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION_ID);
    },

    /**
     * 모든 로컬 데이터를 초기화합니다. (데모 초기화용)
     */
    clearAll: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.clear();
    }
};
