"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * Rendert Lektionstexte.
 *
 * Codeblöcke haben bewusst **keinen** Kopieren-Knopf: Der Kurs lebt davon, dass
 * Programme selbst getippt werden. Der Knopf tauchte ohnehin nur an einer
 * einzigen Stelle im ganzen Kurs auf – ausgerechnet an der Musterlösung.
 */
export const Markdown = memo(function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={{
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
