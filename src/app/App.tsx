import { DemoControls } from '../components/DemoControls';
import { DestinationEntryScreen } from '../components/DestinationEntryScreen';
import { DriverAssignedScreen } from '../components/DriverAssignedScreen';
import { MatchingScreen } from '../components/MatchingScreen';
import { RideReviewScreen } from '../components/RideReviewScreen';
import { useMatchingAssignment } from '../hooks/useMatchingAssignment';
import { PedalProvider } from './PedalProvider';
import { usePedal } from './usePedal';

function StageRenderer() {
  const { state } = usePedal();
  useMatchingAssignment();

  switch (state.stage) {
    case 'destination_entry':
      return <DestinationEntryScreen />;
    case 'ride_review':
      return <RideReviewScreen />;
    case 'matching':
      return <MatchingScreen />;
    case 'driver_assigned':
      return <DriverAssignedScreen />;
    default:
      // Later lifecycle stages intentionally have no rider implementation until Booking S3.
      return null;
  }
}

export function App() {
  return (
    <PedalProvider>
      <div className="app-canvas">
        <StageRenderer />
        <DemoControls />
      </div>
    </PedalProvider>
  );
}
