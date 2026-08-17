import type { PaymentType } from "@shared/models";

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  CASH: "Dinheiro",
  CARD: "Cartão",
  PIX: "PIX",
};
