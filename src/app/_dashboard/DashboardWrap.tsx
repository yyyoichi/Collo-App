"use client";
import { useColloState } from '@/hooks/useColloState';
import { NetworkGraph } from './NetworkGraph';
import { DateInput, FormComps, KeywordInput, Label, LoadingButton, StartButton, WrapProps } from './Forms';
import { FormEvent } from 'react';

export default function Home() {
    const colloState = useColloState();
    const formwrapPorps: WrapProps = {
        onSubmit: function (event: FormEvent<HTMLFormElement>): void {
            event.preventDefault();
            // start search
            console.log(event.target);
            const form = new FormData(event.currentTarget);
            const start = form.get("start");
            const end = form.get("end");
            const keyword = form.get("keyword");
            console.log("start:", start, ", end:", end, ", keyword:", keyword);
        }
    }
    return <>
        <FormComps.Wrap {...formwrapPorps}>
            <FormComps.Col>
                <Label htmlFor='keyword'>{"開始日"}</Label><DateInput id='start' name='start' defaultValue={"2023-01-01"} />
            </FormComps.Col>
            <FormComps.Col>
                <Label htmlFor='keyword'>{"終了日"}</Label><DateInput id='end' name='end' defaultValue={"2023-03-31"} />
            </FormComps.Col>
            <FormComps.Col>
                <Label htmlFor='keyword'>{"キーワード"}</Label><KeywordInput id='keyword' name='keyword' />
            </FormComps.Col>
            <StartButton />
            <LoadingButton />
        </FormComps.Wrap>
        <NetworkGraph {...colloState} />
    </>
}
