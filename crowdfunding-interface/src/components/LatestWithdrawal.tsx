import { WithdrawnEvent } from "@/lib/type";
import { shortenAddress } from "@/lib/utils";
import { ExternalLink, LoaderCircle } from "lucide-react";

interface LatestWithdrawalProps {
  isLoading: boolean;
  latestWithdrawals: WithdrawnEvent[] | null;
}

const LatestWithdrawal = ({
  isLoading,
  latestWithdrawals,
}: LatestWithdrawalProps) => {
  return (
    <section id="withdrawals" className="scroll-mt-24 py-16 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-ink-200 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-ink-400">
            Owner
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
            Latest withdrawals
          </h2>
        </div>
      </div>

      <div className="space-y-0">
        {isLoading && (
          <div className="flex items-center gap-3 py-8 text-ink-400">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading events…</span>
          </div>
        )}

        {!isLoading &&
          (!latestWithdrawals || latestWithdrawals.length === 0) && (
            <p className="py-8 text-sm text-ink-400">No withdrawals yet.</p>
          )}

        {!isLoading &&
          latestWithdrawals &&
          latestWithdrawals.length > 0 &&
          latestWithdrawals.map((item) => (
            <div
              key={item.txHash}
              className="group grid grid-cols-1 items-center gap-3 border-b border-ink-200 py-5 transition hover:bg-ink-100/60 sm:grid-cols-[1fr_1.2fr] sm:gap-6"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
                  Value
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink-950">
                  {item.value}{" "}
                  <span className="text-sm font-sans font-normal text-ink-400">
                    ETH
                  </span>
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
                  Transaction
                </p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900 sm:justify-end"
                >
                  {shortenAddress(item.txHash)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default LatestWithdrawal;
