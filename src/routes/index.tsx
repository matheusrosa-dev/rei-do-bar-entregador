import { Button, CpfInput, Input } from "@components";
import { useAuthService } from "@services";
import { useSessionStore } from "@shared/stores/session";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "./-login-form";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (useSessionStore.getState().session) {
      throw redirect({ to: "/minhas-entregas", replace: true });
    }
  },
  component: Login,
});

function Login() {
  const { login } = useAuthService();
  const navigate = Route.useNavigate();
  const { createSession } = useSessionStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver });

  const { mutate: triggerLogin, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      createSession(session);

      navigate({ to: "/minhas-entregas", replace: true });
    },
  });

  const onSubmit = (data: Form) => {
    triggerLogin({ cpf: data.cpf, password: data.password });
  };

  return (
    <div className="min-h-full flex items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-6">
        <span className="text-white font-bold text-lg tracking-tight text-center">
          Rei do Bar - Entregador
        </span>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="cpf"
            render={({ field, fieldState }) => (
              <CpfInput
                label="CPF"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={isPending}
              />
            )}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={isPending}
            {...register("password")}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
