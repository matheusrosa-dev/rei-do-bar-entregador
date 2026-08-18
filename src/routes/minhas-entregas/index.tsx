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
import { OrderCard } from "./-partials";

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
  const { getOrders } = useOrdersService();

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: [getOrders.key],
    queryFn: getOrders.fn,
    retry: false,
  });

  const headerContent = () => (
    <RefetchButton
      onRefetch={ordersQuery.refetch}
      isRefetching={ordersQuery.isRefetching}
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
