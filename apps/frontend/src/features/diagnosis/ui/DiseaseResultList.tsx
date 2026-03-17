'use client';

import React from 'react';
import {
  Activity,
  Fingerprint,
  Info,
  ChevronRight,
  ChevronUp,
  BarChart3,
  ShieldCheck,
  Beaker,
} from 'lucide-react';
import { DiagnosisDiseaseItem } from '../model/types';

interface Props {
  diseases: DiagnosisDiseaseItem[];
}

export default function DiseaseResultList({ diseases }: Props) {
  const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  const getRiskConfig = (weightedPercent: number) => {
    if (weightedPercent >= 80) {
      return {
        label: 'High Match',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        icon: <Activity size={14} className="text-red-500" />,
      };
    }

    if (weightedPercent >= 60) {
      return {
        label: 'Moderate',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        icon: <ShieldCheck size={14} className="text-amber-500" />,
      };
    }

    return {
      label: 'Low Match',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: <Info size={14} className="text-blue-500" />,
    };
  };

  if (!diseases || diseases.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white/50 py-24 text-center backdrop-blur-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Beaker className="text-slate-400" size={32} />
        </div>
        <h3 className="mb-1 text-xl font-bold text-slate-900">
          분석 결과가 없습니다
        </h3>
        <p className="max-w-xs text-slate-400">
          증상을 좀 더 구체적으로 입력하시면 정확한 분석이 가능합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-[#5200cc]" />
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              AI Diagnosis Candidates
            </h2>
            <p className="text-sm font-medium text-slate-500">
              분석된 상위 {diseases.length}개의 희귀질환 후보
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {diseases.map((disease, idx) => {
          const risk = getRiskConfig(disease.weighted_percent);
          const matchPercent = disease.weighted_percent;
          const matchRatio = Math.max(
            0,
            Math.min(1, disease.weighted_percent / 100)
          );
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={`${disease.orpha_id}-${idx}`}
              className={`group relative flex flex-col items-stretch overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 hover:border-[#5200cc]/20 hover:shadow-[0_20px_40px_-12px_rgba(82,0,204,0.15)] lg:flex-row ${
                isExpanded ? 'ring-2 ring-[#5200cc]/10 border-[#5200cc]/20' : ''
              }`}
            >
              <div
                className={`hidden w-24 flex-col items-center justify-center border-r border-slate-100 transition-colors duration-500 lg:flex ${
                  isExpanded
                    ? 'bg-[#5200cc] border-[#5200cc]'
                    : 'bg-slate-50 group-hover:bg-[#5200cc] group-hover:border-[#5200cc]'
                }`}
              >
                <span
                  className={`text-3xl font-black tracking-tighter transition-colors duration-500 ${
                    isExpanded
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex-1 p-8">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className={`text-2xl font-extrabold tracking-tight transition-colors ${
                          isExpanded
                            ? 'text-[#5200cc]'
                            : 'text-slate-900 group-hover:text-[#5200cc]'
                        }`}
                      >
                        {disease.disease_name}
                      </h3>

                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${risk.bgColor} ${risk.color} ${risk.borderColor}`}
                      >
                        {risk.icon}
                        {risk.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
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

                  <div
                    className={`flex items-center gap-4 rounded-2xl p-4 transition-colors duration-500 ${
                      isExpanded ? 'bg-[#5200cc]/10' : 'bg-slate-50 group-hover:bg-[#5200cc]/5'
                    }`}
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                        Match Score
                      </span>
                      <span className="leading-none text-3xl font-black tracking-tighter text-[#5200cc]">
                        {matchPercent}%
                      </span>
                    </div>

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-200">
                      <svg className="absolute h-12 w-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#5200cc"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - matchRatio)}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <BarChart3 size={18} className="text-[#5200cc]" />
                    </div>
                  </div>
                </div>

                <p
                  className={`mb-6 max-w-4xl text-[15px] leading-relaxed text-slate-600 transition-all duration-300 ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}
                >
                  {disease.definition ||
                    '해당 희귀질환에 대한 상세 설명이 아직 등록되지 않았습니다.'}
                </p>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-transparent bg-slate-50 px-4 py-2 text-[13px] font-bold text-slate-600 transition-all group-hover:border-slate-100 group-hover:bg-white group-hover:shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      매칭된 증상: {disease.matched_hpo_count}개
                    </div>

                    <div className="rounded-xl border border-transparent bg-slate-50 px-4 py-2 text-[13px] font-bold text-slate-600">
                      입력 증상 수: {disease.input_hpo_count}개
                    </div>

                    <div className="rounded-xl border border-transparent bg-slate-50 px-4 py-2 text-[13px] font-bold text-slate-600">
                      기본 일치율: {disease.match_percent}%
                    </div>

                    <button
                      onClick={() => toggleExpand(idx)}
                      className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#5200cc]/5 px-4 py-2 text-sm font-bold text-[#5200cc] transition-all hover:bg-[#5200cc]/10"
                    >
                      {isExpanded ? (
                        <>
                          간략히 보기 <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          상세 정보 보기 <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-4 mt-2 border-t border-slate-100 pt-6 fade-in duration-500">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="h-4 w-1 rounded-full bg-[#5200cc]/30" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                          매칭 상세 리포트 (HPO CODE)
                        </h4>
                      </div>

                      {disease.matched_hpo_codes?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {disease.matched_hpo_codes.map((code, hIdx) => (
                            <div
                              key={`${code}-${hIdx}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-[12px] font-bold text-slate-500 transition-all hover:border-[#5200cc]/30 hover:bg-white hover:text-[#5200cc] hover:shadow-sm"
                            >
                              <span className="rounded border border-slate-100 bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#5200cc]/70">
                                {code}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          매칭된 HPO 코드 정보가 없습니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-colors lg:hidden ${
                  isExpanded
                    ? 'bg-[#5200cc] text-white'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-[#5200cc] group-hover:text-white'
                }`}
              >
                {idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}