"use client"

const OrganizationsLoading = () => {
  return (
    <div className="h-full w-full animate-pulse select-none space-y-3">
      <div className="flex h-14 w-full shrink-0 items-center border-border/40 border-b bg-background">
        <div className="flex w-full items-center justify-between px-4">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-muted" />
          <div className="h-5 w-48 rounded-md bg-muted" />
          <div className="w-8 shrink-0" />
        </div>
      </div>

      <div className="grid w-full gap-2 p-2">
        <div className="h-9 w-48 rounded-lg bg-muted" />

        <div className="hidden w-full overflow-hidden rounded-xl border border-border/40 bg-background/50 md:block">
          <div className="flex h-12 items-center justify-between gap-2 border-border/40 border-b bg-muted/20 px-4 text-xs">
            <div className="h-4 w-4 shrink-0 rounded-sm bg-muted" />
            <div className="h-4 w-28 flex-1 rounded-md bg-muted" />
            <div className="h-4 w-20 w-24 shrink-0 rounded-md bg-muted" />
            <div className="h-4 w-36 flex-1 rounded-md bg-muted" />
            <div className="h-4 w-24 w-28 shrink-0 rounded-md bg-muted" />
            <div className="h-4 w-20 w-24 shrink-0 rounded-md bg-muted" />
            <div className="h-4 w-20 w-24 shrink-0 rounded-md bg-muted" />
            <div className="h-4 w-20 w-24 shrink-0 rounded-md bg-muted" />
            <div className="h-4 w-12 w-8 shrink-0 rounded-md bg-muted" />
          </div>

          <div className="divide-y divide-border/30">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="flex h-14 items-center justify-between gap-2 px-4" key={i}>
                <div className="h-4 w-4 shrink-0 rounded-sm bg-muted/60" />
                <div className="h-4 w-32 flex-1 rounded-md bg-muted/60" />
                <div className="h-4 w-24 w-24 shrink-0 rounded-md bg-muted/60" />
                <div className="h-4 w-48 flex-1 rounded-md bg-muted/50" />
                <div className="h-4 w-20 w-28 shrink-0 rounded-md bg-muted/60" />
                <div className="h-4 w-16 w-24 shrink-0 rounded-md bg-muted/60" />
                <div className="h-4 w-16 w-24 shrink-0 rounded-md bg-muted/60" />
                <div className="h-4 w-16 w-24 shrink-0 rounded-md bg-muted/60" />
                <div className="h-8 w-12 w-8 shrink-0 rounded-full bg-muted/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="block flex max-h-[81dvh] w-full flex-col md:hidden">
          <div className="w-full border-b bg-background p-4 pb-2">
            <div className="h-10 w-full rounded-md bg-muted" />
          </div>

          <div className="grid gap-4 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                className="grid w-full overflow-hidden rounded-xl border border-border/50 bg-muted shadow-md"
                key={i}
              >
                <div className="grid gap-2 border-b bg-zinc-300/50 p-4 text-center dark:bg-zinc-800/50">
                  <div className="mx-auto h-5 w-40 rounded-md bg-muted" />
                  <div className="mx-auto h-4 w-28 rounded-md bg-muted/80" />
                </div>

                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="grid gap-2 rounded-xl bg-background/30 p-2">
                    <div className="h-3 w-24 rounded-sm bg-muted/60" />
                    <div className="h-4 w-20 rounded-sm bg-muted" />
                    <div className="h-3 w-24 rounded-sm bg-muted/60" />
                    <div className="h-4 w-16 rounded-sm bg-muted" />
                  </div>
                  <div className="grid content-baseline gap-2 rounded-xl bg-background/30 p-2">
                    <div className="h-3 w-24 rounded-sm bg-muted/60" />
                    <div className="h-4 w-28 rounded-sm bg-muted" />
                  </div>
                </div>

                <div className="mx-2 grid gap-2 rounded-xl bg-background/20 p-2">
                  <div className="h-3 w-16 rounded-sm bg-muted/60" />
                  <div className="h-4 w-full rounded-sm bg-muted" />
                </div>

                <div className="grid items-center justify-items-center gap-3 rounded-xl p-2">
                  <div className="flex w-full flex-col items-center gap-1.5">
                    <div className="h-3 w-28 rounded-sm bg-muted/60" />
                    <div className="h-4 w-3/4 rounded-sm bg-muted" />
                  </div>
                  <div className="flex w-full flex-col items-center gap-1.5">
                    <div className="h-3 w-28 rounded-sm bg-muted/60" />
                    <div className="h-4 w-2/3 rounded-sm bg-muted" />
                  </div>
                </div>

                <div className="border-border/40 border-t bg-background/40 px-3 py-2">
                  <div className="field-height h-10 w-full rounded-md bg-muted/80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationsLoading
