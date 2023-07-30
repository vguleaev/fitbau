import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { BottomNav } from './bottom-nav';
import { Drawer } from './drawer';

type ComponentProps = {
  page: string;
  children: ReactNode;
};

export default function Layout({ children, page }: ComponentProps) {
  return (
    <div>
      <Navbar />
      <Drawer>
        <div>{children}</div>
      </Drawer>
      <BottomNav page={page} />
    </div>
  );
}
