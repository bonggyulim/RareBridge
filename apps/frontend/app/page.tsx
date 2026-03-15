'use client';

import { useState } from 'react';

export default function SymptomPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // if (!text.trim()) return alert("증상을 입력해주세요.");
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/symptoms/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* 헤더 섹션 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">증상 입력 및 분석</h1>
          <p className="text-gray-500">자연어 기술을 사용하여 환자의 임상 증상을 입력해 주세요.</p>
        </div>

        {/* 입력 카드 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            임상적 특징 및 증상 (Symptom Description)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="증상을 입력하세요. 예: '눈이 돌출되어 보이고 뼈가 쉽게 부러지는 증상이 있습니다.'"
            className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-800"
          />
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-blue-600 flex items-center">
              <span className="mr-1">ℹ️</span> 자연어 입력 지원 중
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center shadow-md disabled:bg-blue-300"
            >
              {loading ? '분석 중...' : '진단 분석 시작 →'}
            </button>
          </div>
        </div>

        {/* 결과창 (임의 추가 영역) */}
        {result && (
          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">🔍</span> 분석 결과 리포트
            </h3>
            <pre className="bg-slate-700 p-4 rounded-lg overflow-x-auto text-green-400 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* 의료 면책 조항 */}
        <div className="mt-12 text-center border-t border-gray-200 pt-8">
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-xl mx-auto uppercase">
            Medical Disclaimer / 의료적 면책 조항<br />
            본 도구는 인공지능 기반 보조 도구입니다. 제공되는 결과는 최종적인 의학적 진단이 아니며,
            반드시 전문 의료진의 상담과 검사를 통해 확인되어야 합니다.
          </p>
        </div>

      </div>
    </div>
  );
}






















// 'use client';

// import { useState } from 'react';

// export default function SymptomPage() {
//   const [text, setText] = useState('');
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       // 우리가 만든 백엔드 주소 (8000번 포트)
//       const response = await fetch('http://localhost:8000/api/v1/symptoms/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text }), // 여기서 JSON으로 포장해서 보냅니다!
//       });
//       const data = await response.json();
//       setResult(data);
//     } catch (error) {
//       console.error('에러 발생:', error);
//       alert('백엔드 서버가 켜져 있는지 확인해 주세요!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>RareBridge 증상 분석 테스트</h1>
//       <p>자유롭게 증상을 입력하고 백엔드로 전송해보세요.</p>

//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="어디가 아프신가요? (예: 어제부터 머리가 아프고 열이 나요)"
//         style={{ width: '100%', height: '150px', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
//       />

//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         style={{ width: '100%', padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//       >
//         {loading ? '분석 중...' : '백엔드로 전송하기'}
//       </button>

//       {result && (
//         <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#000', borderRadius: '5px' }}>
//           <h3>백엔드 응답 결과:</h3>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
