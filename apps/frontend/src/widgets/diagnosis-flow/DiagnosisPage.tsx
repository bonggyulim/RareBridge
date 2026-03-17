'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Home,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { postDiagnosis } from '@/features/diagnosis/api/postDiagnosis';
import { DiagnosisResult } from '@/features/diagnosis/model/types';
import SymptomInputForm from '@/features/diagnosis/ui/SymptomInputForm';
import DiseaseResultList from '@/features/diagnosis/ui/DiseaseResultList';

type Step = 'onboarding' | 'input' | 'result';

export default function DiagnosisPage() {
  const [step, setStep] = useState<Step>('onboarding');
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
      alert(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9ff] font-sans selection:bg-[#5200cc]/10 selection:text-[#5200cc]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-[#5200cc]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-gradient-to-tr from-blue-100/50 to-transparent blur-[120px]" />
      </div>

      <header className="sticky top-0 z-[100] w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => setStep('onboarding')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5200cc] text-white shadow-lg shadow-[#5200cc]/20 transition-transform group-hover:scale-110">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              RareBridge
            </span>
          </div>


        </div>
      </header>

      <main className="relative z-10 mx-auto flex-1 w-full max-w-7xl px-6 py-12 lg:px-10">
        {step === 'onboarding' && (
          <div className="animate-in slide-in-from-bottom-8 grid grid-cols-1 items-center gap-16 py-12 fade-in duration-1000 lg:grid-cols-2">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#5200cc]/10 bg-[#5200cc]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#5200cc]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5200cc] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5200cc]" />
                  </span>
                  Precision Medical AI
                </div>

                <h1 className="text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                  Connecting <br />
                  <span className="bg-gradient-to-r from-[#5200cc] to-[#8800ff] bg-clip-text text-transparent">
                    Health & Future
                  </span>
                </h1>

                <p className="max-w-xl text-xl leading-relaxed text-slate-500">
                  희귀질환 환우들을 위한 차세대 통합 건강 관리 플랫폼입니다.
                  독자적인 AI 엔진을 통해 복잡한 증상을 분석하고 최적의 건강
                  데이터를 연결합니다.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row">
                <button
                  onClick={() => setStep('input')}
                  className="group flex h-16 items-center justify-center gap-3 rounded-[20px] bg-[#5200cc] px-10 text-lg font-bold text-white shadow-2xl shadow-[#5200cc]/30 transition-all hover:scale-[1.02] hover:bg-[#4300aa] active:scale-95"
                >
                  분석 시작하기
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white/50 px-6 backdrop-blur-sm shadow-sm">
                  <ShieldCheck size={24} className="text-green-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Security Status
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      Enterprise Verified
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                <div>
                  <h4 className="text-3xl font-black text-slate-900">99.2%</h4>
                  <p className="text-sm font-bold text-slate-400">
                    Analysis Precision
                  </p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">5k+</h4>
                  <p className="text-sm font-bold text-slate-400">
                    Disease Database
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 rounded-[60px] bg-gradient-to-br from-[#5200cc]/20 to-transparent blur-[20px] transition-all duration-700 group-hover:blur-[40px]" />
              <div className="relative aspect-square overflow-hidden rounded-[60px] border border-white bg-white p-3 shadow-2xl shadow-[#5200cc]/10">
                <div className="relative h-full w-full overflow-hidden rounded-[48px]">
                  <Image
                    src="/hero.png"
                    alt="Medical AI Illustration"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="absolute right-10 top-10 animate-bounce rounded-3xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-lg duration-[3000ms]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5200cc] text-white">
                    <Activity size={24} />
                  </div>
                </div>

                <div className="absolute bottom-12 left-12 max-w-[200px] rounded-[32px] border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#5200cc]">
                    Live Engine
                  </p>
                  <p className="text-xs font-bold leading-relaxed text-slate-700">
                    Processing 2.4k clinical features/sec
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'input' && (
          <div className="animate-in slide-in-from-right-8 mx-auto flex max-w-5xl flex-col items-center gap-10 fade-in duration-700">
            <div className="mt-4 w-full text-center">
              <div className="mb-6 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span
                  className="cursor-pointer hover:text-[#5200cc]"
                  onClick={() => setStep('onboarding')}
                >
                  Home
                </span>
                <ChevronRight size={14} />
                <span className="text-[#5200cc]">Analysis Engine</span>
              </div>

              <h1 className="mb-6 text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
                당신의 증상을 <br />
                <span className="bg-gradient-to-r from-[#5200cc] to-[#8800ff] bg-clip-text text-transparent">
                  상세히 기록
                </span>
                해주세요.
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
                RareBridge AI가 입력하신 데이터를 바탕으로 전 세계 5,000여 종
                이상의 희귀질환 데이터베이스와 실시간 매칭을 시작합니다.
              </p>
            </div>

            <div className="w-full rounded-[48px] border border-white bg-gradient-to-br from-[#5200cc]/10 to-transparent p-1 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] backdrop-blur-md">
              <div className="h-full w-full rounded-[44px] bg-white p-10 lg:p-14">
                <SymptomInputForm
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 pt-4 md:grid-cols-3">
              <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Clinical Focus</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  통증의 부위나 강도, 빈도를 정확히 입력할수록 분석 정확도가
                  향상됩니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#5200cc]">
                  <Zap size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Real-time Matching</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  표준 의학 용어(HPO) 매핑 과정을 거쳐 글로벌 희귀질환 정보를
                  대조합니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Privacy First</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  입력된 모든 개인 민감 데이터는 암호화 처리되어 안전하게
                  보호됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="animate-in slide-in-from-bottom-8 mx-auto max-w-5xl fade-in duration-1000">
            <div className="relative mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#5200cc]">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#5200cc]" />
                  AI Analysis Completed
                </div>

                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900">
                  희귀질환 <span className="text-[#5200cc]">분석 리포트</span>
                </h1>

                <p className="text-xl leading-relaxed text-slate-500">
                  입력하신 증상과 가장 높은 일치도를 보이는{' '}
                  <span className="font-bold text-slate-900">상위 후보군</span>을
                  도출했습니다.
                </p>
              </div>

              <button
                onClick={() => setStep('input')}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-10 py-4 font-bold text-slate-600 transition-all hover:border-[#5200cc]/30 hover:text-[#5200cc] hover:shadow-xl active:scale-95"
              >
                <RefreshCw
                  size={18}
                  className="transition-transform duration-700 group-hover:rotate-180"
                />
                분석 다시하기
              </button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute right-[-10%] top-0 h-[50%] w-[30%] rounded-full bg-[#5200cc]/5 blur-[100px]" />
              <DiseaseResultList diseases={resultData?.diseases || []} />
            </div>

            <div className="group relative mt-16 overflow-hidden rounded-[40px] bg-slate-900 p-10 text-white">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#5200cc]/20 blur-[80px]" />
              <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="max-w-xl">
                  <h4 className="mb-3 text-2xl font-bold">
                    의료적 면책 조항 (Medical Disclaimer)
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    본 분석 결과는 인공지능 보조 도구에 의한 참고용이며, 최종적인
                    의학적 판단이 아닙니다. 정확한 진단과 치료를 위해서는 반드시
                    전문 의료진의 상담을 통해 정밀 검사를 진행하시기 바랍니다.
                  </p>
                </div>

                <button className="whitespace-nowrap rounded-2xl bg-[#5200cc] px-8 py-4 font-bold shadow-2xl shadow-[#5200cc]/40 transition-colors hover:bg-[#4300aa]">
                  전문의 상담 연결
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-slate-200 bg-white/50 py-16 selection:bg-none">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3 text-[#5200cc]">
              <Zap size={24} fill="currentColor" />
              <span className="text-xl font-black uppercase tracking-tighter text-slate-900">
                RareBridge
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              희귀질환 정밀 의료 인프라를 구축하고 환우들의 건강한 내일을
              연결하는 차세대 플랫폼입니다.
            </p>
          </div>

          <div>
            <h5 className="mb-6 font-sans font-bold text-slate-900">
              Platforms
            </h5>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Symptom Engine
              </li>
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Disease Database
              </li>
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Clinical Portal
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-sans font-bold text-slate-900">Company</h5>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-500">
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Privacy Policy
              </li>
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Terms of Service
              </li>
              <li className="cursor-pointer transition-colors hover:text-[#5200cc]">
                Contact Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-slate-100 px-6 pt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
          © 2026 RareBridge Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}