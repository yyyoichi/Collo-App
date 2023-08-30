"use client"
import { useColloState } from '@/hooks/useColloState'

export default function Home() {
  const collState = useColloState();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className='bg-green-400 p-4 text-white font-bold font-mono' onClick={() => collState.requestCollo()}>GET</button>
    </main>
  )
}
