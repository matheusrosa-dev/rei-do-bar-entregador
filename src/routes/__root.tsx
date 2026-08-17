import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <main className="h-dvh w-full overflow-auto">
    <Outlet />

    <TanStackRouterDevtools />
  </main>
);

export const Route = createRootRoute({ component: RootLayout });
