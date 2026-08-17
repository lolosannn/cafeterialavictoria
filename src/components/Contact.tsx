export default function Contact() {
  return (
    <section id="contacto" className="bg-espresso py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
        <div>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Visitanos
          </span>
          <h2 className="mt-3 font-display text-4xl italic text-cream sm:text-5xl">
            Te esperamos con la mesa lista
          </h2>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-cream/70">
            Pasá a probar el menú, reservar una mesa o simplemente saludar.
            También armamos pedidos para llevar.
          </p>

          <dl className="mt-10 space-y-6 font-sans text-sm text-cream/80">
            <div>
              <dt className="font-semibold text-cream">Dirección</dt>
              <dd>Av. de los Robles 482, esquina Malabia</dd>
            </div>
            <div>
              <dt className="font-semibold text-cream">Horario</dt>
              <dd>Lunes a domingo, 7:30 a 20:00</dd>
            </div>
            <div>
              <dt className="font-semibold text-cream">Contacto</dt>
              <dd>hola@cafeambar.com · +54 9 11 5555-0192</dd>
            </div>
          </dl>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80"
            alt="Mesa de la cafetería con café y croissants"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
