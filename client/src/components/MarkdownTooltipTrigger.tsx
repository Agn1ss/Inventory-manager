import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "bootstrap";

interface MarkdownTooltipTriggerProps {
  content?: string | null;
  width?: number;
  children: React.ReactNode;
}

export default function MarkdownTooltipTrigger({
  content,
  width = 300,
  children,
}: MarkdownTooltipTriggerProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current || !content) return;

    const tooltipContent = document.createElement("div");
    tooltipContent.style.maxWidth = `${width}px`;
    tooltipContent.style.textAlign = "left";
    tooltipContent.style.whiteSpace = "normal";
    tooltipContent.innerHTML = renderMarkdownToHtml(content);

    const tooltip = new Tooltip(ref.current, {
      html: true,
      title: tooltipContent,
      placement: "auto",
    });

    return () => tooltip.dispose();
  }, [content, width]);

  if (!content) {
    return <>{children}</>;
  }

  return (
    <span ref={ref} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
}


function renderMarkdownToHtml(markdown: string): string {
  const element = <ReactMarkdown>{markdown}</ReactMarkdown>;
  return ReactDOMServer.renderToString(element);
}
