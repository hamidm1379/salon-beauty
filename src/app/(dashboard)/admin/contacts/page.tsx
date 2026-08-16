"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  Phone,
  User,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import {
  useContactMessages,
  useMarkAsRead,
  useDeleteContactMessage,
} from "@/hooks/use-contact";

export default function AdminContactsPage() {
  const [page, setPage] = useState(1);
  const [filterRead, setFilterRead] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    messageId: string | null;
  }>({ open: false, messageId: null });

  const { data: messagesData, isLoading } = useContactMessages({
    isRead: filterRead === "read" ? true : filterRead === "unread" ? false : undefined,
    page,
    limit: 10,
  });

  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteContactMessage();

  const messages = messagesData?.items || [];
  const totalPages = messagesData?.totalPages || 1;

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({ open: true, messageId: id });
  };

  const confirmDelete = () => {
    if (!confirmModal.messageId) return;
    deleteMessage.mutate(confirmModal.messageId);
    setConfirmModal({ open: false, messageId: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">پیام‌های تماس</h1>
        <div className="text-sm text-[var(--color-ink-muted)]">
          کل: {messagesData?.total || 0} پیام
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 max-sm:p-1.25">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilterRead("");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !filterRead
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
              }`}
            >
              همه
            </button>
            <button
              onClick={() => {
                setFilterRead("unread");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterRead === "unread"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
              }`}
            >
              خوانده نشده
            </button>
            <button
              onClick={() => {
                setFilterRead("read");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterRead === "read"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
              }`}
            >
              خوانده شده
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-[var(--color-ink-muted)]">پیامی یافت نشد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={message.isRead ? "" : "border-l-4 border-l-[var(--color-primary)]"}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Contact Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" />
                          <span className="font-medium text-[var(--color-ink)]">
                            {message.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" />
                          <a
                            href={`mailto:${message.email}`}
                            className="text-sm text-[var(--color-primary)] hover:underline truncate"
                          >
                            {message.email}
                          </a>
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" />
                            <a
                              href={`tel:${message.phone}`}
                              className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                              {message.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Subject */}
                      {message.subject && (
                        <h3 className="font-medium text-[var(--color-ink)] mb-2">
                          {message.subject}
                        </h3>
                      )}

                      {/* Message */}
                      <p className="text-[var(--color-ink-muted)] mb-3 text-sm leading-relaxed">
                        {message.message}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(message.createdAt).toLocaleDateString("fa-IR")}
                        </div>
                        <Badge variant={message.isRead ? "success" : "warning"}>
                          {message.isRead ? "خوانده شده" : "خوانده نشده"}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-2 sm:mr-4">
                      {!message.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(message.id)}
                          title="علامت خوانده شده"
                        >
                          <MailOpen className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="حذف پیام"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Confirm Delete Modal */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, messageId: null })}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">
            حذف پیام
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
            آیا از حذف این پیام اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, messageId: null })}
            >
              انصراف
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
              isLoading={deleteMessage.isPending}
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
