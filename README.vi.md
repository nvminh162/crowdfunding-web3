# Crowdfunding Web3

> **Ngôn ngữ:** [English](./README.md) · Tiếng Việt (file này)

dApp crowdfunding trên Ethereum Sepolia: smart contract Solidity (Foundry) + frontend React (Vite, ethers, Web3Modal).

Người dùng gửi ETH vào hũ on-chain (tối thiểu ≈ **$5 USD**, giá qua Chainlink ETH/USD). Chỉ **owner** (ví deploy) gọi được `withdraw()`.

| Thư mục | Vai trò |
|---|---|
| `crowdfunding-decentralized/` | Smart contract, test, deploy Sepolia |
| `crowdfunding-interface/` | Giao diện web (connect ví, donate, lịch sử) |

**Contract Sepolia hiện tại (tham chiếu):**  
[`0xaF82203926E6c7D28ac30fDf98C98F47F925B5d2`](https://sepolia.etherscan.io/address/0xaF82203926E6c7D28ac30fDf98C98F47F925B5d2)

Tài liệu này theo hướng **chỉ Sepolia**. Không cần Anvil / local chain để deploy lại sau này.

---

## Mục lục

1. [Bạn cần gì](#1-bạn-cần-gì)
2. [Tài khoản & website (từng bước)](#2-tài-khoản--website-từng-bước)
3. [Cài tool trên máy](#3-cài-tool-trên-máy)
4. [Cài dependency dự án](#4-cài-dependency-dự-án)
5. [Cấu hình `.env` contract](#5-cấu-hình-env-contract)
6. [Import private key MetaMask vào Foundry](#6-import-private-key-metamask-vào-foundry)
7. [Deploy lên Sepolia](#7-deploy-lên-sepolia)
8. [Nối frontend](#8-nối-frontend)
9. [Chạy website](#9-chạy-website)
10. [Tuỳ chọn: fund / withdraw bằng CLI](#10-tuỳ-chọn-fund--withdraw-bằng-cli)
11. [Checklist deploy lại (bạn của tương lai)](#11-checklist-deploy-lại-bạn-của-tương-lai)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Bạn cần gì

| Thứ | Mục đích |
|---|---|
| [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`) | Build, test, deploy contract |
| Node.js 18+ và [pnpm](https://pnpm.io/) | Frontend |
| [MetaMask](https://metamask.io/) | Ví trên mạng **Sepolia** |
| Sepolia ETH | Trả gas + donate (lấy từ faucet) |
| App [Alchemy](https://www.alchemy.com/) | RPC HTTPS Sepolia + API key |
| API key [Etherscan](https://etherscan.io/apis) | Verify source trên explorer |
| Project ID [Reown / WalletConnect](https://dashboard.reown.com/) | Nút Connect ví (Web3Modal) |

---

## 2. Tài khoản & website (từng bước)

### 2.1 MetaMask + mạng Sepolia

1. Cài MetaMask (extension trình duyệt).
2. Tạo / mở ví. Nên dùng tài khoản **chỉ để test** (đừng dùng ví lạnh mainnet cho bài học).
3. Thêm / chuyển mạng sang **Sepolia** (Chain ID `11155111`).
4. Copy địa chỉ ví (ví dụ `0x402c…`).

### 2.2 Lấy Sepolia ETH

1. Vào faucet Sepolia (search “Sepolia faucet”; danh sách faucet hay đổi).
2. Xin ETH test về địa chỉ MetaMask (đang ở Sepolia).
3. Kiểm tra số dư trong MetaMask.

### 2.3 Alchemy (RPC)

1. Vào [https://dashboard.alchemy.com](https://dashboard.alchemy.com) → đăng ký / đăng nhập.
2. **Create App** → Network: **Ethereum Sepolia**.
3. Mở app → copy:
   - **API Key**
   - **HTTPS URL**: `https://eth-sepolia.g.alchemy.com/v2/<API_KEY>`

### 2.4 Etherscan API key

1. Vào [https://etherscan.io/apis](https://etherscan.io/apis).
2. Đăng nhập → tạo API key → copy (dùng để Foundry verify trên Sepolia explorer).

### 2.5 Reown (WalletConnect) Project ID

1. Vào [https://dashboard.reown.com](https://dashboard.reown.com) → đăng nhập.
2. Tạo project (ví dụ tên `crowdfunding`).
3. Copy **Project ID** (chỉ dùng cho frontend Web3Modal; **không phải ví**, không giữ tiền).

### 2.6 Export private key MetaMask (để Foundry deploy)

1. MetaMask → chọn account Sepolia đang có ETH.
2. ⋮ / Account details → **Show private key** → nhập mật khẩu MetaMask → copy.
3. Chỉ dán vào `cast wallet import` trên máy bạn. Không commit, không gửi chat/GitHub.

---

## 3. Cài tool trên máy

### Foundry (Windows)

```powershell
# Nếu đã có %USERPROFILE%\.foundry\bin nhưng lệnh không nhận:
# thêm C:\Users\<BẠN>\.foundry\bin vào User PATH, mở terminal mới.

forge --version
cast --version
```

Cài / cập nhật: [Foundry book — Installation](https://book.getfoundry.sh/getting-started/installation) (`foundryup`).

### Node + pnpm

```powershell
node -v
npm i -g pnpm
pnpm -v
```

### Make (cho `makefile`)

Windows: `scoop install make`, hoặc Git Bash / WSL.

```powershell
make --version
```

---

## 4. Cài dependency dự án

### 4.1 Smart contract

```powershell
cd crowdfunding-decentralized

# Nếu lib/ trống / thiếu:
forge install foundry-rs/forge-std@v1.9.2 --no-git --shallow
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-git --shallow
forge install Cyfrin/foundry-devops@0.2.2 --no-git --shallow
forge install chainlink=smartcontractkit/chainlink-brownie-contracts@1.1.1 --no-git --shallow

forge build
forge test
```

> Nếu báo destination already exists and is not empty → bỏ qua package đó (đã cài rồi).

### 4.2 Frontend

```powershell
cd crowdfunding-interface
pnpm install
```

---

## 5. Cấu hình `.env` contract

```powershell
cd crowdfunding-decentralized
copy .env.example .env
```

Sửa `.env`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<YOUR_ALCHEMY_API_KEY>
ETHERSCAN_API_KEY=<YOUR_ETHERSCAN_API_KEY>
ACCOUNT=sepoliaKey
```

`ACCOUNT` là **tên file keystore** (bước sau), không phải địa chỉ ví `0x…`.

Nạp biến môi trường vào PowerShell trước khi `make`:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim()
  }
}
```

---

## 6. Import private key MetaMask vào Foundry

```powershell
cast wallet import sepoliaKey --interactive
```

1. Dán **private key** MetaMask khi được hỏi.
2. Đặt **password mới** (mã hoá keystore tại `%USERPROFILE%\.foundry\keystores\sepoliaKey`). Nhớ password — lúc deploy sẽ hỏi lại.
3. Kiểm tra:

```powershell
cast wallet address --account sepoliaKey
```

Address in ra **phải trùng** MetaMask đang có Sepolia ETH.

Nếu đặt tên keystore khác, sửa `ACCOUNT=` trong `.env` cho khớp.

---

## 7. Deploy lên Sepolia

```powershell
cd crowdfunding-decentralized
# đã load .env trong shell (mục 5)

make deploy-sepolia
```

Nhập password keystore khi được hỏi.

**Thành công sẽ thấy:**

```text
Deployer: 0x...
Deployed to: 0x...
Transaction hash: 0x...
Contract successfully verified
```

Copy địa chỉ **Deployed to**.

Mở explorer:  
`https://sepolia.etherscan.io/address/<DEPLOYED_ADDRESS>`

### Lưu ý deploy (đã vấp khi làm)

- Nên dùng `make deploy-sepolia` (`forge create`): Sepolia có thể cần **gas limit tx rất cao** (~6M+). `forge create --gas-limit 8000000` mới là gas **của transaction**. Với `forge script`, `--gas-limit` chỉ là giới hạn gas **block** khi simulate.
- `--constructor-args` phải để **cuối cùng** (nó “nuốt” mọi tham số phía sau).
- Price feed: Chainlink Sepolia ETH/USD `0x694AA1769357215DE4FAC081bf1f309aDC325306`.

---

## 8. Nối frontend

### 8.1 Address contract (+ ABI nếu đổi Solidity)

Sửa `crowdfunding-interface/src/contracts/contractData.ts`:

```ts
export const contractAddr = "<DEPLOYED_ADDRESS>";
```

Nếu đổi hàm Solidity: lấy ABI mới từ `crowdfunding-decentralized/out/Crowdfunding.sol/Crowdfunding.json` sau `forge build`.

### 8.2 Block bắt đầu quét event (Latest Donation)

Trong `crowdfunding-interface/src/contracts/contractInteractions.ts`, cập nhật:

```ts
const CONTRACT_DEPLOY_BLOCK = <số_block_lúc_deploy>;
```

Xem số block trên trang transaction deploy ở Etherscan (hoặc lấy block hơi trước deploy). Tránh lỗi giới hạn khoảng block của Alchemy `eth_getLogs`.

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

Đổi `.env` xong phải **restart** `pnpm dev` (Vite chỉ đọc env lúc start).

---

## 9. Chạy website

```powershell
cd crowdfunding-interface
pnpm dev
```

1. Mở URL Vite in ra (thường `http://localhost:5173`).
2. MetaMask → mạng **Sepolia**.
3. Bấm **Connect** → MetaMask.
4. Nhập số ETH (≥ ~$5 USD) → **Fund** → confirm MetaMask.
5. Kiểm tra tổng ETH, số funders, Latest Donation.
6. Đối chiếu Etherscan: balance contract + lịch sử tx.

**Không cần** chạy gì trong `crowdfunding-decentralized` để web hoạt động. Contract đã nằm trên Sepolia; UI chỉ gọi RPC.

---

## 10. Tuỳ chọn: fund / withdraw bằng CLI

Sau khi deploy thành công (có artifact `broadcast`) và đã load `.env`:

```powershell
cd crowdfunding-decentralized
make fund
make withdraw
```

`withdraw` chỉ chạy được với keystore **owner** (`ACCOUNT`).

> Trên Windows, `foundry-devops` đã được patch trong `lib/foundry-devops/src/DevOpsTools.sol` để nhận cả `\` lẫn `/`. Cài lại lib thì nhớ patch lại.

---

## 11. Checklist deploy lại (bạn của tương lai)

- [ ] Foundry có trên PATH (`forge --version`)
- [ ] `cd crowdfunding-decentralized` → cài `lib/` nếu trống → `forge build && forge test`
- [ ] Alchemy Sepolia RPC + Etherscan key + Reown Project ID
- [ ] MetaMask Sepolia + ETH test
- [ ] `cast wallet import <tên> --interactive` → `ACCOUNT=<tên>` trong `.env`
- [ ] Load `.env` vào shell
- [ ] `make deploy-sepolia` → copy address → check Etherscan (Verified)
- [ ] Cập nhật `contractData.ts` (+ `CONTRACT_DEPLOY_BLOCK` trong `contractInteractions.ts`)
- [ ] Frontend `.env` → `pnpm install` → `pnpm dev`
- [ ] Connect MetaMask (Sepolia) → Fund thử

---

## 12. Troubleshooting

| Hiện tượng | Cách xử lý |
|---|---|
| `forge` không nhận | Thêm `%USERPROFILE%\.foundry\bin` vào User PATH; mở terminal mới |
| Thiếu import trong `lib/` | Chạy lại các lệnh `forge install …` mục 4 |
| `Failed to decode private key` với `cast wallet address 0xtên` | Dùng `cast wallet address --account tên` |
| Deploy tx status 0 / hết gas | Dùng `make deploy-sepolia` (gas limit 8_000_000) |
| Constructor argument count mismatch | Để `--constructor-args` **cuối** lệnh |
| Latest Donation trống sau F5 | Giới hạn log Alchemy — đúng `CONTRACT_DEPLOY_BLOCK` + query chia chunk |
| Web3Modal / connect lỗi | Điền `VITE_WALLETCONNECT_PROJECT_ID`; restart Vite |
| Frontend không hiện balance | Điền `VITE_ALCHEMY_API_KEY` + RPC; restart Vite |

---

## Cấu trúc dự án

```text
crowdfunding-web3/
├── README.md                 ← English (mặc định)
├── README.vi.md              ← Tiếng Việt
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
- Mạng: Ethereum Sepolia (`11155111`)
