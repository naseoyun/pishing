import { ChatMessage } from '../../shared/types/domain';

interface MessageBubbleProps {
    message: ChatMessage;
}

/**
 * 채팅 메시지 버블 컴포넌트
 */
export const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 mt-1 shrink-0 overflow-hidden shadow-sm">
                    <div className="w-full h-full bg-blue-electric flex items-center justify-center text-white text-[10px] font-black">AI</div>
                </div>
            )}

            <div className={`max-w-[75%] space-y-1`}>
                {!isUser && <span className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-wider">AI Broker Lee</span>}
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}
                >
                    {message.content}
                </div>
                <div className={`text-[9px] font-bold text-slate-400 ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};
