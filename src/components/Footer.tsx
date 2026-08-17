export default function Footer() {
  return (
    <footer className="bg-espresso py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-sans text-xs text-cream/50 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Café Ámbar. Todos los derechos reservados.</p>
        <p>Hecho con cariño, taza por taza.</p>
      </div>
    </footer>
  )
}
