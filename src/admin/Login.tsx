import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft"
      >
        <h1 className="font-display text-2xl text-espresso">Panel de administración</h1>
        <p className="mt-1 font-sans text-sm text-espresso/60">Café Ámbar</p>

        <label className="mt-6 block font-sans text-sm font-medium text-espresso">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-2 font-sans text-sm outline-none focus:border-terracotta"
          />
        </label>

        <label className="mt-4 block font-sans text-sm font-medium text-espresso">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-2 font-sans text-sm outline-none focus:border-terracotta"
          />
        </label>

        {error && <p className="mt-3 font-sans text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-espresso px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-terracotta disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
