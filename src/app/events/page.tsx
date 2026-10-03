import { Nav } from "@/components/nav";

export default function Events() {
  return (
    <main className="min-h-screen bg-[#03040a] text-neutral-100">
      <div className="pt-24 px-6">
        <div className="mx-auto max-w-3xl space-y-12">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.4em] uppercase">Events</h1>
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-400">
              Dark-sky nights, weather dependent. All sessions begin after nautical twilight.
            </p>
          </header>
          <div className="grid gap-6">
            {[
              { title: "Stargazing Night", when: "Fri 20:00", desc: "Constellations, telescope tour, naked-eye orientation." },
              { title: "Moon & Planets", when: "Sat 19:30", desc: "Lunar features, Jupiter's Galilean moons, Saturn's rings." },
              { title: "Deep Sky Session", when: "Wed 21:00", desc: "Open clusters, nebulae, globular clusters at high power." },
              { title: "Astrophotography 101", when: "Thu 19:00", desc: "Tracked shots of bright targets, processing essentials." },
            ].map((e) => (
              <article key={e.title} className="border border-white/10 p-6">
                <h2 className="text-lg md:text-xl tracking-[0.28em] uppercase">{e.title}</h2>
                <p className="mt-2 text-xs tracking-[0.22em] uppercase text-neutral-400">{e.when}</p>
                <p className="mt-4 text-sm tracking-[0.16em] uppercase text-neutral-300">{e.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}