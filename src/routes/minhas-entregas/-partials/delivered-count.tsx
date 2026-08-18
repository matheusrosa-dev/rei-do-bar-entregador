import { Wrapper } from "@components";

type Props = {
  count: number;
};

export const DeliveredCount = ({ count }: Props) => {
  return (
    <Wrapper className="mb-4 flex items-center justify-between gap-3">
      <span className="text-zinc-400 text-sm">Entregues nas últimas 10h</span>

      <span className="text-amber-500 font-bold text-2xl">{count}</span>
    </Wrapper>
  );
};
