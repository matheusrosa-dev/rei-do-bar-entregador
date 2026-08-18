import { ImagePreview, StatusBadge, Wrapper } from "@components";
import { formatPrice } from "@shared/helpers/number";
import { PAYMENT_TYPE_LABEL } from "@shared/helpers/order";
import type { IOrder } from "@shared/models";
import { DeliverOrderButton } from "./deliver-order-button";

type Props = {
  order: IOrder;
};

export const OrderCard = ({ order }: Props) => {
  return (
    <Wrapper className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-white font-bold tracking-tight">
            Pedido #{order.orderNumber}
          </span>

          <span className="text-zinc-400 text-sm">{order.address}</span>
        </div>

        <StatusBadge variant="neutral">
          {PAYMENT_TYPE_LABEL[order.paymentType]}
        </StatusBadge>
      </div>

      <ul className="flex flex-col gap-3 border-t border-white/10 pt-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <ImagePreview src={item.imageUrl} className="size-12 shrink-0" />

            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-white text-sm font-medium truncate">
                {item.name}
              </span>

              <span className="text-zinc-400 text-xs">
                {item.quantity}x {formatPrice(item.price)}
              </span>
            </div>

            <span className="text-zinc-300 text-sm font-medium">
              {formatPrice(item.quantity * item.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-zinc-400 text-sm">Total a cobrar</span>

        <span className="text-white font-bold">{formatPrice(order.total)}</span>
      </div>

      <DeliverOrderButton order={order} />
    </Wrapper>
  );
};
