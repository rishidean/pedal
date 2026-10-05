import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { createInitialPedalState } from '../state/pedalInitialState';
import { pedalReducer } from '../state/pedalReducer';
import { PEDAL_STORAGE_KEY } from '../state/pedalStorage';
import type { PedalState } from '../state/pedalTypes';

function stateAt(stage: PedalState['stage']): PedalState {
  let state = pedalReducer(createInitialPedalState(), {
    type: 'SELECT_DESTINATION',
    destinationId: 'ferry-building',
  });
  state = pedalReducer(state, { type: 'REQUEST_RIDE', now: '2026-10-04T20:00:00.000Z' });
  state = pedalReducer(state, { type: 'ASSIGN_DRIVER' });
  if (stage === 'driver_assigned') return state;
  state = pedalReducer(state, { type: 'DRIVER_ARRIVED' });
  if (stage === 'driver_arrived') return state;
  state = pedalReducer(state, { type: 'START_RIDE' });
  if (stage === 'ride_in_progress') return state;
  return pedalReducer(state, { type: 'COMPLETE_RIDE' });
}

function restore(stage: PedalState['stage']) {
  window.history.replaceState({}, '', '/?demo=1');
  window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(stateAt(stage)));
  render(<App />);
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('lifecycle persistence', () => {
  it.each([
    ['driver_assigned', 'Maya is on the way'],
    ['driver_arrived', 'Your pedicab is here'],
    ['ride_in_progress', 'Heading to Ferry Building'],
    ['ride_completed', 'You’ve arrived'],
  ] as const)('restores canonical %s state and its required context', (stage, headline) => {
    restore(stage);

    expect(screen.getByRole('heading', { level: 1, name: headline })).toBeInTheDocument();
    expect(document.body).toHaveTextContent('Ferry Building');
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toContain(`"stage":"${stage}"`);
  });

  it('clears the active record when reset from restored completion', () => {
    restore('ride_completed');

    fireEvent.click(screen.getByRole('button', { name: 'Start another ride' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });

  it('fails closed from a malformed lifecycle record', () => {
    const malformed = { ...stateAt('driver_arrived'), driverId: null };
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(malformed));

    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });
});
