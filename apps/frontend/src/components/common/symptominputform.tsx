'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Info, Sparkles } from 'lucide-react';

interface Props {
    onSearch: (text: string) => void;
    isLoading: boolean;
}

export default function SymptomInputForm({ onSearch, isLoading }: Props) {
    const [text, setText] = useState('');

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-[#5200cc]/5 flex items-center justify-center text-[#5200cc]">
                            <Search size={18} />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Symptom Description</h3>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                        <Sparkles size={12} className="text-[#5200cc]" />
                        AI Natural Language Parsing
                    </div>
                </div>

                <div className="relative group">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full min-h-[300px] p-8 rounded-[32px] border-2 border-slate-100 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-[#5200cc]/30 focus:ring-4 focus:ring-[#5200cc]/5 transition-all outline-none placeholder:text-slate-300 text-lg leading-relaxed shadow-inner"
                        placeholder="어떠한 증상을 겪고 계신지 자연스럽게 설명해 주세요. 
예: '최근 다리에 힘이 빠지고 근육 경련이 자주 일어납니다. 특히 계단을 오를 때 더 심해지는 것 같아요.'"
                    />
                    <div className="absolute bottom-6 right-8 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        {text.length} characters
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => onSearch(text)}
                    disabled={isLoading || !text.trim()}
                    className="flex-[2] h-16 bg-[#5200cc] text-white font-bold rounded-2xl hover:bg-[#4300aa] hover:shadow-2xl hover:shadow-[#5200cc]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-[#5200cc]/20"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                    onClick={() => setText('')}
                    className="flex-1 h-16 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 hover:text-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw size={18} />
                    <span>초기화</span>
                </button>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#5200cc]/5 border border-[#5200cc]/10">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center text-[#5200cc] shadow-sm">
                    <Info size={20} />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-slate-900 text-sm">작성 가이드</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        증상의 발생 시점, 부위, 강도 및 빈도를 포함해 주시면 AI가 더욱 정밀하게 분석할 수 있습니다.
                        입력된 내용은 표준 의학 용어인 HPO(Human Phenotype Ontology)로 자동 변환됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
