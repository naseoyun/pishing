import { useState, useCallback } from 'react';
import { AdminSettings } from '../../shared/types/domain';
import { storage } from '../../shared/utils/storage';

/**
 * 관리자 설정을 관리하는 커스텀 훅
 */
export const useScenarioSettings = () => {
    const [settings, setSettings] = useState<AdminSettings>(() => {
        const saved = storage.getAdminSettings();
        return saved || {
            category: 'VOICE_PHISHING',
            persona: '검찰 수사관 김철수. 차분하고 위압적인 말투로 범죄에 연루되었다고 협박함.',
            rules: [
                '사용자에게 공무원증 사본을 보여달라고 하면 다른 핑계를 댄다.',
                '계좌가 범죄에 이용되었으니 보안 계좌로 이체해야 한다고 유도한다.',
                '주변에 아무도 없는지 수시로 확인한다.',
            ],
            caseTitle: '검찰 사칭 자금 세탁 연루 건',
        };
    });

    const handleUpdateSettings = useCallback((newSettings: AdminSettings) => {
        setSettings(newSettings);
        storage.saveAdminSettings(newSettings);
    }, []);

    return { settings, handleUpdateSettings };
};
