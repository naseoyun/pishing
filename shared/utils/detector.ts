import { DetectedInfo } from '../types/domain';

/**
 * 개인정보 탐지 정규표현식 패턴
 */
const PATTERNS = {
    PHONE: /(01[016789][-.\s]?\d{3,4}[-.\s]?\d{4})|(02|0[3-6][1-5])[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    ACCOUNT: /(\d{1,}[-.\s]?){10,14}/g, // 일반적인 계좌번호 패턴
    ADDRESS: /(([가-힣]+(시|도))\s+([가-힣]+(구|군|시))\s+([가-힣]+(구|군|시|동|면|리)))|(([가-힣]+(도로명|길|번길))\s*\d+)/g,
    JOB: /(공무원|경찰|검찰|은행|금융감독원|상담원|대리|과장|팀장)/g,
};

/**
 * 텍스트 내에서 개인정보(PII)를 탐지합니다.
 * @param text 탐지할 텍스트
 * @returns 탐지된 정보 배열
 */
export const detectSensitiveInfo = (text: string): DetectedInfo[] => {
    const detected: DetectedInfo[] = [];
    const now = Date.now();

    // Phone detection
    const phoneMatches = text.matchAll(PATTERNS.PHONE);
    for (const match of phoneMatches) {
        detected.push({
            type: 'PHONE',
            value: match[0],
            context: text.substring(Math.max(0, (match.index || 0) - 10), Math.min(text.length, (match.index || 0) + match[0].length + 10)),
            timestamp: now,
        });
    }

    // Account detection
    const accountMatches = text.matchAll(PATTERNS.ACCOUNT);
    for (const match of accountMatches) {
        detected.push({
            type: 'ACCOUNT',
            value: match[0],
            context: text.substring(Math.max(0, (match.index || 0) - 10), Math.min(text.length, (match.index || 0) + match[0].length + 10)),
            timestamp: now,
        });
    }

    // Address detection
    const addressMatches = text.matchAll(PATTERNS.ADDRESS);
    for (const match of addressMatches) {
        detected.push({
            type: 'ADDRESS',
            value: match[0],
            context: text.substring(Math.max(0, (match.index || 0) - 10), Math.min(text.length, (match.index || 0) + match[0].length + 10)),
            timestamp: now,
        });
    }

    // Job detection
    const jobMatches = text.matchAll(PATTERNS.JOB);
    for (const match of jobMatches) {
        detected.push({
            type: 'JOB',
            value: match[0],
            context: text.substring(Math.max(0, (match.index || 0) - 10), Math.min(text.length, (match.index || 0) + match[0].length + 10)),
            timestamp: now,
        });
    }

    return detected;
};
