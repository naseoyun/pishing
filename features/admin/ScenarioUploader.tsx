'use client';

import { useState, useRef } from 'react';
import { FileUp, CheckCircle, Loader2, FileText } from 'lucide-react';

interface ScenarioUploaderProps {
    onAnalysisComplete: (mockData: { persona: string; rules: string[]; caseTitle: string }) => void;
}

/**
 * 사례 분석(PDF 업로드) 컴포넌트 - 시뮬레이션 고도화
 */
export const ScenarioUploader = ({ onAnalysisComplete }: ScenarioUploaderProps) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setProgress(0);
        }
    };

    const handleSelectClick = () => {
        fileInputRef.current?.click();
    };

    const handleStartLearning = () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setProgress(0);

        // 시나리오 시뮬레이션을 위한 11초 지연 및 프로그레스 연출
        const duration = 11000;
        const interval = 100;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min(Math.round((currentStep / steps) * 100), 99);
            setProgress(newProgress);

            if (currentStep >= steps) {
                clearInterval(timer);
                setProgress(100);

                // 완료 후 연출
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setShowSuccessToast(true);

                    // 3초 후 토스트 숨기고 완료 콜백 실행
                    setTimeout(() => {
                        setShowSuccessToast(false);
                        onAnalysisComplete({
                            persona: '보이스피싱 조직원 브로커 리. 급박한 목소리로 신용불량 위기를 강조하며 대출 상환을 유도함.',
                            rules: [
                                '대출 연체로 인해 통장이 압류될 것이라고 압박한다.',
                                '당장 상환하지 않으면 법적 조치가 취해진다고 경고한다.',
                                '직장 정보를 물어보며 상환 능력을 확인한다.',
                            ],
                            caseTitle: '저금리 대출 갈아타기 유도 피싱',
                        });
                    }, 2000);
                }, 500);
            }
        }, interval);
    };

    return (
        <div className="relative">
            {/* Local Toast Message */}
            {showSuccessToast && (
                <div className="fixed top-10 right-10 z-[500] animate-in slide-in-from-right duration-500">
                    <div className="bg-navy-deep text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center space-x-4 border border-white/10 backdrop-blur-md">
                        <div className="w-10 h-10 bg-blue-electric/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-blue-electric" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-sm tracking-tight text-white uppercase">학습 및 분석 완료</span>
                            <span className="text-xs font-bold text-slate-400">최신 범죄 리포트가 시스템에 반영되었습니다.</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 backdrop-blur-sm transition-all hover:border-blue-400 group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.txt,.docx"
                />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className={`p-5 rounded-[24px] transition-all duration-500 ${isAnalyzing ? 'bg-blue-600 shadow-lg shadow-blue-200 scale-110' :
                        selectedFile ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 group-hover:text-blue-500 group-hover:scale-105 shadow-sm'
                        }`}>
                        {isAnalyzing ? (
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        ) : selectedFile ? (
                            <FileCheckIcon fileName={selectedFile.name} />
                        ) : (
                            <FileUp className="w-10 h-10" />
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-extrabold text-slate-900">
                            {isAnalyzing ? 'AI 공격 로직 정밀 분석 중...' :
                                selectedFile ? '학습 데이터 준비 완료' : '범죄 사례 리포트 데이터셋'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                            {isAnalyzing ? '가해자의 다이얼로그와 심리 압박 패턴을 추출하고 있습니다.' :
                                selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)}KB)` : 'PDF 또는 Text 파일을 드래그하거나 선택하여 AI를 학습시키세요.'}
                        </p>
                    </div>

                    {/* Progress Bar Area */}
                    {isAnalyzing && (
                        <div className="w-full max-w-md space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                <span>Deep Learning Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!isAnalyzing && (
                        <div className="flex items-center space-x-3 w-full max-w-md">
                            <button
                                onClick={handleSelectClick}
                                className="flex-1 px-6 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center space-x-2"
                            >
                                <FileText className="w-4 h-4" />
                                <span>{selectedFile ? '파일 변경' : '파일 선택'}</span>
                            </button>

                            {selectedFile && (
                                <button
                                    onClick={handleStartLearning}
                                    className="flex-[1.5] px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-right-4"
                                >
                                    <span>학습 시작</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FileCheckIcon = ({ fileName }: { fileName: string }) => (
    <div className="relative">
        <FileText className="w-10 h-10" />
        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
            <CheckCircle className="w-3 h-3" />
        </div>
    </div>
);
