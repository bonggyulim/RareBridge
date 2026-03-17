'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Info, Sparkles } from 'lucide-react';

interface Props {
  onSearch: (text: string) => void;
  isLoading: boolean;
}

export default function SymptomInputForm({ onSearch, isLoading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  const handleReset = () => {
    if (isLoading) return;
    setText('');
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5200cc]/5 text-[#5200cc]">
              <Search size={18} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">
              Symptom Description
            </h3>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-tighter text-slate-400">
            <Sparkles size={12} className="text-[#5200cc]" />
            AI Natural Language Parsing
          </div>
        </div>

        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] w-full rounded-[32px] border-2 border-slate-100 bg-slate-50/50 p-8 text-lg leading-relaxed text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-300 focus:border-[#5200cc]/30 focus:bg-white focus:ring-4 focus:ring-[#5200cc]/5"
            placeholder={`어떠한 증상을 겪고 계신지 자연스럽게 설명해 주세요.
예: '최근 다리에 힘이 빠지고 근육 경련이 자주 일어납니다. 특히 계단을 오를 때 더 심해지는 것 같아요.'`}
            disabled={isLoading}
          />
          <div className="absolute bottom-6 right-8 text-xs font-bold uppercase tracking-widest text-slate-300">
            {text.length} characters
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !text.trim()}
          className="flex h-16 flex-[2] items-center justify-center gap-3 rounded-2xl bg-[#5200cc] font-bold text-white shadow-xl shadow-[#5200cc]/20 transition-all hover:scale-[1.01] hover:bg-[#4300aa] hover:shadow-2xl hover:shadow-[#5200cc]/30 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>분석 중...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>진단 분석 시작하기</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 font-bold text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700 active:scale-95 disabled:opacity-50"
        >
          <RotateCcw size={18} />
          <span>초기화</span>
        </button>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-[#5200cc]/10 bg-[#5200cc]/5 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#5200cc] shadow-sm">
          <Info size={20} />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold text-slate-900">작성 가이드</h4>
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            증상의 발생 시점, 부위, 강도 및 빈도를 포함해 주시면 AI가 더욱 정밀하게
            분석할 수 있습니다. 입력된 내용은 표준 의학 용어인 HPO(Human
            Phenotype Ontology)로 자동 변환됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}