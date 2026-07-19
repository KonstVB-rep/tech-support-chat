// src/shared/ui/fixed-wrapper.tsx
import { cn } from "@/shared/lib/utils";

const FixedWrapper = ({
  className = "bottom-10 left-1/2 -translate-x-1/2",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "fixed z-50 p-4 rounded-xl bg-zinc-900 border border-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FixedWrapper;
