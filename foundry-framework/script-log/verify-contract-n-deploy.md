# Deploy & Xác Minh Đồng Thời (Deploy & Verify)

Hướng dẫn deploy Smart Contract và tự động xác minh mã nguồn trên Etherscan chỉ trong 1 câu lệnh.

## 1. Môi trường & Cấu hình (.env)
```bash
export PATH="$PATH:/c/Users/nvmin/.foundry/bin"

# Load biến môi trường
source .env
```

## 2. Câu lệnh Deploy & Verify đồng thời
```bash
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --account foundry-learn \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## 3. Kết quả thực tế
* **Contract Address:** `0xAF3EC1eE6B3949b3a3e28813a48378B76693A4E8`
* **Transaction Hash:** `0xa384dfae3af20b546d0246e4343f5502822f5504610a6a572364cd5cff916ff0`
* **Verification Status:** `OK (All (1) contracts were verified!)`
* **Link Etherscan:** [https://sepolia.etherscan.io/address/0xaf3ec1ee6b3949b3a3e28813a48378b76693a4e8](https://sepolia.etherscan.io/address/0xaf3ec1ee6b3949b3a3e28813a48378b76693a4e8)
