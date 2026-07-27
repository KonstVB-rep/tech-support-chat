import { AccountClient } from "@/app/(pages)/account/AccountClient";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";

const AccountPage = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <AccountClient />
    </Suspense>
  );
};

export default AccountPage;

const Skeleton = () => {
  return (
    <aside className="w-full flex flex-col justify-between md:justify-start md:w-80 h-dvh shrink-0 bg-sidebar border-r border-border/40">
      <div className="h-14 shrink-0 flex items-center p-2 justify-center md:justify-start">
        <div className="h-6 w-28 bg-muted rounded-md md:ml-2" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-2 p-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full flex items-center justify-start h-12 border border-border/10 rounded-lg"
          >
            <div className="h-10 w-10 bg-muted rounded-md shrink-0" />
            <div className="h-10 bg-muted rounded-md ml-2 flex-1 max-w-full" />
            <ChevronRight className="h-4 w-4 text-muted/30 shrink-0" />
          </div>
        ))}
      </div>
    </aside>
  );
};
