"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface NoteNode {
  id: string;
  title: string;
  tags: { name: string }[];
}

export default function GraphPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchGraphData();
    }
  }, [user, loading]);

  const fetchGraphData = async () => {
    try {
      const res = await fetch(`/api/graph?userId=${user?.id}`);
      const data = await res.json();

      // 노드 생성
      const graphNodes: Node[] = data.nodes.map(
        (note: NoteNode, index: number) => {
          const angle = (index / data.nodes.length) * 2 * Math.PI;
          const radius = 300;
          return {
            id: note.id,
            data: {
              label: (
                <div className="p-2">
                  <div className="font-medium text-sm">{note.title}</div>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.name}
                          className="text-xs bg-blue-100 text-blue-700 px-1 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            position: {
              x: 400 + radius * Math.cos(angle),
              y: 400 + radius * Math.sin(angle),
            },
            style: {
              background: "white",
              border: "2px solid #3b82f6",
              borderRadius: "8px",
              padding: "0",
              cursor: "pointer",
            },
          };
        },
      );

      // 엣지 생성 (유사도 0.7 이상만)
      const graphEdges: Edge[] = data.edges
        .filter((edge: any) => edge.similarity > 0.7)
        .map((edge: any) => ({
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: `${(edge.similarity * 100).toFixed(0)}%`,
          animated: edge.similarity > 0.85,
          style: {
            stroke: edge.similarity > 0.85 ? "#3b82f6" : "#94a3b8",
            strokeWidth: edge.similarity > 0.85 ? 2 : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edge.similarity > 0.85 ? "#3b82f6" : "#94a3b8",
          },
        }));

      setNodes(graphNodes);
      setEdges(graphEdges);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
      setIsLoading(false);
    }
  };

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    router.push(`/notes/${node.id}`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="h-[calc(100vh-73px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

