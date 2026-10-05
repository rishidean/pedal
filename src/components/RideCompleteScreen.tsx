import { usePedal } from '../app/usePedal';
import { destinations } from '../data/pedalFixtures';
import { BrandHeader } from './BrandHeader';
import { RiderFrame } from './RiderFrame';

export function RideCompleteScreen() {
  const { state, dispatch } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined || state.estimate === null) {
    return null;
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="ride-complete-heading">
        <p className="eyebrow">Ride complete</p>
        <h1 id="ride-complete-heading">You’ve arrived</h1>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Ride complete. You’ve arrived at {destination.label}.
        </p>
      </section>
      <section className="completion-card" aria-label="Ride complete summary">
        <p className="completion-label">Destination</p>
        <p className="completion-destination">{destination.label}</p>
        <p className="completion-fare">${state.estimate.fareCents / 100}</p>
        <p className="completion-instruction">Pay the driver directly</p>
      </section>
      <div className="journey-actions">
        <button
          className="primary-action"
          type="button"
          onClick={() => dispatch({ type: 'RESET_RIDE' })}
        >
          Start another ride
        </button>
      </div>
    </RiderFrame>
  );
}
