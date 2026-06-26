
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import CardForm from "./CardForm";

const NameChangeForm = () => {


  return (
    <CardForm cardTitle="Имя" cardDescription="Введите свое полное имя или отображаемое имя">
      <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" placeholder="Name" required type="text" />
            </div>
          </div>
        </form>
    </CardForm>
  );
};

export default NameChangeForm;
