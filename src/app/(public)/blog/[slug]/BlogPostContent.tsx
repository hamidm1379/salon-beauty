"use client";

import { useRef, useEffect } from "react";

interface BlogPostContentProps {
  html: string;
}

export function BlogPostContent({ html }: BlogPostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    el.querySelectorAll("h1").forEach((n) => n.classList.add("text-3xl", "font-bold", "text-[var(--color-ink)]", "mt-10", "mb-4", "leading-snug"));
    el.querySelectorAll("h2").forEach((n) => n.classList.add("text-2xl", "font-bold", "text-[var(--color-ink)]", "mt-8", "mb-3", "leading-snug"));
    el.querySelectorAll("h3").forEach((n) => n.classList.add("text-xl", "font-semibold", "text-[var(--color-ink)]", "mt-6", "mb-2"));
    el.querySelectorAll("h4, h5, h6").forEach((n) => n.classList.add("text-lg", "font-semibold", "text-[var(--color-ink)]", "mt-5", "mb-2"));

    el.querySelectorAll("p").forEach((n) => n.classList.add("text-[var(--color-ink-muted)]", "leading-[1.9]", "mb-5", "text-base"));

    el.querySelectorAll("a").forEach((n) => n.classList.add("text-[var(--color-primary)]", "underline", "underline-offset-2", "hover:text-[var(--color-primary-soft)]", "transition-colors"));

    el.querySelectorAll("blockquote").forEach((n) => n.classList.add("border-r-4", "border-[var(--color-primary)]/40", "bg-[var(--color-primary)]/5", "rounded-2xl", "px-6", "py-4", "my-6", "text-[var(--color-ink-muted)]", "italic"));

    el.querySelectorAll("ul, ol").forEach((n) => n.classList.add("space-y-2", "my-4", "text-[var(--color-ink-muted)]", "leading-relaxed"));

    el.querySelectorAll("li").forEach((n) => n.classList.add("relative", "pr-5"));

    el.querySelectorAll("ul li").forEach((n) => {
      const marker = document.createElement("span");
      marker.className = "absolute right-0 top-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50";
      n.prepend(marker);
    });

    el.querySelectorAll("ol").forEach((n) => n.classList.add("list-decimal", "list-inside"));

    el.querySelectorAll("code").forEach((n) => n.classList.add("bg-[var(--color-primary)]/8", "text-[var(--color-primary)]", "px-2", "py-0.5", "rounded-lg", "text-sm", "font-mono"));

    el.querySelectorAll("pre").forEach((n) => {
      n.classList.add("bg-[var(--color-ink)]", "rounded-2xl", "p-5", "my-6", "overflow-x-auto", "border", "border-[var(--color-ink)]/10");
      n.querySelectorAll("code").forEach((c) => {
        c.classList.remove("bg-[var(--color-primary)]/8", "text-[var(--color-primary)]", "px-2", "py-0.5", "rounded-lg");
        c.classList.add("text-gray-100", "text-sm");
      });
    });

    el.querySelectorAll("table").forEach((n) => n.classList.add("w-full", "my-6", "border-collapse", "rounded-2xl", "overflow-hidden", "border", "border-[var(--color-ink)]/10"));

    el.querySelectorAll("th").forEach((n) => n.classList.add("bg-[var(--color-primary)]/8", "text-[var(--color-ink)]", "px-4", "py-3", "text-right", "text-sm", "font-semibold", "border-b", "border-[var(--color-ink)]/10"));

    el.querySelectorAll("td").forEach((n) => n.classList.add("px-4", "py-3", "text-sm", "text-[var(--color-ink-muted)]", "border-b", "border-[var(--color-ink)]/5"));

    el.querySelectorAll("hr").forEach((n) => n.classList.add("my-10", "border-0", "h-px", "bg-gradient-to-l", "from-transparent", "via-[var(--color-primary)]/20", "to-transparent"));

    el.querySelectorAll("img").forEach((n) => {
      n.classList.add("rounded-2xl", "my-6", "w-full");
      n.setAttribute("loading", "lazy");
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
