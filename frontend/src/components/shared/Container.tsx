import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Container({ className, children, as: Component = "div", ...props }: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-(--container-2xl) px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
