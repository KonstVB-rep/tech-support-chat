"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import { Button } from "../button";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

type DrawerComponentProps = {
  trigger?: ReactNode
  buttonTriggerInnerContent?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  side: "top" | "right" | "left" | "bottom";
  showFooter?: boolean;
  className?:string
};

export const DrawerComponent = ({
  trigger,
  buttonTriggerInnerContent,
  title,
  description,
  children,
  submitText,
  side = "left",
  showFooter = false,
  className
}: DrawerComponentProps) => {
  // const isDekstop = useMediaQuery("(max-width: 768px)");

  return (
    <Drawer direction={side}>
      <DrawerTrigger asChild>
       {trigger ?? (
          <Button variant="outline" className="capitalize">
            {buttonTriggerInnerContent}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className={cn("data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]", className)}>
       {(title || description) && <DrawerHeader>
         <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>}
          {children}
        {showFooter && (
          <DrawerFooter className="mt-0">
            <Button>{submitText}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
