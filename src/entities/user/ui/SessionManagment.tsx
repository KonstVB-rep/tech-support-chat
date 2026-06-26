import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { TvMinimal } from "lucide-react";
import CardForm from "./CardForm";



const SessionManagment = () => {
  return (
    <CardForm cardTitle="Сессия" cardDescription="Управляйте своим активным сеансом и отменяйте доступ">
        <div className="flex justify-between border  border-muted p-3 rounded-lg">
          <div className="flex gap-1 items-center">
            <TvMinimal /> Текущая сессия
          </div>
          <ButtonSignOut className="bg-inherit p-0 h-auto text-white" />
        </div>
    </CardForm>
  );
};

export default SessionManagment;
