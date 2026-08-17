import { yupResolver } from "@hookform/resolvers/yup";
import { isValidCpf } from "@shared/helpers/cpf";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const ONLY_DIGITS = /^\d+$/;

const schema = yup.object({
  cpf: yup
    .string()
    .matches(ONLY_DIGITS, "Apenas dígitos")
    .length(11, "Informe 11 dígitos")
    .test("cpf-check", "CPF inválido", (value) =>
      typeof value === "string" ? isValidCpf(value) : false,
    )
    .required("Campo obrigatório"),
  password: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72, "Máximo 72 caracteres")
    .required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  cpf: "",
  password: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;
