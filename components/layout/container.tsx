import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main" | "article" | "header" | "footer" | "nav";
}

export function Container({
  as: As = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <As
      className={cn("mx-auto w-full max-w-[1200px] px-6 sm:px-8", className)}
      {...props}
    >
      {children}
    </As>
  );
}
