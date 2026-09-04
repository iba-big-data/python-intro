"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

/**
 * Rendert Lektionstexte. Code-Blöcke bekommen automatisch einen
 * Kopieren-Knopf – Abtippen soll nie an Fleißarbeit scheitern.
 */
function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const pre = event.currentTarget.parentElement?.querySelector("code");
    const text = pre?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="group relative">
      <pre>{children}</pre>
      <button
        onClick={copy}
        aria-label="Code kopieren"
        className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-dim opacity-0 transition group-hover:opacity-100 hover:border-line-bright hover:text-ink"
      >
        {copied ? (
          <>
            <Check className="size-3 text-lime" />
            Kopiert
          </>
        ) : (
          <>
            <Copy className="size-3" />
            Kopieren
          </>
        )}
      </button>
    </div>
  );
}

export const Markdown = memo(function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});
