"use client"
import type { SupportEngineerWithProfile } from "@/entities/support-engineer/model"
import EngineerCard from "./EngineerCard"

interface EngineerListProps {
  data: SupportEngineerWithProfile[]
}

const EngineerListMobile = ({ data }: EngineerListProps) => {
  if (data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-12 text-muted-foreground text-sm md:hidden">
        Инженеры не найдены
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:hidden">
      {data.map((engineer) => (
        <EngineerCard engineer={engineer} key={engineer.id} />
      ))}
    </div>
  )
}

export default EngineerListMobile
