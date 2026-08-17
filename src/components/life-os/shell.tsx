import React from 'react';

export function LifeOSShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 pb-24 md:pb-12">
      {children}
    </main>
  );
}

export { LifeOSShell as Shell };
export default LifeOSShell;
