'use client';
import { useColloState } from '@/hooks/useColloState';

export default function Home() {
  const collState = useColloState();
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <button className='bg-green-400 p-4 font-mono font-bold text-white' onClick={() => collState.requestCollo()}>
        GET
      </button>
      <div>
        {collState.collo.mapPairs().map((v, i) => (
          <div key={i} className='flex gap-5 justify-between bg-gray-600 px-4 py-2 my-1 text-white'>
            <div className=''>{v.pairs.join(' & ')}</div>
            <div>count: {v.count}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
