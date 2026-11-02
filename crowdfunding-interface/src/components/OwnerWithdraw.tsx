import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, Wallet } from "lucide-react";
import Button from "./Button";
import useEthers from "@/hooks/useEthers";
import {
  getContractOwner,
  handleWithdrawFromContract,
} from "@/contracts/contractInteractions";
import { shortenAddress } from "@/lib/utils";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

interface OwnerWithdrawProps {
  crowdfBalance: string | null;
  fetchContractInfor: () => void;
}

const OwnerWithdraw = ({
  crowdfBalance,
  fetchContractInfor,
}: OwnerWithdrawProps) => {
  const { provider, signer } = useEthers();
  const { address, isConnected } = useWeb3ModalAccount();
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    async function loadOwner() {
      if (!provider) {
        setOwner(null);
        return;
      }
      const nextOwner = await getContractOwner(provider);
      setOwner(nextOwner);
    }
    loadOwner();
  }, [provider]);

  const isOwner =
    !!isConnected &&
    !!address &&
    !!owner &&
    address.toLowerCase() === owner.toLowerCase();

  if (!isOwner) return null;

  const balanceNum = Number(crowdfBalance ?? 0);
  const hasBalance = Number.isFinite(balanceNum) && balanceNum > 0;

  const onWithdraw = async () => {
    if (!signer) return;
    if (!hasBalance) {
      alert("Contract balance is already 0.");
      return;
    }

    setIsLoading(true);
    setTxHash(null);
    try {
      const tx = await handleWithdrawFromContract(signer);
      if (!tx) {
        alert("Withdraw failed.");
        return;
      }
      setTxHash(tx.hash);
      await tx.wait();
      fetchContractInfor();
      alert("Withdraw successful — check MetaMask (Sepolia).");
    } catch (error) {
      console.error(error);
      alert("Withdraw failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-ink-900 bg-ink-950 p-5 text-white md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-ink-300">
            <Wallet className="h-3.5 w-3.5" />
            Owner panel
          </p>
          <p className="mt-2 text-sm text-ink-200">
            Ví của bạn là chủ contract. Có thể rút toàn bộ số dư về MetaMask.
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Balance: {crowdfBalance ?? "0"} ETH
          </p>
          {txHash && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              className="mt-2 inline-flex items-center gap-1 text-xs text-ink-300 transition hover:text-white"
            >
              {shortenAddress(txHash)}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <Button
          disabled={isLoading || !hasBalance}
          onClick={onWithdraw}
          className="h-11 min-w-[150px] bg-white text-ink-950 hover:bg-ink-100"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Withdrawing…
            </>
          ) : (
            "Withdraw"
          )}
        </Button>
      </div>
    </div>
  );
};

export default OwnerWithdraw;
