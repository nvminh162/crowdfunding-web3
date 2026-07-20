# Hướng dẫn Xác Minh Contract (Verify Contract)

Hướng dẫn xác minh mã nguồn Smart Contract trên Etherscan qua Forge CLI.

## 1. Cấu hình Biến Môi Trường (.env)
```bash
# Thêm ETHERSCAN_API_KEY vào .env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Load biến môi trường
source .env
```

## 2. Xác minh Contract đã Deploy (forge verify-contract / forge v)
```bash
# Cú pháp: forge v <ADDRESS> <PATH_TO_CONTRACT>:<CONTRACT_NAME> --rpc-url <RPC> --etherscan-api-key <KEY>
forge v 0x366deB9ED54445E596306D6715913a9A03ab8aF3 src/SimpleStorage.sol:SimpleStorage \
  --rpc-url $SEPOLIA_RPC_URL \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## 3. Kết quả Verify Thành Công
* **Response:** `OK`
* **GUID:** `jyf3qkzrbdrzgjjmr3ppedxiyty3xerk6wuykffvgnrr6vhm4d`
* **Link Etherscan:** [https://sepolia.etherscan.io/address/0x366deb9ed54445e596306d6715913a9a03ab8af3](https://sepolia.etherscan.io/address/0x366deb9ed54445e596306d6715913a9A03ab8af3)

## 4. Tự động Verify khi Deploy (Tùy chọn)
```bash
# Verify trực tiếp trong lúc chạy script deploy bằng cờ --verify
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```
