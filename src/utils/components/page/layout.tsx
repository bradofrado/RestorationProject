import React from 'react';
import { Navbar } from '~/utils/components/page/navbar';

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <div className="container mx-auto flex h-full flex-1 flex-col px-4">
        <Navbar />
        {children}
      </div>
    </>
  );
};
