import {
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";
import { useOrdersService } from "@services";
import { useSessionStore } from "@shared/stores/session";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DeliveredCount, OrderCard } from "./-partials";

export const Route = createFileRoute("/minhas-entregas/")({
  beforeLoad: () => {
    if (!useSessionStore.getState().session) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: MinhasEntregas,
});

const TITLE = "Minhas entregas";

function MinhasEntregas() {
  const { getOrders, getDeliveredCount } = useOrdersService();

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: [getOrders.key],
    queryFn: getOrders.fn,
    retry: false,
  });

  const { data: deliveredCount, ...deliveredCountQuery } = useQuery({
    queryKey: [getDeliveredCount.key],
    queryFn: getDeliveredCount.fn,
    retry: false,
  });

  const onRefetch = () => {
    ordersQuery.refetch();
    deliveredCountQuery.refetch();
  };

  const headerContent = () => (
    <RefetchButton
      onRefetch={onRefetch}
      isRefetching={
        ordersQuery.isRefetching || deliveredCountQuery.isRefetching
      }
    />
  );

  if (ordersQuery.isLoading) {
    return <PageLoading title={TITLE} headerContent={headerContent} />;
  }

  if (ordersQuery.isError) {
    return <PageError title={TITLE} headerContent={headerContent} />;
  }

  return (
    <PageWrapper title={TITLE} headerContent={headerContent}>
      {deliveredCount !== undefined && (
        <DeliveredCount count={deliveredCount.deliveredCount} />
      )}

      {orders?.length ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-zinc-400 text-sm">
            Nenhuma entrega no momento.
          </span>
        </div>
      )}
    </PageWrapper>
  );
}
