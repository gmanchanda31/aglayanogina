export function DropCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="float-left mr-3 mt-1 font-[family-name:var(--font-vollkorn)] text-[5.5rem] leading-[0.85] tracking-tight text-ink select-none">
      {children}
    </span>
  );
}
