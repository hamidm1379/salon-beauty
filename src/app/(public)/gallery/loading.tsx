import { Container } from "@/components/ui/Layout";

export default function GalleryLoading() {
  return (
    <Container className="py-24">
      <div className="text-center mb-12">
        <div className="h-10 bg-[var(--color-bg-soft)] rounded-2xl w-32 mx-auto animate-pulse" />
        <div className="h-5 bg-[var(--color-bg-soft)] rounded-xl w-80 max-w-full mx-auto mt-4 animate-pulse" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-[var(--color-bg-soft)] rounded-3xl animate-pulse"
          />
        ))}
      </div>
    </Container>
  );
}
