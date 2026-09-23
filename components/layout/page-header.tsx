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
      {eyebrow ? <p className="label-caps text-stone nums">{eyebrow}</p> : null}
      <h1 className="title-page text-ink mt-2">
        {title}
      </h1>
      {lede ? (
        <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-base md:text-[1.0625rem] leading-[1.55] mt-3 max-w-2xl">
          {lede}
        </p>
      ) : null}
      {actions ? <div className="mt-6">{actions}</div> : null}
    </div>
  );
}
