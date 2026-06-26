import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import CardForm from "./CardForm";

const PasswordChangeForm = () => {
  return (
    <CardForm cardTitle="Изменить пароль" cardDescription="Введите ваш текущий пароль и новый пароль.">
            <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Текущий пароль</Label>
              <Input id="current_password" placeholder="" required type="password" />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="new_password">Новый пароль</Label>
              <Input id="new_password" placeholder="" required type="password" />
            </div>
          </div>
        </form>
    </CardForm>
  );
};

export default PasswordChangeForm;
