"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  registerTab: (id: string) => void;
  onTabChange?: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ defaultValue, children, className, onTabChange }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultValue);
  const tabsRef = useRef<string[]>([]);

  const registerTab = useCallback((id: string) => {
    if (!tabsRef.current.includes(id)) {
      tabsRef.current.push(id);
    }
  }, []);

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
      onTabChange?.(id);
    },
    [onTabChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab, onTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { activeTab, setActiveTab } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabsRef.current.indexOf(activeTab);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (e.key === "ArrowRight") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabsRef.current.length - 1;
      } else {
        nextIndex = currentIndex < tabsRef.current.length - 1 ? currentIndex + 1 : 0;
      }
      setActiveTab(tabsRef.current[nextIndex]);
      const buttons = listRef.current?.querySelectorAll("[role=tab]");
      (buttons?.[nextIndex] as HTMLElement)?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex gap-1 p-1 bg-[var(--color-bg-soft)] rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab, registerTab } = useTabs();

  useEffect(() => {
    registerTab(value);
  }, [value, registerTab]);

  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-xl transition-all",
        isActive
          ? "bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return (
    <div role="tabpanel" className={cn("mt-4", className)}>
      {children}
    </div>
  );
}
