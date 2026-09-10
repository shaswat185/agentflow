import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
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
  onConnect: (connection: Connection) => void;
  onNodeClick: (
    event: React.MouseEvent,
    node: Node
  ) => void;
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
  return (
    <div className="workflow-canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        fitView
        fitViewOptions={{
          padding: 0.25,
        }}
        minZoom={0.4}
        maxZoom={1.6}
        defaultEdgeOptions={{
          animated: false,
          style: {
            strokeWidth: 2,
          },
        }}
      >
        <Background
          gap={20}
          size={1}
        />

        <Controls
          showInteractive={false}
          position="bottom-left"
        />

        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;