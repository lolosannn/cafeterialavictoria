const highlights = [
  {
    title: 'Granos de origen',
    description: 'Seleccionamos lotes de pequeños productores y tostamos en pequeños lotes cada semana.',
  },
  {
    title: 'Horneado diario',
    description: 'Croissants, tostadas y repostería salen del horno todas las mañanas antes de abrir.',
  },
  {
    title: 'Espacio para quedarse',
    description: 'Wifi, luz natural y mesas grandes para trabajar, leer o charlar sin apuro.',
  },
]

export default function About() {
  return (
    <section id="nosotros" className="bg-latte py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
            alt="Interior cálido de la cafetería Café Ámbar"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft"
          />
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=500&q=80"
            alt="Barista preparando café en la barra"
            className="absolute -bottom-8 -right-6 hidden aspect-square w-40 rounded-2xl border-4 border-cream object-cover shadow-soft sm:block md:w-52"
          />
        </div>

        <div>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Nuestra historia
          </span>
          <h2 className="mt-3 font-display text-4xl italic text-espresso sm:text-5xl">
            Un rincón de barrio para amantes del café
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-espresso/70">
            Café Ámbar nació en 2018 con una idea simple: hacer buen café, hornear
            todos los días y crear un lugar donde dieras ganas de quedarte. Hoy
            seguimos tostando en pequeños lotes y horneando a mano, receta por
            receta.
          </p>

          <div className="mt-8 space-y-5">
            {highlights.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <div>
                  <h3 className="font-display text-lg text-espresso">{item.title}</h3>
                  <p className="font-sans text-sm text-espresso/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
