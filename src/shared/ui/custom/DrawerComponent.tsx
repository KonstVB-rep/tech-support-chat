"use client"


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer"
import { Button } from "../button"
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery"

type DrawerComponentProps = {
  buttonTriggerInnerContent?: React.ReactNode
  title?: string
  description?: string
  children: React.ReactNode
  submitText?: string
  side: "top" | "right" | "left" | "bottom",
  showFooter?: boolean
}

export const DrawerComponent = ({buttonTriggerInnerContent,title,description,children, submitText, side = "left", showFooter= false}: DrawerComponentProps) => {
 const isDekstop = useMediaQuery("(max-width: 768px)")

  return (

        <Drawer
          direction={side}
        >
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {buttonTriggerInnerContent}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              <DrawerDescription className="sr-only">
               {description}
              </DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4 flex flex-col gap-3">
              {children}
            </div>
            {showFooter && <DrawerFooter className="mt-0">
              <Button>{submitText}</Button>
              <DrawerClose asChild>
                <Button variant="outline">Закрыть</Button>
              </DrawerClose>
            </DrawerFooter>}
          </DrawerContent>
        </Drawer>
  )
}
