import { ReactNode } from 'react';
import Header from './Header';
import AlternateHeader from './AlternateHeader'; // If you have multiple header styles

interface LayoutProps {
  children: ReactNode;
  headerType?: 'default' | 'alternate'; // Add more types if needed
}

export default function Layout({ children, headerType = 'default' }: LayoutProps) {
  return (
    <>
      {headerType === 'default' && <Header />}
      {headerType === 'alternate' && <AlternateHeader />}
      <main>{children}</main>
    </>
  );
}
