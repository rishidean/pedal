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
  if (stage === 'ride_review') return state;
  state = pedalReducer(state, { type: 'REQUEST_RIDE', now: '2026-10-04T20:00:00.000Z' });
  if (stage === 'matching') return state;
  state = pedalReducer(state, { type: 'ASSIGN_DRIVER' });
  if (stage === 'driver_assigned') return state;
  state = pedalReducer(state, { type: 'DRIVER_ARRIVED' });
  if (stage === 'driver_arrived') return state;
  state = pedalReducer(state, { type: 'START_RIDE' });
  if (stage === 'ride_in_progress') return state;
  return pedalReducer(state, { type: 'COMPLETE_RIDE' });
}

function renderStage(stage: PedalState['stage'], query = '?demo=1') {
  window.history.replaceState({}, '', `/${query}`);
  if (stage !== 'destination_entry') {
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(stateAt(stage)));
  }
  render(<App />);
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('Demo Controls', () => {
  it.each(['', '?demo=true', '?demo=0', '?other=1'])(
    'does not render for a non-exact demo query %s',
    (query) => {
      renderStage('driver_assigned', query);
      expect(screen.queryByTestId('demo-controls')).not.toBeInTheDocument();
    },
  );

  it('is separate teaching infrastructure with the only valid action at each eligible stage', () => {
    renderStage('driver_assigned');

    const panel = screen.getByTestId('demo-controls');
    expect(panel).toHaveTextContent('Teaching only');
    expect(panel).toHaveTextContent('driver_assigned');
    expect(screen.getByRole('button', { name: 'Simulate driver arrival' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start simulated ride' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Complete simulated ride' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Simulate driver arrival' }));
    expect(screen.getByRole('button', { name: 'Start simulated ride' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Simulate driver arrival' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start simulated ride' }));
    expect(screen.getByRole('button', { name: 'Complete simulated ride' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start simulated ride' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Complete simulated ride' }));
    expect(screen.getByText('No demo action available')).toBeInTheDocument();
    expect(panel.querySelector('button')).toBeNull();
  });

  it.each<PedalState['stage']>(['destination_entry', 'ride_review', 'matching', 'ride_completed'])(
    'shows no action in %s',
    (stage) => {
      renderStage(stage);
      const panel = screen.getByTestId('demo-controls');
      expect(panel).toHaveTextContent('No demo action available');
      expect(panel.querySelector('button')).toBeNull();
    },
  );
});
