import { usePedal } from '../app/usePedal';
import { destinations } from '../data/pedalFixtures';
import { BrandHeader } from './BrandHeader';
import { DriverCard } from './DriverCard';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';

export function RideInProgressScreen() {
  const { state } = usePedal();
  const destination = destinations.find(({ id }) => id === state.destinationId);

  if (destination === undefined || state.estimate === null) {
    return null;
  }

  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro" aria-labelledby="ride-in-progress-heading">
        <p className="eyebrow">Ride in progress</p>
        <h1 id="ride-in-progress-heading">Heading to {destination.label}</h1>
        <p className="supporting-copy">Estimated fare ${state.estimate.fareCents / 100}</p>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Ride in progress. Heading to {destination.label}. Estimated fare ${state.estimate.fareCents / 100}.
        </p>
      </section>
      <DriverCard showEta={false} />
      <StaticCityMap mode="route" />
    </RiderFrame>
  );
}
