import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

function renderStage(stage: PedalState['stage']) {
  window.history.replaceState({}, '', '/?demo=1');
  window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(stateAt(stage)));
  return render(<App />);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('ride lifecycle', () => {
  it('renders canonical driver-arrived content without rider-facing lifecycle or contact controls', () => {
    renderStage('driver_arrived');

    expect(screen.getByText('Driver arrived')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Your pedicab is here' })).toBeInTheDocument();
    expect(screen.getByText('Meet Maya at Current location')).toBeInTheDocument();
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('PEDAL 14')).toBeInTheDocument();
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('Current location');
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('Ferry Building');
    expect(screen.getByRole('status')).toHaveTextContent('Driver arrived');
    expect(screen.queryByRole('button', { name: /start ride/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/call|message|cancel|wait fee|pin/i)).not.toBeInTheDocument();
  });

  it('renders canonical in-progress content with a static route and no live-trip controls', () => {
    renderStage('ride_in_progress');

    expect(screen.getByRole('heading', { level: 1, name: 'Heading to Ferry Building' })).toBeInTheDocument();
    expect(screen.getByText('Estimated fare $18')).toBeInTheDocument();
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('PEDAL 14')).toBeInTheDocument();
    expect(screen.getByTestId('static-city-map')).toHaveClass('city-map--route');
    expect(screen.getByRole('status')).toHaveTextContent('Ride in progress');
    expect(screen.queryByText(/speed|remaining distance|live eta|emergency/i)).not.toBeInTheDocument();
    expect(within(screen.getByRole('main')).queryByRole('button', { name: /complete/i })).not.toBeInTheDocument();
  });

  it('completes with a direct-payment instruction and resets all active ride data', () => {
    renderStage('ride_completed');

    expect(screen.getByRole('heading', { level: 1, name: 'You’ve arrived' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ride complete summary')).toHaveTextContent('Ferry Building');
    expect(screen.getByLabelText('Ride complete summary')).toHaveTextContent('$18');
    expect(screen.getByText('Pay the driver directly')).toBeInTheDocument();
    expect(screen.queryByText(/paid|payment method|tip|receipt|rating|transaction/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start another ride' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(screen.queryByText('Maya Chen')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });

  it('does not allow a matching timer to alter the fresh reset state', () => {
    vi.useFakeTimers();
    window.history.replaceState({}, '', '/?demo=1');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Ferry Building' }));
    fireEvent.click(screen.getByRole('button', { name: 'Request PEDAL' }));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simulate driver arrival' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start simulated ride' }));
    fireEvent.click(screen.getByRole('button', { name: 'Complete simulated ride' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start another ride' }));
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });
});
