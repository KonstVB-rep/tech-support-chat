import { DataTable } from '@/shared/ui/custom/DataTable';
import WrapperHeaderScreen from '@/shared/ui/custom/WrapperHeaderScreen';

import CompanyCard from './ui/CompanyCard';
import Profile from './ui/Profile';
import { EmployessTable } from '@/widgets/employees-table';


const Account = () => {
  return (
     <div className="flex flex-col w-full h-full">
        <WrapperHeaderScreen>Аккаунт</WrapperHeaderScreen>
        <div className='overflow-y-auto space-y-10'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-[2dvh]">
               <Profile/>
               <CompanyCard />
            </div>
            <EmployessTable />
        </div>
     </div>

  )
}

export default Account