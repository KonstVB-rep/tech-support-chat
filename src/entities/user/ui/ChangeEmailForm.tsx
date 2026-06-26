
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const ChangeEmailForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="border-b-blue-200 border-b">
        <CardTitle>Изменить адрес электронной почты</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Электронная почта</Label>
              <Input id="email" placeholder="Name" required type="text" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <ButtonSubmitForm
          className="w-fit"
          text="Обновить электронную почту"
          title="Обновить электронную почту"
        />
      </CardFooter>
    </Card>
  );
};

export default ChangeEmailForm;
