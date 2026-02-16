export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  calories: number;
  image: string;
  sellerId: string;
  discount?: number;
  category?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalPrice: number;
  totalCalories: number;
  paymentMethod: 'online' | 'cod';
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}
