

'use client';

import { DataTable } from '@/shared/ui/custom/DataTable';
import { OrgRole } from '@prisma/client';
import { columns } from './columns';
import { EmployeeWithProfile } from '@/entities/employee';



const EmployessTable = ({data}:{ data: EmployeeWithProfile[]}) => {

  return (
     <DataTable columns={columns} data={data ?? []} getRowClassName={(row) =>
             row.role === OrgRole.RESPONSIBLE
               ? "shadow-[0_0_0_3px_#1e40af]"
               : ""
           }/>
  )
}

export default EmployessTable