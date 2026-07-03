
import { SupportEngineersTable } from "@/widgets/support-engineers-table";
import { getSupportEngineers } from "@/entities/support-engineer"; // 🎯 Наша функция чтения
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer/ui/AddSupportEngineerDialog";

const SupportEngineersPage =  async () => {
  const engineers = await getSupportEngineers();

  return (
    <div className="container py-6 space-y-4 w-full h-full select-none">
      <div className="flex justify-between items-center">
        <WrapperHeaderScreen>Инженеры техподдержки</WrapperHeaderScreen>
        
        <AddSupportEngineerDialog />
      </div>

      <SupportEngineersTable data={engineers} />
    </div>
  );
}
 export default SupportEngineersPage;