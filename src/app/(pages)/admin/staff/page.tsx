
import { SupportEngineersTable } from "@/widgets/support-engineers-table";
import { getSupportEngineers } from "@/entities/support-engineer"; // 🎯 Наша функция чтения
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer/ui/AddSupportEngineerDialog";

const SupportEngineersPage =  async () => {
  const engineers = await getSupportEngineers();

  return (
    <div className="py-6 space-y-4 w-full h-full">
      <WrapperHeaderScreen><h2 className="text-center font-semibold uppercase w-full">Инженеры техподдержки</h2></WrapperHeaderScreen>
      <div className="grid gap-2 p-2">
        
        <AddSupportEngineerDialog />
        <SupportEngineersTable data={engineers} />
      </div>


    </div>
  );
}
 export default SupportEngineersPage;