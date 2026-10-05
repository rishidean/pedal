import { createContext, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { clearPedalState, loadPedalState, savePedalState } from '../state/pedalStorage';
import { pedalReducer } from '../state/pedalReducer';
import type { Dispatch, ReactNode } from 'react';
import type { PedalEvent, PedalState } from '../state/pedalTypes';

export interface PedalContextValue {
  state: PedalState;
  dispatch: Dispatch<PedalEvent>;
}

export const PedalContext = createContext<PedalContextValue | null>(null);

interface PedalProviderProps {
  children: ReactNode;
}

export function PedalProvider({ children }: PedalProviderProps) {
  const [state, dispatch] = useReducer(pedalReducer, undefined, loadPedalState);
  const persistedStateRef = useRef(state);

  useLayoutEffect(() => {
    if (persistedStateRef.current !== state) {
      if (state.stage === 'destination_entry') {
        clearPedalState();
      } else {
        savePedalState(state);
      }
      persistedStateRef.current = state;
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <PedalContext.Provider value={value}>{children}</PedalContext.Provider>;
}
