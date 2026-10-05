import { usePedal } from '../app/usePedal';
import type { PedalEvent, PedalStage } from '../state/pedalTypes';

function isDemoMode(): boolean {
  return (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('demo') === '1'
  );
}

const lifecycleActions: Partial<Record<PedalStage, { label: string; event: PedalEvent }>> = {
  driver_assigned: { label: 'Simulate driver arrival', event: { type: 'DRIVER_ARRIVED' } },
  driver_arrived: { label: 'Start simulated ride', event: { type: 'START_RIDE' } },
  ride_in_progress: { label: 'Complete simulated ride', event: { type: 'COMPLETE_RIDE' } },
};

export function DemoControls() {
  const { state, dispatch } = usePedal();

  if (!isDemoMode()) {
    return null;
  }

  const action = lifecycleActions[state.stage];

  return (
    <aside className="demo-controls" aria-labelledby="demo-controls-heading" data-testid="demo-controls">
      <div className="demo-eyebrow">Teaching only</div>
      <h2 id="demo-controls-heading">Demo Controls</h2>
      <p>
        Current state: <code>{state.stage}</code>
      </p>
      {action === undefined ? <p>No demo action available</p> : null}
      {action !== undefined ? (
        <button className="demo-action" type="button" onClick={() => dispatch(action.event)}>
          {action.label}
        </button>
      ) : null}
    </aside>
  );
}
