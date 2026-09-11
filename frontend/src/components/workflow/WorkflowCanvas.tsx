import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow";

import "reactflow/dist/style.css";
import WorkflowNode from "./WorkflowNode";

type WorkflowCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: NodeMouseHandler;
};

const nodeTypes = {
  workflow: WorkflowNode,
};

const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}: WorkflowCanvasProps) => {
  const nodeMap = new Map(
    nodes.map((node) => [node.id, node])
  );

  const styledEdges = edges.map((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    const sourceStatus =
      sourceNode?.data?.executionStatus;

    const targetStatus =
      targetNode?.data?.executionStatus;

    const isSkipped =
      sourceStatus === "waiting" ||
      targetStatus === "waiting";

    const isRunning =
      sourceStatus === "running" ||
      targetStatus === "running";

    const isCompleted =
      sourceStatus === "completed" &&
      targetStatus === "completed";

    let stroke = "#94a3b8";
    let strokeWidth = 2;
    let animated = false;
    let opacity = 1;

    /*
     * CONDITION YES BRANCH
     */

    if (edge.sourceHandle === "yes") {
      stroke = "#198754";
      strokeWidth = 2.5;
    }

    /*
     * CONDITION NO BRANCH
     */

    if (edge.sourceHandle === "no") {
      stroke = "#dc3545";
      strokeWidth = 2.5;
    }

    /*
     * RUNNING PATH
     */

    if (isRunning) {
      strokeWidth = 3;
      animated = true;
    }

    /*
     * COMPLETED PATH
     */

    if (isCompleted) {
      strokeWidth = 2.5;
    }

    /*
     * SKIPPED PATH
     */

    if (isSkipped) {
      opacity = 0.2;
      animated = false;
    }

    return {
      ...edge,
      type: "smoothstep",
      animated,
      style: {
        stroke,
        strokeWidth,
        opacity,
      },
    };
  });

  return (
    <div className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodesConnectable
        nodesDraggable
        elementsSelectable
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: {
            stroke: "#94a3b8",
            strokeWidth: 2,
          },
        }}
        connectionLineStyle={{
          stroke: "#64748b",
          strokeWidth: 2,
        }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          gap={20}
          size={1}
        />

        <Controls
          showInteractive={false}
        />

        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;