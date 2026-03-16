'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '../../features/simulation/useSimulation';
import { ChatInterface } from '../../features/simulation/ChatInterface';
import { storage } from '../../shared/utils/storage';
import {
  PlayCircle,
  History,
  MessageSquareWarning,
  Layout,
  ChevronRight,
  ShieldCheck,
  ClipboardList,
  ArrowBigRight,
  Upload,
  Mic,
  FileText,
  AlertCircle
} from 'lucide-react';

/**
 * 시뮬레이션 통합 사용자 페이지 (Entry + Chat + History + Report)
 */
export default function SimulatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ENTRY' | 'CHAT' | 'HISTORY' | 'REPORT_VICTIM'>('ENTRY');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prevSessions, setPrevSessions] = useState<any[]>([]);

  // 초기 상태 로드
  useEffect(() => {
    const adminSettings = storage.getAdminSettings();
    if (!adminSettings) {
      router.push('/admin');
      return;
    }

    // 이전 세션 목록 로드
    const ids = storage.getSessionList();
    const loaded = ids.map(id => storage.getSession(id)).filter(Boolean);
    setPrevSessions(loaded);
  }, [router]);

  const { session, isLoading, handleSendMessage, handleEndSession } = useSimulation(sessionId || '');

  // 시뮬레이션 시작 핸들러
  const handleStartSim = () => {
    const newId = `session_${Date.now()}`;
    setSessionId(newId);
    storage.setCurrentSessionId(newId);
    setActiveTab('CHAT');
  };

  // 종료 시 리포트 자동 이동 연출
  useEffect(() => {
    if (session?.isEnded) {
      const timer = setTimeout(() => {
        router.push(`/report/${session.id}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [session?.isEnded, session?.id, router]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center">
      {/* User Header / Branding */}
      <header className="w-full bg-navy-deep border-b border-white/10 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ENTRY')}>
            <div className="w-9 h-9 bg-blue-electric rounded-xl flex items-center justify-center shadow-lg shadow-blue-electric/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">Phishing Insight</span>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            {[
              { id: 'ENTRY', icon: <Layout className="w-4 h-4" />, label: '홈' },
              { id: 'HISTORY', icon: <History className="w-4 h-4" />, label: '진단 기록' },
              { id: 'REPORT_VICTIM', icon: <MessageSquareWarning className="w-4 h-4" />, label: '피싱 제보' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                  ? 'bg-blue-electric text-white shadow-lg shadow-blue-electric/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <span className="text-xs font-black text-slate-500">EX</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex-1 flex flex-col items-center py-10 px-6">

        {/* TAB: ENTRY (Landing within User App) */}
        {activeTab === 'ENTRY' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-3 space-y-10">
              <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 group-hover:bg-blue-50 transition-colors"></div>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.2] relative z-10">
                  지금 바로 AI와 <br />
                  <span className="text-blue-600">모의 피싱 대화</span>를 <br />
                  시작해 보세요.
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md relative z-10">
                  관리자가 설정한 최신 피싱 시나리오를 바탕으로
                  당신의 개인정보 보호 능력을 측정합니다.
                </p>
                <button
                  onClick={handleStartSim}
                  className="flex items-center space-x-4 px-10 py-6 bg-slate-900 text-white rounded-[32px] text-xl font-black shadow-2xl hover:bg-black transition-all active:scale-[0.98] relative z-10"
                >
                  <PlayCircle className="w-8 h-8" />
                  <span>진단 시작하기</span>
                  <ArrowBigRight className="w-6 h-6 animate-pulse" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <MessageSquareWarning className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">피싱 제보하기</h3>
                  <p className="text-sm text-slate-400 font-medium">실제 겪으신 사례를 제보해 주세요. AI 학습에 큰 도움이 됩니다.</p>
                  <button
                    onClick={() => setActiveTab('REPORT_VICTIM')}
                    className="text-sm font-black text-amber-600 flex items-center group"
                  >
                    신고 접수
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">이전 리포트</h3>
                  <p className="text-sm text-slate-400 font-medium">{prevSessions.length}개의 진단 기록이 보관되어 있습니다.</p>
                  <button
                    onClick={() => setActiveTab('HISTORY')}
                    className="text-sm font-black text-blue-600 flex items-center group"
                  >
                    기록 보기
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10">
              <div className="bg-slate-900 rounded-[50px] p-10 text-white space-y-8 shadow-2xl">
                <h3 className="text-2xl font-black tracking-tight">시스템 안내</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">실시간 PII 감지</p>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">대화 중 민감 정보가 발설되면 즉시 분석 시스템에 기록됩니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Layout className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">심리 분석 엔진</p>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">대화가 끝나면 당신의 심리적 방어력을 레이더 차트로 시각화합니다.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-2">Live Status</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">대응 매뉴얼 2.4.0</span>
                      <span className="text-xs text-emerald-400 font-black">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHAT (The actual simulation) */}
        {activeTab === 'CHAT' && sessionId && session && (
          <div className="w-full max-w-4xl h-[80vh] bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden relative">
            <ChatInterface
              session={session}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onEndSession={handleEndSession}
            />
            {/* Overlay for Ended Session */}
            {session.isEnded && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="bg-white rounded-[48px] p-12 max-w-sm w-full animate-bounce-short shadow-2xl">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <MessageSquareWarning className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">위험 행동 임계치 도달</h2>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    AI 공격자의 심리적 압박에 의한 <br />
                    보안 취약 행동이 탐지되었습니다. <br />
                    잠시 후 정밀 리포트로 이동합니다.
                  </p>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: HISTORY (Previous diagnosis) */}
        {activeTab === 'HISTORY' && (
          <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">당신의 진단 발자취</h2>
              <button onClick={() => setActiveTab('ENTRY')} className="text-sm font-bold text-slate-400 hover:text-slate-600">돌아가기</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prevSessions.length === 0 ? (
                <div className="col-span-2 py-32 text-center bg-white rounded-[40px] border border-slate-100 text-slate-400 font-bold">
                  기록된 진단 데이터가 없습니다. 시뮬레이션을 먼저 진행해 주세요.
                </div>
              ) : (
                prevSessions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/report/${s.id}`)}
                    className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${s.detectedInfos.length > 2 ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                        {s.detectedInfos.length > 2 ? 'High Risk' : 'Secure'}
                      </div>
                      <div className="text-xs font-bold text-slate-400 italic">#{s.id.slice(-4)}</div>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {s.settings.caseTitle}
                    </h4>
                    <p className="text-xs text-slate-400 font-bold mb-6 italic">{new Date(parseInt(s.id.split('_')[1])).toLocaleString()}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <span className="text-xs font-bold text-slate-500">탐지 지점: {s.detectedInfos.length}건</span>
                      <div className="flex items-center text-xs font-black text-slate-800">
                        리포트 확인 <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: REPORT_VICTIM (Victim reporting UI) */}
        {activeTab === 'REPORT_VICTIM' && (
          <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-200 space-y-12">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquareWarning className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">피싱 범죄 제보</h2>
                <p className="text-slate-500 font-medium">당신의 제보 한 건이 수백 명의 피해를 막을 수 있습니다.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">제보 유형</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-5 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-700 font-black text-sm">실제 피해</button>
                    <button className="py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-400 font-bold text-sm">피해 미수</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">사건 상황 (Text)</label>
                  <textarea
                    rows={4}
                    placeholder="가해자가 어떤 상황을 연출했는지, 어떤 요구를 했는지 상세히 작성해 주세요."
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center space-y-4 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Mic className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
                    </div>
                    <span className="text-xs font-black text-slate-500 group-hover:text-amber-700">녹취 파일 업로드</span>
                  </div>
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center space-y-4 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <FileText className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
                    </div>
                    <span className="text-xs font-black text-slate-500 group-hover:text-amber-700">스크린샷 / PDF 제출</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => { alert('제보가 성공적으로 접수되었습니다. (Mock)'); setActiveTab('ENTRY'); }}
                  className="w-full py-6 bg-amber-500 text-white font-black rounded-3xl shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-[0.98]"
                >
                  법적/학습 자료로 제출하기
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Button for Mobile Chat Exit */}
      {activeTab === 'CHAT' && (
        <button
          onClick={handleEndSession}
          className="fixed bottom-8 right-8 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden active:scale-90 transition-transform"
        >
          <AlertCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
