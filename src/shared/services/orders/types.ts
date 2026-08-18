import type { IOrder } from "@shared/models";

export type GetOrdersResponse = IOrder[];

export type GetOrders = () => Promise<GetOrdersResponse>;

export type DeliverOrder = (orderId: string) => Promise<void>;

export type GetDeliveredCountResponse = {
  deliveredCount: number;
};

export type GetDeliveredCount = () => Promise<GetDeliveredCountResponse>;

export type UseOrdersService = () => {
  getOrders: {
    fn: GetOrders;
    key: string;
  };
  deliverOrder: DeliverOrder;
  getDeliveredCount: {
    fn: GetDeliveredCount;
    key: string;
  };
};
