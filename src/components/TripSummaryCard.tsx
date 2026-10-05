import { usePedal } from '../app/usePedal';
import { destinations, pickupFixture } from '../data/pedalFixtures';

export function TripSummaryCard() {
  const { state } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined || state.estimate === null) {
    return null;
  }

  return (
    <section className="trip-summary-card" aria-label="Trip summary">
      <dl>
        <div>
          <dt>Pickup</dt>
          <dd>{pickupFixture.label}</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd>{destination.label}</dd>
        </div>
        <div>
          <dt>Pickup ETA</dt>
          <dd>{state.estimate.pickupEtaMinutes} min</dd>
        </div>
        <div>
          <dt>Estimated fare</dt>
          <dd>${state.estimate.fareCents / 100}</dd>
        </div>
      </dl>
    </section>
  );
}
