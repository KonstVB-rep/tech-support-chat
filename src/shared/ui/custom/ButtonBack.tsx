"use client";

import { Button } from "@/shared/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ButtonBack = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0"
      type="button"
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
};

export default ButtonBack;
