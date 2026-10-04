import {
  assignedEtaMinutes,
  driverFixture,
  estimateFixture,
  isDestinationId,
  pedicabFixture,
} from '../data/pedalFixtures';
import { createInitialPedalState } from './pedalInitialState';
import type { PedalEvent, PedalState, ReducerEvent } from './pedalTypes';

function hasTripContext(state: PedalState): state is PedalState & {
  destinationId: NonNullable<PedalState['destinationId']>;
  estimate: NonNullable<PedalState['estimate']>;
} {
  return state.destinationId !== null && state.estimate !== null;
}

function hasAssignment(state: PedalState): boolean {
  return (
    hasTripContext(state) &&
    state.driverId === driverFixture.id &&
    state.pedicabId === pedicabFixture.id &&
    state.assignedEtaMinutes === assignedEtaMinutes
  );
}

export function pedalReducer(state: PedalState, event: ReducerEvent): PedalState {
  switch (event.type) {
    case 'SELECT_DESTINATION': {
      const typedEvent = event as Extract<PedalEvent, { type: 'SELECT_DESTINATION' }>;
      if (state.stage !== 'destination_entry' || !isDestinationId(typedEvent.destinationId)) {
        return state;
      }

      return {
        ...state,
        stage: 'ride_review',
        destinationId: typedEvent.destinationId,
        estimate: { ...estimateFixture },
      };
    }

    case 'CHANGE_DESTINATION':
      return state.stage === 'ride_review' ? createInitialPedalState() : state;

    case 'REQUEST_RIDE': {
      const typedEvent = event as Extract<PedalEvent, { type: 'REQUEST_RIDE' }>;
      if (state.stage !== 'ride_review' || !hasTripContext(state) || typeof typedEvent.now !== 'string') {
        return state;
      }

      return {
        ...state,
        stage: 'matching',
        requestedAt: typedEvent.now,
      };
    }

    case 'ASSIGN_DRIVER':
      if (state.stage !== 'matching' || !hasTripContext(state) || state.requestedAt === null) {
        return state;
      }

      return {
        ...state,
        stage: 'driver_assigned',
        driverId: driverFixture.id,
        pedicabId: pedicabFixture.id,
        assignedEtaMinutes,
      };

    case 'DRIVER_ARRIVED':
      return state.stage === 'driver_assigned' && hasAssignment(state)
        ? { ...state, stage: 'driver_arrived' }
        : state;

    case 'START_RIDE':
      return state.stage === 'driver_arrived' && hasAssignment(state)
        ? { ...state, stage: 'ride_in_progress' }
        : state;

    case 'COMPLETE_RIDE':
      return state.stage === 'ride_in_progress' && hasAssignment(state)
        ? { ...state, stage: 'ride_completed' }
        : state;

    case 'RESET_RIDE':
      return state.stage === 'ride_completed' ? createInitialPedalState() : state;

    default:
      return state;
  }
}
