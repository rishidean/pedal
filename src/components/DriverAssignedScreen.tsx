import { usePedal } from '../app/usePedal';
import { destinations, pickupFixture } from '../data/pedalFixtures';
import { BrandHeader } from './BrandHeader';
import { DriverCard } from './DriverCard';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';
import { TripSummaryCard } from './TripSummaryCard';

export function DriverAssignedScreen() {
  const { state } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined) {
    return null;
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="driver-assigned-heading">
        <p className="eyebrow">Driver assigned</p>
        <h1 id="driver-assigned-heading">Maya is on the way</h1>
        <p className="review-route">{pickupFixture.label} → {destination.label}</p>
      </section>
      <DriverCard />
      <TripSummaryCard />
      <StaticCityMap mode="route" />
    </RiderFrame>
  );
}
