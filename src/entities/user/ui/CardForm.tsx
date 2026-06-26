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

type CardFormProps = {
  cardTitle: string | React.ReactNode;
  cardDescription: string;
  children?: React.ReactNode;
  buttonTitle?: string;
  footerChildren?: React.ReactNode
  cardAction?: React.ReactNode
};


const CardForm = ({cardTitle, cardDescription, children, buttonTitle = "Сохранить", footerChildren, cardAction}: CardFormProps) => {
  return (
       <Card className="w-full max-w-md">
          <CardHeader className="border-b-blue-200 border-b">
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>
              {cardDescription}
            </CardDescription>
            {cardAction && <CardAction>{cardAction}</CardAction>}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {footerChildren}
            <Button className="w-fit" type="submit" title={buttonTitle}>
              {buttonTitle}
            </Button>
          </CardFooter>
        </Card>
  )
}

export default CardForm