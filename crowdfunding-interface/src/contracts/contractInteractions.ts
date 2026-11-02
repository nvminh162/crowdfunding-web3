import {
  Contract,
  formatEther,
  parseEther,
  id,
  AbiCoder,
  JsonRpcSigner,
  BrowserProvider,
  AlchemyProvider,
  TransactionResponse,
} from "ethers";
import { contractABI, contractAddr } from "./contractData";
import { FundedEvent, WithdrawnEvent } from "@/lib/type";

type AnyProvider = BrowserProvider | AlchemyProvider;

const CONTRACT_DEPLOY_BLOCK = 12_047_650;
const LOG_CHUNK_SIZE = 10;
const MAX_CHUNKS = 400; // ~4k blocks walking backwards
const FUNDED_TOPIC = id("Funded(address,uint256)");
const WITHDRAWN_TOPIC = id("Withdrawn(uint256)");

export const getContractBalance = async (
  ethersProvider: AnyProvider,
  contract: string
) => {
  try {
    const balance = await ethersProvider.getBalance(contract);
    return formatEther(balance);
  } catch {
    return null;
  }
};

export const getFundersLength = async (ethersProvider: AnyProvider) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );
    const fundersLength = await crowdfundingContract.getFundersLength();
    return Number(fundersLength);
  } catch {
    return null;
  }
};

function mapEventLogs(
  fundedEvents: Array<{
    args?: unknown;
    transactionHash: string;
    blockNumber: number;
  }>
): FundedEvent[] {
  return fundedEvents
    .map((currentEvent) => {
      const args = currentEvent.args as unknown as
        | [string, bigint]
        | undefined
        | null;
      if (!args?.[0] || args[1] === undefined) return null;
      return {
        funder: args[0],
        value: formatEther(args[1]),
        txHash: currentEvent.transactionHash,
        blockNumber: currentEvent.blockNumber,
      };
    })
    .filter((e): e is FundedEvent => e !== null)
    .sort((a, b) => b.blockNumber - a.blockNumber);
}

async function queryFundedLogsViaRpc(
  contract: Contract,
  fromBlock: number,
  toBlock: number
) {
  const filter = contract.filters.Funded();

  // Fast path — MetaMask / good RPCs often allow a wide range
  try {
    return await contract.queryFilter(filter, fromBlock, toBlock);
  } catch (error) {
    console.warn("Wide log query failed, chunking backwards:", error);
  }

  // Alchemy-safe: walk backwards in tiny windows (free tier ~10 blocks)
  const logs = [];
  let end = toBlock;
  let chunks = 0;

  while (end >= fromBlock && chunks < MAX_CHUNKS) {
    const start = Math.max(fromBlock, end - LOG_CHUNK_SIZE);
    try {
      const chunk = await contract.queryFilter(filter, start, end);
      if (chunk.length) logs.push(...chunk);
    } catch (chunkError) {
      console.warn(`Log chunk ${start}-${end} failed:`, chunkError);
    }
    if (start === fromBlock) break;
    end = start - 1;
    chunks += 1;
  }

  return logs;
}

async function queryFundedLogsViaEtherscan(
  fromBlock: number,
  toBlock: number | "latest"
): Promise<FundedEvent[]> {
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    module: "logs",
    action: "getLogs",
    address: contractAddr,
    fromBlock: String(fromBlock),
    toBlock: String(toBlock),
    topic0: FUNDED_TOPIC,
    apikey: apiKey,
  });

  // V1 Sepolia endpoint is deprecated — use Etherscan API V2 + chainid
  const url = `https://api.etherscan.io/v2/api?chainid=11155111&${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "1" || !Array.isArray(json.result)) {
    console.warn("Etherscan logs fallback empty/failed:", json.message || json);
    return [];
  }

  const coder = AbiCoder.defaultAbiCoder();

  return json.result
    .map((log: { topics: string[]; data: string; transactionHash: string; blockNumber: string }) => {
      try {
        const funder = `0x${log.topics[1].slice(26)}`;
        const [value] = coder.decode(["uint256"], log.data) as unknown as [
          bigint,
        ];
        return {
          funder,
          value: formatEther(value),
          txHash: log.transactionHash,
          blockNumber: parseInt(log.blockNumber, 16),
        } satisfies FundedEvent;
      } catch {
        return null;
      }
    })
    .filter((e: FundedEvent | null): e is FundedEvent => e !== null)
    .sort((a: FundedEvent, b: FundedEvent) => b.blockNumber - a.blockNumber);
}

export const getFundedEvents = async (ethersProvider: AnyProvider) => {
  const fromBlock = CONTRACT_DEPLOY_BLOCK;

  // Prefer Etherscan V2 first (Alchemy free getLogs is flaky / range-limited)
  try {
    const viaExplorer = await queryFundedLogsViaEtherscan(fromBlock, "latest");
    if (viaExplorer.length > 0) return viaExplorer;
  } catch (error) {
    console.warn("Etherscan V2 logs failed, trying RPC:", error);
  }

  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );
    const latestBlock = await ethersProvider.getBlockNumber();
    return mapEventLogs(
      await queryFundedLogsViaRpc(
        crowdfundingContract,
        Math.min(fromBlock, latestBlock),
        latestBlock
      )
    );
  } catch (error) {
    console.error("getFundedEvents failed:", error);
    return [];
  }
};

async function queryWithdrawnLogsViaRpc(
  contract: Contract,
  fromBlock: number,
  toBlock: number
) {
  const filter = contract.filters.Withdrawn();

  try {
    return await contract.queryFilter(filter, fromBlock, toBlock);
  } catch (error) {
    console.warn("Wide withdraw log query failed, chunking backwards:", error);
  }

  const logs = [];
  let end = toBlock;
  let chunks = 0;

  while (end >= fromBlock && chunks < MAX_CHUNKS) {
    const start = Math.max(fromBlock, end - LOG_CHUNK_SIZE);
    try {
      const chunk = await contract.queryFilter(filter, start, end);
      if (chunk.length) logs.push(...chunk);
    } catch (chunkError) {
      console.warn(`Withdraw log chunk ${start}-${end} failed:`, chunkError);
    }
    if (start === fromBlock) break;
    end = start - 1;
    chunks += 1;
  }

  return logs;
}

async function queryWithdrawnLogsViaEtherscan(
  fromBlock: number,
  toBlock: number | "latest"
): Promise<WithdrawnEvent[]> {
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    module: "logs",
    action: "getLogs",
    address: contractAddr,
    fromBlock: String(fromBlock),
    toBlock: String(toBlock),
    topic0: WITHDRAWN_TOPIC,
    apikey: apiKey,
  });

  const url = `https://api.etherscan.io/v2/api?chainid=11155111&${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "1" || !Array.isArray(json.result)) {
    console.warn(
      "Etherscan withdraw logs empty/failed:",
      json.message || json
    );
    return [];
  }

  const coder = AbiCoder.defaultAbiCoder();

  return json.result
    .map(
      (log: {
        data: string;
        transactionHash: string;
        blockNumber: string;
      }) => {
        try {
          const [value] = coder.decode(["uint256"], log.data) as unknown as [
            bigint,
          ];
          return {
            value: formatEther(value),
            txHash: log.transactionHash,
            blockNumber: parseInt(log.blockNumber, 16),
          } satisfies WithdrawnEvent;
        } catch {
          return null;
        }
      }
    )
    .filter((e: WithdrawnEvent | null): e is WithdrawnEvent => e !== null)
    .sort(
      (a: WithdrawnEvent, b: WithdrawnEvent) => b.blockNumber - a.blockNumber
    );
}

function mapWithdrawnLogs(
  events: Array<{
    args?: unknown;
    transactionHash: string;
    blockNumber: number;
  }>
): WithdrawnEvent[] {
  return events
    .map((currentEvent) => {
      const args = currentEvent.args as unknown as [bigint] | undefined | null;
      if (!args || args[0] === undefined) return null;
      return {
        value: formatEther(args[0]),
        txHash: currentEvent.transactionHash,
        blockNumber: currentEvent.blockNumber,
      };
    })
    .filter((e): e is WithdrawnEvent => e !== null)
    .sort((a, b) => b.blockNumber - a.blockNumber);
}

export const getWithdrawnEvents = async (ethersProvider: AnyProvider) => {
  const fromBlock = CONTRACT_DEPLOY_BLOCK;

  try {
    const viaExplorer = await queryWithdrawnLogsViaEtherscan(
      fromBlock,
      "latest"
    );
    if (viaExplorer.length > 0) return viaExplorer;
  } catch (error) {
    console.warn("Etherscan V2 withdraw logs failed, trying RPC:", error);
  }

  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );
    const latestBlock = await ethersProvider.getBlockNumber();
    return mapWithdrawnLogs(
      await queryWithdrawnLogsViaRpc(
        crowdfundingContract,
        Math.min(fromBlock, latestBlock),
        latestBlock
      )
    );
  } catch (error) {
    console.error("getWithdrawnEvents failed:", error);
    return [];
  }
};

export const getContractOwner = async (ethersProvider: AnyProvider) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      ethersProvider
    );
    const owner = await crowdfundingContract.owner();
    return String(owner);
  } catch {
    return null;
  }
};

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
  } catch {
    return null;
  }
};

export const handleWithdrawFromContract = async (signer: JsonRpcSigner) => {
  try {
    const crowdfundingContract = new Contract(
      contractAddr,
      contractABI,
      signer
    );
    const tx: TransactionResponse = await crowdfundingContract.withdraw();
    return tx;
  } catch {
    return null;
  }
};
