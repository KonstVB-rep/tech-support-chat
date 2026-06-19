import { Button } from "@/shared/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";

const AccountDelForm = () => {
  return (
    <Card className="w-full max-w-sm border-red-950 border">
      <CardHeader className="border-b-red-950 border-b">
        <CardTitle>Удалить аккаунт</CardTitle>
        <CardDescription>
          Удалитm навсегда свою учетную запись и все ее содержимое. Данное
          действия необратимо, поэтому,пожалуйста, будьте осторожны
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-end gap-2 bg-red-950/20">
        <Button className="w-fit" type="submit">
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountDelForm;
