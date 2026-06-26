'use client';

import { useGetOrganizations } from '@/entities/organization/api/useGetOrganizations';
import { DataTable } from '@/shared/ui/custom/DataTable';
import { columns } from './columns';

const OrganizationsTable = () => {

  const {data = [], isLoading} = useGetOrganizations();

  if (isLoading) {
    return <p>Загрузка...</p>
  }
  return (
    <DataTable columns={columns} data={data} />
  )
}

export default OrganizationsTable