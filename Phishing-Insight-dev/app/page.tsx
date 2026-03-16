'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ChevronRight,
  Menu,
  X,
  Play,
  BarChart3,
  ShieldCheck,
  Lock,
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';

/**
 * Phishing Insight Landing Page (v2)
 */
export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'USER' | 'ADMIN'>('USER');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginRedirect = () => {
    if (loginType === 'ADMIN') router.push('/admin');
    else router.push('/simulate');
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-navy-deep py-4 shadow-xl' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-blue-electric rounded-xl flex items-center justify-center shadow-lg shadow-blue-electric/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tighter ${scrolled ? 'text-white' : 'text-navy-deep'}`}>
              PHISHING INSIGHT
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => router.push('/about')} className={`text-sm font-bold hover:text-blue-electric transition-colors ${scrolled ? 'text-slate-300' : 'text-slate-600'}`}>서비스 소개</button>
            <button onClick={() => router.push('/status')} className={`text-sm font-bold hover:text-blue-electric transition-colors ${scrolled ? 'text-slate-300' : 'text-slate-600'}`}>범죄 대응 현황</button>
            <div className="h-4 w-px bg-slate-300"></div>
            <button
              onClick={() => { setLoginType('USER'); setShowLoginModal(true); }}
              className={`text-sm font-bold hover:text-blue-electric transition-colors ${scrolled ? 'text-white' : 'text-navy-deep'}`}
            >
              일반 로그인
            </button>
            <button
              onClick={() => { setLoginType('ADMIN'); setShowLoginModal(true); }}
              className="px-6 py-2.5 bg-blue-electric text-white text-sm font-black rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-electric/30"
            >
              관리자 로그인
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-navy-deep" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={scrolled ? 'text-white' : ''} /> : <Menu className={scrolled ? 'text-white' : ''} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-navy-deep border-t border-slate-800 p-8 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
            <button onClick={() => router.push('/about')} className="block w-full text-left text-lg font-bold text-slate-300">서비스 소개</button>
            <button onClick={() => router.push('/status')} className="block w-full text-left text-lg font-bold text-slate-300">범죄 대응 현황</button>
            <div className="pt-4 space-y-4">
              <button
                onClick={() => { setLoginType('USER'); setShowLoginModal(true); setIsMenuOpen(false); }}
                className="block w-full py-4 text-center font-bold text-white border border-slate-700 rounded-2xl"
              >
                일반 로그인
              </button>
              <button
                onClick={() => { setLoginType('ADMIN'); setShowLoginModal(true); setIsMenuOpen(false); }}
                className="block w-full py-4 text-center font-bold text-white bg-blue-electric rounded-2xl shadow-lg shadow-blue-electric/20"
              >
                관리자 로그인
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-gradient-to-l from-slate-50 to-white"></div>
        <div className="absolute top-1/4 -right-20 -z-10 w-96 h-96 bg-blue-electric/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="lg:flex items-center gap-20">
            <div className="lg:w-3/5 space-y-10">
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-blue-50 text-blue-electric rounded-full text-sm font-black ring-1 ring-blue-100">
                <ShieldCheck className="w-4 h-4" />
                <span>Next-Gen Security Simulation</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-black text-navy-deep leading-[1.1] tracking-tight">
                  당신의 일상을 지키는 <br />
                  가장 완벽한 방어선, <br />
                  <span className="text-blue-electric">Phishing Insight</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                  지능화되는 피싱 범죄, 이제 실전형 AI 시뮬레이션으로 <br />
                  당신의 대응력을 진단하세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button
                  onClick={() => router.push('/simulate')}
                  className="px-10 py-5 bg-navy-deep text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl flex items-center justify-center space-x-3 group"
                >
                  <Play className="w-6 h-6 fill-white" />
                  <span className="text-lg text-nowrap">모의 훈련 시작하기</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className="px-10 py-5 bg-white text-navy-deep font-black rounded-2xl border-2 border-slate-100 hover:border-blue-electric transition-all flex items-center justify-center space-x-3"
                >
                  <Info className="w-6 h-6" />
                  <span className="text-lg">서비스 자세히 보기</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="pt-12 grid grid-cols-3 gap-12 border-t border-slate-100 max-w-md">
                <div>
                  <div className="text-3xl font-black text-navy-deep">12k+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Users</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-navy-deep">98%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Detection Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-navy-deep">24/7</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI Monitoring</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:w-2/5">
              <div className="relative">
                <div className="bg-white rounded-[60px] p-4 shadow-[0_50px_100px_-20px_rgba(10,25,47,0.15)] border border-slate-100 relative z-10">
                  <div className="bg-navy-deep rounded-[48px] overflow-hidden p-10 aspect-[4/5] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <BarChart3 className="w-8 h-8 text-blue-electric" />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Level</div>
                        <div className="text-2xl font-black text-red-500">CRITICAL</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-electric shadow-[0_0_15px_rgba(0,112,243,0.5)]"></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>PII Exposure Index</span>
                        <span className="text-white font-black">85/100</span>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400">Real-time Alert</div>
                          <div className="text-sm font-bold text-white">Sensitive Information Leaked</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decoration Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-50 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black text-slate-400 italic tracking-tighter">POLICE DATA SYNC</span>
          <span className="text-2xl font-black text-slate-400 italic tracking-tighter">FINANCIAL GUARD</span>
          <span className="text-2xl font-black text-slate-400 italic tracking-tighter">AI SECURITY LAB</span>
          <span className="text-2xl font-black text-slate-400 italic tracking-tighter">TRUST NET 2026</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep pt-24 pb-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-electric rounded flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter uppercase">Phishing Insight</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed">
                인간의 기술적 취약점이 아닌 심리적 취약점을 공략하는 고도화된 피싱 범죄로부터 당신의 소중한 일상을 보호합니다. 대한민국 미래 보안 프로젝트의 시작입니다.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold">Quick Links</h4>
              <div className=" flex flex-col space-y-4 text-sm font-medium">
                <button onClick={() => router.push('/about')} className="text-left hover:text-white transition-colors">서비스 소개</button>
                <button onClick={() => router.push('/status')} className="text-left hover:text-white transition-colors">대응 현황</button>
                <button onClick={() => router.push('/simulate')} className="text-left hover:text-white transition-colors">진단 시작하기</button>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold">Contact</h4>
              <div className="space-y-4 text-sm font-medium">
                <p>서울특별시</p>
                <p>danhana531@gmail.com</p>
                <p>010-1234-1234</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-medium">© 2026 Phishing Insight. All rights reserved.</p>
            <div className="flex space-x-8 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-electric">Terms</a>
              <a href="#" className="hover:text-blue-electric">Privacy</a>
              <a href="#" className="hover:text-blue-electric">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-md" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className={`h-2 w-full ${loginType === 'ADMIN' ? 'bg-blue-electric' : 'bg-navy-deep'}`}></div>
            <div className="p-12 space-y-10">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-navy-deep">
                  {loginType === 'ADMIN' ? '관리자 대시보드' : '일반 사용자 로그인'}
                </h3>
                <p className="text-slate-500 font-medium tracking-tight">계정에 접속하여 정밀 진단 및 관리를 시작하세요.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access ID</label>
                  <input
                    type="text"
                    placeholder="ID 를 입력하세요"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-electric/10 focus:border-blue-electric transition-all font-bold text-navy-deep"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                  <input
                    type="password"
                    placeholder="PW 를 입력하세요"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-electric/10 focus:border-blue-electric transition-all font-bold text-navy-deep"
                  />
                </div>
              </div>

              <button
                onClick={handleLoginRedirect}
                className={`w-full py-5 rounded-2xl text-lg font-black text-white shadow-xl transition-all active:scale-[0.98] ${loginType === 'ADMIN' ? 'bg-blue-electric hover:bg-blue-700' : 'bg-navy-deep hover:bg-black'
                  }`}
              >
                Access System
              </button>

              <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                <button className="hover:text-navy-deep">아이디 찾기</button>
                <button className="hover:text-navy-deep">비밀번호 찾기</button>
                <button className="text-blue-electric">회원가입</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
