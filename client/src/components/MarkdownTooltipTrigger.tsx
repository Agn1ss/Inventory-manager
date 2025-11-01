import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "bootstrap";

interface MarkdownTooltipTriggerProps {
  content: string;
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
    if (ref.current) {
      const tooltipContent = document.createElement("div");
      tooltipContent.style.maxWidth = `${width}px`;
      tooltipContent.style.textAlign = "left";
      tooltipContent.style.whiteSpace = "normal";
      tooltipContent.innerHTML = renderMarkdownToHtml(content);

      new Tooltip(ref.current, {
        html: true,
        title: tooltipContent,
        placement: "auto",
      });
    }
  }, [content, width]);

  return (
    <span ref={ref} className="cursor-pointer">
      {children}
    </span>
  );
}

function renderMarkdownToHtml(markdown: string): string {
  return ReactDOMServer.renderToStaticMarkup(
    <ReactMarkdown>{markdown}</ReactMarkdown>
  );
}
