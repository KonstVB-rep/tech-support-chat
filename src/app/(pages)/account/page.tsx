import { Suspense } from "react";
import { AccountClient } from "./AccountClient";

const AccountPage = () => {
  return (
    <Suspense fallback={"Загрузка..."}>
      <AccountClient />
    </Suspense>
  );
};

export default AccountPage;
