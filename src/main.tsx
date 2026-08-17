import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))

const path = window.location.pathname.replace(import.meta.env.BASE_URL, '')
const isAdmin = path === 'admin' || path.startsWith('admin/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
