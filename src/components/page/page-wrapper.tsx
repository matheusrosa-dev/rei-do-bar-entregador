export type Props = {
  title: string;
  children: React.ReactNode;
  headerContent?: () => React.ReactNode;
};

export const PageWrapper = ({
  title,
  children,
  headerContent: HeaderContent,
}: Props) => {
  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center px-5 h-18 border-b border-white/10 bg-white/3 select-none">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg tracking-tight">
            {title}
          </h3>
        </div>

        {HeaderContent && <HeaderContent />}
      </header>

      <div className="p-5 overflow-auto flex-1 flex flex-col">{children}</div>
    </div>
  );
};
