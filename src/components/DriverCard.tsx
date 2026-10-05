import { usePedal } from '../app/usePedal';
import { driverFixture, pedicabFixture } from '../data/pedalFixtures';

export function DriverCard() {
  const { state } = usePedal();

  if (
    state.driverId !== driverFixture.id ||
    state.pedicabId !== pedicabFixture.id ||
    state.assignedEtaMinutes === null
  ) {
    return null;
  }

  return (
    <section className="driver-card" aria-label="Driver details">
      <div className="driver-avatar" aria-hidden="true">MC</div>
      <div>
        <p className="driver-name">{driverFixture.name}</p>
        <p className="driver-pedicab">{pedicabFixture.label}</p>
      </div>
      <p className="driver-eta">{state.assignedEtaMinutes} min away</p>
    </section>
  );
}
