import { usePedal } from '../app/usePedal';
import { destinations, pickupFixture } from '../data/pedalFixtures';
import { BrandHeader } from './BrandHeader';
import { DriverCard } from './DriverCard';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';
import { TripSummaryCard } from './TripSummaryCard';

export function DriverArrivedScreen() {
  const { state } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined) {
    return null;
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="driver-arrived-heading">
        <p className="eyebrow">Driver arrived</p>
        <h1 id="driver-arrived-heading">Your pedicab is here</h1>
        <p className="supporting-copy">Meet Maya at {pickupFixture.label}</p>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Driver arrived. Your pedicab is here. Meet Maya at {pickupFixture.label}.
        </p>
      </section>
      <DriverCard showEta={false} />
      <TripSummaryCard />
      <StaticCityMap mode="route" />
    </RiderFrame>
  );
}
