import type { ReactNode } from 'react';

interface RiderFrameProps {
  children: ReactNode;
}

export function RiderFrame({ children }: RiderFrameProps) {
  return (
    <main className="rider-frame" aria-label="PEDAL rider experience">
      <div className="rider-surface">{children}</div>
    </main>
  );
}
