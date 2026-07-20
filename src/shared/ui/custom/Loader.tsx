// src/shared/ui/custom/Loader.tsx
"use client";

import { FC } from "react";

const LoaderGlobal: FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

const Loader = {
  global: LoaderGlobal,
};
export default Loader;