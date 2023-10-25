"use client";
import { useColloState } from '@/hooks/useColloState';

export type StartButtonProps = Pick<ReturnType<typeof useColloState>, 'requestCollo'>;
export const StartButton = (props: StartButtonProps) => {
    return <>
        <button
            className='bg-green-400 p-4 font-mono font-bold text-white'
            onClick={() => props.requestCollo(new Date(2022, 3, 1), new Date(2022, 3, 2), '震災')}
        >
            GET
        </button>
    </>
}