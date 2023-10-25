"use client";
import { useEffect, useState } from 'react';
import { useColloState } from '@/hooks/useColloState';
import Graph from 'graphology';
import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, ZoomControl, useLoadGraph, useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { LayoutForceAtlas2Control, useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import '@react-sigma/core/lib/react-sigma.min.css';
import { Attributes } from 'graphology-types';

export type NetworkGraphProps = Pick<ReturnType<typeof useColloState>, 'collo' | 'ready'>;
export const NetworkGraph = (props: NetworkGraphProps) => {
    return <>
        <SigmaContainer style={{ height: "500px" }}>
            <LoadGraph {...props} />
            <ControlsContainer position={"bottom-right"}>
                <ZoomControl />
                <FullScreenControl />
                <LayoutForceAtlas2Control settings={{ settings: { slowDown: 10 } }} />
            </ControlsContainer>
            <ControlsContainer position={"top-right"}>
                <SearchControl style={{ width: "200px" }} />
            </ControlsContainer>
        </SigmaContainer>
    </>
}

const LoadGraph = (props: NetworkGraphProps) => {
    const { assign } = useLayoutForceAtlas2();
    const sigma = useSigma();
    const registerEvents = useRegisterEvents();
    const loadGraph = useLoadGraph();
    const setSettings = useSetSettings();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        if (props.ready) return;
        const graph = new Graph();
        for (const [wordID, word] of props.collo.wordsMap.entries()) {
            graph.addNode(wordID, {
                label: word,
                size: 5,
                x: Math.random() * 100,
                y: Math.random() * 100,
            });
        }
        let edgeID = 0;
        for (const { id1, id2, count } of props.collo.generatorPairs()) {
            graph.addEdgeWithKey(edgeID, id1, id2);
            edgeID++;
        }
        loadGraph(graph);
        assign();

        registerEvents({
            enterNode: (event) => setHoveredNode(event.node),
            leaveNode: () => setHoveredNode(null),
        });
    }, [loadGraph, registerEvents, props.ready, props.collo, assign]);

    useEffect(() => {
        setSettings({
            nodeReducer: (node, data) => {
                const graph = sigma.getGraph();
                const newData: Attributes = { ...data, highlighted: data.highlighted || false };
                // user doesnot hover any node
                if (!hoveredNode) return newData;

                // hightligth hover node and related node
                if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
                    newData.highlighted = true;
                } else {
                    newData.color = "#E2E2E2";
                    newData.highlighted = false;
                }
                return newData;
            },
            edgeReducer: (edge, data) => {
                const graph = sigma.getGraph();
                const newData = { ...data, hidden: false };

                if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
                    newData.hidden = true;
                }
                return newData;
            },
        });
    }, [hoveredNode, setSettings, sigma]);

    return null;
};
