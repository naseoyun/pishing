'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '../../../shared/utils/storage';
import { SessionData } from '../../../shared/types/domain';
import { analyzeVulnerability, getHighlightedContent } from '../../../features/analysis/reportStore';
import { VulnerabilityChart } from '../../../features/analysis/VulnerabilityChart';
import { ShieldAlert, ArrowLeft, Download, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * 리포트 페이지: 시뮬레이션 결과 및 진단 내용
 */
export default function ReportPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const data = storage.getSession(sessionId);
    if (data) {
      setSession(data);
    }
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">리포트를 불러오는 중...</p>
      </div>
    );
  }

  const scores = analyzeVulnerability(session);
  const totalScore = Math.round(scores.reduce((acc, curr) => acc + curr.A, 0) / scores.length);

  const handleRestart = () => {
    storage.setCurrentSessionId(''); // 세션 초기화
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            초기 화면으로
          </button>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Diagnostic Report
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              피싱 대응력 <br />
              정밀 진단 결과
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              사용자님은 <strong>{session.settings.caseTitle}</strong> 시나리오에서
              일부 개인정보 노출 위험이 감지되었습니다. 아래 차트를 통해 취약 지표를 확인하세요.
            </p>
          </div>

          <div className="w-full md:w-96 p-4 bg-gray-50 rounded-3xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-4 right-6 text-2xl font-black text-gray-200">GRADE</div>
            <div className="text-center py-6">
              <div className={`text-7xl font-black mb-2 ${totalScore > 60 ? 'text-red-500' : 'text-blue-500'}`}>
                {totalScore > 80 ? 'D' : totalScore > 60 ? 'C' : totalScore > 40 ? 'B' : 'A'}
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Security Level</p>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur rounded-2xl">
              <span className="text-sm font-medium text-gray-600">취약점 종합 점수</span>
              <span className="text-lg font-bold text-gray-900">{totalScore} / 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Radar Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">심리적 취약도 분석</h3>
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <VulnerabilityChart data={scores} />
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {scores.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">{s.subject}</div>
                  <div className={`text-lg font-black ${s.A > 70 ? 'text-red-500' : 'text-gray-700'}`}>{s.A}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">주요 위험 신호</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">개인정보 직접 노출</p>
                    <p className="text-xs text-gray-500">총 {session.detectedInfos.length}건의 민감 정보가 발설되었습니다.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">권위적 압박에 취약</p>
                    <p className="text-xs text-gray-500">수사기관 사칭 시 대응 경향이 낮습니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-6 bg-gray-900 text-white rounded-3xl font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              <span>다른 시나리오 도전하기</span>
            </button>
          </div>
        </div>

        {/* Conversation Review (Highlighting) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">대화 복기 (Review)</h3>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-gray-400">
                <div className="w-3 h-3 bg-red-200 mr-1 rounded-sm"></div> 정보 노출 지점
              </span>
            </div>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto px-2">
            {session.messages.filter(m => m.role !== 'system').map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {msg.role === 'user' ? (
                    <>
                      <span className="text-[10px] font-bold text-gray-400">나 (사용자)</span>
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] font-bold text-gray-900">가해자 (AI)</span>
                    </>
                  )}
                </div>
                <div
                  className={`px-6 py-4 rounded-2xl text-sm max-w-2xl leading-relaxed ${msg.role === 'user'
                    ? 'bg-blue-50 text-blue-900 rounded-tr-none border border-blue-100'
                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'user'
                      ? getHighlightedContent(msg.content, session.detectedInfos)
                      : msg.content
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
