import type { DestinationId, PedalEstimate } from '../state/pedalTypes';

export const pickupFixture = {
  id: 'current-location',
  label: 'Current location',
} as const;

export const destinations = [
  { id: 'union-square', label: 'Union Square' },
  { id: 'ferry-building', label: 'Ferry Building' },
  { id: 'oracle-park', label: 'Oracle Park' },
] as const satisfies ReadonlyArray<{ id: DestinationId; label: string }>;

export const destinationIds = destinations.map(({ id }) => id) as DestinationId[];

export const estimateFixture: PedalEstimate = {
  pickupEtaMinutes: 4,
  fareCents: 1800,
  currency: 'USD',
};

export const driverFixture = {
  id: 'maya-chen',
  name: 'Maya Chen',
} as const;

export const pedicabFixture = {
  id: 'pedal-14',
  label: 'PEDAL 14',
} as const;

export const assignedEtaMinutes = 3 as const;
export const matchingDelayMilliseconds = 1200 as const;

export function isDestinationId(value: unknown): value is DestinationId {
  return typeof value === 'string' && destinationIds.includes(value as DestinationId);
}
