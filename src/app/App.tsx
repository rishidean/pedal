import { DemoControls } from '../components/DemoControls';
import { DestinationEntryScreen } from '../components/DestinationEntryScreen';
import { DriverArrivedScreen } from '../components/DriverArrivedScreen';
import { DriverAssignedScreen } from '../components/DriverAssignedScreen';
import { MatchingScreen } from '../components/MatchingScreen';
import { RideCompleteScreen } from '../components/RideCompleteScreen';
import { RideInProgressScreen } from '../components/RideInProgressScreen';
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
    case 'driver_arrived':
      return <DriverArrivedScreen />;
    case 'ride_in_progress':
      return <RideInProgressScreen />;
    case 'ride_completed':
      return <RideCompleteScreen />;
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
