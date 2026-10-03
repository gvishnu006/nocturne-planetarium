export default function About() {
  return (
    <main className="min-h-screen bg-[#03040a] text-neutral-100">
      <div className="pt-24 px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.4em] uppercase">About</h1>
          </header>
          <p className="text-sm tracking-[0.18em] uppercase text-neutral-300 leading-relaxed">
            Nocturne renders the real night sky. The catalog is drawn from HYG v4.0, keeping stars down to visual magnitude 6.5 —
            the point where the eye stops under genuine dark skies. Apparent brightness accounts for extinction and airmass,
            colour is inferred from B-V and gently desaturated, and scintillation varies with altitude. The scroll drives sidereal
            time, turning the sky as it would in the field.
          </p>
          <p className="text-sm tracking-[0.18em] uppercase text-neutral-300 leading-relaxed">
            Palette: deep indigo/navy. Density: realistic. UI: typographic, minimal, human.
          </p>
        </div>
      </div>
    </main>
  );
}