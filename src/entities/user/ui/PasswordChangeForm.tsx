import ButtonSubmitForm from "@/shared/ui/ButtonSubmitForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const PasswordChangeForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b-blue-200 border-b">
        <CardTitle>Изменить пароль</CardTitle>
        <CardDescription>
          Введите ваш текущий пароль и новый пароль.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <ButtonSubmitForm
          className="w-fit"
          text="Сохранение"
          title="Сохранить"
        />
      </CardFooter>
    </Card>
  );
};

export default PasswordChangeForm;
