"use client";
import { useEffect, useState } from 'react';
import { useColloState } from '@/hooks/useColloState';
import Graph from 'graphology';
import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, ZoomControl, useLoadGraph, useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { LayoutForceAtlas2Control, useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import '@react-sigma/core/lib/react-sigma.min.css';
import { Attributes } from 'graphology-types';
import { NodeStrength } from './node';

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
        const MAX_NODE = 100;
        const MAX_NODE_SIZE = 10;
        const MAX_EDGE_SIZE = 3;

        const graph = new Graph();
        const pairs = props.collo.getSortedPairs().splice(0, MAX_NODE);
        const EDGE_SCALING = MAX_EDGE_SIZE / pairs[0].count;

        /**単語識別子と共起回数の合計値を持つ */
        const nodeStrength = new NodeStrength();
        /**
         * ノードに単語を追加する
         * @param wordID 単語識別子
         */
        const addNode = (wordID: string) => {
            graph.addNode(wordID, {
                label: props.collo.getWordByID(wordID),
                size: 0,
                x: Math.random() * 100,
                y: Math.random() * 100,
            });
        }
        pairs.forEach(({ id1, id2, count }, edgeID) => {
            if (!nodeStrength.isAddedNode(id1)) {
                addNode(id1);
            }
            if (!nodeStrength.isAddedNode(id2)) {
                addNode(id2);
            }
            nodeStrength.add(id1, count);
            nodeStrength.add(id2, count);

            // add edge
            graph.addEdgeWithKey(edgeID, id1, id2, {
                size: count * EDGE_SCALING
            });
        })
        const NODE_SCALING = MAX_NODE_SIZE / nodeStrength.getMaxCount();
        graph.forEachNode((node, attr) => {
            attr.size = nodeStrength.get(node) * NODE_SCALING;
        });
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
