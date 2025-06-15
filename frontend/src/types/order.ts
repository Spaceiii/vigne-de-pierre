export type OrderStatus = 'pending' | 'confirmed' | 'ready_for_pickup' | 'delivered' | 'cancelled';

export interface OrderItem {
  id?: number;
  wineSlug: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderFormData {
  pickupInfo: string;
  contactPhone: string;
  contactEmail: string;
  items: OrderItem[];
}

export interface Order {
  id?: number;
  userId: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  pickupInfo: string;
  contactPhone: string;
  contactEmail: string;
  items: OrderItem[];
}
