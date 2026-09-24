export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote data-reveal="fade" className="my-block border-l-2 border-clay/60 pl-8">
      <p className="type-lead text-ink">
        “{children}”
      </p>
    </blockquote>
  );
}
