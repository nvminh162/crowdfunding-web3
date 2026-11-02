import { LoaderCircle } from "lucide-react";

interface StatsRowProps {
  crowdfBalance: string | null;
  funders: number | null;
  isLoading: boolean;
}

const StatsRow = ({ crowdfBalance, funders, isLoading }: StatsRowProps) => {
  return (
    <div className="grid grid-cols-2 gap-px border border-ink-200 bg-ink-200">
      <div className="bg-white p-5 md:p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-400">
          Total funded
        </p>
        {isLoading ? (
          <LoaderCircle className="mt-3 h-5 w-5 animate-spin text-ink-400" />
        ) : (
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
            {crowdfBalance ?? "—"}
            <span className="ml-1 font-sans text-sm font-normal text-ink-400">
              ETH
            </span>
          </p>
        )}
      </div>
      <div className="bg-white p-5 md:p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-400">
          Funders
        </p>
        {isLoading ? (
          <LoaderCircle className="mt-3 h-5 w-5 animate-spin text-ink-400" />
        ) : (
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
            {funders ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsRow;
