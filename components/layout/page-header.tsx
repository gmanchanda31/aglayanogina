import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="label-caps text-stone">{eyebrow}</p> : null}
      <h1
        className={cn(
          "font-[family-name:var(--font-vollkorn)] tracking-tight text-ink leading-[1] mt-3",
          "text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem]",
        )}
      >
        {title}
      </h1>
      {lede ? (
        <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl md:text-2xl leading-[1.45] mt-6 max-w-2xl">
          {lede}
        </p>
      ) : null}
      {actions ? <div className="mt-8">{actions}</div> : null}
    </div>
  );
}
