import { usePedal } from '../app/usePedal';

function isDemoMode(): boolean {
  return (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('demo') === '1'
  );
}

export function DemoControls() {
  const { state } = usePedal();

  if (!isDemoMode()) {
    return null;
  }

  return (
    <aside className="demo-controls" aria-labelledby="demo-controls-heading" data-testid="demo-controls">
      <div className="demo-eyebrow">Teaching only</div>
      <h2 id="demo-controls-heading">Demo Controls</h2>
      <p>
        Current state: <code>{state.stage}</code>
      </p>
      {state.stage === 'destination_entry' ? <p>No demo action available</p> : null}
      {state.stage === 'driver_assigned' ? <p>Lifecycle controls arrive in Booking S3</p> : null}
    </aside>
  );
}
