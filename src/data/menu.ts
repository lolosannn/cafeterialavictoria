import menuData from './menu.json'

export type MenuItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  tag?: string
}

export type MenuCategory = {
  id: string
  title: string
  subtitle: string
  items: MenuItem[]
}

export const menu = menuData as MenuCategory[]
