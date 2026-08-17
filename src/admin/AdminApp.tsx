import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, firebaseReady } from '../lib/firebase'
import Login from './Login'
import MenuEditor from './MenuEditor'

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!auth) {
      setChecking(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  if (!firebaseReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-xl text-espresso">
            El panel de administración todavía no está configurado
          </h1>
          <p className="mt-3 font-sans text-sm text-espresso/60">
            Falta conectar el sitio con Firebase. Revisá las variables de entorno
            VITE_FIREBASE_* en el repositorio.
          </p>
        </div>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-sans text-espresso/60">Cargando…</p>
      </div>
    )
  }

  return user ? <MenuEditor /> : <Login />
}
