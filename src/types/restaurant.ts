export type TableStatus = 'free' | 'occupied' | 'waiting' | 'serving';

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  position: { x: number; y: number };
  capacity: number;
}

export type OrderStatus = 'new' | 'cooking' | 'ready';

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  total: number;
}

export interface KitchenOrder extends Order {
  prepTime?: number; // minutes
}
