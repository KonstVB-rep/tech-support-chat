"use client"

const StaffMemberLoading = () => {
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
        <div className="h-9 w-44 rounded-lg bg-muted" />

        <div className="hidden w-full overflow-hidden rounded-xl border border-border/40 bg-background/50 md:block">
          <div className="flex h-12 items-center justify-between gap-4 border-border/40 border-b bg-muted/20 px-4">
            <div className="h-4 w-4 rounded-sm bg-muted" />
            <div className="h-4 w-28 rounded-md bg-muted" />
            <div className="h-4 w-36 rounded-md bg-muted" />
            <div className="h-4 w-24 rounded-md bg-muted" />
            <div className="h-4 w-12 rounded-md bg-muted" />
          </div>

          <div className="divide-y divide-border/30">
            {[1, 2, 3, 4, 5].map((i) => (
              <div className="flex h-14 items-center justify-between gap-4 px-4" key={i}>
                <div className="h-4 w-4 rounded-sm bg-muted/60" />
                <div className="h-4 w-32 rounded-md bg-muted/60" />
                <div className="h-4 w-44 rounded-md bg-muted/60" />
                <div className="h-4 w-20 rounded-md bg-muted/60" />
                <div className="h-8 w-8 rounded-full bg-muted/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="block w-full md:hidden">
          <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                className="relative mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-background p-4 text-center shadow-xl"
                key={i}
              >
                <div className="mt-4 h-16 w-16 shrink-0 rounded-full border-2 border-border bg-muted" />

                <div className="mt-4 flex w-full flex-col items-center gap-2">
                  <div className="h-5 w-28 rounded-md bg-muted" />

                  <div className="h-4 w-40 rounded-md bg-muted/70" />
                </div>

                <div className="mt-5 flex w-full items-center justify-center">
                  <div className="h-9 w-28 shrink-0 rounded-3xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffMemberLoading
