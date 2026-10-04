import { useContext } from 'react';
import { PedalContext } from './PedalProvider';
import type { PedalContextValue } from './PedalProvider';

export function usePedal(): PedalContextValue {
  const context = useContext(PedalContext);
  if (context === null) {
    throw new Error('usePedal must be used within a PedalProvider.');
  }

  return context;
}
