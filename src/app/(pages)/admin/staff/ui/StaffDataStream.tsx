import { getStaffMembers } from "@/entities/staff-member/api/getStaffMembers"
import StaffMemberListMobile from "@/entities/staff-member/ui/StaffMemberListMobile"
import { StaffMembersTable } from "@/widgets/staff-memders-table"

const StaffDataStream = async () => {
  const staffMembers = await getStaffMembers()
  return (
    <>
      <div className="hidden h-full w-full md:block">
        <StaffMembersTable data={staffMembers} />
      </div>

      <div className="block w-full md:hidden">
        <StaffMemberListMobile data={staffMembers} />
      </div>
    </>
  )
}

export default StaffDataStream
