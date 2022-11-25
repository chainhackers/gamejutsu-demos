import { Header } from 'components';
import React from 'react';
export const Layout = ({ children, version }: { children: React.ReactNode, version?: string }) => {
  return (
    <div>
      <header>
        <Header version={version} />
      </header>
      <main>{children}</main>
    </div>
  );
};
