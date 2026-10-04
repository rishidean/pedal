import type { PedalState } from './pedalTypes';

export function createInitialPedalState(): PedalState {
  return {
    version: 1,
    stage: 'destination_entry',
    pickupId: 'current-location',
    destinationId: null,
    estimate: null,
    driverId: null,
    pedicabId: null,
    assignedEtaMinutes: null,
    requestedAt: null,
  };
}

export const initialPedalState: PedalState = createInitialPedalState();
