import { Suspense } from "react"
import { ChevronRight } from "lucide-react"
import { AccountClient } from "@/app/(pages)/account/ui/AccountClient"

const AccountPage = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <AccountClient />
    </Suspense>
  )
}

export default AccountPage

const Skeleton = () => {
  return (
    <aside className="flex h-dvh w-full shrink-0 flex-col justify-between border-border/40 border-r bg-sidebar md:w-80 md:justify-start">
      <div className="flex h-14 shrink-0 items-center justify-center p-2 md:justify-start">
        <div className="h-6 w-28 rounded-md bg-muted md:ml-2" />
      </div>

      <div className="min-h-0 w-full flex-1 space-y-2 overflow-y-auto p-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            className="flex h-12 w-full items-center justify-start rounded-lg border border-border/10"
            key={i}
          >
            <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
            <div className="ml-2 h-10 max-w-full flex-1 rounded-md bg-muted" />
            <ChevronRight className="h-4 w-4 shrink-0 text-muted/30" />
          </div>
        ))}
      </div>
    </aside>
  )
}
