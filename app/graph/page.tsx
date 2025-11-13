"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);

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
      const glowPalette = ["#a855f7", "#38bdf8", "#f472b6", "#34d399"];

      const graphNodes: Node[] = data.nodes.map((note: NoteNode, index: number) => {
        const angle = (index / data.nodes.length) * 2 * Math.PI;
        const radius = 320;
        const glowColor = glowPalette[index % glowPalette.length];

        return {
          id: note.id,
          data: {
            label: (
              <div className="relative w-44 max-w-[12rem]">
                <div
                  className="absolute inset-0 -z-10 opacity-70 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
                  }}
                />
                <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white shadow-[0_12px_40px_rgba(2,6,23,0.6)] backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">노트</p>
                  <p className="text-sm font-semibold leading-tight line-clamp-2">{note.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>{note.tags.length} tags</span>
                    <span className="text-white/50">↗</span>
                  </div>
                </div>
              </div>
            ),
          },
          position: {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
          },
          style: {
            background: "transparent",
            border: "none",
            borderRadius: "24px",
            padding: "0",
            cursor: "pointer",
          },
        };
      });

      // 엣지 생성 (유사도 0.7 이상만)
      const graphEdges: Edge[] = data.edges
        .filter((edge: any) => edge.similarity > 0.7)
        .map((edge: any) => {
          const similarity = edge.similarity;
          const stroke =
            similarity > 0.9
              ? "rgba(168, 85, 247, 0.9)"
              : similarity > 0.8
                ? "rgba(99, 102, 241, 0.85)"
                : "rgba(148, 163, 184, 0.4)";
          return {
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            label: similarity > 0.9 ? "고유사" : undefined,
            animated: similarity > 0.85,
            type: "smoothstep",
            style: {
              stroke,
              strokeWidth: similarity > 0.85 ? 2 : 1.5,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: stroke,
            },
          };
        });

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

  useEffect(() => {
    if (!isLoading && flowInstance) {
      flowInstance.fitView({ padding: 0.25 });
    }
  }, [isLoading, flowInstance, nodes]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation />
      <div className="flex h-[calc(100vh-88px)] flex-col">
        <div className="mx-auto w-full max-w-6xl px-6 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Knowledge Graph</p>
          <h1 className="mt-2 text-3xl font-semibold">연결된 아이디어 맵</h1>
          <p className="mt-2 text-sm text-white/70">노트 간 유사도를 기반으로 네트워크를 확인하세요.</p>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={(instance) => setFlowInstance(instance)}
          attributionPosition="bottom-right"
          fitViewOptions={{ padding: 0.25 }}
          className="rounded-t-3xl border-t border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%),_radial-gradient(circle_at_20%_20%,_rgba(147,51,234,0.2),_transparent_45%),_#030712]"
        >
          <Background color="rgba(148,163,184,0.15)" variant={BackgroundVariant.Dots} gap={24} size={1.5} />
          <Controls
            className="!border-white/20 !bg-white/10 text-white"
            style={{ color: "white" }}
            showInteractive={false}
          />
          <MiniMap
            nodeStrokeColor="#c084fc"
            nodeColor="#1d1b3a"
            maskColor="rgba(3,7,18,0.75)"
            style={{ backgroundColor: "rgba(3,7,18,0.85)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

