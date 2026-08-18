import { Button, ConfirmModal } from "@components";
import { useOrdersService } from "@services";
import type { IOrder } from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  order: IOrder;
};

export const DeliverOrderButton = ({ order }: Props) => {
  const { getOrders, deliverOrder } = useOrdersService();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: triggerDeliver, isPending } = useMutation({
    mutationFn: () => deliverOrder(order.id),
    onSuccess: () => {
      toast.success("Pedido entregue!");
    },
    onSettled: () => {
      setIsModalOpen(false);

      queryClient.invalidateQueries({ queryKey: [getOrders.key] });
    },
  });

  return (
    <>
      <Button className="w-full" onClick={() => setIsModalOpen(true)}>
        Marcar como entregue
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar entrega"
        description={`O pedido #${order.orderNumber} será marcado como entregue.`}
        confirmLabel="Confirmar"
        canClose={!isPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => triggerDeliver()}
      />
    </>
  );
};
