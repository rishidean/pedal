import {
  assignedEtaMinutes,
  driverFixture,
  estimateFixture,
  isDestinationId,
  pedicabFixture,
  pickupFixture,
} from '../data/pedalFixtures';
import { createInitialPedalState } from './pedalInitialState';
import type { PedalStage, PedalState } from './pedalTypes';

export const PEDAL_STORAGE_KEY = 'pedal.ride.v1';

const stages: readonly PedalStage[] = [
  'destination_entry',
  'ride_review',
  'matching',
  'driver_assigned',
  'driver_arrived',
  'ride_in_progress',
  'ride_completed',
];

function browserStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasCanonicalEstimate(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.pickupEtaMinutes === estimateFixture.pickupEtaMinutes &&
    value.fareCents === estimateFixture.fareCents &&
    value.currency === estimateFixture.currency
  );
}

function isStage(value: unknown): value is PedalStage {
  return typeof value === 'string' && stages.includes(value as PedalStage);
}

export function isValidPedalState(value: unknown): value is PedalState {
  if (!isRecord(value) || value.version !== 1 || !isStage(value.stage)) {
    return false;
  }

  if (
    value.pickupId !== pickupFixture.id ||
    !(value.destinationId === null || isDestinationId(value.destinationId)) ||
    !(value.estimate === null || hasCanonicalEstimate(value.estimate)) ||
    !(value.driverId === null || value.driverId === driverFixture.id) ||
    !(value.pedicabId === null || value.pedicabId === pedicabFixture.id) ||
    !(value.assignedEtaMinutes === null || value.assignedEtaMinutes === assignedEtaMinutes) ||
    !(value.requestedAt === null || typeof value.requestedAt === 'string')
  ) {
    return false;
  }

  const hasTrip = value.destinationId !== null && value.estimate !== null;
  const hasNoAssignment =
    value.driverId === null && value.pedicabId === null && value.assignedEtaMinutes === null;
  const hasAssignment =
    value.driverId === driverFixture.id &&
    value.pedicabId === pedicabFixture.id &&
    value.assignedEtaMinutes === assignedEtaMinutes;

  switch (value.stage) {
    case 'destination_entry':
      return !hasTrip && hasNoAssignment && value.requestedAt === null;
    case 'ride_review':
      return hasTrip && hasNoAssignment && value.requestedAt === null;
    case 'matching':
      return hasTrip && hasNoAssignment && typeof value.requestedAt === 'string';
    case 'driver_assigned':
    case 'driver_arrived':
    case 'ride_in_progress':
    case 'ride_completed':
      return hasTrip && hasAssignment && typeof value.requestedAt === 'string';
  }
}

export function loadPedalState(storage: Storage | null = browserStorage()): PedalState {
  if (storage === null) {
    return createInitialPedalState();
  }

  const serialized = storage.getItem(PEDAL_STORAGE_KEY);
  if (serialized === null) {
    return createInitialPedalState();
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (isValidPedalState(parsed)) {
      return parsed;
    }
  } catch {
    // Invalid browser data intentionally fails closed below.
  }

  storage.removeItem(PEDAL_STORAGE_KEY);
  return createInitialPedalState();
}

export function savePedalState(state: PedalState, storage: Storage | null = browserStorage()): void {
  if (storage !== null && isValidPedalState(state)) {
    storage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(state));
  }
}

export function clearPedalState(storage: Storage | null = browserStorage()): void {
  storage?.removeItem(PEDAL_STORAGE_KEY);
}
