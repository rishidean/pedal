import { describe, expect, it } from 'vitest';
import {
  assignedEtaMinutes,
  driverFixture,
  estimateFixture,
  pedicabFixture,
} from '../data/pedalFixtures';
import { createInitialPedalState } from '../state/pedalInitialState';
import { pedalReducer } from '../state/pedalReducer';
import type { PedalState } from '../state/pedalTypes';

const requestTime = '2026-10-04T20:00:00.000Z';

function stateAt(stage: PedalState['stage']): PedalState {
  let state = pedalReducer(createInitialPedalState(), {
    type: 'SELECT_DESTINATION',
    destinationId: 'ferry-building',
  });
  if (stage === 'ride_review') return state;
  state = pedalReducer(state, { type: 'REQUEST_RIDE', now: requestTime });
  if (stage === 'matching') return state;
  state = pedalReducer(state, { type: 'ASSIGN_DRIVER' });
  if (stage === 'driver_assigned') return state;
  state = pedalReducer(state, { type: 'DRIVER_ARRIVED' });
  if (stage === 'driver_arrived') return state;
  state = pedalReducer(state, { type: 'START_RIDE' });
  if (stage === 'ride_in_progress') return state;
  return pedalReducer(state, { type: 'COMPLETE_RIDE' });
}

describe('pedalReducer', () => {
  it('TR-001 selects a valid destination and creates the canonical estimate', () => {
    const next = pedalReducer(createInitialPedalState(), {
      type: 'SELECT_DESTINATION',
      destinationId: 'ferry-building',
    });

    expect(next.stage).toBe('ride_review');
    expect(next.destinationId).toBe('ferry-building');
    expect(next.estimate).toEqual(estimateFixture);
  });

  it('TR-002 clears the selection when changing destination', () => {
    const next = pedalReducer(stateAt('ride_review'), { type: 'CHANGE_DESTINATION' });

    expect(next).toEqual(createInitialPedalState());
  });

  it('TR-003 creates a matching request with its timestamp', () => {
    const next = pedalReducer(stateAt('ride_review'), { type: 'REQUEST_RIDE', now: requestTime });

    expect(next.stage).toBe('matching');
    expect(next.requestedAt).toBe(requestTime);
    expect(next.destinationId).toBe('ferry-building');
  });

  it('TR-004 assigns the canonical driver and pedicab', () => {
    const next = pedalReducer(stateAt('matching'), { type: 'ASSIGN_DRIVER' });

    expect(next).toMatchObject({
      stage: 'driver_assigned',
      driverId: driverFixture.id,
      pedicabId: pedicabFixture.id,
      assignedEtaMinutes,
    });
  });

  it('TR-005 records driver arrival only after assignment', () => {
    expect(pedalReducer(stateAt('driver_assigned'), { type: 'DRIVER_ARRIVED' }).stage).toBe(
      'driver_arrived',
    );
  });

  it('TR-006 starts the ride only after driver arrival', () => {
    expect(pedalReducer(stateAt('driver_arrived'), { type: 'START_RIDE' }).stage).toBe(
      'ride_in_progress',
    );
  });

  it('TR-007 completes only an in-progress ride', () => {
    const next = pedalReducer(stateAt('ride_in_progress'), { type: 'COMPLETE_RIDE' });

    expect(next.stage).toBe('ride_completed');
    expect(next.estimate?.fareCents).toBe(1800);
  });

  it('TR-008 resets a completed ride and clears active data', () => {
    expect(pedalReducer(stateAt('ride_completed'), { type: 'RESET_RIDE' })).toEqual(
      createInitialPedalState(),
    );
  });

  it('ignores invalid and unknown events without mutating input state', () => {
    const initial = createInitialPedalState();
    const snapshot = structuredClone(initial);

    expect(pedalReducer(initial, { type: 'REQUEST_RIDE', now: requestTime })).toBe(initial);
    expect(pedalReducer(initial, { type: 'NOT_A_PEDAL_EVENT' })).toBe(initial);
    expect(initial).toEqual(snapshot);
  });

  it('uses only deterministic fixture values', () => {
    const assigned = stateAt('driver_assigned');

    expect(assigned.estimate).toEqual({ pickupEtaMinutes: 4, fareCents: 1800, currency: 'USD' });
    expect(assigned.driverId).toBe('maya-chen');
    expect(assigned.pedicabId).toBe('pedal-14');
    expect(assigned.assignedEtaMinutes).toBe(3);
  });
});
