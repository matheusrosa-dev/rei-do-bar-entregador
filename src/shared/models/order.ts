export interface IOrderItem {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  orderNumber: number;
  address: string;
  total: number;
  paymentType: PaymentType;
  items: IOrderItem[];
}

export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  PIX = "PIX",
}
