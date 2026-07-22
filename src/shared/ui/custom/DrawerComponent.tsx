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

// Твой файл с компонентом DrawerComponent.tsx
type DrawerComponentProps = {
  trigger?: ReactNode;
  open?: boolean; // 🎯 Добавили контролируемый стейт
  onOpenChange?: (open: boolean) => void; // 🎯 Добавили колбэк изменения
  title?: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  side: "top" | "right" | "left" | "bottom";
  showFooter?: boolean;
  className?: string;
};

export const DrawerComponent = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText,
  side = "left",
  showFooter = false,
  className,
}: DrawerComponentProps) => {
  return (
    <Drawer direction={side} open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn(
          "data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=top]:max-h-[90vh]",
          className,
        )}
      >
        {(title || description) && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {description}
            </DrawerDescription>
          </DrawerHeader>
        )}
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
