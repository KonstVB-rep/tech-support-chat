"use client"
import type { StaffMemberWithProfile } from "@/entities/staff-member/model"
import StaffMemberCard from "./StaffMemder"

interface StaffMemberListProps {
  data: StaffMemberWithProfile[]
}

const StaffMemberListMobile = ({ data }: StaffMemberListProps) => {
  if (data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-12 text-muted-foreground text-sm md:hidden">
        Сотрудники не найдены
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:hidden">
      {data.map((staffMember) => (
        <StaffMemberCard key={staffMember.id} staffMember={staffMember} />
      ))}
    </div>
  )
}

export default StaffMemberListMobile
