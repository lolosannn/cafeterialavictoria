import { useEffect, useState } from 'react'
import { useMenu } from '../hooks/useMenu'

export default function Menu() {
  const { categories } = useMenu()
  const [activeId, setActiveId] = useState(categories[0]?.id)

  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === activeId)) {
      setActiveId(categories[0].id)
    }
  }, [categories, activeId])

  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  if (!active) return null

  return (
    <section id="menu" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Nuestro menú
          </span>
          <h2 className="mt-3 font-display text-4xl italic text-espresso sm:text-5xl">
            Hecho con calma, servido con cariño
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveId(category.id)}
              className={`rounded-full px-5 py-2 font-sans text-sm font-medium transition-colors ${
                activeId === category.id
                  ? 'bg-espresso text-cream'
                  : 'bg-latte text-espresso/70 hover:bg-latte/70'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center font-sans text-sm text-espresso/60">
          {active.subtitle}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {active.items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-espresso">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-espresso">{item.name}</h3>
                  <span className="whitespace-nowrap font-sans text-sm font-semibold text-terracotta">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 font-sans text-sm leading-relaxed text-espresso/60">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
