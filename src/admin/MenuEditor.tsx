import { useEffect, useRef, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { signOut } from 'firebase/auth'
import { auth, db, storage } from '../lib/firebase'
import { menu as sampleMenu, type MenuCategory, type MenuItem } from '../data/menu'

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

export default function MenuEditor() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState<Record<string, boolean>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState<string | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const loadMenu = async () => {
    if (!db) return
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'menu'), orderBy('order', 'asc')))
      setCategories(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuCategory, 'id'>) })),
      )
    } catch {
      setError('No se pudo cargar el menú. Revisá tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markDirty = (categoryId: string) => setDirty((d) => ({ ...d, [categoryId]: true }))

  const updateCategory = (categoryId: string, field: 'title' | 'subtitle', value: string) => {
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, [field]: value } : c)),
    )
    markDirty(categoryId)
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
          : {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId ? { ...it, [field]: value } : it,
              ),
            },
      ),
    )
    markDirty(categoryId)
  }

  const addItem = (categoryId: string) => {
    setCategories((cats) =>
      cats.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, blankItem()] } : c)),
    )
    markDirty(categoryId)
  }

  const removeItem = (categoryId: string, itemId: string) => {
    if (!window.confirm('¿Eliminar este plato del menú?')) return
    setCategories((cats) =>
      cats.map((c) =>
        c.id === categoryId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c,
      ),
    )
    markDirty(categoryId)
  }

  const saveCategory = async (categoryId: string) => {
    if (!db) return
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return
    setSavingId(categoryId)
    setError('')
    try {
      const { id, ...data } = category
      await setDoc(doc(db, 'menu', id), data)
      setDirty((d) => ({ ...d, [categoryId]: false }))
      setSavedFlash(categoryId)
      setTimeout(() => setSavedFlash((s) => (s === categoryId ? null : s)), 2000)
    } catch {
      setError('No se pudieron guardar los cambios. Intentá de nuevo.')
    } finally {
      setSavingId(null)
    }
  }

  const uploadImage = async (categoryId: string, itemId: string, file: File) => {
    if (!storage) return
    const key = `${categoryId}:${itemId}`
    setUploadingKey(key)
    setError('')
    try {
      const path = `menu/${categoryId}/${itemId}-${Date.now()}-${slugify(file.name)}`
      const fileRef = ref(storage, path)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      updateItem(categoryId, itemId, 'image', url)
    } catch {
      setError('No se pudo subir la foto. Probá con otra imagen.')
    } finally {
      setUploadingKey(null)
    }
  }

  const addCategory = async () => {
    if (!db) return
    const title = window.prompt('Nombre de la nueva categoría (ej: Bebidas frías):')
    if (!title || !title.trim()) return
    const id = `${slugify(title)}-${Date.now().toString(36)}`
    const newCategory: MenuCategory = {
      id,
      title: title.trim(),
      subtitle: '',
      items: [],
    }
    try {
      await setDoc(doc(db, 'menu', id), {
        title: newCategory.title,
        subtitle: newCategory.subtitle,
        order: categories.length,
        items: [],
      })
      setCategories((cats) => [...cats, newCategory])
    } catch {
      setError('No se pudo crear la categoría.')
    }
  }

  const removeCategory = async (categoryId: string, title: string) => {
    if (!db) return
    if (!window.confirm(`¿Eliminar la categoría "${title}" y todos sus platos?`)) return
    try {
      await deleteDoc(doc(db, 'menu', categoryId))
      setCategories((cats) => cats.filter((c) => c.id !== categoryId))
    } catch {
      setError('No se pudo eliminar la categoría.')
    }
  }

  const loadSampleMenu = async () => {
    const database = db
    if (!database) return
    if (
      !window.confirm(
        'Esto va a cargar el menú de ejemplo del sitio como punto de partida. ¿Continuar?',
      )
    )
      return
    setLoading(true)
    try {
      await Promise.all(
        sampleMenu.map((cat, index) => {
          const { id, ...data } = cat
          return setDoc(doc(database, 'menu', id), { ...data, order: index })
        }),
      )
      await loadMenu()
    } catch {
      setError('No se pudo cargar el menú de ejemplo.')
      setLoading(false)
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
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-10 border-b border-espresso/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-xl text-espresso">Panel de administración</h1>
            <p className="font-sans text-xs text-espresso/60">Editá precios, fotos y platos</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="./"
              className="font-sans text-sm text-espresso/70 underline-offset-2 hover:underline"
            >
              Ver sitio
            </a>
            <button
              onClick={() => auth && signOut(auth)}
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

        {categories.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-soft">
            <p className="font-sans text-espresso/70">Todavía no hay ningún plato cargado.</p>
            <button
              onClick={loadSampleMenu}
              className="mt-4 rounded-full bg-espresso px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-terracotta"
            >
              Cargar menú de ejemplo
            </button>
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => addItem(category.id)}
                  className="rounded-full border border-espresso/20 px-4 py-1.5 font-sans text-sm text-espresso hover:bg-latte"
                >
                  + Agregar plato
                </button>

                <div className="flex items-center gap-3">
                  {savedFlash === category.id && (
                    <span className="font-sans text-sm text-green-700">Guardado ✓</span>
                  )}
                  <button
                    onClick={() => saveCategory(category.id)}
                    disabled={!dirty[category.id] || savingId === category.id}
                    className="rounded-full bg-espresso px-5 py-2 font-sans text-sm font-semibold text-cream hover:bg-terracotta disabled:opacity-40"
                  >
                    {savingId === category.id ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>

        {categories.length > 0 && (
          <button
            onClick={addCategory}
            className="mt-8 w-full rounded-2xl border-2 border-dashed border-espresso/20 py-4 font-sans text-sm font-medium text-espresso/70 hover:border-terracotta hover:text-terracotta"
          >
            + Agregar categoría
          </button>
        )}
      </main>
    </div>
  )
}
