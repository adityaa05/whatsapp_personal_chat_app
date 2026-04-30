import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({ content }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("pre code").forEach((block) => {
      if (!block.dataset.highlighted) hljs.highlightElement(block);
    });
  }, [content]);

  return (
    <div ref={ref} className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div style={{ overflowX: "auto" }}>
              <table {...props} />
            </div>
          ),
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          p: ({ node, children, ...props }) => {
            const hasPre = node.children.some(
              (c) =>
                c.tagName === "pre" ||
                (c.children && c.children.some((cc) => cc.tagName === "pre")),
            );
            return hasPre ? (
              <div style={{ marginBottom: 5 }} {...props}>
                {children}
              </div>
            ) : (
              <p {...props}>{children}</p>
            );
          },
          code: ({ node, inline, className, children, ...props }) =>
            inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
