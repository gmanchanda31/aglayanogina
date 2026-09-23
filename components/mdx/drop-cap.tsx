export function DropCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="float-left mr-3 mt-1 font-[family-name:var(--font-vollkorn)] text-[3.75rem] leading-[0.82] tracking-tight text-ink select-none">
      {children}
    </span>
  );
}
