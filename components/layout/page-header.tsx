import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  lede?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  lede,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <h1 className="type-title text-ink">
        {title}
      </h1>
      {lede ? (
        <p className="type-lead text-ink mt-tight max-w-2xl">
          {lede}
        </p>
      ) : null}
      {actions ? <div className="mt-block">{actions}</div> : null}
    </div>
  );
}
