export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-espresso"
    >
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
        alt="Café recién preparado sobre una mesa de madera"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/20" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <span className="inline-block rounded-full bg-cream/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Cafetería de especialidad
        </span>
        <h1 className="mt-6 font-display text-5xl italic text-cream text-shadow-soft sm:text-6xl md:text-7xl">
          Café Ámbar
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-sans text-base text-cream/85 sm:text-lg">
          Granos de origen, horneado artesanal todos los días y un rincón cálido
          para disfrutar despacio.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#menu"
            className="rounded-full bg-terracotta px-8 py-3 font-sans text-sm font-semibold text-cream shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Ver el menú
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-cream/40 px-8 py-3 font-sans text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
          >
            Cómo llegar
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-sans text-xs uppercase tracking-[0.3em] text-cream/60">
        Lun a Dom · 7:30 – 20:00
      </div>
    </section>
  )
}
