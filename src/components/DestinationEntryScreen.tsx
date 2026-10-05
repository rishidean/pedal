import { usePedal } from '../app/usePedal';
import { destinations, pickupFixture } from '../data/pedalFixtures';
import type { DestinationId } from '../state/pedalTypes';
import { BrandHeader } from './BrandHeader';
import { DestinationOption } from './DestinationOption';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';

export function DestinationEntryScreen() {
  const { dispatch } = usePedal();

  function selectDestination(destinationId: DestinationId) {
    dispatch({ type: 'SELECT_DESTINATION', destinationId });
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="destination-heading">
        <p className="eyebrow">A short ride across town</p>
        <h1 id="destination-heading">Where are you headed?</h1>
        <p className="pickup-copy">
          <span aria-hidden="true">●</span> Pickup: {pickupFixture.label}
        </p>
      </section>
      <section aria-labelledby="landmark-heading" className="landmark-section">
        <h2 id="landmark-heading">Local landmarks</h2>
        <div className="landmark-list">
          {destinations.map((destination) => (
            <DestinationOption
              destinationId={destination.id}
              key={destination.id}
              label={destination.label}
              onSelect={selectDestination}
            />
          ))}
        </div>
      </section>
      <StaticCityMap />
    </RiderFrame>
  );
}
