import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { TvMinimal } from "lucide-react";



const SessionManagment = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b-blue-200 border-b">
        <CardTitle>Сессия</CardTitle>
        <CardDescription>
          Управляйте своим активным сеансом и отменяйте доступ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between border  border-muted p-3 rounded-lg">
          <div className="flex gap-1 items-center">
            <TvMinimal /> Текущая сессия
          </div>
          <ButtonSignOut className="bg-inherit p-0 h-auto text-white" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button className="w-fit" type="submit">
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionManagment;
