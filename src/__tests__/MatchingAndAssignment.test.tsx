import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../app/App';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('matching and assignment', () => {
  it('keeps matching visible through 1199ms and assigns only after the fixture delay', () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Ferry Building' }));
    fireEvent.click(screen.getByRole('button', { name: 'Request PEDAL' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Finding a nearby pedicab' })).toBeInTheDocument();
    expect(screen.getByText('This usually takes less than a minute')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Finding a nearby pedicab');
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('Current location');
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('Ferry Building');
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('4 min');
    expect(screen.getByLabelText('Trip summary')).toHaveTextContent('$18');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1199);
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Finding a nearby pedicab' })).toBeInTheDocument();
    expect(screen.queryByText('Maya Chen')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('Driver assigned')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Maya is on the way' })).toBeInTheDocument();
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('PEDAL 14')).toBeInTheDocument();
    expect(screen.getByText('3 min away')).toBeInTheDocument();
    expect(screen.getByText('Current location → Ferry Building')).toBeInTheDocument();
    expect(screen.queryByText(/call/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/chat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/payment/i)).not.toBeInTheDocument();
  });
});
