import { useEffect, useRef } from 'react';
import { usePedal } from '../app/usePedal';
import { matchingDelayMilliseconds } from '../data/pedalFixtures';

export function useMatchingAssignment() {
  const { state, dispatch } = usePedal();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.stage !== 'matching') {
      return undefined;
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      dispatch({ type: 'ASSIGN_DRIVER' });
    }, matchingDelayMilliseconds);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dispatch, state.stage]);
}
