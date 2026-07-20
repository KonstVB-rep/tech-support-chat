// src/shared/ui/custom/Loader.tsx
"use client";

import { FC } from "react";

const Loader: FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
