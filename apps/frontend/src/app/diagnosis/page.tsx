'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { postDiagnosis } from '@/lib/diagnosis';
import { DiagnosisResult } from '@/app/types/diagnosis';
import SymptomInputForm from '@/components/common/symptominputform';
import DiseaseResultList from '@/components/common/diseaseresultlist';
import { Activity, ShieldCheck, Zap, ArrowRight, Home, ChevronRight, RefreshCw } from 'lucide-react';

export default function DiagnosisPage() {
  const [step, setStep] = useState<'onboarding' | 'input' | 'result'>('onboarding');
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<DiagnosisResult | null>(null);

  const handleSearch = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await postDiagnosis(text);
      if (response.success) {
        setResultData(response.data);
        setStep('result');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans selection:bg-[#5200cc]/10 selection:text-[#5200cc]">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-[#5200cc]/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Global Header */}
      <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('onboarding')}>
            <div className="w-10 h-10 bg-[#5200cc] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5200cc]/20 transition-transform group-hover:scale-110">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">RareBridge</span>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-[#5200cc] transition-colors">Technology</a>
              <a href="#" className="hover:text-[#5200cc] transition-colors">Research</a>
              <a href="#" className="hover:text-[#5200cc] transition-colors">Security</a>
            </nav>
            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />
            {step === 'onboarding' ? (
              <button
                onClick={() => setStep('input')}
                className="bg-[#5200cc] text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-[#5200cc]/20 hover:bg-[#4300aa] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Analyze Symptoms
              </button>
            ) : (
              <button
                onClick={() => setStep('onboarding')}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:px-10">

        {/* Step 1: Onboarding */}
        {step === 'onboarding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12 animate-in fade-in duration-1000 slide-in-from-bottom-8">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#5200cc]/5 border border-[#5200cc]/10 px-4 py-1.5 text-xs font-bold text-[#5200cc] uppercase tracking-wider w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5200cc] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5200cc]"></span>
                  </span>
                  Precision Medical AI
                </div>
                <h1 className="text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                  Connecting <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5200cc] to-[#8800ff]">Health & Future</span>
                </h1>
                <p className="text-xl leading-relaxed text-slate-500 max-w-xl">
                  희귀질환 환우들을 위한 차세대 통합 건강 관리 플랫폼입니다.
                  독자적인 AI 엔진을 통해 복잡한 증상을 분석하고 최적의 건강 데이터를 연결합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => setStep('input')}
                  className="group flex h-16 items-center justify-center gap-3 rounded-[20px] bg-[#5200cc] px-10 text-lg font-bold text-white shadow-2xl shadow-[#5200cc]/30 hover:bg-[#4300aa] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  분석 시작하기
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-6 border border-slate-200 rounded-[20px] bg-white/50 backdrop-blur-sm shadow-sm">
                  <ShieldCheck size={24} className="text-green-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Status</p>
                    <p className="text-xs font-bold text-slate-900">Enterprise Verified</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <div>
                  <h4 className="text-3xl font-black text-slate-900">99.2%</h4>
                  <p className="text-sm font-bold text-slate-400">Analysis Precision</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">5k+</h4>
                  <p className="text-sm font-bold text-slate-400">Disease Database</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5200cc]/20 to-transparent rounded-[60px] blur-[20px] group-hover:blur-[40px] transition-all duration-700" />
              <div className="relative aspect-square rounded-[60px] bg-white shadow-2xl shadow-[#5200cc]/10 overflow-hidden border border-white p-3">
                <div className="w-full h-full rounded-[48px] overflow-hidden relative">
                  <Image
                    src="/hero.png"
                    alt="Medical AI Illustration"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 p-5 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 animate-bounce duration-[3000ms]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5200cc] text-white">
                    <Activity size={24} />
                  </div>
                </div>
                <div className="absolute bottom-12 left-12 p-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/40 max-w-[200px]">
                  <p className="text-[10px] font-black text-[#5200cc] uppercase tracking-widest mb-1">Live Engine</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">Processing 2.4k clinical features/sec</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Symptom Input */}
        {step === 'input' && (
          <div className="flex flex-col items-center gap-10 animate-in fade-in slide-in-from-right-8 duration-700 max-w-5xl mx-auto">

            <div className="text-center w-full mt-4">
              <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">
                <span className="cursor-pointer hover:text-[#5200cc]" onClick={() => setStep('onboarding')}>Home</span>
                <ChevronRight size={14} />
                <span className="text-[#5200cc]">Analysis Engine</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                당신의 증상을 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5200cc] to-[#8800ff]">상세히 기록</span>해주세요.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                RareBridge AI가 입력하신 데이터를 바탕으로 전 세계 5,000여 종 이상의 희귀질환 데이터베이스와 실시간 매칭을 시작합니다.
              </p>
            </div>

            <div className="w-full bg-white/80 backdrop-blur-md p-1 bg-gradient-to-br from-[#5200cc]/10 to-transparent rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-white">
              <div className="w-full h-full bg-white rounded-[44px] p-10 lg:p-14">
                <SymptomInputForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
              <div className="p-6 rounded-3xl bg-white/50 border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Activity size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Clinical Focus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">통증의 부위나 강도, 빈도를 정확히 입력할수록 분석 정확도가 향상됩니다.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/50 border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#5200cc]">
                  <Zap size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Real-time Matching</h4>
                <p className="text-xs text-slate-500 leading-relaxed">표준 의학 용어(HPO) 매핑 과정을 거쳐 글로벌 희귀질환 정보를 대조합니다.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/50 border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Privacy First</h4>
                <p className="text-xs text-slate-500 leading-relaxed">입력된 모든 개인 민감 데이터는 암호화 처리되어 안전하게 보호됩니다.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Result View */}
        {step === 'result' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 relative">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-[#5200cc] font-bold text-xs mb-4 uppercase tracking-[0.25em]">
                  <div className="w-2 h-2 rounded-full bg-[#5200cc] animate-pulse" />
                  AI Analysis Completed
                </div>
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">희귀질환 <span className="text-[#5200cc]">분석 리포트</span></h1>
                <p className="text-slate-500 text-xl leading-relaxed">
                  입력하신 증상과 가장 높은 일치도를 보이는 <span className="font-bold text-slate-900">5가지</span> 후보군을 도출했습니다.
                </p>
              </div>
              <button
                onClick={() => setStep('input')}
                className="group flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:text-[#5200cc] hover:border-[#5200cc]/30 hover:shadow-xl transition-all active:scale-95"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                분석 다시하기
              </button>
            </div>

            <div className="relative">
              {/* Decorative Blur behind the list */}
              <div className="absolute top-0 right-[-10%] w-[30%] h-[50%] bg-[#5200cc]/5 rounded-full blur-[100px] pointer-events-none" />
              <DiseaseResultList diseases={resultData?.diseases || []} />
            </div>

            <div className="mt-16 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#5200cc]/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="max-w-xl">
                  <h4 className="text-2xl font-bold mb-3">의료적 면책 조항 (Medical Disclaimer)</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    본 분석 결과는 인공지능 보조 도구에 의한 참고용이며, 최종적인 의학적 판단이 아닙니다.
                    정확한 진단과 치료를 위해서는 반드시 전문 의료진의 상담을 통해 정밀 검사를 진행하시기 바랍니다.
                  </p>
                </div>
                <button className="whitespace-nowrap px-8 py-4 bg-[#5200cc] rounded-2xl font-bold hover:bg-[#4300aa] transition-colors shadow-2xl shadow-[#5200cc]/40">
                  전문의 상담 연결
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full bg-white/50 border-t border-slate-200 py-16 selection:bg-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 text-[#5200cc] mb-6">
              <Zap size={24} fill="currentColor" />
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">RareBridge</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              희귀질환 정밀 의료 인프라를 구축하고 환우들의 건강한 내일을 연결하는 차세대 플랫폼입니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-6 font-sans">Platforms</h5>
            <ul className="text-sm text-slate-500 flex flex-col gap-4 font-medium">
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Symptom Engine</li>
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Disease Database</li>
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Clinical Portal</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-6 font-sans">Company</h5>
            <ul className="text-sm text-slate-500 flex flex-col gap-4 font-medium">
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-[#5200cc] cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-100 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2026 RareBridge Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
