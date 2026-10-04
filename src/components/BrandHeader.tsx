function PedicabMark() {
  return (
    <svg aria-hidden="true" className="pedicab-mark" viewBox="0 0 48 40" focusable="false">
      <path d="M8 28h29l-4-13H17L8 28Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M22 15V8h9l5 7M15 22h9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="15" cy="31" r="4" fill="#FFF8EC" stroke="currentColor" strokeWidth="3" />
      <circle cx="34" cy="31" r="4" fill="#FFF8EC" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="brand-lockup" aria-label="PEDAL">
        <PedicabMark />
        <span className="brand-wordmark">PEDAL</span>
      </div>
      <span className="brand-tagline">Local rides, simply</span>
    </header>
  );
}
