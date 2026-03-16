/**
 * Phishing Insight Domain Types
 */

export type PhishingCategory = 'VOICE_PHISHING' | 'ROMANCE_SCAM';

/**
 * 관리자 설정 인터페이스
 */
export interface AdminSettings {
  category: PhishingCategory;
  persona: string;
  rules: string[];
  caseTitle: string;
}

/**
 * 탐지된 개인정보 인터페이스
 */
export interface DetectedInfo {
  type: 'ADDRESS' | 'ACCOUNT' | 'PHONE' | 'JOB';
  value: string;
  context: string;
  timestamp: number;
}

/**
 * 채팅 메시지 인터페이스
 */
export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: number;
}

/**
 * 세션 데이터 인터페이스
 */
export interface SessionData {
  id: string;
  settings: AdminSettings;
  messages: ChatMessage[];
  detectedInfos: DetectedInfo[];
  isEnded: boolean;
}

/**
 * 리포트 인터페이스
 */
export interface Report extends SessionData { }

/**
 * 세션 응답 인터페이스
 */
export interface SessionResponse {
  id: string;
  data?: SessionData;
}

/**
 * 이벤트 응답 인터페이스
 */
export interface EventResponse {
  success: boolean;
  message?: string;
}
