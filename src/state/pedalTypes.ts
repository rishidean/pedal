export type PedalStage =
  | 'destination_entry'
  | 'ride_review'
  | 'matching'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'ride_in_progress'
  | 'ride_completed';

export type DestinationId =
  | 'union-square'
  | 'ferry-building'
  | 'oracle-park';

export interface PedalEstimate {
  pickupEtaMinutes: 4;
  fareCents: 1800;
  currency: 'USD';
}

export interface PedalState {
  version: 1;
  stage: PedalStage;
  pickupId: 'current-location';
  destinationId: DestinationId | null;
  estimate: PedalEstimate | null;
  driverId: 'maya-chen' | null;
  pedicabId: 'pedal-14' | null;
  assignedEtaMinutes: 3 | null;
  requestedAt: string | null;
}

export type PedalEvent =
  | { type: 'SELECT_DESTINATION'; destinationId: DestinationId }
  | { type: 'CHANGE_DESTINATION' }
  | { type: 'REQUEST_RIDE'; now: string }
  | { type: 'ASSIGN_DRIVER' }
  | { type: 'DRIVER_ARRIVED' }
  | { type: 'START_RIDE' }
  | { type: 'COMPLETE_RIDE' }
  | { type: 'RESET_RIDE' };

export type ReducerEvent = PedalEvent | { type: string };
