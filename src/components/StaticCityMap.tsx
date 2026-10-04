export function StaticCityMap() {
  return (
    <section className="city-map" aria-labelledby="city-map-heading" data-testid="static-city-map">
      <h2 id="city-map-heading" className="sr-only">Static city map</h2>
      <div className="city-map-label" aria-hidden="true">PEDAL service area</div>
      <svg aria-hidden="true" viewBox="0 0 340 220" focusable="false">
        <rect width="340" height="220" rx="24" fill="#DFF0FF" />
        <path d="M-10 42 100 77 206 38 354 85M-8 116l91-32 107 42 158-34M52-8l25 236M148-8l-7 236M253-8l22 236" fill="none" stroke="#FFF8EC" strokeWidth="16" strokeLinecap="round" />
        <path d="M20 161c52-17 90-23 128-2 42 23 92 14 164-49" fill="none" stroke="#4DA3FF" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 17" />
        <path d="M20 161c52-17 90-23 128-2 42 23 92 14 164-49" fill="none" stroke="#10233F" strokeOpacity=".18" strokeWidth="11" strokeLinecap="round" />
        <circle cx="20" cy="161" r="11" fill="#F24E3D" stroke="#FFF8EC" strokeWidth="5" />
        <circle cx="312" cy="61" r="11" fill="#F5B642" stroke="#FFF8EC" strokeWidth="5" />
        <rect x="76" y="114" width="44" height="28" rx="6" fill="#F5B642" fillOpacity=".66" />
        <rect x="198" y="55" width="38" height="31" rx="6" fill="#F24E3D" fillOpacity=".54" />
        <rect x="259" y="142" width="43" height="27" rx="6" fill="#4DA3FF" fillOpacity=".52" />
      </svg>
    </section>
  );
}
