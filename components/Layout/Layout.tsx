import React from 'react';
// import { Header } from 'components';
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        {/* <Header><Navigation /></Header> */}
      </header>
      <main>{children}</main>
    </div>
  );
};
