import { useState } from 'react'
import Unlock from './Unlock'
import MenuEditor from './MenuEditor'

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null)

  if (!token) return <Unlock onUnlock={setToken} />

  return <MenuEditor token={token} onLogout={() => setToken(null)} />
}
