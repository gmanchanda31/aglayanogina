export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-12 border-l-2 border-clay/60 pl-8">
      <p className="font-[family-name:var(--font-vollkorn)] italic text-[1.625rem] md:text-[1.875rem] leading-[1.4] text-clay">
        “{children}”
      </p>
    </blockquote>
  );
}
