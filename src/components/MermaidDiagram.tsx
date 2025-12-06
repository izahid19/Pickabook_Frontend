"use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
      });
      if (ref.current) {
        mermaid.contentLoaded();
        // Force re-render of diagram if content changes or on mount
        mermaid.run({
            nodes: [ref.current]
        })
      }
    }
  }, [chart]);

  return (
    <div className="mermaid flex justify-center bg-white p-4" ref={ref}>
      {chart}
    </div>
  );
};

export default MermaidDiagram;
