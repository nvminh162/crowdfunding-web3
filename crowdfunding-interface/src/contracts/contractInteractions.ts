import { Contract, formatEther, parseEther } from "ethers";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { contractABI, contractAddr } from "./contractData";
import { TransactionResponse } from "ethers";
import { FundedEvent } from "@/lib/type";
import { AlchemyProvider } from "ethers";

// Read contract
export const getContractBalance = async (
  ethersProvider: BrowserProvider | AlchemyProvider,
  contract: string
) => {
  try {
    const balance = await ethersProvider.getBalance(contract);
    return formatEther(balance);
  } catch (error) {
    return null;
  }
};

export const getFundersLength = async (
  ethersProvider: BrowserProvider | AlchemyProvider
) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );
    const fundersLength = await crowdfundingContract.getFundersLength();
    return Number(fundersLength);
  } catch (error) {
    return null;
  }
};

// Sepolia deploy block of current Crowdfunding contract (make deploy-sepolia)
const CONTRACT_DEPLOY_BLOCK = 12_047_650;
// Alchemy free tier often caps eth_getLogs to ~10 blocks per request
const LOG_CHUNK_SIZE = 10;

async function queryFundedLogs(
  contract: Contract,
  fromBlock: number,
  toBlock: number
) {
  const filter = contract.filters.Funded();

  try {
    return await contract.queryFilter(filter, fromBlock, toBlock);
  } catch {
    // Fallback: chunk for Alchemy free eth_getLogs limit
    const logs = [];
    for (
      let start = fromBlock;
      start <= toBlock;
      start += LOG_CHUNK_SIZE + 1
    ) {
      const end = Math.min(start + LOG_CHUNK_SIZE, toBlock);
      const chunk = await contract.queryFilter(filter, start, end);
      logs.push(...chunk);
    }
    return logs;
  }
}

export const getFundedEvents = async (
  ethersProvider: BrowserProvider | AlchemyProvider
) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );

    const latestBlock = await ethersProvider.getBlockNumber();
    const fromBlock = Math.min(CONTRACT_DEPLOY_BLOCK, latestBlock);

    const fundedEvents = await queryFundedLogs(
      crowdfundingContract,
      fromBlock,
      latestBlock
    );

    const events: FundedEvent[] = fundedEvents.map((currentEvent) => ({
      funder: (currentEvent as any).args[0] as string,
      value: formatEther((currentEvent as any).args[1]),
      txHash: currentEvent.transactionHash,
      blockNumber: currentEvent.blockNumber,
    }));

    return events.sort((a, b) => b.blockNumber - a.blockNumber);
  } catch (error) {
    console.error("getFundedEvents failed:", error);
    return [];
  }
};

// Write contract
export const handleFundToContract = async (
  signer: JsonRpcSigner,
  value: number
) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      signer
    );
    const tx: TransactionResponse = await crowdfundingContract.fund({
      value: parseEther(String(value)),
    });
    return tx;
  } catch (error) {
    return null;
  }
};
