import type { DestinationId } from '../state/pedalTypes';

interface DestinationOptionProps {
  destinationId: DestinationId;
  label: string;
  onSelect: (destinationId: DestinationId) => void;
}

export function DestinationOption({ destinationId, label, onSelect }: DestinationOptionProps) {
  return (
    <button
      className="destination-option"
      type="button"
      onClick={() => onSelect(destinationId)}
    >
      <span className="landmark-dot" aria-hidden="true" />
      <span>{label}</span>
      <span className="destination-option-action" aria-hidden="true">Choose</span>
    </button>
  );
}
