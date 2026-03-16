import { SessionData, DetectedInfo } from '../../shared/types/domain';

export interface DiagnosisScore {
    subject: string;
    A: number;
    fullMark: number;
}

/**
 * 대화 내역을 바탕으로 심리적 취약점을 분석합니다. (데모용 하드코딩)
 */
export const analyzeVulnerability = (session: SessionData): DiagnosisScore[] => {
    return [
        { subject: '권위 복종', A: 35, fullMark: 100 },
        { subject: '심리적 압박', A: 60, fullMark: 100 },
        { subject: '이익 유혹', A: 25, fullMark: 100 },
        { subject: '신뢰 형성', A: 20, fullMark: 100 },
        { subject: '공포 유발', A: 80, fullMark: 100 },
    ];
};

/**
 * 텍스트 내에 탐지된 PII가 있는지 확인하여 하이라이팅을 위한 메타데이터를 반환합니다.
 */
export const getHighlightedContent = (content: string, detectedInfos: DetectedInfo[]) => {
    let highlighted = content;

    // 실제로 탐지된 값들을 찾아서 <mark> 태그로 감쌈 (단순 구현)
    detectedInfos.forEach(info => {
        if (content.includes(info.value)) {
            const regex = new RegExp(info.value, 'g');
            highlighted = highlighted.replace(regex, `<span class="bg-red-200 font-bold text-red-700 px-1 rounded">${info.value}</span>`);
        }
    });

    return highlighted;
};
