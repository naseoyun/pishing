'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScenarioSettings } from '../../features/admin/scenarioStore';
import { ScenarioUploader } from '../../features/admin/ScenarioUploader';
import { PhishingCategory } from '../../shared/types/domain';
import { storage } from '../../shared/utils/storage';
import {
    Users,
    Database,
    FileText,
    Activity,
    Settings as SettingsIcon,
    Search,
    AlertTriangle,
    History,
    LayoutDashboard
} from 'lucide-react';

/**
 * 관리자 정밀 대시보드
 */
export default function AdminPage() {
    const router = useRouter();
    const { settings, handleUpdateSettings } = useScenarioSettings();
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCENARIO' | 'MONITORING'>('DASHBOARD');
    const [sessionList, setSessionList] = useState<any[]>([]);

    useEffect(() => {
        // 모든 세션 데이터 로드 (모니터링용)
        const ids = storage.getSessionList();
        const loaded = ids.map(id => storage.getSession(id)).filter(Boolean);
        setSessionList(loaded);
    }, []);

    const handleAnalysisComplete = (data: { persona: string; rules: string[]; caseTitle: string }) => {
        handleUpdateSettings({ ...settings, ...data });
        setActiveTab('SCENARIO'); // 설정 완료 후 상세 설정 탭으로 이동
    };

    const [showToast, setShowToast] = useState(false);

    const handleApplySimulation = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex relative">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] bg-navy-deep text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center space-x-3 border border-white/10 animate-in slide-in-from-top duration-500">
                    <div className="w-6 h-6 bg-blue-electric rounded-full flex items-center justify-center">
                        <Activity className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">AI 시나리오가 실시간 시스템에 성공적으로 반영되었습니다.</span>
                </div>
            )}

            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
                <div className="p-8 border-b border-slate-100 mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-slate-800 uppercase">Admin Hub</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, label: '대시보드' },
                        { id: 'SCENARIO', icon: <FileText className="w-5 h-5" />, label: '시나리오 관리' },
                        { id: 'MONITORING', icon: <Users className="w-5 h-5" />, label: '사용자 진단 현황' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-3">
                            <div className="text-xs font-bold text-slate-400 uppercase">System Status</div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold leading-none">AI Engine Online</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">OpenAI GPT-4o 연결됨. 실시간 분석 모듈 작동 중.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">
                            {activeTab === 'DASHBOARD' && '학습 데이터 및 인사이트'}
                            {activeTab === 'SCENARIO' && 'AI 시나리오 정밀 제어'}
                            {activeTab === 'MONITORING' && '사용자 탐지 현황 리액션'}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Phishing Insight 관리 시스템에 오신 것을 환영합니다.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 flex items-center space-x-3 shadow-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Search className="w-4 h-4 text-blue-600" />
                            </div>
                            <input type="text" placeholder="통합 검색..." className="bg-transparent border-none text-sm focus:outline-none w-40" />
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            로그아웃
                        </button>
                    </div>
                </header>

                {/* Tab Content: DASHBOARD */}
                {activeTab === 'DASHBOARD' && (
                    <div className="space-y-8">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: <Database className="w-5 h-5 text-blue-600" />, label: '수집 사례집', value: '3,482', change: '+12% from last wk', color: 'blue' },
                                { icon: <Users className="w-5 h-5 text-indigo-600" />, label: '누적 진단', value: '12,402', change: '+5.4%', color: 'indigo' },
                                { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, label: '위험군 감지', value: '412', change: '+2.1%', color: 'red' },
                                { icon: <Activity className="w-5 h-5 text-emerald-600" />, label: 'AI 탐지율', value: '98.2%', change: 'Normal', color: 'emerald' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-4`}>
                                        {stat.icon}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                                    <div className={`text-[10px] font-bold ${stat.color === 'red' ? 'text-red-500' : 'text-slate-400'}`}>{stat.change}</div>
                                </div>
                            ))}
                        </div>

                        {/* Main Action Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
                                    <h2 className="text-xl font-black text-slate-900">새로운 범죄 리포트 학습</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        최근 발생한 보이스피싱/로맨스스캠 사건의 전문을 업로드하세요.
                                        AI가 가해자의 화법, 상황 설정, 정보 갈취 수법을 추출하여 시나리오 상수에 주입합니다.
                                    </p>
                                    <ScenarioUploader onAnalysisComplete={handleAnalysisComplete} />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center space-x-2">
                                        <History className="w-5 h-5 text-blue-600" />
                                        <span>최근 학습 기록</span>
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { title: '금감원 사칭 24년형', type: 'VOICE', date: '2h ago' },
                                            { title: '인천지검 스팸 연루', type: 'VOICE', date: '5h ago' },
                                            { title: '이성 어플 로맨스', type: 'SCAM', date: 'Yesterday' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2 h-2 rounded-full ${item.type === 'VOICE' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                                                    <div className="text-sm font-bold text-slate-700">{item.title}</div>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400">{item.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: SCENARIO */}
                {activeTab === 'SCENARIO' && (
                    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">시나리오 페르소나 설정</h2>
                                <p className="text-sm text-slate-500">AI 공격자가 대화 중에 사용할 성격과 말투, 금기 사항을 정의합니다.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">공격 범주</label>
                                    <div className="flex gap-4">
                                        {(['VOICE_PHISHING', 'ROMANCE_SCAM'] as PhishingCategory[]).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleUpdateSettings({ ...settings, category: cat })}
                                                className={`flex-1 py-4 rounded-2xl text-sm font-bold border-2 transition-all ${settings.category === cat ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                                                    }`}
                                            >
                                                {cat === 'VOICE_PHISHING' ? '보이스 피싱' : '로맨스 스캠'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">시나리오 타이틀</label>
                                    <input
                                        type="text"
                                        value={settings.caseTitle}
                                        onChange={(e) => handleUpdateSettings({ ...settings, caseTitle: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 font-bold text-slate-700 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase ml-1">AI 페르소나 (말투/성격)</label>
                                <textarea
                                    rows={3}
                                    value={settings.persona}
                                    onChange={(e) => handleUpdateSettings({ ...settings, persona: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 font-bold text-slate-700 transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase ml-1">주입된 공격 규칙 (System Prompt)</label>
                                <div className="space-y-2">
                                    {settings.rules.map((rule, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-lg flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </div>
                                            <input
                                                type="text"
                                                value={rule}
                                                onChange={(e) => {
                                                    const newRules = [...settings.rules];
                                                    newRules[idx] = e.target.value;
                                                    handleUpdateSettings({ ...settings, rules: newRules });
                                                }}
                                                className="w-full bg-transparent border-none text-sm font-bold text-slate-600 focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleApplySimulation}
                                className="w-full py-6 bg-blue-600 text-white font-black rounded-[32px] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
                            >
                                설정값 저장 및 시뮬레이션 적용하기
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Content: MONITORING */}
                {activeTab === 'MONITORING' && (
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">사용자 진단 로그</h2>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Total: {sessionList.length} Sessions</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Session ID / Type</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Detection Count</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Status</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Date</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sessionList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">진단된 사용자 데이터가 아직 없습니다.</td>
                                        </tr>
                                    ) : (
                                        sessionList.map((s, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-bold text-slate-900">{s.id.slice(0, 10)}...</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{s.settings.category}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${s.detectedInfos.length > 2 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {s.detectedInfos.length}건 탐지
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${s.isEnded ? 'bg-slate-300' : 'bg-green-500'}`}></div>
                                                        <span className="text-sm font-bold text-slate-500">{s.isEnded ? '종료됨' : '진행중'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                                    {new Date(parseInt(s.id.split('_')[1] || Date.now().toString())).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button
                                                        onClick={() => router.push(`/report/${s.id}`)}
                                                        className="text-xs font-black text-blue-600 hover:underline"
                                                    >
                                                        리포트 확인
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
