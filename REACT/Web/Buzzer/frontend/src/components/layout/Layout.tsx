import type { ReactElement, ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  isHeaderFixed?: boolean;
}

export function Layout({ children, isHeaderFixed = true }: LayoutProps): ReactElement {
  return (
    <div className="h-screen bg-bg-primary relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="fixed inset-0 tech-grid pointer-events-none" />

      {/* Header */}
      <Header isFixed={isHeaderFixed} />

      {/* Main Content */}
      <main className={`relative z-10 ${
        isHeaderFixed ? 'h-[calc(100vh-4rem)] md:mt-0' : 'h-full'
      } overflow-y-auto`}>
        <div className="max-w-[1400px] mx-auto px-6 py-8 pb-12 md:pb-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
