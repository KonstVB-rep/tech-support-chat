import React from "react";

const WrapperHeaderScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center g-primary-foreground p-4 text-primary shadow-[5px_0_5px_0_gray] m-0 sticky top-0 z-50">
      {children}
    </div>
  );
};

export default WrapperHeaderScreen;
