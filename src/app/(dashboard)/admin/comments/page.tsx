"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageCircle,
  Reply,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import {
  useComments,
  useApproveComment,
  useRejectComment,
  useDeleteComment,
  useReplyToComment,
} from "@/hooks/use-comments";
import type { Comment, CommentReply } from "@/hooks/use-comments";

export default function AdminCommentsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const { data: commentsData, isLoading } = useComments({
    isApproved: filter === "approved" ? true : filter === "pending" ? false : undefined,
    page,
    limit: 10,
  });

  const approveComment = useApproveComment();
  const rejectComment = useRejectComment();
  const deleteComment = useDeleteComment();
  const replyToComment = useReplyToComment();

  const comments = commentsData?.items || [];
  const totalPages = commentsData?.totalPages || 1;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewComment, setViewComment] = useState<{ name: string; content: string } | null>(null);
  const [viewReplies, setViewReplies] = useState<{ commentName: string; replies: CommentReply[] } | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string; serviceId: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteComment.mutate(deleteId);
    setDeleteId(null);
  };

  const handleReply = () => {
    if (!replyTarget || !replyContent.trim()) return;
    replyToComment.mutate(
      { id: replyTarget.id, content: replyContent.trim(), serviceId: replyTarget.serviceId },
      {
        onSuccess: () => {
          setReplyTarget(null);
          setReplyContent("");
        },
      }
    );
  };

  const columns = [
    {
      key: "name",
      label: "نام",
      render: (item: Comment) => (
        <div>
          <p className="font-medium text-[var(--color-ink)]">{item.name}</p>
          <p className="text-xs text-[var(--color-ink-muted)]" dir="ltr">{item.phone}</p>
        </div>
      ),
    },
    {
      key: "content",
      label: "متن نظر",
      render: (item: Comment) => (
        <div>
          <button
            type="button"
            onClick={() => setViewComment({ name: item.name, content: item.content })}
            className="text-sm text-[var(--color-ink-muted)] text-right leading-relaxed max-w-xs hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="line-clamp-1">{item.content}</span>
            {item.content.length > 30 && (
              <span className="block text-xs text-[var(--color-primary)] mt-1">مشاهده کامل</span>
            )}
          </button>
          {item.replies.length > 0 && (
            <button
              type="button"
              onClick={() => setViewReplies({ commentName: item.name, replies: item.replies })}
              className="flex items-center gap-1 mt-1 text-xs text-[var(--color-primary)] hover:underline"
            >
              {item.replies.length} پاسخ
            </button>
          )}
        </div>
      ),
    },
    {
      key: "service",
      label: "سرویس",
      render: (item: Comment) => (
        <Link
          href={`/services/${item.service.slug}`}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          {item.service.name}
        </Link>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (item: Comment) => (
        <Badge variant={item.isApproved ? "success" : "warning"}>
          {item.isApproved ? "تایید شده" : "در انتظار تایید"}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "تاریخ",
      render: (item: Comment) => (
        <span className="text-xs text-[var(--color-ink-muted)]">
          {new Date(item.createdAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (item: Comment) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setReplyTarget({ id: item.id, name: item.name, serviceId: item.service.id })
            }
            className="text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
          >
            <Reply className="w-4 h-4" />
          </Button>
          {!item.isApproved ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => approveComment.mutate(item.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => rejectComment.mutate(item.id)}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت نظرات</h1>
        <div className="text-sm text-[var(--color-ink-muted)]">
          کل: {commentsData?.total || 0} نظر
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all" as const, label: "همه" },
          { key: "pending" as const, label: "در انتظار تایید" },
          { key: "approved" as const, label: "تایید شده" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)] hover:bg-[var(--color-bg)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-10 h-10 mx-auto text-[var(--color-ink-muted)]/30 mb-3" />
              <p className="text-[var(--color-ink-muted)]">نظری یافت نشد</p>
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={comments}
              keyExtractor={(item) => item.id}
              emptyMessage="نظری یافت نشد"
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">
            حذف نظر
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
            آیا از حذف این نظر اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              انصراف
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
              isLoading={deleteComment.isPending}
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              حذف
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Comment Modal */}
      <Modal
        open={!!viewComment}
        onClose={() => setViewComment(null)}
        title={viewComment ? `نظر ${viewComment.name}` : ""}
        className="max-w-lg"
      >
        <p className="text-sm text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap">
          {viewComment?.content}
        </p>
        <div className="flex justify-end mt-6">
          <Button variant="ghost" onClick={() => setViewComment(null)}>
            بستن
          </Button>
        </div>
      </Modal>

      {/* View Replies Modal */}
      <Modal
        open={!!viewReplies}
        onClose={() => setViewReplies(null)}
        title={viewReplies ? `پاسخ‌های ${viewReplies.commentName}` : ""}
        className="max-w-lg"
      >
        <div className="space-y-3">
          {viewReplies?.replies.map((reply) => (
            <div
              key={reply.id}
              className="flex gap-3 p-3 rounded-xl bg-[var(--color-bg-soft)] border border-[var(--color-ink)]/5"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--color-primary)]">
                  {reply.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {reply.name}
                  </p>
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                    پاسخ مدیریت
                  </Badge>
                  <span className="text-xs text-[var(--color-ink-muted)]">
                    {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="ghost" onClick={() => setViewReplies(null)}>
            بستن
          </Button>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        open={!!replyTarget}
        onClose={() => { setReplyTarget(null); setReplyContent(""); }}
        title={replyTarget ? `پاسخ به ${replyTarget.name}` : ""}
        className="max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">
            متن پاسخ
          </label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 transition-all resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => { setReplyTarget(null); setReplyContent(""); }}>
            انصراف
          </Button>
          <Button
            variant="primary"
            onClick={handleReply}
            isLoading={replyToComment.isPending}
            disabled={!replyContent.trim()}
          >
            ارسال پاسخ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
