import type { IOrder } from "@shared/models";

export type GetOrdersResponse = IOrder[];

export type GetOrders = () => Promise<GetOrdersResponse>;

export type UseOrdersService = () => {
  getOrders: {
    fn: GetOrders;
    key: string;
  };
};
