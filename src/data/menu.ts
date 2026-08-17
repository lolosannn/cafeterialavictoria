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

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`

export const menu: MenuCategory[] = [
  {
    id: 'cafes-calientes',
    title: 'Cafés calientes',
    subtitle: 'Granos de origen único, tostados cada semana',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        description: 'Doble shot, cuerpo intenso y crema dorada.',
        price: '$2.800',
        image: img('photo-1510707577719-ae7c14805e3a'),
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        description: 'Espresso, leche vaporizada y espuma sedosa.',
        price: '$3.400',
        image: img('photo-1541167760496-1628856ab772'),
        tag: 'Favorito',
      },
      {
        id: 'latte-vainilla',
        name: 'Latte de vainilla',
        description: 'Espresso suave con leche y toque de vainilla natural.',
        price: '$3.600',
        image: img('photo-1509042239860-f550ce710b93'),
      },
      {
        id: 'flat-white',
        name: 'Flat White',
        description: 'Doble espresso con microespuma bien texturizada.',
        price: '$3.500',
        image: img('photo-1461023058943-07fcbe16d735'),
      },
      {
        id: 'mocha',
        name: 'Mocha',
        description: 'Espresso, chocolate semiamargo y crema batida.',
        price: '$3.800',
        image: img('photo-1578314675249-a6910f80cc4e'),
      },
      {
        id: 'americano',
        name: 'Americano',
        description: 'Espresso alargado con agua caliente, suave y limpio.',
        price: '$2.900',
        image: img('photo-1447933601403-0c6688de566e'),
      },
    ],
  },
  {
    id: 'cafes-frios',
    title: 'Cafés fríos',
    subtitle: 'Ideales para las tardes de sol',
    items: [
      {
        id: 'iced-latte',
        name: 'Iced Latte',
        description: 'Espresso, leche fría y hielo en las rocas.',
        price: '$3.700',
        image: img('photo-1517701604599-bb29b565090c'),
      },
      {
        id: 'cold-brew',
        name: 'Cold Brew',
        description: 'Infusión en frío por 18 horas, suave y dulce naturalmente.',
        price: '$3.900',
        image: img('photo-1517959105821-eaf2591984ca'),
        tag: 'Nuevo',
      },
      {
        id: 'frappe-caramelo',
        name: 'Frappé de caramelo',
        description: 'Café batido con hielo, leche y caramelo artesanal.',
        price: '$4.200',
        image: img('photo-1461988320302-91bde64fc8e4'),
      },
      {
        id: 'affogato',
        name: 'Affogato',
        description: 'Helado de vainilla "ahogado" en un shot de espresso.',
        price: '$4.000',
        image: img('photo-1551030173-122aabc4489c'),
      },
    ],
  },
  {
    id: 'panaderia',
    title: 'Panadería de hoy',
    subtitle: 'Horneado fresco todas las mañanas',
    items: [
      {
        id: 'croissant-manteca',
        name: 'Croissant de manteca',
        description: 'Hojaldrado clásico, crocante por fuera y suave por dentro.',
        price: '$2.200',
        image: img('photo-1555507036-ab1f4038808a'),
        tag: 'Favorito',
      },
      {
        id: 'croissant-almendras',
        name: 'Croissant de almendras',
        description: 'Relleno de crema de almendras y almendras fileteadas.',
        price: '$2.800',
        image: img('photo-1509440159596-0249088772ff'),
      },
      {
        id: 'pain-chocolat',
        name: 'Pain au chocolat',
        description: 'Hojaldre de manteca con dos barras de chocolate belga.',
        price: '$2.700',
        image: img('photo-1608198093002-ad4e005484ec'),
      },
      {
        id: 'medialuna-jamon-queso',
        name: 'Croissant jamón y queso',
        description: 'Versión salada, gratinada con queso gruyère.',
        price: '$3.200',
        image: img('photo-1546548970-71785318a17b'),
      },
    ],
  },
  {
    id: 'tostadas',
    title: 'Tostadas',
    subtitle: 'Pan de masa madre horneado en casa',
    items: [
      {
        id: 'tostada-palta',
        name: 'Tostada de palta',
        description: 'Palta, limón, chile flakes y aceite de oliva.',
        price: '$4.500',
        image: img('photo-1541519227354-08fa5d50c44d'),
        tag: 'Favorito',
      },
      {
        id: 'tostada-francesa',
        name: 'Tostada francesa',
        description: 'Pan brioche, canela, frutos rojos y miel.',
        price: '$4.800',
        image: img('photo-1484723091739-30a097e8f929'),
      },
      {
        id: 'tostada-huevo-pochado',
        name: 'Tostada con huevo pochado',
        description: 'Huevo pochado, espinaca salteada y salsa holandesa.',
        price: '$4.900',
        image: img('photo-1525351484163-7529414344d8'),
      },
      {
        id: 'tostada-ricotta-miel',
        name: 'Tostada de ricotta y miel',
        description: 'Ricotta cremosa, miel de campo y nueces tostadas.',
        price: '$4.300',
        image: img('photo-1484723091739-30a097e8f929'),
      },
    ],
  },
  {
    id: 'cookies-reposteria',
    title: 'Cookies y repostería',
    subtitle: 'Dulces caseros para acompañar tu café',
    items: [
      {
        id: 'cookie-chips-chocolate',
        name: 'Cookie de chips de chocolate',
        description: 'Bordes crocantes, centro tierno y mucho chocolate.',
        price: '$2.100',
        image: img('photo-1499636136210-6f4ee915583e'),
        tag: 'Favorito',
      },
      {
        id: 'cookie-avena-pasas',
        name: 'Cookie de avena y pasas',
        description: 'Receta tradicional con avena integral y pasas de uva.',
        price: '$2.100',
        image: img('photo-1558961363-fa8fdf82db35'),
      },
      {
        id: 'brownie',
        name: 'Brownie de chocolate',
        description: 'Denso y fudgy, con nueces tostadas por encima.',
        price: '$2.600',
        image: img('photo-1606313564200-e75d5e30476c'),
      },
      {
        id: 'cheesecake',
        name: 'Cheesecake de frutos rojos',
        description: 'Base de galleta, queso crema y coulis casero.',
        price: '$3.400',
        image: img('photo-1524351199678-941a58a3df50'),
      },
      {
        id: 'muffin-arandanos',
        name: 'Muffin de arándanos',
        description: 'Esponjoso, con arándanos frescos y streusel crocante.',
        price: '$2.300',
        image: img('photo-1607958996333-41aef7caefaa'),
      },
    ],
  },
]
