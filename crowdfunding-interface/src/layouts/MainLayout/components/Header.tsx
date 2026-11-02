import Button from "@/components/Button";
import { contractAddr } from "@/contracts/contractData";
import { config } from "@/lib/config";
import { shortenAddress } from "@/lib/utils";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ExternalLink } from "lucide-react";

const Header = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="group flex min-w-0 items-center gap-3">
          <a href="#top" className="shrink-0">
            <img
              src={config.avatarUrl}
              alt={config.brand}
              className="h-9 w-9 object-cover"
            />
          </a>
          <div className="min-w-0 leading-tight">
            <a
              href="#top"
              className="block truncate font-display text-base font-bold tracking-tight text-ink-900 md:text-lg"
            >
              {config.brand}
            </a>
            <a
              href={`https://sepolia.etherscan.io/address/${contractAddr}`}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-ink-500 transition hover:text-ink-900"
            >
              {shortenAddress(contractAddr)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-ink-500 md:flex">
          <a href="#donate" className="transition hover:text-ink-900">
            Donate
          </a>
          <a href="#activity" className="transition hover:text-ink-900">
            Activity
          </a>
          <a href="#withdrawals" className="transition hover:text-ink-900">
            Withdrawals
          </a>
          <a href="#contact" className="transition hover:text-ink-900">
            Contact
          </a>
        </nav>

        <Button
          onClick={() =>
            open({
              view: isConnected ? "Account" : "Connect",
            })
          }
        >
          {isConnected
            ? shortenAddress(address as string)
            : "Connect Wallet"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
