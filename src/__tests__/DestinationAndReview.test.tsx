import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { destinations } from '../data/pedalFixtures';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('destination selection and ride review', () => {
  it('renders exactly the canonical destinations and creates a correct review for each', () => {
    for (const destination of destinations) {
      const view = render(<App />);
      const option = screen.getByRole('button', { name: destination.label });

      expect(option.tagName).toBe('BUTTON');
      option.focus();
      expect(document.activeElement).toBe(option);
      fireEvent.click(option);

      expect(screen.getByRole('heading', { level: 1, name: 'Your PEDAL' })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Current location\\s*→\\s*${destination.label}`))).toBeInTheDocument();
      expect(screen.getByText('Pickup in 4 min')).toBeInTheDocument();
      expect(screen.getByText('Estimated fare $18')).toBeInTheDocument();

      view.unmount();
      window.localStorage.clear();
    }
  });

  it('shows the canonical Ferry Building review and clears it when changing destination', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Ferry Building' }));

    expect(screen.getByText('Current location → Ferry Building')).toBeInTheDocument();
    expect(screen.getByText('Pickup in 4 min')).toBeInTheDocument();
    expect(screen.getByText('Estimated fare $18')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request PEDAL' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByText(/payment method/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/promo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/schedule/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change destination' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Where are you headed?' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Request PEDAL' })).not.toBeInTheDocument();
    expect(window.localStorage.getItem('pedal.ride.v1')).toBeNull();
  });
});
