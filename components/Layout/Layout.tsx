import { Header } from 'components';
import React from 'react';
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>{children}</main>
    </div>
  );
};
