'use client';

import React from 'react';
import { DiagnosisDiseaseItem } from '@/app/types/diagnosis';
import {
    Activity,
    Fingerprint,
    Info,
    ChevronRight,
    ChevronUp,
    BarChart3,
    ShieldCheck,
    Beaker
} from 'lucide-react';

export default function DiseaseResultList({ diseases }: { diseases: DiagnosisDiseaseItem[] }) {
    const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

    const toggleExpand = (idx: number) => {
        setExpandedIdx(expandedIdx === idx ? null : idx);
    };

    // Determine risk level styling
    const getRiskConfig = (ratio: number) => {
        if (ratio >= 0.8) {
            return {
                label: 'High Risk',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-100',
                icon: <Activity size={14} className="text-red-500" />
            };
        }
        if (ratio >= 0.6) {
            return {
                label: 'Moderate',
                color: 'text-amber-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-100',
                icon: <ShieldCheck size={14} className="text-amber-500" />
            };
        }
        return {
            label: 'Low Risk',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            icon: <Info size={14} className="text-blue-500" />
        };
    };

    if (!diseases || diseases.length === 0) {
        return (
            <div className="w-full py-24 bg-white/50 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Beaker className="text-slate-400" size={32} />
                </div>
                <h3 className="text-slate-900 font-bold text-xl mb-1">분석 결과가 없습니다</h3>
                <p className="text-slate-400 max-w-xs">증상을 좀 더 구체적으로 입력하시면 정확한 분석이 가능합니다.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-[#5200cc] rounded-full" />
                    <div>
                        <h2 className="text-slate-900 text-2xl font-black tracking-tight">AI Diagnosis Candidates</h2>
                        <p className="text-slate-500 text-sm font-medium">분석된 상위 {diseases.length}개의 희귀질환 후보</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {diseases.map((disease, idx) => {
                    const risk = getRiskConfig(disease.weighted_ratio);
                    const matchPercent = disease.weighted_percent;
                    const isExpanded = expandedIdx === idx;

                    return (
                        <div
                            key={idx}
                            className={`group relative flex flex-col lg:flex-row items-stretch gap-0 rounded-[32px] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(82,0,204,0.15)] hover:border-[#5200cc]/20 transition-all duration-500 overflow-hidden ${isExpanded ? 'ring-2 ring-[#5200cc]/10 border-[#5200cc]/20' : ''}`}
                        >
                            {/* Rank Badge - Side bar style */}
                            <div className={`hidden lg:flex w-24 flex-col items-center justify-center border-r border-slate-100 transition-colors duration-500 ${isExpanded ? 'bg-[#5200cc] border-[#5200cc]' : 'bg-slate-50 group-hover:bg-[#5200cc] group-hover:border-[#5200cc]'}`}>
                                <span className={`font-black text-3xl tracking-tighter transition-colors duration-500 ${isExpanded ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                            </div>

                            <div className="flex-1 p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center flex-wrap gap-3">
                                            <h3 className={`text-2xl font-extrabold tracking-tight transition-colors ${isExpanded ? 'text-[#5200cc]' : 'text-slate-900 group-hover:text-[#5200cc]'}`}>
                                                {disease.disease_name}
                                            </h3>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${risk.bgColor} ${risk.color} border ${risk.borderColor}`}>
                                                {risk.icon}
                                                {risk.label}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Fingerprint size={14} className="text-slate-300" />
                                                ORPHA:{disease.orpha_id}
                                            </span>
                                            <span className="text-slate-200">|</span>
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck size={14} className="text-slate-300" />
                                                Verified Entity
                                            </span>
                                        </div>
                                    </div>

                                    {/* Match Score Display */}
                                    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-colors duration-500 ${isExpanded ? 'bg-[#5200cc]/10' : 'bg-slate-50 group-hover:bg-[#5200cc]/5'}`}>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Match Score</span>
                                            <span className="text-3xl font-black text-[#5200cc] tracking-tighter leading-none">{matchPercent}%</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border-4 border-slate-200 relative flex items-center justify-center">
                                            <svg className="absolute -rotate-90 w-12 h-12">
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    fill="none"
                                                    stroke="#5200cc"
                                                    strokeWidth="4"
                                                    strokeDasharray={2 * Math.PI * 20}
                                                    strokeDashoffset={2 * Math.PI * 20 * (1 - disease.weighted_ratio)}
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <BarChart3 size={18} className="text-[#5200cc]" />
                                        </div>
                                    </div>
                                </div>

                                <p className={`text-slate-600 text-[15px] leading-relaxed max-w-4xl mb-6 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                    {disease.definition || "해당 희귀질환에 대한 상세 설명이 아직 등록되지 않았습니다."}
                                </p>

                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="px-4 py-2 bg-slate-50 rounded-xl text-[13px] font-bold text-slate-600 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100 transition-all flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            매칭된 증상: {disease.matched_hpo_count}개
                                        </div>
                                        <button
                                            onClick={() => toggleExpand(idx)}
                                            className="ml-auto flex items-center gap-1.5 text-[#5200cc] font-bold text-sm bg-[#5200cc]/5 hover:bg-[#5200cc]/10 px-4 py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            {isExpanded ? (
                                                <>간략히 보기 <ChevronUp size={16} /></>
                                            ) : (
                                                <>상세 정보 보기 <ChevronRight size={16} /></>
                                            )}
                                        </button>
                                    </div>

                                    {/* Expanded Match Details */}
                                    {isExpanded && (
                                        <div className="mt-2 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-1 h-4 bg-[#5200cc]/30 rounded-full" />
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">매칭 상세 리포트 (HPO)</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {disease.matched_hpo_list?.map((hpo, hIdx) => (
                                                    <div
                                                        key={hIdx}
                                                        className="group/hpo inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-500 hover:bg-white hover:border-[#5200cc]/30 hover:shadow-sm hover:text-[#5200cc] transition-all"
                                                        title={hpo.name}
                                                    >
                                                        <span className="text-[#5200cc]/50 font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-100 group-hover/hpo:border-[#5200cc]/20">
                                                            {hpo.hpo_id}
                                                        </span>
                                                        <span className="max-w-[150px] truncate">{hpo.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Rank Indicator */}
                            <div className={`lg:hidden absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${isExpanded ? 'bg-[#5200cc] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-[#5200cc] group-hover:text-white'}`}>
                                {idx + 1}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}