import React from "react";

const WrapperHeaderScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center p-4 text-primary shadow-md m-0 sticky top-0 z-50">
      {children}
    </div>
  );
};

export default WrapperHeaderScreen;
