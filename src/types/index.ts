export type OrderStatus = 'Cancelled' | 'Order Placed' | 'Payment Completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Clerk {
  id: string;
  name: string;
  avatar?: string;
}

export interface Order {
  id: string;
  orderId: number;
  userInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  courtComplex: string;
  products: string[];
  orderDate: string;
  status: OrderStatus;
  hasEsign: boolean;
  tags: Tag[];
  note?: string;
  clerk?: Clerk;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}
