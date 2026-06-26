import Link from "next/link"

export const SidebarSettingsList = () => {
  return(
    <div className="flex-1 overflow-y-auto">
      <Link href="/account" className="flex items-center justify-start flex-1 py-3 px-2">
        <p className="text-xs text-muted-foreground">Аккаунт</p>
      </Link>

      <Link href="organizations" className="flex items-center justify-start flex-1 py-3 px-2">
        <p className="text-xs text-muted-foreground">Клиенты</p>
      </Link>
  
    </div>
  )
}
