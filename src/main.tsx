import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useSessionStore } from "@shared/stores/session";

// So existem as rotas `/` e `/minhas-entregas`: qualquer outra cai no notFound
// e volta para a pagina permitida da sessao atual.
const NotFound = () => {
  const session = useSessionStore((state) => state.session);

  return <Navigate to={session ? "/minhas-entregas" : "/"} replace />;
};

const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });

const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Sem isso, os guards de `beforeLoad` so voltariam a rodar na proxima navegacao:
// quando o interceptor destroi uma sessao expirada o usuario continuaria em uma
// rota privada. Comparamos como booleano porque o objeto de sessao e substituido
// a cada refresh de token, e os guards so se importam com a presenca dela.
useSessionStore.subscribe((state, prevState) => {
  if (Boolean(state.session) === Boolean(prevState.session)) return;

  // O cache so e descartado depois que o redirect termina: limpa-lo enquanto a
  // rota privada ainda esta montada faria suas queries ativas refetcharem (sem
  // token) em vez de apenas descartar os dados da sessao anterior.
  router.invalidate().then(() => {
    if (!state.session) {
      queryClient.clear();
    }
  });
});

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster theme="dark" richColors position="top-right" />
      </QueryClientProvider>
    </StrictMode>,
  );
}
