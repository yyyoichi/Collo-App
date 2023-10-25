"use client";
import { useEffect } from 'react';
import { useColloState } from '@/hooks/useColloState';
import { MultiDirectedGraph } from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';

export type NetworkGraphProps = Pick<ReturnType<typeof useColloState>, 'collo' | 'ready'>;
export const NetworkGraph = (props: NetworkGraphProps) => {
    return <>
        <SigmaContainer style={{ height: '500px', width: '500px' }}>
            <LoadGraph {...props} />
        </SigmaContainer>
    </>
}

const LoadGraph = (props: NetworkGraphProps) => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        if (props.ready) return;
        const graph = new MultiDirectedGraph();
        for (const [wordID, word] of props.collo.wordsMap.entries()) {
            graph.addNode(wordID, {
                label: word,
                x: Math.random() * 100,
                y: Math.random() * 100,
            });
        }
        let edgeID = 0;
        for (const { id1, id2, count } of props.collo.generatorPairs()) {
            graph.addEdgeWithKey(edgeID, id1, id2, { size: count });
            edgeID++;
        }

        // const positions = forceAtlas2(graph, {
        //     iterations: 50,
        //     settings: {
        //         gravity: 10
        //     }
        // });
        // forceAtlas2.assign(graph, 50);
        loadGraph(graph);
    }, [loadGraph, props.ready, props.collo]);

    return null;
};
