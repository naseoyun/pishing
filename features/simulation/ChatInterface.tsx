'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatMessage, SessionData } from '../../shared/types/domain';

interface ChatInterfaceProps {
    session: SessionData;
    isLoading: boolean;
    onSendMessage: (content: string) => void;
    onEndSession: () => void;
}

/**
 * 메신저 스타일 채팅 인터페이스
 */
export const ChatInterface = ({ session, isLoading, onSendMessage, onEndSession }: ChatInterfaceProps) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim() || isLoading || session.isEnded) return;
        onSendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [session.messages, isLoading]);

    return (
        <div className="flex flex-col h-full bg-[#F3F4F6] relative overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-10">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">AI</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">
                            {session.settings.category === 'VOICE_PHISHING' ? '검찰 사칭 수사관' : '데이팅 앱 친구'}
                        </h3>
                        <p className="text-[10px] text-green-500 font-medium">대화 중...</p>
                    </div>
                </div>
                <button
                    onClick={onEndSession}
                    className="text-xs font-bold text-red-500 px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-50 transition-colors"
                >
                    대화 종료
                </button>
            </div>

            {/* Message List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide"
            >
                {session.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-2">
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2 focus-within:border-blue-500 transition-all">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={session.isEnded}
                            placeholder={session.isEnded ? '대화가 종료되었습니다.' : '메시지를 입력하세요...'}
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-800 py-1 resize-none disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || session.isEnded}
                        className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${!input.trim() || isLoading || session.isEnded
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
