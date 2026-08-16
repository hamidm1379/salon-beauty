"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Settings,
  Users,
  FileText,
  Mail,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useAuth } from "@/hooks/use-auth";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "نوبت‌ها", icon: CalendarDays },
  { href: "/admin/services", label: "سرویس‌ها", icon: Settings },
  { href: "/admin/gallery", label: "گالری", icon: Image },
  { href: "/admin/blog", label: "بلاگ", icon: FileText },
  { href: "/admin/contacts", label: "پیام‌ها", icon: Mail },
  { href: "/admin/comments", label: "نظرات", icon: MessageSquare },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

interface SidebarContentProps {
  collapsed: boolean;
  onLinkClick: () => void;
  user: { name: string; role: string } | undefined;
  logout: () => void;
}

function SidebarContent({ collapsed, onLinkClick, user, logout }: SidebarContentProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--color-ink)]/10">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-[var(--color-ink)]">
                مدیریت
              </span>
            )}
          </Link>
          <button
            onClick={onLinkClick}
            className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-bg-soft)] transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5 text-[var(--color-ink-muted)]" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--color-ink)]/10">
        {user && (
          <div className={cn("flex items-center gap-3 mb-4", collapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-primary)] font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-ink)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {user.role === "ADMIN" ? "مدیر" : "ویرایشگر"}
                </p>
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>خروج</span>}
        </Button>
      </div>
    </div>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 right-0 z-40 bg-[var(--color-bg)] border-l border-[var(--color-ink)]/10 transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onLinkClick={() => {}}
          user={user}
          logout={logout}
        />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        side="right"
        className="p-0"
      >
        <SidebarContent
          collapsed={false}
          onLinkClick={() => setSidebarOpen(false)}
          user={user}
          logout={logout}
        />
      </Drawer>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:mr-20" : "lg:mr-64"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-ink)]/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronLeft
                  className={cn(
                    "w-5 h-5 transition-transform",
                    collapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                <CalendarDays className="w-4 h-4" />
                {new Date().toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                {new Date().toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">ورود به سایت</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
