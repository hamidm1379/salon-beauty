import { Container } from "@/components/ui/Layout";

export default function ServiceDetailLoading() {
  return (
    <Container className="py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="aspect-[4/3] bg-[var(--color-bg-soft)] rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-[var(--color-bg-soft)] rounded-full w-24 animate-pulse" />
          <div className="h-10 bg-[var(--color-bg-soft)] rounded-2xl w-3/4 animate-pulse" />
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-[var(--color-bg-soft)] rounded-xl w-full animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-soft)] rounded-xl w-5/6 animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-soft)] rounded-xl w-4/6 animate-pulse" />
          </div>
          <div className="flex gap-6 mt-8">
            <div className="h-8 bg-[var(--color-bg-soft)] rounded-xl w-24 animate-pulse" />
            <div className="h-8 bg-[var(--color-bg-soft)] rounded-xl w-28 animate-pulse" />
          </div>
          <div className="h-12 bg-[var(--color-bg-soft)] rounded-2xl w-full sm:w-48 mt-8 animate-pulse" />
        </div>
      </div>
    </Container>
  );
}
