"use client";
import { SupportEngineerWithProfile } from "@/entities/support-engineer/model";
import EngineerCard from "./EngineerCard";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

interface EngineerListProps {
  data: SupportEngineerWithProfile[];
}

const EngineerListMobile = ({ data }: EngineerListProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) return null;
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full py-12 text-muted-foreground text-sm">
        Инженеры не найдены
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full p-4">
      {data.map((engineer) => (
        <EngineerCard key={engineer.id} engineer={engineer} />
      ))}
    </div>
  );
};

export default EngineerListMobile;
