import axios, { type AxiosError } from "axios";
import type {
  IApiError,
  RetryableAxiosRequestConfig,
  TypedAxiosInstance,
} from "./types";
import { useSessionStore } from "../stores/session";
import type { ISession } from "../models";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: { indexes: null },
}) as TypedAxiosInstance;

api.interceptors.request.use(async (config) => {
  const { session } = useSessionStore.getState();

  if (session) {
    const isRefreshRoute = config.url?.includes("/auth/refresh");
    const isLogoutRoute = config.url?.includes("/auth/logout");
    const token =
      isRefreshRoute || isLogoutRoute
        ? session.refreshToken
        : session.accessToken;

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let sessionExpiredToastShowing = false;

const refreshSession = async () => {
  const { data } = await api.post<ISession>("/auth/refresh");

  return data.data;
};

const onCommonError = (error: IApiError) => {
  const { code, message } = error.response?.data ?? {};

  if (typeof message === "string") {
    toast.error(message, { description: code });
  } else {
    toast.error("Erro desconhecido.", { description: code });
  }

  return Promise.reject(error);
};

const onSessionExpired = async () => {
  const { destroySession } = useSessionStore.getState();

  destroySession();

  if (sessionExpiredToastShowing) return;

  sessionExpiredToastShowing = true;

  toast.error("Sessão expirada. Por favor, faça login novamente.", {
    onDismiss: () => {
      sessionExpiredToastShowing = false;
    },
    onAutoClose: () => {
      sessionExpiredToastShowing = false;
    },
  });
};

// Mutex de refresh: garante que apenas um refresh seja executado por vez.
// Requests concorrentes com 401 aguardam a mesma Promise em vez de
// cada uma disparar seu proprio refresh (o que esgotaria o token de uso unico).
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 1) Lemos o estado atual da sessao e o metodo que tenta renovar o token.
    const { session, createSession } = useSessionStore.getState();

    // 2) Guardamos a request original para possivel replay apos refresh.
    const originalRequest = error.config as RetryableAxiosRequestConfig;

    // 3) Se nao existe sessao local, nao faz sentido tentar renovar.
    // 4) Sem request original nao e possivel repetir a chamada com seguranca.
    if (!session || !originalRequest) {
      return onCommonError(error as IApiError);
    }

    // 5) Nunca tentamos refresh quando o proprio endpoint de refresh falha.
    //    Isso evita recursao infinita no interceptor. Apenas propagamos o erro:
    //    quem trata e o catch da request original, que ja distingue 401 (sessao
    //    expirada) de qualquer outra falha do refresh.
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // 6) Se nao for 401, nao ha fluxo de autenticacao para tratar.
    if (error.response?.status !== 401) {
      return onCommonError(error as IApiError);
    }

    // 7) Se essa request ja foi tentada apos refresh, encerramos e limpamos sessao.
    //    Evita loop quando o backend continua retornando 401.
    if (originalRequest._retry) {
      await onSessionExpired();

      return Promise.reject(error);
    }

    // 8) Marcamos a request como "ja retentada" antes de renovar a sessao.
    originalRequest._retry = true;

    try {
      // 9) Se ja existe um refresh em andamento, aguardamos ele terminar.
      //    Caso contrario, iniciamos um novo e armazenamos a Promise no mutex.
      if (!refreshPromise) {
        refreshPromise = refreshSession()
          .then((session) => {
            createSession(session);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      return api.request(originalRequest);
    } catch (refreshError) {
      // 10) Se ate o refresh retornar 401, invalida sessao local definitivamente.
      const refreshStatus = (refreshError as AxiosError).response?.status;

      if (refreshStatus === 401) {
        await onSessionExpired();

        return Promise.reject(error);
      }

      return onCommonError(refreshError as IApiError);
    }
  },
);

export { api };
