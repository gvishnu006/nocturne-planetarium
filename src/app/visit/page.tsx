export default function Visit() {
  return (
    <main className="min-h-screen bg-[#03040a] text-neutral-100">
      <div className="pt-24 px-6">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.4em] uppercase">Visit</h1>
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
              Observatory dome situated at a certified dark sky site.
            </p>
          </header>
          <div className="space-y-6 text-sm tracking-[0.18em] uppercase text-neutral-300">
            <p>Check-in: 30 minutes before session start</p>
            <p>Weather: Open only when sky transparency and seeing meet minimums</p>
            <p>Admission: General, student, senior & groups</p>
            <p>Accessibility: Ground level access; dome steps required for telescope floor</p>
          </div>
        </div>
      </div>
    </main>
  );
}