import { DataTable } from '@/shared/ui/custom/DataTable';
import WrapperHeaderScreen from '@/shared/ui/custom/WrapperHeaderScreen';


const EmployeeSinglePage = async ({params}: {params: Promise<{empId: string, id: string}>}) => {
  return (
     <div className="flex flex-col w-full h-full">
       <WrapperHeaderScreen><h2 className="text-center font-semibold uppercase w-full">Сотрудник</h2></WrapperHeaderScreen>
     </div>
  )
}

export default EmployeeSinglePage