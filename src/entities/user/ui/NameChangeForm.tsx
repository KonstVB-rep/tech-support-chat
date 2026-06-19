
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

const NameChangeForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b-blue-200 border-b">
        <CardTitle>Имя</CardTitle>
        <CardDescription>
          Введите свое полное имя или отображаемое имя
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" placeholder="Name" required type="text" />
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

export default NameChangeForm;
