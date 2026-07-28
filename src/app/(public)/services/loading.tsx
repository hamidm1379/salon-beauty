import { Container } from "@/components/ui/Layout";

export default function ServicesLoading() {
  return (
    <Container className="py-24">
      <div className="text-center mb-12">
        <div className="h-10 bg-[var(--color-bg-soft)] rounded-2xl w-48 mx-auto animate-pulse" />
        <div className="h-5 bg-[var(--color-bg-soft)] rounded-xl w-96 max-w-full mx-auto mt-4 animate-pulse" />
      </div>

      <div className="flex gap-4 mb-10">
        <div className="h-12 bg-[var(--color-bg-soft)] rounded-2xl flex-1 animate-pulse" />
        <div className="h-12 bg-[var(--color-bg-soft)] rounded-2xl w-48 animate-pulse" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="h-48 bg-[var(--color-bg-soft)] animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-[var(--color-bg-soft)] rounded-full w-20 animate-pulse" />
              <div className="h-5 bg-[var(--color-bg-soft)] rounded-xl w-3/4 animate-pulse" />
              <div className="h-3 bg-[var(--color-bg-soft)] rounded-xl w-full animate-pulse" />
              <div className="h-3 bg-[var(--color-bg-soft)] rounded-xl w-2/3 animate-pulse" />
              <div className="flex justify-between pt-4 border-t border-[var(--color-ink)]/5">
                <div className="h-6 bg-[var(--color-bg-soft)] rounded-xl w-16 animate-pulse" />
                <div className="h-4 bg-[var(--color-bg-soft)] rounded-xl w-20 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
