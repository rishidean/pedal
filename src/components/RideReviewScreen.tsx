import { usePedal } from '../app/usePedal';
import { destinations, pickupFixture } from '../data/pedalFixtures';
import { BrandHeader } from './BrandHeader';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';

export function RideReviewScreen() {
  const { state, dispatch } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined || state.estimate === null) {
    return null;
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="ride-review-heading">
        <p className="eyebrow">Ride review</p>
        <h1 id="ride-review-heading">Your PEDAL</h1>
        <p className="review-route">{pickupFixture.label} → {destination.label}</p>
      </section>
      <section className="ride-option-card" aria-label="PEDAL ride option">
        <div>
          <p className="ride-option-name">PEDAL</p>
          <p className="ride-option-copy">Pickup in {state.estimate.pickupEtaMinutes} min</p>
        </div>
        <p className="ride-option-fare">Estimated fare ${state.estimate.fareCents / 100}</p>
      </section>
      <div className="journey-actions">
        <button
          className="primary-action"
          type="button"
          onClick={() => dispatch({ type: 'REQUEST_RIDE', now: new Date().toISOString() })}
        >
          Request PEDAL
        </button>
        <button
          className="secondary-action"
          type="button"
          onClick={() => dispatch({ type: 'CHANGE_DESTINATION' })}
        >
          Change destination
        </button>
      </div>
      <StaticCityMap />
    </RiderFrame>
  );
}
