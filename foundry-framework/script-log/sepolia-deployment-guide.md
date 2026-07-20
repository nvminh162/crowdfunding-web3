# Hướng dẫn Deploy Sepolia Testnet

Hướng dẫn deploy và tương tác Smart Contract trên Sepolia Testnet qua Alchemy và Bảo mật `.env`.

## 1. Bảo mật Biến môi trường (.env)

Tạo file `.env` chứa URL RPC để tránh lộ API key:
```bash
# Kiểm tra file .gitignore đã có .env chưa
cat .gitignore

# Tạo file .env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Load biến môi trường vào Git Bash
source .env
```

## 2. Import Ví Keystore
```bash
cast wallet import foundry-learn --interactive
# Address: 0x402c41118d930f1788ce7f78a4b783e9b850ce32
```

## 3. Deploy Contract (Forge Script)

### Dry-run Simulation (Giả lập)
```bash
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn
```

### Broadcast Deploy THẬT On-chain
```bash
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn \
  --broadcast
# Contract: 0x366deB9ED54445E596306D6715913a9A03ab8aF3
# Tx Hash:  0x9db9570967b8bf9e55a5e32eb37b605bf4f6e108a96317ddb711ff11ef53eafa
# Block:    11310116
# Etherscan: https://sepolia.etherscan.io/address/0x366deB9ED54445E596306D6715913a9A03ab8aF3
```

## 4. Tương tác với Contract (Cast Call & Send)

### Đọc giá trị State (cast call)
```bash
cast call 0x366deB9ED54445E596306D6715913a9A03ab8aF3 "number()" \
  --rpc-url $SEPOLIA_RPC_URL
# Hex Output: 0x0000000000000000000000000000000000000000000000000000000000000000 (0)
```

### Gửi Transaction ghi State (cast send)
```bash
cast send 0x366deB9ED54445E596306D6715913a9A03ab8aF3 "setNumber(uint256)" 16022004 \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn
# Tx Hash: 0xeaafa7b2a12078d423cb99f80b77d5fe33d5f35e4a03bf86e34e126744d538dd
# Block:   11310308
# Etherscan Tx: https://sepolia.etherscan.io/tx/0xeaafa7b2a12078d423cb99f80b77d5fe33d5f35e4a03bf86e34e126744d538dd
```

### Kiểm tra lại giá trị mới & Chuyển đổi Hex
```bash
cast call 0x366deB9ED54445E596306D6715913a9A03ab8aF3 "number()" \
  --rpc-url $SEPOLIA_RPC_URL
# Hex Output: 0x0000000000000000000000000000000000000000000000000000000000f479f4

cast --to-base 0x0000000000000000000000000000000000000000000000000000000000f479f4 dec
# Dec Output: 16022004
```

## 5. Khắc phục lỗi (Troubleshooting)
| Lỗi | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `Error: odd number of digits` | Private Key nhập thiếu ký tự (chuỗi hex lẻ) | Copy đủ 64 ký tự hex |
| `unexpected argument '--acount'` | Sai cờ `--acount` | Sửa thành `--account` |
| `Keystore file "foudry-learn" does not exist` | Sai tên keystore `foudry-learn` | Sửa thành `foundry-learn` |
| `contract source info format must be...` | Dùng dấu gạch ngược `script\Deploy...` | Dùng dấu gạch xuôi `script/Deploy...` |
