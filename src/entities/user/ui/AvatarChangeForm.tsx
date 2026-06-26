
import { ButtonEnable2FA } from "@/features/auth-2fa";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import AvatarUser from "./AvatarUser";
import CardForm from "./CardForm";

const AvatarChangeForm = () => {
  return (

<CardForm  cardTitle="Аватар" cardDescription="Кликните на аватар чтобы загрузить свою фотографию" footerChildren={<ButtonEnable2FA />} cardAction={<Button className="rounded-full" size="icon"><AvatarUser /></Button>}>
  <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>
          </div>
        </form>
</CardForm>
  );
};

export default AvatarChangeForm;
