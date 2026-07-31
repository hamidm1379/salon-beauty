"use client";

import { useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import axiosInstance from "@/lib/axios";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Code,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        isActive
          ? "bg-[var(--color-primary)] text-white"
          : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[var(--color-ink)]/10 mx-1" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "محتوا را بنویسید...",
  className,
  minHeight = "300px",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--color-primary)] underline" },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Table.configure({
        HTMLAttributes: { class: "border-collapse w-full" },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[250px] px-4 py-3",
        dir: "rtl",
      },
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      // Show loading state
      editor.chain().focus().setImage({ src: "/uploading-placeholder.svg" }).run();

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", file.name);

        const { data } = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.success && data.data?.url) {
          // Replace placeholder with actual image
          editor.chain().focus().setImage({ src: data.data.url, alt: file.name }).run();
        } else {
          // Remove placeholder on error
          const { state } = editor;
          const pos = state.selection.$from.pos;
          const resolved = state.doc.resolve(pos);
          const node = resolved.nodeBefore;
          if (node && node.type.name === "image") {
            editor.chain().focus().deleteRange({ from: pos - node.nodeSize, to: pos }).run();
          }
        }
      } catch {
        // Remove placeholder on error — find and delete the placeholder image
        const { state } = editor;
        const pos = state.selection.$from.pos;
        // Walk backwards to find the placeholder image node
        const resolved = state.doc.resolve(pos);
        const node = resolved.nodeBefore;
        if (node && node.type.name === "image") {
          editor.chain().focus().deleteRange({ from: pos - node.nodeSize, to: pos }).run();
        }
      }

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [editor]
  );

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("آدرس لینک:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) {
    return (
      <div
        className={`border border-gray-200 rounded-xl bg-gray-50 ${className}`}
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className={className}>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border border-b-0 border-gray-200 rounded-t-xl bg-[var(--color-bg-soft)]">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="بولد"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="ایتالیک"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="کد"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="عنوان ۱"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="عنوان ۲"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="لیست نقطه‌ای"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="لیست شماره‌ای"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="لینک">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={addImage} title="آپلود تصویر">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={addTable} title="جدول">
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="خط افقی"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="بازگشت"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="انجام مجدد"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        className="border border-gray-200 rounded-b-xl bg-white overflow-y-auto"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Tiptap styles */}
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: var(--color-ink-muted);
          pointer-events: none;
          height: 0;
        }
        .tiptap h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .tiptap h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-right: 1.5rem;
          margin: 0.5rem 0;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-right: 1.5rem;
          margin: 0.5rem 0;
        }
        .tiptap li {
          margin: 0.25rem 0;
        }
        .tiptap blockquote {
          border-right: 4px solid var(--color-primary);
          padding-right: 1rem;
          margin: 1rem 0;
          color: var(--color-ink-muted);
        }
        .tiptap pre {
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .tiptap code {
          background: var(--color-bg-soft);
          border-radius: 0.25rem;
          padding: 0.15rem 0.3rem;
          font-size: 0.875rem;
        }
        .tiptap pre code {
          background: none;
          padding: 0;
        }
        .tiptap hr {
          border: none;
          border-top: 2px solid var(--color-ink);
          margin: 1.5rem 0;
        }
        .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .tiptap table td,
        .tiptap table th {
          border: 1px solid var(--color-ink);
          padding: 0.5rem;
          text-align: right;
        }
        .tiptap table th {
          background: var(--color-bg-soft);
          font-weight: 600;
        }
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .tiptap a {
          color: var(--color-primary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
