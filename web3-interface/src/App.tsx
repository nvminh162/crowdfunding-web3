import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { FiExternalLink } from "react-icons/fi";
import { HandCoinsIcon } from "./components/HandCoinsIcon";
import { contractAddress, shortenAddr } from "./constants/contractData";

export default function App() {
  // Hook kết nối ví từ Reown AppKit
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  // Hook lấy số dư từ Wagmi
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  // Format địa chỉ ví dạng 0x402c...CE32 khi đã kết nối
  const formattedAddress = address ? shortenAddr(address) : "";

  // Format số dư dạng "3.417 SepoliaETH" dùng formatEther từ viem
  const formattedBalance = balanceData
    ? `${parseFloat(formatEther(balanceData.value)).toFixed(3)} ${balanceData.symbol}`
    : "";

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0b0f19] font-['Inter',sans-serif] px-6 py-8 sm:px-12 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <header className="flex items-center justify-between gap-4 pb-1">
          {/* Left: Title + Contract Address */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-[#0b0f19]">
              Crowdfunding
            </h1>
            <a
              href={`https://sepolia.etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0b0f19] hover:opacity-80 transition-opacity"
            >
              <span className="font-mono text-xs text-slate-600">
                {shortenAddr(contractAddress)}
              </span>
              <FiExternalLink className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
            </a>
          </div>

          {/* Right: Wallet Button & Balance */}
          <div className="flex items-center gap-3">
            {isConnected && formattedBalance && (
              <span className="text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
                {formattedBalance}
              </span>
            )}
            <button
              onClick={() => open()}
              className="bg-[#0b0f19] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              {isConnected ? formattedAddress : "Connect Wallet"}
            </button>
          </div>
        </header>

        {/* MAIN CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN - STATS (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            {/* Stat Card 1: Total amount funding */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] h-[76px] flex flex-col justify-start">
              <span className="text-xs font-bold text-[#0b0f19]">
                Total amount funding
              </span>
            </div>

            {/* Stat Card 2: Funders */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] h-[76px] flex flex-col justify-start">
              <span className="text-xs font-bold text-[#0b0f19]">Funders</span>
            </div>
          </div>

          {/* RIGHT COLUMN - DONATE FORM & GRAPHIC (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.05)] relative overflow-hidden h-[216px] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 h-full">
              {/* Form Content */}
              <div className="z-10 flex flex-col justify-between h-full space-y-4">
                {/* Section Title & Form */}
                <div className="mb-1">
                  <h2 className="text-base font-bold text-[#0b0f19] tracking-tight">
                    Donate your Ether
                  </h2>

                  {/* Input + Button Form */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <input
                      type="text"
                      placeholder="Amount"
                      className="w-44 sm:w-52 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-300 bg-white focus:outline-none focus:border-slate-400"
                    />
                    <button className="bg-[#0b0f19] hover:bg-[#1e293b] text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm cursor-pointer">
                      Fund
                    </button>
                  </div>
                </div>
              </div>

              {/* Vector Graphic (Hand & Coins) */}
              <div className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 pointer-events-none self-end sm:self-auto">
                <HandCoinsIcon className="w-32 h-32 sm:w-36 sm:h-36 text-slate-200/90 stroke-[3.5]" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - LATEST DONATION */}
        <section className="pt-8">
          <h3 className="text-xs font-bold text-[#0b0f19] mb-2">
            Latest Donation
          </h3>
          <p className="text-xs text-slate-500 font-normal">No data to show.</p>
        </section>
      </div>
    </div>
  );
}
