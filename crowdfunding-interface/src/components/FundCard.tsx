import { ExternalLink, LoaderCircle, Check } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { handleFundToContract } from "@/contracts/contractInteractions";
import useEthers from "@/hooks/useEthers";
import { shortenAddress } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/ethers/react";

interface FundCardProps {
  fetchContractInfor: () => void;
}

const FundCard = ({ fetchContractInfor }: FundCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const { signer } = useEthers();
  const { open } = useWeb3Modal();

  const onFundToContract = async () => {
    const amount = Number(value);
    if (!amount || amount <= 0) {
      alert("Please enter an amount greater than 0.");
      return;
    }

    if (!signer) {
      open({ view: "Connect" });
      return;
    }

    setIsLoading(true);
    try {
      const tx = await handleFundToContract(signer, amount);
      if (tx) {
        setTxHash(tx.hash);
        await tx.wait();
        setIsSuccess(true);
        fetchContractInfor();
      } else {
        alert("Transaction error!");
      }
    } catch (error) {
      console.error(error);
      alert("Transaction error!");
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseSuccess = () => {
    setIsSuccess(false);
    setValue("");
    setTxHash(null);
  };

  return (
    <div
      id="donate"
      className="scroll-mt-24 border border-ink-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)] md:p-8"
    >
      {isLoading && (
        <div className="flex min-h-[180px] items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-ink-900" />
          <div className="space-y-2 text-sm text-ink-500">
            <p className="font-medium text-ink-900">Transaction in progress…</p>
            {txHash && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                className="inline-flex items-center gap-1 text-ink-500 transition hover:text-ink-900"
              >
                {shortenAddress(txHash)}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {!isLoading && !isSuccess && (
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-ink-400">
              Donate
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
              Send Sepolia ETH
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
              Minimum about $5 USD (Chainlink price feed). Connect your wallet,
              enter an amount, then confirm in MetaMask.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label className="relative flex-1">
              <span className="sr-only">Amount in ETH</span>
              <input
                placeholder="0.01"
                className="h-12 w-full border border-ink-200 bg-ink-50 px-4 pr-14 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900"
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs tracking-widest text-ink-400">
                ETH
              </span>
            </label>
            <Button className="h-12 min-w-[140px]" onClick={onFundToContract}>
              {signer ? "Fund" : "Connect & Fund"}
            </Button>
          </div>
        </div>
      )}

      {!isLoading && isSuccess && (
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center border border-ink-900 bg-ink-900 text-white">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-ink-950">
                Thank you
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Your donation was confirmed on Sepolia.
              </p>
            </div>
          </div>
          {txHash && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              className="inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-900"
            >
              View transaction {shortenAddress(txHash)}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Button onClick={onCloseSuccess}>Donate again</Button>
        </div>
      )}
    </div>
  );
};

export default FundCard;
