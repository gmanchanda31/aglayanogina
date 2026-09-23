export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote data-reveal="fade" className="my-12 border-l-2 border-clay/60 pl-8">
      <p className="font-[family-name:var(--font-vollkorn)] italic text-[1.25rem] md:text-[1.375rem] leading-[1.5] text-ink">
        “{children}”
      </p>
    </blockquote>
  );
}
