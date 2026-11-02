# Crowdfunding Web3

Dự án crowdfunding on-chain: smart contract (Foundry) + frontend (React + Vite + ethers + Web3Modal).

Người dùng donate ETH (tối thiểu ~**$5 USD**, giá qua Chainlink ETH/USD). Owner rút toàn bộ số dư bằng `withdraw()`.

| Package | Vai trò |
|---|---|
| `crowdfunding-decentralized/` | Smart contract + deploy/test (Foundry) |
| `crowdfunding-interface/` | UI kết nối ví, donate trên **Sepolia** |

Price feed Sepolia (HelperConfig): Chainlink ETH/USD `0x694AA1769357215DE4FAC081bf1f309aDC325306`.

> Repo đã được **clean** (xoá `broadcast/` deploy cũ, reset `contractAddr`). Sau khi `make deploy ARGS="--network sepolia"`, copy address mới vào `crowdfunding-interface/src/contracts/contractData.ts`.
>
> Frontend hiện **chỉ cấu hình Sepolia**, không kết nối Anvil. Local Anvil dùng để build/test/deploy contract bằng CLI.

---

## Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Clone & cài dependency](#2-clone--cài-dependency)
3. [Local: Anvil + deploy + test](#3-local-anvil--deploy--test)
4. [Chuẩn bị Sepolia (testnet)](#4-chuẩn-bị-sepolia-testnet)
5. [Deploy contract lên Sepolia](#5-deploy-contract-lên-sepolia)
6. [Chạy frontend](#6-chạy-frontend)
7. [Nối frontend với contract mới](#7-nối-frontend-với-contract-mới)
8. [Tương tác sau khi deploy](#8-tương-tác-sau-khi-deploy)
9. [Checklist zero → production (testnet)](#9-checklist-zero--production-testnet)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Yêu cầu hệ thống

Cài trước khi bắt đầu:

| Tool | Mục đích | Gợi ý |
|---|---|---|
| [Foundry](https://book.getfoundry.sh/getting-started/installation) | `forge`, `cast`, `anvil` | `curl -L https://foundry.paradigm.xyz \| bash` rồi `foundryup` |
| [Node.js](https://nodejs.org/) 18+ | Frontend | LTS |
| [pnpm](https://pnpm.io/) | Package manager frontend | `npm i -g pnpm` |
| [MetaMask](https://metamask.io/) | Ví browser | Thêm mạng Sepolia |
| Make | Chạy lệnh trong `makefile` | Windows: Git Bash / WSL / `choco install make` |

Kiểm tra nhanh:

```bash
forge --version
anvil --version
node -v
pnpm -v
```

---

## 2. Clone & cài dependency

```bash
cd crowdfunding-web3
```

### Smart contract (Foundry)

Thư mục `lib/` (forge-std, chainlink, openzeppelin, foundry-devops) là **git submodules** — cần install trước khi build:

```bash
cd crowdfunding-decentralized

# Cài libs (lần đầu hoặc sau khi clone mới)
forge install

# Hoặc nếu submodule trống:
git submodule update --init --recursive

forge build
```

### Frontend

```bash
cd crowdfunding-interface
pnpm install
```

---

## 3. Local: Anvil + deploy + test

### 3.1 Chạy test (không cần Anvil)

```bash
cd crowdfunding-decentralized
forge test -vvv
```

### 3.2 Chạy Anvil (local chain)

Terminal 1:

```bash
anvil
```

Anvil mặc định:

- RPC: `http://localhost:8545`
- Chain ID: `31337`
- Account #0 private key (để sẵn trong makefile):  
  `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 3.3 Deploy lên Anvil

Terminal 2 (cùng thư mục `crowdfunding-decentralized`):

```bash
# Không cần file .env cho local
make deploy
```

Script sẽ:

1. Deploy `MockV3Aggregator` (giá ETH giả = $3000)
2. Deploy `Crowdfunding` trỏ tới mock price feed

Address contract in ra terminal / nằm trong `broadcast/`.

### 3.4 Fund / withdraw trên Anvil

```bash
make fund      # gửi 0.01 ETH vào contract vừa deploy
make withdraw # rút (chỉ owner = người deploy)
```

Các lệnh này dùng `foundry-devops` để lấy **deployment mới nhất** theo `chainId`.

---

## 4. Chuẩn bị Sepolia (testnet)

### 4.1 Lấy RPC URL

Tạo app miễn phí tại [Alchemy](https://www.alchemy.com/) hoặc [Infura](https://infura.io/), chọn mạng **Ethereum Sepolia**, copy HTTPS RPC URL.

Ví dụ Alchemy: `https://eth-sepolia.g.alchemy.com/v2/<API_KEY>`

### 4.2 Lấy Etherscan API key

[etherscan.io/apis](https://etherscan.io/apis) — dùng để **verify** contract sau khi deploy.

### 4.3 Ví deploy + ETH testnet

1. Tạo / dùng ví MetaMask (mạng Sepolia).
2. Nạp Sepolia ETH từ faucet (Google “Sepolia faucet”).
3. Import private key vào Foundry keystore (an toàn hơn đưa raw key vào `.env`):

```bash
cast wallet import <TÊN_ACCOUNT> --interactive
# Ví dụ: cast wallet import sepoliaKey --interactive
# Nhập private key + password khi được hỏi
```

`<TÊN_ACCOUNT>` chính là giá trị `ACCOUNT` trong `.env`.

### 4.4 File `.env` (contract)

```bash
cd crowdfunding-decentralized
cp .env.example .env
```

Điền:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<API_KEY>
ETHERSCAN_API_KEY=<etherscan_api_key>
ACCOUNT=<TÊN_ACCOUNT>   # ví dụ: sepoliaKey
```

> `.env` đã nằm trong `.gitignore` — **không commit**.

---

## 5. Deploy contract lên Sepolia

```bash
cd crowdfunding-decentralized

# Load biến môi trường (Git Bash / WSL / macOS / Linux)
source .env

# Windows PowerShell:
# Get-Content .env | ForEach-Object { if ($_ -match '^([^#][^=]+)=(.*)$') { Set-Item -Path "env:$($matches[1])" -Value $matches[2] } }

make deploy ARGS="--network sepolia"
```

Lệnh thực tế (từ makefile):

```text
forge script script/DeployCrowdfunding.s.sol:DeployCrowdfunding \
  --rpc-url $SEPOLIA_RPC_URL \
  --account $ACCOUNT \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv
```

Bạn sẽ được hỏi password của keystore (`cast wallet import`).

Sau khi thành công:

- Contract address in ra console
- Broadcast lưu tại `broadcast/DeployCrowdfunding.s.sol/11155111/`
- Etherscan verify (nếu API key đúng)

HelperConfig tự chọn price feed Sepolia: `0x694AA1769357215DE4FAC081bf1f309aDC325306`.

---

## 6. Chạy frontend

### 6.1 WalletConnect Project ID

1. Đăng ký [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Tạo project → copy **Project ID**

### 6.2 File `.env`

```bash
cd crowdfunding-interface
cp .env.example .env
```

```env
VITE_WALLETCONNECT_PROJECT_ID=<walletconnect_project_id>
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<API_KEY>
VITE_ALCHEMY_API_KEY=<alchemy_api_key>
```

| Biến | Dùng cho |
|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Web3Modal / kết nối ví |
| `VITE_SEPOLIA_RPC_URL` | RPC mạng trong Web3Modal |
| `VITE_ALCHEMY_API_KEY` | Đọc chain khi chưa connect ví (`AlchemyProvider("sepolia", ...)`) |

### 6.3 Dev server

```bash
pnpm dev
```

Mở URL Vite in ra (thường `http://localhost:5173`).

### 6.4 Build production (static)

```bash
pnpm build
pnpm preview   # xem local bản build
```

Deploy thư mục `dist/` lên Vercel / Netlify / Cloudflare Pages. Nhớ set cùng các biến `VITE_*` trên hosting.

Trong MetaMask: chọn mạng **Sepolia**, connect ví → donate.

---

## 7. Nối frontend với contract mới

Sau khi deploy Sepolia **mới**, cập nhật address trong:

`crowdfunding-interface/src/contracts/contractData.ts`

```ts
export const contractAddr = "0xYOUR_NEW_CONTRACT_ADDRESS";
```

ABI trong file đó thường giữ nguyên nếu không đổi interface contract. Nếu đổi Solidity API:

```bash
cd crowdfunding-decentralized
forge build
# Copy ABI từ out/Crowdfunding.sol/Crowdfunding.json → contractData.ts
```

---

## 8. Tương tác sau khi deploy

Trên Sepolia (đã `source .env`):

```bash
cd crowdfunding-decentralized

make fund ARGS="--network sepolia"      # fund 0.01 ETH từ account deploy
make withdraw ARGS="--network sepolia"  # chỉ owner mới withdraw được
```

Hoặc dùng UI: Connect Wallet → nhập số ETH (≥ ~$5) → Fund.

---

## 9. Checklist zero → production (testnet)

Làm theo thứ tự:

- [ ] Cài Foundry, Node, pnpm, MetaMask
- [ ] `cd crowdfunding-decentralized && forge install && forge build && forge test`
- [ ] (Tuỳ chọn) `anvil` + `make deploy` / `make fund` để quen flow local
- [ ] Tạo Alchemy (RPC + API key) + Etherscan API key
- [ ] Nạp Sepolia ETH vào ví deploy
- [ ] `cast wallet import <ACCOUNT> --interactive`
- [ ] Điền `crowdfunding-decentralized/.env`
- [ ] `make deploy ARGS="--network sepolia"`
- [ ] Copy address mới vào `contractData.ts` (nếu redeploy)
- [ ] Tạo WalletConnect Project ID
- [ ] Điền `crowdfunding-interface/.env`
- [ ] `pnpm install && pnpm dev`
- [ ] MetaMask → Sepolia → Connect → Fund thử
- [ ] `pnpm build` → deploy `dist/` lên hosting

---

## 10. Troubleshooting

**`forge build` lỗi thiếu import / lib trống**  
→ Chạy lại `forge install` hoặc `git submodule update --init --recursive`.

**`make: command not found` (Windows)**  
→ Dùng Git Bash/WSL, hoặc chạy thẳng lệnh `forge script ...` như trong makefile.

**Deploy Sepolia hỏi password / không tìm thấy account**  
→ Kiểm tra `ACCOUNT` trùng tên `cast wallet import`. Xem list: `cast wallet list`.

**Verify Etherscan fail**  
→ Đợi vài giây rồi verify tay, hoặc chạy lại script verify; kiểm tra `ETHERSCAN_API_KEY`.

**Frontend không load balance / lỗi Alchemy**  
→ Thiếu hoặc sai `VITE_ALCHEMY_API_KEY`. Restart `pnpm dev` sau khi sửa `.env` (Vite chỉ đọc env lúc start).

**WalletConnect / modal lỗi**  
→ Thiếu `VITE_WALLETCONNECT_PROJECT_ID`, hoặc Project ID sai.

**Fund bị revert `InsufficientFunding`**  
→ Số ETH quy đổi USD (qua Chainlink) < $5. Tăng số ETH gửi.

**Withdraw revert**  
→ Chỉ `owner` (ví đã deploy contract) mới gọi được.

**Make deploy Sepolia nhưng vẫn dùng localhost**  
→ Phải truyền đúng: `ARGS="--network sepolia"` (makefile detect chuỗi `--network sepolia`).

---

## Cấu trúc nhanh

```text
crowdfunding-web3/
├── README.md                          ← file này
├── crowdfunding-decentralized/        # Foundry
│   ├── src/Crowdfunding.sol
│   ├── script/DeployCrowdfunding.s.sol
│   ├── script/HelperConfig.s.sol
│   ├── script/Interactions.s.sol
│   ├── test/
│   ├── makefile                       # deploy | fund | withdraw
│   └── .env.example
└── crowdfunding-interface/            # Vite React
    ├── src/App.tsx                    # Web3Modal + Sepolia
    ├── src/contracts/contractData.ts  # address + ABI
    └── .env.example
```

## Stack

- **Solidity 0.8.26**, Foundry, OpenZeppelin Ownable, Chainlink AggregatorV3
- **React 18**, TypeScript, Vite, Tailwind, ethers v6, `@web3modal/ethers`
- **Network production (testnet):** Ethereum Sepolia (`11155111`)
