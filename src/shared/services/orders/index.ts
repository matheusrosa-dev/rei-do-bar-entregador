import { api } from "../api";
import type {
  DeliverOrder,
  GetDeliveredCount,
  GetDeliveredCountResponse,
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

  const getDeliveredCount: GetDeliveredCount = async () => {
    const response = await api.get<GetDeliveredCountResponse>(
      `${baseUrl}/delivered-count`,
    );

    return response.data.data;
  };

  return {
    getOrders: {
      fn: getOrders,
      key: "get-orders",
    },
    deliverOrder,
    getDeliveredCount: {
      fn: getDeliveredCount,
      key: "get-delivered-count",
    },
  };
};
