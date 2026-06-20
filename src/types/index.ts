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

export interface CourtInfo {
  name: string;
  location: string;
}

export interface ProductItem {
  classification: 'Judgement' | 'Interim Order' | 'Other';
  trackingToken?: string;
  subClause?: string;
  amount: string;
}

export interface Order {
  id: string;
  orderId: number;
  userInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  courtComplex: CourtInfo;
  products: ProductItem[];
  orderDate: string;
  status: OrderStatus;
  hasEsign: boolean;
  tags: Tag[];
  note?: string;
  ecopyFileName?: string;
  clerk?: Clerk;
  address?: string;
  trackingId?: string;
  paymentCompletedDate?: string;
  appliedDate?: string;
  dispatchedDate?: string;
  deliveredDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}
