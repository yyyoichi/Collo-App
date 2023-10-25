"use client";
import { useColloState } from '@/hooks/useColloState';
import { NetworkGraph } from './NetworkGraph';
import { StartButton } from './StartButton';

export default function Home() {
    const colloState = useColloState();
    return <>
        <StartButton {...colloState} />
        <NetworkGraph {...colloState} />
    </>
}
