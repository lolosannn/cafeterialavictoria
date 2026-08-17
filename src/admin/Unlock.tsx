import { useEffect, useState, type FormEvent } from 'react'
import { verifyToken, GitHubApiError } from '../lib/github'
import { hasStoredVault, saveVault, unlockVault, clearVault } from '../lib/vault'

export default function Unlock({ onUnlock }: { onUnlock: (token: string) => void }) {
  const [mode, setMode] = useState<'checking' | 'setup' | 'unlock'>('checking')

  useEffect(() => {
    setMode(hasStoredVault() ? 'unlock' : 'setup')
  }, [])

  if (mode === 'checking') return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
      {mode === 'setup' ? (
        <SetupForm onDone={onUnlock} />
      ) : (
        <UnlockForm onDone={onUnlock} onReset={() => setMode('setup')} />
      )}
    </div>
  )
}

function UnlockForm({
  onDone,
  onReset,
}: {
  onDone: (token: string) => void
  onReset: () => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await unlockVault(password)
      onDone(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo desbloquear el acceso.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Esto borra el acceso guardado en este navegador. Vas a necesitar tu token de GitHub de nuevo para volver a configurarlo. ¿Continuar?',
      )
    ) {
      clearVault()
      onReset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl text-espresso">Panel de administración</h1>
      <p className="mt-1 font-sans text-sm text-espresso/60">Ingresá tu contraseña</p>

      <label className="mt-6 block font-sans text-sm font-medium text-espresso">
        Contraseña
        <input
          type="password"
          autoFocus
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
        {loading ? 'Verificando…' : 'Ingresar'}
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="mt-4 w-full text-center font-sans text-xs text-espresso/50 underline-offset-2 hover:underline"
      >
        Olvidé mi contraseña / configurar en otro dispositivo
      </button>
    </form>
  )
}

function SetupForm({ onDone }: { onDone: (token: string) => void }) {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    try {
      await verifyToken(token.trim())
      await saveVault(token.trim(), password)
      onDone(token.trim())
    } catch (err) {
      setError(
        err instanceof GitHubApiError ? err.message : 'No se pudo configurar el acceso.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="font-display text-2xl text-espresso">Configurar el panel</h1>
      <p className="mt-1 font-sans text-sm text-espresso/60">
        Primera vez en este navegador — esto se hace una sola vez.
      </p>

      <div className="mt-5 rounded-xl bg-latte/40 p-4 font-sans text-xs leading-relaxed text-espresso/70">
        <p className="font-semibold text-espresso">1. Creá un token de GitHub (gratis):</p>
        <ol className="mt-1 list-decimal space-y-1 pl-4">
          <li>
            Andá a{' '}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-terracotta underline"
            >
              github.com/settings/personal-access-tokens/new
            </a>
          </li>
          <li>En "Repository access" elegí "Only select repositories" → este repositorio.</li>
          <li>En "Permissions" → "Repository permissions" → "Contents" → "Read and write".</li>
          <li>Generá el token y pegalo abajo.</li>
        </ol>
      </div>

      <label className="mt-5 block font-sans text-sm font-medium text-espresso">
        Token de GitHub
        <input
          type="password"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_…"
          className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-2 font-mono text-sm outline-none focus:border-terracotta"
        />
      </label>

      <label className="mt-4 block font-sans text-sm font-medium text-espresso">
        Elegí una contraseña
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-2 font-sans text-sm outline-none focus:border-terracotta"
        />
      </label>

      <label className="mt-4 block font-sans text-sm font-medium text-espresso">
        Repetí la contraseña
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-2 font-sans text-sm outline-none focus:border-terracotta"
        />
      </label>

      {error && <p className="mt-3 font-sans text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-espresso px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-terracotta disabled:opacity-60"
      >
        {loading ? 'Verificando…' : 'Guardar y entrar'}
      </button>

      <p className="mt-4 font-sans text-xs text-espresso/50">
        El token queda guardado cifrado solo en este navegador, protegido por tu contraseña. En
        otro dispositivo vas a tener que repetir este paso una vez.
      </p>
    </form>
  )
}
