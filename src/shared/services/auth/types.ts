export type LoginBody = {
  cpf: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type Login = (body: LoginBody) => Promise<LoginResponse>;

export type UseAuthService = () => {
  login: Login;
};
