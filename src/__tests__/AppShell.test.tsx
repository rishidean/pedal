import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('App shell', () => {
  it('renders the brand, destination shell, fixture labels, map, and semantic main landmark', () => {
    render(<App />);

    expect(screen.getByLabelText('PEDAL')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(screen.getByText('Pickup: Current location')).toBeInTheDocument();
    expect(screen.getByText('Union Square')).toBeInTheDocument();
    expect(screen.getByText('Ferry Building')).toBeInTheDocument();
    expect(screen.getByText('Oracle Park')).toBeInTheDocument();
    expect(screen.getByTestId('static-city-map')).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'PEDAL rider experience' })).toBeInTheDocument();
    expect(screen.queryByTestId('demo-controls')).not.toBeInTheDocument();
  });

  it('shows teaching infrastructure only for the exact demo query parameter', () => {
    window.history.replaceState({}, '', '/?demo=1');
    render(<App />);

    expect(screen.getByTestId('demo-controls')).toHaveTextContent('Demo Controls');
    expect(screen.getByTestId('demo-controls')).toHaveTextContent('Teaching only');
    expect(screen.getByTestId('demo-controls')).toHaveTextContent('destination_entry');
    expect(screen.getByTestId('demo-controls')).toHaveTextContent('No demo action available');
  });
});
