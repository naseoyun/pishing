'use client';

import { useRouter } from 'next/navigation';
import {
    BarChart,
    LineChart,
    Activity,
    AlertTriangle,
    ShieldCheck,
    ChevronRight,
    TrendingDown,
    Map,
    ArrowLeft
} from 'lucide-react';

/**
 * Police Data & Status Page - Dark Theme Version
 */
export default function StatusPage() {
    const router = useRouter();

    const stats = [
        { label: "전년 대비 범죄율", value: "-12.5%", icon: <TrendingDown className="w-5 h-5" />, color: "emerald", desc: "고도화된 예방 체계 도입 효과" },
        { label: "누적 피해액 (2025)", value: "3.2조", icon: <AlertTriangle className="w-5 h-5" />, color: "red", desc: "지속적인 경계심 강화 필요" },
        { label: "AI 탐지 성공률", value: "98.2%", icon: <Activity className="w-5 h-5" />, color: "blue", desc: "Phishing Insight 엔진 기준" },
        { label: "시뮬레이션 이수자", value: "2.4만", icon: <ShieldCheck className="w-5 h-5" />, color: "indigo", desc: "전국 공공기관 및 금융사 협약" }
    ];

    const alerts = [
        { type: "CRITICAL", title: "[주의] 모바일 부고 문자 스캠 급증", desc: "부고 소식을 사칭한 링크 클릭 시 악성 앱이 설치되어 개인정보가 탈취됩니다. 출처 불분명 링크 클릭 금지.", date: "26.02.07" },
        { type: "WARNING", title: "연말정산 환급금 안내 사칭 주의", desc: "국세청을 사칭하여 계좌 인증을 요구하는 문자가 유행 중입니다. 공식 앱을 통해서만 확인하세요.", date: "26.02.05" },
        { type: "INFO", title: "새로운 금융 보안 인증 가이드 배포", desc: "신종 피싱 수법에 대응하기 위한 보안 팩 패치가 금융사 공통으로 적용됩니다.", date: "26.02.01" }
    ];

    return (
        <div className="min-h-screen bg-[#0a192f] text-white">
            {/* Dark Navy Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0d1b3e] to-[#0a192f] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center text-sm font-black text-slate-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            홈으로 돌아가기
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">범죄 대응 및 통계 현황</h1>
                        <p className="text-slate-400 font-medium">실시간 데이터 동기화를 통한 피싱 범죄 예방 대시보드입니다.</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-sm font-bold animate-pulse text-blue-400">
                            LIVE DATA CONNECTED
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-[40px] border border-white/10 hover:border-blue-electric/50 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                                    s.color === 'red' ? 'bg-red-500/10 text-red-400' :
                                        s.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-indigo-500/10 text-indigo-400'
                                }`}>
                                {s.icon}
                            </div>
                            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</div>
                            <div className="text-3xl font-black text-white mb-2 group-hover:text-blue-electric transition-colors">{s.value}</div>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Chart Placeholder Section */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[50px] border border-white/10 space-y-8 min-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-blue-electric" />
                                    월별 피싱 범죄 발생 트렌드 (경찰청 데이터)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-blue-electric rounded-sm shadow-[0_0_10px_rgba(0,112,243,0.5)]"></span>
                                    <span className="text-[10px] font-bold text-slate-400">2026 Monthly Trend</span>
                                </div>
                            </div>
                            <div className="flex-1 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <BarChart className="w-32 h-32 text-white/5 group-hover:scale-110 group-hover:text-white/10 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/50 to-transparent"></div>
                                <div className="absolute bottom-10 text-xs font-black text-slate-600 uppercase tracking-[0.4em]">Visualizing Real-time Crime Data</div>
                            </div>
                        </div>

                        <div className="bg-blue-electric/10 backdrop-blur-sm rounded-[50px] p-10 border border-blue-electric/20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                            <div className="space-y-4 flex-1 relative z-10">
                                <h3 className="text-2xl font-black text-white">지역별 취약 지점 맵</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium text-balance">최근 24시간 내 전국 시/도 단위의 피싱 키워드 언급량을 <br />데이터 히트맵으로 제공합니다.</p>
                                <button className="flex items-center text-blue-electric font-black text-sm group">
                                    지도 상세보기 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0 relative z-10">
                                <Map className="w-20 h-20 text-blue-electric/30" />
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-electric/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        </div>
                    </div>

                    {/* Alert Section */}
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[50px] border border-white/10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    신종 피싱 라이브 경보
                                </h3>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            </div>
                            <div className="space-y-6 flex-1">
                                {alerts.map((alert, i) => (
                                    <div key={i} className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-red-500/30 hover:bg-white/[0.05] transition-all cursor-pointer">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${alert.type === 'CRITICAL' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' : alert.type === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {alert.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500 italic">{alert.date}</span>
                                        </div>
                                        <h4 className="text-sm font-black text-white mb-2 group-hover:text-red-400 transition-colors">{alert.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{alert.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-8">
                                <button className="w-full py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all shadow-xl border border-white/10 active:scale-95">전체 공지사항 보기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
