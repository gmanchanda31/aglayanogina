export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote data-reveal="fade" className="my-12 border-l-2 border-clay/60 pl-8">
      <p className="type-lead italic text-ink">
        “{children}”
      </p>
    </blockquote>
  );
}
