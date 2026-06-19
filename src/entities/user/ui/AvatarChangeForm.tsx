
import { Button } from "@/shared/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import AvatarUser from "./AvatarUser";
import { ButtonEnable2FA } from "@/features/auth-2fa";

const AvatarChangeForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b-blue-200 border-b">
        <CardTitle>Аватар</CardTitle>
        <CardDescription>
          Кликните на аватар чтобы загрузить свою фотографию
        </CardDescription>
        <CardAction>
          <Button className="rounded-full" size="icon">
            <AvatarUser />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <ButtonEnable2FA />
        <Button className="w-fit" type="submit">
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvatarChangeForm;
