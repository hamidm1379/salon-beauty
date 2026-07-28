"use client";

import { useMemo } from "react";

interface BlogPostContentProps {
  html: string;
}

export function BlogPostContent({ html }: BlogPostContentProps) {
  const content = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll("h1").forEach((el) => {
      el.classList.add("text-3xl", "font-bold", "text-[var(--color-ink)]", "mt-10", "mb-4", "leading-snug");
    });
    doc.querySelectorAll("h2").forEach((el) => {
      el.classList.add("text-2xl", "font-bold", "text-[var(--color-ink)]", "mt-8", "mb-3", "leading-snug");
    });
    doc.querySelectorAll("h3").forEach((el) => {
      el.classList.add("text-xl", "font-semibold", "text-[var(--color-ink)]", "mt-6", "mb-2");
    });
    doc.querySelectorAll("h4, h5, h6").forEach((el) => {
      el.classList.add("text-lg", "font-semibold", "text-[var(--color-ink)]", "mt-5", "mb-2");
    });

    doc.querySelectorAll("p").forEach((el) => {
      el.classList.add("text-[var(--color-ink-muted)]", "leading-[1.9]", "mb-5", "text-base");
    });

    doc.querySelectorAll("a").forEach((el) => {
      el.classList.add("text-[var(--color-primary)]", "underline", "underline-offset-2", "hover:text-[var(--color-primary-soft)]", "transition-colors");
    });

    doc.querySelectorAll("blockquote").forEach((el) => {
      el.classList.add(
        "border-r-4", "border-[var(--color-primary)]/40", "bg-[var(--color-primary)]/5",
        "rounded-2xl", "px-6", "py-4", "my-6",
        "text-[var(--color-ink-muted)]", "italic"
      );
    });

    doc.querySelectorAll("ul, ol").forEach((el) => {
      el.classList.add("space-y-2", "my-4", "text-[var(--color-ink-muted)]", "leading-relaxed");
    });

    doc.querySelectorAll("li").forEach((el) => {
      el.classList.add("relative", "pr-5");
    });

    doc.querySelectorAll("ul li").forEach((el) => {
      const marker = document.createElement("span");
      marker.className = "absolute right-0 top-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50";
      el.prepend(marker);
    });

    doc.querySelectorAll("ol").forEach((el) => {
      el.classList.add("list-decimal", "list-inside");
    });

    doc.querySelectorAll("code").forEach((el) => {
      el.classList.add(
        "bg-[var(--color-primary)]/8", "text-[var(--color-primary)]",
        "px-2", "py-0.5", "rounded-lg", "text-sm", "font-mono"
      );
    });

    doc.querySelectorAll("pre").forEach((el) => {
      el.classList.add(
        "bg-[var(--color-ink)]", "rounded-2xl", "p-5", "my-6",
        "overflow-x-auto", "border", "border-[var(--color-ink)]/10"
      );
      el.querySelectorAll("code").forEach((code) => {
        code.classList.remove("bg-[var(--color-primary)]/8", "text-[var(--color-primary)]", "px-2", "py-0.5", "rounded-lg");
        code.classList.add("text-gray-100", "text-sm");
      });
    });

    doc.querySelectorAll("table").forEach((el) => {
      el.classList.add("w-full", "my-6", "border-collapse", "rounded-2xl", "overflow-hidden", "border", "border-[var(--color-ink)]/10");
    });

    doc.querySelectorAll("th").forEach((el) => {
      el.classList.add(
        "bg-[var(--color-primary)]/8", "text-[var(--color-ink)]",
        "px-4", "py-3", "text-right", "text-sm", "font-semibold",
        "border-b", "border-[var(--color-ink)]/10"
      );
    });

    doc.querySelectorAll("td").forEach((el) => {
      el.classList.add(
        "px-4", "py-3", "text-sm", "text-[var(--color-ink-muted)]",
        "border-b", "border-[var(--color-ink)]/5"
      );
    });

    doc.querySelectorAll("hr").forEach((el) => {
      el.classList.add("my-10", "border-0", "h-px", "bg-gradient-to-l", "from-transparent", "via-[var(--color-primary)]/20", "to-transparent");
    });

    doc.querySelectorAll("img").forEach((el) => {
      el.classList.add("rounded-2xl", "my-6", "w-full");
      el.setAttribute("loading", "lazy");
    });

    return doc.body.innerHTML;
  }, [html]);

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
