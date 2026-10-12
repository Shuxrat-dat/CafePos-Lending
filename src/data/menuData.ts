export interface MenuItem {
  id: string;
  name: {
    ru: string;
    uz: string;
  };
  category: string;
  price: number;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: {
    ru: string;
    uz: string;
  };
  icon: string;
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'hot-dishes',
    name: { ru: 'Горячие блюда', uz: 'Issiq taomlar' },
    icon: '🍽️',
  },
  {
    id: 'salads',
    name: { ru: 'Салаты', uz: 'Salatlar' },
    icon: '🥗',
  },
  {
    id: 'drinks',
    name: { ru: 'Напитки', uz: 'Ichimliklar' },
    icon: '☕',
  },
  {
    id: 'desserts',
    name: { ru: 'Десерты', uz: 'Desertlar' },
    icon: '🍰',
  },
];

export const menuItems: MenuItem[] = [
  // Hot dishes
  {
    id: 'pasta-carbonara',
    name: { ru: 'Паста Карбонара', uz: 'Karbonara pastasi' },
    category: 'hot-dishes',
    price: 85000,
  },
  {
    id: 'grilled-chicken',
    name: { ru: 'Курица гриль', uz: 'Gril tovuq' },
    category: 'hot-dishes',
    price: 95000,
  },
  {
    id: 'beef-steak',
    name: { ru: 'Стейк из говядины', uz: 'Mol go\'shti bifshteksi' },
    category: 'hot-dishes',
    price: 145000,
  },
  {
    id: 'salmon-fillet',
    name: { ru: 'Филе лосося', uz: 'Losos filesi' },
    category: 'hot-dishes',
    price: 135000,
  },
  
  // Salads
  {
    id: 'caesar-salad',
    name: { ru: 'Салат Цезарь', uz: 'Sezar salati' },
    category: 'salads',
    price: 65000,
  },
  {
    id: 'greek-salad',
    name: { ru: 'Греческий салат', uz: 'Yunon salati' },
    category: 'salads',
    price: 55000,
  },
  {
    id: 'tuna-salad',
    name: { ru: 'Салат с тунцом', uz: 'Tuna baliq salati' },
    category: 'salads',
    price: 75000,
  },
  
  // Drinks
  {
    id: 'espresso',
    name: { ru: 'Эспрессо', uz: 'Espresso' },
    category: 'drinks',
    price: 18000,
  },
  {
    id: 'cappuccino',
    name: { ru: 'Капучино', uz: 'Kapuchino' },
    category: 'drinks',
    price: 25000,
  },
  {
    id: 'latte',
    name: { ru: 'Латте', uz: 'Latte' },
    category: 'drinks',
    price: 28000,
  },
  {
    id: 'orange-juice',
    name: { ru: 'Апельсиновый сок', uz: 'Apelsin sharbati' },
    category: 'drinks',
    price: 22000,
  },
  {
    id: 'mineral-water',
    name: { ru: 'Минеральная вода', uz: 'Mineral suv' },
    category: 'drinks',
    price: 12000,
  },
  
  // Desserts
  {
    id: 'tiramisu',
    name: { ru: 'Тирамису', uz: 'Tiramisu' },
    category: 'desserts',
    price: 45000,
  },
  {
    id: 'cheesecake',
    name: { ru: 'Чизкейк', uz: 'Chizkeyk' },
    category: 'desserts',
    price: 42000,
  },
  {
    id: 'ice-cream',
    name: { ru: 'Мороженое', uz: 'Muzqaymoq' },
    category: 'desserts',
    price: 28000,
  },
];

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter(item => item.category === categoryId);
}

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}
