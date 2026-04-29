import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({ content }) {
  const rootRef = useRef(null);

  // Automatically apply syntax highlighting to code blocks after render
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.querySelectorAll("pre code").forEach((block) => {
        // FIX 2: Only highlight if it hasn't been highlighted already
        if (!block.dataset.highlighted) {
          hljs.highlightElement(block);
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={rootRef}
      className="text-sm md:text-base text-slate-800 leading-relaxed space-y-4"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom renderers to make Tailwind style the Markdown elements
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-slate-300 my-4"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-slate-300 bg-slate-100 px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-slate-300 px-4 py-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // FIX 1: Intercept Paragraphs. If it contains a code block, use a div instead of a p tag.
          p: ({ node, children, ...props }) => {
            // Check if any of the children is a 'pre' element
            const hasPreChild = node.children.some(
              (child) =>
                child.tagName === "pre" ||
                (child.children &&
                  child.children.some((c) => c.tagName === "pre")),
            );
            if (hasPreChild) {
              return (
                <div className="mb-4" {...props}>
                  {children}
                </div>
              );
            }
            return (
              <p className="mb-4" {...props}>
                {children}
              </p>
            );
          },

          code: ({ node, inline, className, children, ...props }) => {
            return !inline ? (
              <pre className="bg-[#0d1117] text-slate-300 p-4 rounded-md overflow-x-auto my-4 text-sm font-mono">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded font-mono text-sm border border-slate-200"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
