import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#5200cc]">
          RareBridge
        </p>
        <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900">
          희귀질환 분석 플랫폼
        </h1>
        <p className="mb-8 leading-relaxed text-slate-500">
          증상을 입력하면 HPO 기반으로 희귀질환 후보를 분석하는 AI 진단 보조
          서비스입니다.
        </p>

        <Link
          href="/diagnosis"
          className="inline-flex items-center justify-center rounded-2xl bg-[#5200cc] px-8 py-4 font-bold text-white transition-colors hover:bg-[#4300aa]"
        >
          진단 페이지로 이동
        </Link>
      </div>
    </main>
  );
}