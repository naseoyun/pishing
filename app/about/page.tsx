'use client';

import { useRouter } from 'next/navigation';
import {
    ShieldCheck,
    Target,
    BarChart3,
    Cpu,
    ShieldAlert,
    ArrowRight,
    TrendingUp,
    FileSearch,
    Users
} from 'lucide-react';

/**
 * Service Introduction Page
 */
export default function AboutPage() {
    const router = useRouter();

    const features = [
        {
            icon: <FileSearch className="w-8 h-8 text-blue-electric" />,
            title: "사건 기반 시나리오",
            desc: "단순 스크립트가 아닙니다. 실제 범죄 사례 PDF를 AI가 실시간 분석하여 가해자의 성격, 말투, 상황 설정을 완벽하게 재현하는 페르소나를 구축합니다."
        },
        {
            icon: <Target className="w-8 h-8 text-blue-electric" />,
            title: "실시간 PII 탐지",
            desc: "대화 중 사용자가 주소, 계좌번호, 주민번호 등 민감 정보를 입력하는 시점을 즉각 감지합니다. 이와 동시에 사용자의 심리적 압박 상태를 함께 분석합니다."
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-blue-electric" />,
            title: "행동 분석 리포트",
            desc: "단순히 '당했다/안 당했다'가 아닌, 권위 복종, 심리 압박, 이익 유혹 등 5대 행동 지표를 바탕으로 사용자의 정밀한 심리 취약점을 도출합니다."
        }
    ];

    const processSteps = [
        { num: "01", title: "사례 업로드", desc: "관리자가 실제 범죄 리포트를 시스템에 주입합니다." },
        { num: "02", title: "실전 AI 대화", desc: "사용자는 모바일 메신저 환경에서 AI 공격자와 실시간 대화를 진행합니다." },
        { num: "03", title: "심리 취약점 분석", desc: "대화 패턴과 정보 유출 시점을 기반으로 취약 지표를 산출합니다." },
        { num: "04", title: "맞춤형 가이드", desc: "진단 결과에 따른 개인별 예방 수칙과 행동 대응 매뉴얼을 제공합니다." }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Mini Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-8 h-8 bg-navy-deep rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-lg tracking-tighter text-navy-deep">PHISHING INSIGHT</span>
                    </div>
                    <button onClick={() => router.push('/')} className="text-sm font-bold text-slate-500 hover:text-navy-deep transition-colors">홈으로 돌아가기</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 bg-gradient-to-b from-slate-50 to-white text-center px-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-6xl font-black text-navy-deep tracking-tight leading-tight">
                        기술보다 무서운 <br />
                        <span className="text-blue-electric underline decoration-slate-200 underline-offset-8">심리적 공격</span>에 대비하십시오.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                        피싱 인사이트는 기존의 수동적 교육 모델에서 벗어나, <br />
                        사용자가 직접 부딪히고 배우는 <span className="font-bold text-slate-800">능동적 AI 보안 시뮬레이션</span>을 제공합니다.
                    </p>
                </div>
            </section>

            {/* Comparison Table Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-navy-deep mb-4 italic">Comparison</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">왜 피싱 인사이트여야 하는가?</p>
                </div>

                <div className="overflow-hidden rounded-[40px] border border-slate-200 shadow-2xl">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-navy-deep text-white">
                                <th className="py-8 px-6 text-xl font-bold">진단 항목</th>
                                <th className="py-8 px-6 text-xl font-bold bg-slate-800 text-slate-400">기존 주입식 교육</th>
                                <th className="py-8 px-6 text-xl font-bold bg-blue-electric">Phishing Insight (AI)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { label: "학습 방식", old: "강의 시청 및 단방향 전달", new: "1:1 AI 상호작용 및 실전 대화" },
                                { label: "사례 적용", old: "고정된 과거 사례 (Dead Case)", new: "실시간 RAG 기반 최신 범죄 학습" },
                                { label: "피드백", old: "획일적인 정답 유도", new: "개인별 심리 취약점 정밀 지표화" },
                                { label: "교육 몰입도", old: "매우 낮음 (~20%)", new: "매우 높음 (실제 메신저 환경 90%+)" }
                            ].map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-8 px-6 font-black text-slate-900 border-r border-slate-100">{item.label}</td>
                                    <td className="py-8 px-6 text-slate-500 font-medium border-r border-slate-100">{item.old}</td>
                                    <td className="py-8 px-6 text-blue-electric font-black bg-blue-50/30">{item.new}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Core Functions Section */}
            <section className="py-24 bg-navy-deep text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-electric/10 -z-0"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <h2 className="text-4xl font-black leading-tight">
                                Phishing Insight의 <br />
                                <span className="text-blue-electric">3대 핵심 기술</span>
                            </h2>
                            <div className="space-y-8">
                                {features.map((f, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-blue-electric group-hover:border-blue-electric transition-all">
                                            {f.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-white">{f.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="relative p-8 bg-white/5 rounded-[60px] border border-white/10 backdrop-blur-md">
                                <div className="aspect-square bg-white rounded-[40px] flex items-center justify-center overflow-hidden">
                                    <Cpu className="w-32 h-32 text-navy-deep animate-pulse" />
                                </div>
                                <div className="absolute -bottom-6 -left-6 px-8 py-4 bg-blue-electric rounded-2xl font-black text-white shadow-xl">
                                    High-Fidelity Simulation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Workflow</div>
                    <h2 className="text-4xl font-black text-navy-deep">스마트한 진단 프로세스</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                    <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-slate-100 -z-10"></div>
                    {processSteps.map((step, i) => (
                        <div key={i} className="space-y-6 text-center group">
                            <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-[32px] flex items-center justify-center mx-auto shadow-sm group-hover:border-blue-electric group-hover:shadow-xl transition-all duration-500">
                                <span className="text-2xl font-black text-navy-deep group-hover:text-blue-electric">{step.num}</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Roadmap Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-[50px] p-12 md:p-20 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-navy-deep">2026 Future Roadmap</h2>
                            <p className="text-slate-500 font-medium">피싱 인사이트는 멈추지 않습니다. 우리는 가장 안전한 디지털 사회를 향해 나아갑니다.</p>
                            <div className="space-y-6">
                                <div className="p-8 rounded-3xl bg-blue-50 border border-blue-100">
                                    <h4 className="text-lg font-black text-blue-electric mb-2 underline decoration-blue-200 underline-offset-4">Voice Simulation Module</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">텍스트를 넘어 실제 전화 통화와 동일한 긴박감을 제공하는 TTS/STT 결합 모듈 도입 예정입니다.</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                                    <h4 className="text-lg font-black text-navy-deep mb-2 underline decoration-slate-200 underline-offset-4">Real-time FDS API Sync</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">금융기관 이상거래 탐지 시스템(FDS)과의 연동을 통해, 시뮬레이션 중 초동 대처 능력을 직접 계좌 보호와 연결하는 비전을 제시합니다.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] bg-navy-deep rounded-[40px] shadow-2xl overflow-hidden relative flex items-center justify-center">
                                <TrendingUp className="w-20 h-20 text-blue-electric animate-in fade-in duration-1000 slide-in-from-bottom" />
                                <div className="absolute bottom-8 left-8 text-white/20 font-black text-6xl italic">FUTURE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 text-center px-6">
                <div className="max-w-4xl mx-auto p-12 bg-navy-deep rounded-[40px] space-y-8 shadow-2xl shadow-blue-electric/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-electric/20 via-transparent to-transparent opacity-50"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight relative z-10">지금 바로 <br /> 실전 대응력을 테스트해 보세요.</h2>
                    <p className="text-slate-400 font-medium relative z-10">단 5분의 체험이 당신의 전 재산을 지키는 전환점이 됩니다.</p>
                    <div className="pt-4 relative z-10">
                        <button
                            onClick={() => router.push('/simulate')}
                            className="px-12 py-5 bg-blue-electric text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center mx-auto space-x-3"
                        >
                            <span>무료 진단 시작하기</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
