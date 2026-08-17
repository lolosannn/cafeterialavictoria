import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, firebaseReady } from '../lib/firebase'
import { menu as seedMenu, type MenuCategory } from '../data/menu'

export function useMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>(seedMenu)
  const [loading, setLoading] = useState(firebaseReady)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!firebaseReady || !db) {
      setLoading(false)
      return
    }

    const q = query(collection(db, 'menu'), orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setCategories(seedMenu)
          setLive(false)
        } else {
          setCategories(
            snapshot.docs.map((doc) => {
              const data = doc.data() as Omit<MenuCategory, 'id'>
              return { id: doc.id, ...data }
            }),
          )
          setLive(true)
        }
        setLoading(false)
      },
      () => {
        setCategories(seedMenu)
        setLive(false)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return { categories, loading, live }
}
