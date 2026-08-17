import { useEffect, useRef, useState } from 'react'
import {
  GitHubApiError,
  IMAGES_DIR,
  MENU_PATH,
  fileToBase64,
  getFile,
  putBinaryFile,
  putFile,
} from '../lib/github'
import type { MenuCategory, MenuItem } from '../data/menu'

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `item-${Date.now()}`

const blankItem = (): MenuItem => ({
  id: `plato-${Date.now()}`,
  name: '',
  description: '',
  price: '',
  image: '',
})

export default function MenuEditor({
  token,
  onLogout,
}: {
  token: string
  onLogout: () => void
}) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [sha, setSha] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const file = await getFile(token, MENU_PATH)
        if (cancelled) return
        if (file) {
          setCategories(JSON.parse(file.content))
          setSha(file.sha)
        } else {
          setCategories([])
          setSha(undefined)
        }
      } catch {
        if (!cancelled) setError('No se pudo cargar el menú desde GitHub.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const updateCategory = (categoryId: string, field: 'title' | 'subtitle', value: string) => {
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, [field]: value } : c)),
    )
    setDirty(true)
  }

  const updateItem = (
    categoryId: string,
    itemId: string,
    field: keyof MenuItem,
    value: string,
  ) => {
    setCategories((cats) =>
      cats.map((c) =>
        c.id !== categoryId
          ? c
          : { ...c, items: c.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) },
      ),
    )
    setDirty(true)
  }

  const addItem = (categoryId: string) => {
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, blankItem()] } : c)),
    )
    setDirty(true)
  }

  const removeItem = (categoryId: string, itemId: string) => {
    if (!window.confirm('¿Eliminar este plato del menú?')) return
    setCategories((cats) =>
      cats.map((c) =>
        c.id === categoryId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c,
      ),
    )
    setDirty(true)
  }

  const addCategory = () => {
    const title = window.prompt('Nombre de la nueva categoría (ej: Bebidas frías):')
    if (!title || !title.trim()) return
    const id = `${slugify(title)}-${Date.now().toString(36)}`
    setCategories((cats) => [...cats, { id, title: title.trim(), subtitle: '', items: [] }])
    setDirty(true)
  }

  const removeCategory = (categoryId: string, title: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${title}" y todos sus platos?`)) return
    setCategories((cats) => cats.filter((c) => c.id !== categoryId))
    setDirty(true)
  }

  const uploadImage = async (categoryId: string, itemId: string, file: File) => {
    const key = `${categoryId}:${itemId}`
    setUploadingKey(key)
    setError('')
    try {
      const base64 = await fileToBase64(file)
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filename = `${itemId}-${Date.now()}.${ext}`
      const path = `${IMAGES_DIR}/${categoryId}/${filename}`
      await putBinaryFile(token, path, base64, `Subir foto para ${itemId}`)
      updateItem(categoryId, itemId, 'image', `${import.meta.env.BASE_URL}menu-images/${categoryId}/${filename}`)
    } catch (err) {
      setError(err instanceof GitHubApiError ? err.message : 'No se pudo subir la foto.')
    } finally {
      setUploadingKey(null)
    }
  }

  const saveAll = async () => {
    setSaving(true)
    setError('')
    try {
      const content = JSON.stringify(categories, null, 2) + '\n'
      const newSha = await putFile(
        token,
        MENU_PATH,
        content,
        'Actualizar menú desde el panel de administración',
        sha,
      )
      setSha(newSha)
      setDirty(false)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 6000)
    } catch (err) {
      setError(err instanceof GitHubApiError ? err.message : 'No se pudieron guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-sans text-espresso/60">Cargando menú…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      <header className="sticky top-0 z-10 border-b border-espresso/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-xl text-espresso">Panel de administración</h1>
            <p className="font-sans text-xs text-espresso/60">
              Editá y tocá "Guardar cambios" para publicar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="./"
              className="font-sans text-sm text-espresso/70 underline-offset-2 hover:underline"
            >
              Ver sitio
            </a>
            <button
              onClick={onLogout}
              className="rounded-full border border-espresso/20 px-4 py-1.5 font-sans text-sm text-espresso hover:bg-espresso hover:text-cream"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-8">
          {categories.map((category) => (
            <section key={category.id} className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    value={category.title}
                    onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                    placeholder="Nombre de la categoría"
                    className="w-full rounded-lg border border-transparent bg-latte/40 px-3 py-1.5 font-display text-lg text-espresso outline-none focus:border-terracotta"
                  />
                  <input
                    value={category.subtitle}
                    onChange={(e) => updateCategory(category.id, 'subtitle', e.target.value)}
                    placeholder="Subtítulo (opcional)"
                    className="w-full rounded-lg border border-transparent bg-latte/20 px-3 py-1 font-sans text-sm text-espresso/70 outline-none focus:border-terracotta"
                  />
                </div>
                <button
                  onClick={() => removeCategory(category.id, category.title)}
                  className="whitespace-nowrap rounded-full px-3 py-1 font-sans text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Eliminar categoría
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {category.items.map((item) => {
                  const key = `${category.id}:${item.id}`
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-espresso/10 p-4 sm:flex-row"
                    >
                      <div className="flex flex-col items-center gap-2 sm:w-32">
                        <div className="h-24 w-24 overflow-hidden rounded-xl bg-latte">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-sans text-xs text-espresso/40">
                              Sin foto
                            </div>
                          )}
                        </div>
                        <input
                          ref={(el) => {
                            fileInputs.current[key] = el
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) uploadImage(category.id, item.id, file)
                            e.target.value = ''
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputs.current[key]?.click()}
                          disabled={uploadingKey === key}
                          className="rounded-full border border-espresso/20 px-3 py-1 font-sans text-xs text-espresso hover:bg-latte disabled:opacity-50"
                        >
                          {uploadingKey === key ? 'Subiendo…' : 'Cambiar foto'}
                        </button>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateItem(category.id, item.id, 'name', e.target.value)
                            }
                            placeholder="Nombre del plato"
                            className="flex-1 rounded-lg border border-espresso/15 px-3 py-1.5 font-sans text-sm outline-none focus:border-terracotta"
                          />
                          <input
                            value={item.price}
                            onChange={(e) =>
                              updateItem(category.id, item.id, 'price', e.target.value)
                            }
                            placeholder="Precio"
                            className="w-28 rounded-lg border border-espresso/15 px-3 py-1.5 font-sans text-sm outline-none focus:border-terracotta"
                          />
                        </div>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateItem(category.id, item.id, 'description', e.target.value)
                          }
                          placeholder="Descripción"
                          rows={2}
                          className="w-full resize-none rounded-lg border border-espresso/15 px-3 py-1.5 font-sans text-sm outline-none focus:border-terracotta"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            value={item.tag ?? ''}
                            onChange={(e) =>
                              updateItem(category.id, item.id, 'tag', e.target.value)
                            }
                            placeholder="Etiqueta (ej: Favorito) — opcional"
                            className="flex-1 rounded-lg border border-espresso/15 px-3 py-1.5 font-sans text-xs outline-none focus:border-terracotta"
                          />
                          <button
                            onClick={() => removeItem(category.id, item.id)}
                            className="whitespace-nowrap rounded-full px-3 py-1 font-sans text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Eliminar plato
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => addItem(category.id)}
                className="mt-4 rounded-full border border-espresso/20 px-4 py-1.5 font-sans text-sm text-espresso hover:bg-latte"
              >
                + Agregar plato
              </button>
            </section>
          ))}
        </div>

        <button
          onClick={addCategory}
          className="mt-8 w-full rounded-2xl border-2 border-dashed border-espresso/20 py-4 font-sans text-sm font-medium text-espresso/70 hover:border-terracotta hover:text-terracotta"
        >
          + Agregar categoría
        </button>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-espresso/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-6 py-4">
          {savedFlash && (
            <span className="font-sans text-sm text-green-700">
              Guardado ✓ — se publica en el sitio en ~1 min
            </span>
          )}
          {dirty && !savedFlash && (
            <span className="font-sans text-sm text-espresso/50">Cambios sin guardar</span>
          )}
          <button
            onClick={saveAll}
            disabled={!dirty || saving}
            className="rounded-full bg-espresso px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-terracotta disabled:opacity-40"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
