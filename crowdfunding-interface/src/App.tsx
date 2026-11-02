import { MainLayout } from "./layouts/MainLayout";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import useEthers from "./hooks/useEthers";
import { useEffect, useState } from "react";
import {
  getContractBalance,
  getFundedEvents,
  getFundersLength,
} from "./contracts/contractInteractions";
import { contractAddr } from "./contracts/contractData";
import FundCard from "./components/FundCard";
import LatestDonation from "./components/LatestDonation";
import { FundedEvent } from "./lib/type";
import Hero from "./components/Hero";
import StatsRow from "./components/StatsRow";
import ContactSection from "./components/ContactSection";
import { config } from "./lib/config";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
};

const metadata = {
  name: config.brand,
  description: config.tagline,
  url: "https://github.com/nvminh162",
  icons: [config.avatarUrl],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#171715",
    "--w3m-border-radius-master": "0px",
  },
});

function App() {
  const { provider } = useEthers();
  const [crowdfBalance, setCrowdfBalance] = useState<string | null>(null);
  const [funders, setFunders] = useState<number | null>(null);
  const [latestEvents, setLatestEvents] = useState<FundedEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCrowfundingInfor = async () => {
    setIsLoading(true);
    try {
      if (provider) {
        const balance = await getContractBalance(provider, contractAddr);
        const nextFunders = await getFundersLength(provider);
        const events = await getFundedEvents(provider);
        setCrowdfBalance(balance);
        setFunders(nextFunders);
        setLatestEvents(events ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrowfundingInfor();
  }, [provider]);

  return (
    <MainLayout>
      <Hero />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <section className="grid gap-6 border-b border-ink-200 py-14 md:grid-cols-[0.85fr_1.15fr] md:gap-8 md:py-16">
          <StatsRow
            crowdfBalance={crowdfBalance}
            funders={funders}
            isLoading={isLoading}
          />
          <FundCard fetchContractInfor={fetchCrowfundingInfor} />
        </section>

        <LatestDonation isLoading={isLoading} latestEvents={latestEvents} />
        <ContactSection />

        <footer className="flex flex-col gap-2 border-t border-ink-200 py-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {config.brand}. Sepolia only.
          </p>
          <p className="tracking-[0.18em] uppercase">Built with Foundry + Vite</p>
        </footer>
      </div>
    </MainLayout>
  );
}

export default App;
