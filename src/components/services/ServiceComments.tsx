"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Phone, Shield, Star } from "lucide-react";
import { useServiceComments, useCreateComment } from "@/hooks/use-comments";
import type { Comment, CommentReply } from "@/hooks/use-comments";

interface ServiceCommentsProps {
  serviceId: string;
  serviceSlug: string;
}

function InitialAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initial = name.charAt(0);
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] flex items-center justify-center shrink-0 shadow-sm ${className}`}
    >
      <span className="text-white font-bold text-sm">{initial}</span>
    </div>
  );
}

function ReplyItem({ reply, isLast }: { reply: CommentReply; isLast: boolean }) {
  return (
    <div className={`flex gap-3 ${!isLast ? "pb-3" : ""}`}>
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-emerald-200/60 mt-2" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-bold text-[var(--color-ink)]">
            {reply.name}
          </span>
          <span className="text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
            پاسخ مدیریت
          </span>
        </div>
        <p className="text-sm text-[var(--color-ink-muted)] leading-[1.8] whitespace-pre-wrap">
          {reply.content}
        </p>
        <p className="text-[11px] text-[var(--color-ink-muted)]/60 mt-1.5">
          {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
        </p>
      </div>
    </div>
  );
}

function CommentItem({ comment, index }: { comment: Comment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="relative bg-[var(--color-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--color-ink)]/[0.04] shadow-[0_2px_16px_-6px_rgba(124,58,237,0.07)] hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.12)] transition-shadow duration-300">
        {/* Subtle accent line */}
        <div className="absolute right-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-soft)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start gap-3.5">
          <InitialAvatar name={comment.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[15px] font-bold text-[var(--color-ink)]">
                {comment.name}
              </span>
              <span className="text-[11px] text-[var(--color-ink-muted)]/60">
                {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
            <p className="mt-2 text-[14px] text-[var(--color-ink-muted)] leading-[1.85] whitespace-pre-line">
              {comment.content}
            </p>
          </div>
        </div>

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-4 mr-10 sm:mr-[52px] rounded-xl bg-[var(--color-bg-soft)]/60 border border-[var(--color-ink)]/[0.03] p-4">
            {comment.replies.map((reply, i) => (
              <ReplyItem key={reply.id} reply={reply} isLast={i === comment.replies.length - 1} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ServiceComments({ serviceId }: ServiceCommentsProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const { data: commentsData } = useServiceComments(serviceId);
  const createComment = useCreateComment();

  const comments = commentsData?.items || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createComment.mutate(
      { name, phone, content, serviceId },
      {
        onSuccess: () => {
          setName("");
          setPhone("");
          setContent("");
        },
      }
    );
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Star className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">
            نظرات کاربران
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-l from-[var(--color-primary)] to-transparent rounded-full" />
          <span className="text-sm text-[var(--color-ink-muted)]">
            {comments.length > 0
              ? `${comments.length} نظر ثبت شده`
              : "اولین نفری باشید که نظر می‌دهید"}
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        onSubmit={handleSubmit}
        className="relative mb-12 rounded-2xl border border-[var(--color-ink)]/[0.04] overflow-hidden"
      >
        {/* Form background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-bg)] to-[var(--color-primary)]/[0.02]" />

        <div className="relative p-6 sm:p-8">
          <h3 className="text-base font-bold text-[var(--color-ink)] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            نظر خود را بنویسید
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wider">
                نام
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="نام خود را وارد کنید"
                required
                className={`w-full px-4 py-3 rounded-xl border bg-[var(--color-bg)] text-[var(--color-ink)] text-sm placeholder:text-[var(--color-ink-muted)]/50 focus:outline-none transition-all duration-200 ${
                  focused === "name"
                    ? "border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/10"
                    : "border-[var(--color-ink)]/8"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wider">
                شماره موبایل
              </label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="09123456789"
                  dir="ltr"
                  required
                  className={`w-full pr-10 pl-4 py-3 rounded-xl border bg-[var(--color-bg)] text-[var(--color-ink)] text-sm placeholder:text-[var(--color-ink-muted)]/50 focus:outline-none transition-all duration-200 text-left ${
                    focused === "phone"
                      ? "border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/10"
                      : "border-[var(--color-ink)]/8"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wider">
              متن نظر
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocused("content")}
              onBlur={() => setFocused(null)}
              placeholder="نظر، پیشنهاد یا تجربه خود را بنویسید..."
              rows={4}
              required
              className={`w-full px-4 py-3 rounded-xl border bg-[var(--color-bg)] text-[var(--color-ink)] text-sm placeholder:text-[var(--color-ink-muted)]/50 focus:outline-none transition-all duration-200 resize-none leading-relaxed ${
                focused === "content"
                  ? "border-[var(--color-primary)]/40 ring-2 ring-[var(--color-primary)]/10"
                  : "border-[var(--color-ink)]/8"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={createComment.isPending}
            className="float-left inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white text-sm font-bold shadow-[0_4px_14px_-3px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {createComment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            ارسال نظر
          </button>
          <div className="clear-both" />
        </div>
      </motion.form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/[0.06] flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-[var(--color-primary)]/30" />
          </div>
          <p className="text-[var(--color-ink-muted)] font-medium mb-1">
            هنوز نظری ثبت نشده
          </p>
          <p className="text-sm text-[var(--color-ink-muted)]/60">
            اولین نفری باشید که نظر می‌دهید
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <CommentItem key={comment.id} comment={comment} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
