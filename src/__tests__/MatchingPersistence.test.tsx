import { StrictMode } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';
import { createInitialPedalState } from '../state/pedalInitialState';
import { pedalReducer } from '../state/pedalReducer';
import { PEDAL_STORAGE_KEY } from '../state/pedalStorage';

function matchingState() {
  const review = pedalReducer(createInitialPedalState(), {
    type: 'SELECT_DESTINATION',
    destinationId: 'ferry-building',
  });
  return pedalReducer(review, { type: 'REQUEST_RIDE', now: '2026-10-04T20:00:00.000Z' });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('matching persistence', () => {
  it('restores matching, schedules one assignment in Strict Mode, and preserves the assigned result', () => {
    vi.useFakeTimers();
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(matchingState()));

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Finding a nearby pedicab' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeInTheDocument();

    const assignedRecord = window.localStorage.getItem(PEDAL_STORAGE_KEY);
    expect(assignedRecord).not.toBeNull();
    expect(JSON.parse(assignedRecord ?? '{}')).toMatchObject({
      stage: 'driver_assigned',
      driverId: 'maya-chen',
      pedicabId: 'pedal-14',
      assignedEtaMinutes: 3,
    });

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBe(assignedRecord);
  });

  it('restores a previously assigned canonical driver context without scheduling matching', () => {
    const assigned = pedalReducer(matchingState(), { type: 'ASSIGN_DRIVER' });
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify(assigned));

    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeInTheDocument();
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('PEDAL 14')).toBeInTheDocument();
  });
});
