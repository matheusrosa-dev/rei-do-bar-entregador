import { api } from "../api";
import type {
  DeliverOrder,
  GetOrders,
  GetOrdersResponse,
  UseOrdersService,
} from "./types";

export const useOrdersService: UseOrdersService = () => {
  const baseUrl = "/orders";

  const getOrders: GetOrders = async () => {
    const response = await api.get<GetOrdersResponse>(`${baseUrl}`);

    return response.data.data;
  };

  const deliverOrder: DeliverOrder = async (orderId) => {
    await api.patch<void>(`${baseUrl}/${orderId}/deliver`);
  };

  return {
    getOrders: {
      fn: getOrders,
      key: "get-orders",
    },
    deliverOrder,
  };
};
