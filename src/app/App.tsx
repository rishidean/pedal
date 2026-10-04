import { DemoControls } from '../components/DemoControls';
import { BrandHeader } from '../components/BrandHeader';
import { RiderFrame } from '../components/RiderFrame';
import { StaticCityMap } from '../components/StaticCityMap';
import { destinations, pickupFixture } from '../data/pedalFixtures';
import { PedalProvider } from './PedalProvider';

function DestinationEntryShell() {
  return (
    <>
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
          <ul className="landmark-list">
            {destinations.map((destination) => (
              <li className="landmark-card" key={destination.id}>
                <span className="landmark-dot" aria-hidden="true" />
                <span>{destination.label}</span>
                <span className="preview-label">Coming next</span>
              </li>
            ))}
          </ul>
        </section>
        <StaticCityMap />
      </RiderFrame>
      <DemoControls />
    </>
  );
}

export function App() {
  return (
    <PedalProvider>
      <div className="app-canvas">
        <DestinationEntryShell />
      </div>
    </PedalProvider>
  );
}
