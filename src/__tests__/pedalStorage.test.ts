import { afterEach, describe, expect, it } from 'vitest';
import { createInitialPedalState } from '../state/pedalInitialState';
import { pedalReducer } from '../state/pedalReducer';
import {
  clearPedalState,
  loadPedalState,
  PEDAL_STORAGE_KEY,
  savePedalState,
} from '../state/pedalStorage';

function reviewState() {
  return pedalReducer(createInitialPedalState(), {
    type: 'SELECT_DESTINATION',
    destinationId: 'ferry-building',
  });
}

afterEach(() => window.localStorage.clear());

describe('pedalStorage', () => {
  it('returns a fresh initial state when no record exists', () => {
    expect(loadPedalState()).toEqual(createInitialPedalState());
  });

  it('saves and restores a valid state under the versioned key', () => {
    const state = reviewState();
    savePedalState(state);

    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBe(JSON.stringify(state));
    expect(loadPedalState()).toEqual(state);
  });

  it('clears malformed JSON and returns initial state', () => {
    window.localStorage.setItem(PEDAL_STORAGE_KEY, '{not-json');

    expect(loadPedalState()).toEqual(createInitialPedalState());
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });

  it('clears an unknown version and returns initial state', () => {
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify({ ...reviewState(), version: 2 }));

    expect(loadPedalState()).toEqual(createInitialPedalState());
    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
  });

  it('clears an invalid stage and returns initial state', () => {
    window.localStorage.setItem(PEDAL_STORAGE_KEY, JSON.stringify({ ...reviewState(), stage: 'lost' }));

    expect(loadPedalState()).toEqual(createInitialPedalState());
  });

  it('clears an invalid destination fixture and returns initial state', () => {
    window.localStorage.setItem(
      PEDAL_STORAGE_KEY,
      JSON.stringify({ ...reviewState(), destinationId: 'invented-place' }),
    );

    expect(loadPedalState()).toEqual(createInitialPedalState());
  });

  it('removes persisted state when reset storage is cleared', () => {
    savePedalState(reviewState());
    clearPedalState();

    expect(window.localStorage.getItem(PEDAL_STORAGE_KEY)).toBeNull();
    expect(loadPedalState()).toEqual(createInitialPedalState());
  });
});
