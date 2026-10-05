import { BrandHeader } from './BrandHeader';
import { RiderFrame } from './RiderFrame';
import { StaticCityMap } from './StaticCityMap';
import { TripSummaryCard } from './TripSummaryCard';

export function MatchingScreen() {
  return (
    <RiderFrame>
      <BrandHeader />
      <section className="journey-intro matching-intro" aria-labelledby="matching-heading">
        <p className="eyebrow">Matching your request</p>
        <h1 id="matching-heading">Finding a nearby pedicab</h1>
        <p className="supporting-copy">This usually takes less than a minute</p>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Finding a nearby pedicab. This usually takes less than a minute.
        </p>
      </section>
      <TripSummaryCard />
      <StaticCityMap mode="matching" />
    </RiderFrame>
  );
}
