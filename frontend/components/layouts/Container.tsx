import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children?: any;
}

function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl xl:max-w-[1130px] px-4 sm:px-6 lg:px-8 py-24 sm:py-30",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Container;
