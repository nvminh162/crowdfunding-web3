# Crowdfunding Web3 - Dự Án Nuôi Minh

> **Languages:** English (this file) · [Tiếng Việt](./README.vi.md)

Ethereum Sepolia crowdfunding dApp: Solidity contracts (Foundry) + React frontend (Vite, ethers, Web3Modal).

Donors send ETH into an on-chain vault (minimum ≈ **$5 USD** via Chainlink ETH/USD). Only the **owner** (deployer wallet) can `withdraw()`.

| Package | Role |
|---|---|
| `crowdfunding-decentralized/` | Smart contract, tests, Sepolia deploy |
| `crowdfunding-interface/` | Web UI (connect wallet, fund, list donations) |

**Current Sepolia deployment (reference):**  
[`0xaF82203926E6c7D28ac30fDf98C98F47F925B5d2`](https://sepolia.etherscan.io/address/0xaF82203926E6c7D28ac30fDf98C98F47F925B5d2)

This guide is **Sepolia-only**. You do **not** need Anvil / local chain to redeploy years later.

---

## Table of contents

1. [What you need](#1-what-you-need)
2. [Accounts & websites (step by step)](#2-accounts--websites-step-by-step)
3. [Install tools on your PC](#3-install-tools-on-your-pc)
4. [Install project dependencies](#4-install-project-dependencies)
5. [Configure contract `.env`](#5-configure-contract-env)
6. [Import MetaMask key into Foundry](#6-import-metamask-key-into-foundry)
7. [Deploy to Sepolia](#7-deploy-to-sepolia)
8. [Wire the frontend](#8-wire-the-frontend)
9. [Run the website](#9-run-the-website)
10. [Optional: fund / withdraw via CLI](#10-optional-fund--withdraw-via-cli)
11. [Redeploy checklist (future you)](#11-redeploy-checklist-future-you)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What you need

| Item | Purpose |
|---|---|
| [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`) | Build, test, deploy contracts |
| Node.js 18+ and [pnpm](https://pnpm.io/) | Frontend |
| [MetaMask](https://metamask.io/) | Wallet on **Sepolia** |
| Sepolia ETH | Pay gas + donations (from a faucet) |
| [Alchemy](https://www.alchemy.com/) app | Sepolia HTTPS RPC + API key |
| [Etherscan](https://etherscan.io/apis) API key | Verify source on explorer |
| [Reown / WalletConnect](https://dashboard.reown.com/) Project ID | Web3Modal “Connect wallet” |

---

## 2. Accounts & websites (step by step)

### 2.1 MetaMask + Sepolia network

1. Install MetaMask (browser extension).
2. Create / unlock a wallet. Prefer a **test-only** account (never reuse a mainnet cold wallet for tutorials).
3. Add / switch network to **Sepolia** (Chain ID `11155111`).
4. Copy your address (e.g. `0x402c…`).

### 2.2 Get Sepolia ETH

1. Open a Sepolia faucet (search “Sepolia faucet”; options change over time).
2. Request test ETH to your MetaMask Sepolia address.
3. Confirm balance in MetaMask (Sepolia network).

### 2.3 Alchemy (RPC)

1. Go to [https://dashboard.alchemy.com](https://dashboard.alchemy.com) → sign up / log in.
2. **Create App** → Network: **Ethereum Sepolia**.
3. Open the app → copy:
   - **API Key** (short string)
   - **HTTPS URL**: `https://eth-sepolia.g.alchemy.com/v2/<API_KEY>`

### 2.4 Etherscan API key

1. Go to [https://etherscan.io/apis](https://etherscan.io/apis) (same key works for Sepolia explorer verification via Foundry).
2. Sign in → create an API key → copy it.

### 2.5 Reown (WalletConnect) Project ID

1. Go to [https://dashboard.reown.com](https://dashboard.reown.com) → sign in.
2. Create a project (e.g. name `crowdfunding`).
3. Copy **Project ID** (used only by the frontend Web3Modal; it is **not** a wallet and holds no funds).

### 2.6 Export MetaMask private key (for Foundry deploy)

1. MetaMask → select the Sepolia account that has ETH.
2. ⋮ / Account details → **Show private key** → enter MetaMask password → copy.
3. Use this **only** in `cast wallet import` on your machine. Never commit it, never paste it into chat/GitHub.

---

## 3. Install tools on your PC

### Foundry (Windows)

```powershell
# If already installed under %USERPROFILE%\.foundry\bin but missing from PATH:
# add C:\Users\<YOU>\.foundry\bin to User PATH, then open a new terminal.

forge --version
cast --version
```

Install / update: [Foundry book — Installation](https://book.getfoundry.sh/getting-started/installation) (`foundryup`).

### Node + pnpm

```powershell
node -v
npm i -g pnpm
pnpm -v
```

### Make (used by `makefile`)

Windows: `scoop install make`, or Git Bash / WSL.

```powershell
make --version
```

---

## 4. Install project dependencies

### 4.1 Smart contracts

```powershell
cd crowdfunding-decentralized

# If lib/ folders are empty or missing:
forge install foundry-rs/forge-std@v1.9.2 --no-git --shallow
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-git --shallow
forge install Cyfrin/foundry-devops@0.2.2 --no-git --shallow
forge install chainlink=smartcontractkit/chainlink-brownie-contracts@1.1.1 --no-git --shallow

forge build
forge test
```

> If `forge install` says the destination already exists and is not empty, skip that package — it is already installed.

### 4.2 Frontend

```powershell
cd crowdfunding-interface
pnpm install
```

---

## 5. Configure contract `.env`

```powershell
cd crowdfunding-decentralized
copy .env.example .env
```

Edit `.env`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<YOUR_ALCHEMY_API_KEY>
ETHERSCAN_API_KEY=<YOUR_ETHERSCAN_API_KEY>
ACCOUNT=sepoliaKey
```

`ACCOUNT` is the **keystore file name** you will create in the next section (not an Ethereum address).

Load env into the current PowerShell session before `make`:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim()
  }
}
```

---

## 6. Import MetaMask key into Foundry

```powershell
cast wallet import sepoliaKey --interactive
```

1. Paste the MetaMask **private key** when asked.
2. Choose a **new password** (encrypts the keystore under `%USERPROFILE%\.foundry\keystores\sepoliaKey`). Remember this password — deploy will ask for it.
3. Verify:

```powershell
cast wallet address --account sepoliaKey
```

The printed address **must** match the MetaMask account that holds Sepolia ETH.

If `.env` uses another name, set `ACCOUNT=` to that exact name.

---

## 7. Deploy to Sepolia

```powershell
cd crowdfunding-decentralized
# ensure .env is loaded in this shell (section 5)

make deploy-sepolia
```

Enter the keystore password when prompted.

**Success looks like:**

```text
Deployer: 0x...
Deployed to: 0x...
Transaction hash: 0x...
Contract successfully verified
```

Copy **Deployed to** address.

Open it on explorer:  
`https://sepolia.etherscan.io/address/<DEPLOYED_ADDRESS>`

### Important deploy notes (learned the hard way)

- Prefer `make deploy-sepolia` (`forge create`) over plain `forge script` on Windows/Sepolia: Sepolia may need a **high tx gas limit** (~6M+); `forge create --gas-limit 8000000` sets a real transaction gas limit. In `forge script`, `--gas-limit` only affects **block** gas limit for simulation.
- `--constructor-args` must be the **last** CLI flag (it consumes all following tokens).
- Price feed used: Chainlink Sepolia ETH/USD `0x694AA1769357215DE4FAC081bf1f309aDC325306`.

---

## 8. Wire the frontend

### 8.1 Contract address (+ ABI if you changed Solidity)

Edit `crowdfunding-interface/src/contracts/contractData.ts`:

```ts
export const contractAddr = "<DEPLOYED_ADDRESS>";
```

If you changed contract functions, refresh ABI from `crowdfunding-decentralized/out/Crowdfunding.sol/Crowdfunding.json` after `forge build`.

### 8.2 Event scan start block (Latest Donation)

In `crowdfunding-interface/src/contracts/contractInteractions.ts`, update:

```ts
const CONTRACT_DEPLOY_BLOCK = <block_number_of_your_deploy>;
```

Find the block on the deploy transaction page on Etherscan (or use a block slightly before deploy). This avoids Alchemy `eth_getLogs` range limits.

### 8.3 Frontend `.env`

```powershell
cd crowdfunding-interface
copy .env.example .env
```

```env
VITE_WALLETCONNECT_PROJECT_ID=<REOWN_PROJECT_ID>
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<YOUR_ALCHEMY_API_KEY>
VITE_ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>
```

Restart `pnpm dev` after any `.env` change (Vite reads env at startup).

---

## 9. Run the website

```powershell
cd crowdfunding-interface
pnpm dev
```

1. Open the URL printed by Vite (usually `http://localhost:5173`).
2. MetaMask → network **Sepolia**.
3. Click **Connect** → MetaMask.
4. Enter an amount (≥ ~$5 USD in ETH) → **Fund** → confirm in MetaMask.
5. Check total ETH, funders count, and Latest Donation.
6. Confirm on Etherscan: contract balance and tx history.

**You do not need** to keep anything running in `crowdfunding-decentralized` for the website. The contract already lives on Sepolia; the UI talks to the chain via RPC.

---

## 10. Optional: fund / withdraw via CLI

After a successful deploy (broadcast artifacts present) and `.env` loaded:

```powershell
cd crowdfunding-decentralized
make fund ARGS="--network sepolia"      # if your makefile still uses ARGS; else: make fund
make withdraw
```

With the current makefile, Sepolia is the only target:

```powershell
make fund
make withdraw
```

`withdraw` only works from the **owner** keystore (`ACCOUNT`).

> On Windows, `foundry-devops` path matching was patched under `lib/foundry-devops/src/DevOpsTools.sol` to accept `\` as well as `/`. Re-apply that patch if you reinstall the library.

---

## 11. Redeploy checklist (future you)

- [ ] Foundry on PATH (`forge --version`)
- [ ] `cd crowdfunding-decentralized` → install libs if `lib/` empty → `forge build && forge test`
- [ ] Alchemy Sepolia RPC + Etherscan key + Reown Project ID
- [ ] MetaMask Sepolia + test ETH
- [ ] `cast wallet import <name> --interactive` → `ACCOUNT=<name>` in `.env`
- [ ] Load `.env` into the shell
- [ ] `make deploy-sepolia` → copy address → verify on Etherscan
- [ ] Update `contractData.ts` address (+ deploy block in `contractInteractions.ts`)
- [ ] Frontend `.env` → `pnpm install` → `pnpm dev`
- [ ] Connect MetaMask (Sepolia) → Fund smoke test

---

## 12. Troubleshooting

| Symptom | Fix |
|---|---|
| `forge` not recognized | Add `%USERPROFILE%\.foundry\bin` to User PATH; new terminal |
| `lib/` missing imports | Re-run `forge install …` commands in section 4 |
| `Failed to decode private key` with `cast wallet address 0xname` | Use `cast wallet address --account name` (no fake `0x` prefix as “private key”) |
| Deploy tx status 0 / out of gas | Use `make deploy-sepolia` with high `--gas-limit` (already 8_000_000) |
| Constructor argument count mismatch | Put `--constructor-args` **last** |
| Latest Donation empty after F5 | Alchemy log range limits — ensure chunked query + correct `CONTRACT_DEPLOY_BLOCK` |
| Web3Modal / connect broken | Set `VITE_WALLETCONNECT_PROJECT_ID`; restart Vite |
| Frontend balance blank | Set `VITE_ALCHEMY_API_KEY` + RPC URL; restart Vite |

---

## Project layout

```text
crowdfunding-web3/
├── README.md                 ← English (default)
├── README.vi.md              ← Vietnamese
├── crowdfunding-decentralized/
│   ├── src/Crowdfunding.sol
│   ├── script/
│   ├── test/
│   ├── makefile              ← deploy-sepolia | fund | withdraw
│   └── .env.example
└── crowdfunding-interface/
    ├── src/contracts/contractData.ts
    ├── src/contracts/contractInteractions.ts
    └── .env.example
```

## Stack

- Solidity `0.8.26`, Foundry, OpenZeppelin Ownable, Chainlink AggregatorV3  
- React 18, TypeScript, Vite, Tailwind, ethers v6, `@web3modal/ethers`  
- Network: Ethereum Sepolia (`11155111`)
