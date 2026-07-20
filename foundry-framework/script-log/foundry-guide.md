# Foundry Guide

Tài liệu hướng dẫn & ghi chú lệnh Foundry (Forge, Anvil, Cast).

## 1. Cài đặt & Môi trường (Git Bash vs PowerShell)

### Trên Git Bash (Linux / MSYS2 shell)
```bash
# Nạp tạm thời trong session hiện tại
export PATH="$PATH:/c/Users/nvmin/.foundry/bin"

# Nạp file .env
source .env
```

### Trên Windows PowerShell
```powershell
# Nạp tạm thời trong session PowerShell hiện tại
$env:PATH += ";C:\Users\nvmin\.foundry\bin"

# Thêm vĩnh viễn vào User Environment Variables của Windows (Không bao giờ cần gõ lại PATH)
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\nvmin\.foundry\bin", "User")
```

---

## 2. Khởi tạo, Biên dịch & Dọn dẹp
```bash
forge init .
forge compile
forge clean
```

---

## 3. Quản lý Biến Môi Trường (.env)

* **Git Bash:** `source .env`
* **PowerShell:**
  ```powershell
  Get-Content .env | ForEach-Object { if ($_ -match '^([^=]+)=(.*)$') { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2]) } }
  ```

---

## 4. Mạng Cục Bộ Anvil
```bash
anvil
# RPC: http://127.0.0.1:8545 | Chain ID: 31337
```

---

## 5. Quản lý Ví Keystore
```bash
# Tạo keystore mã hóa từ private key (an toàn)
cast wallet import nvminh162-anvil --interactive

# Xem danh sách keystore đã lưu
cast wallet list
```

---

## 6. Deploy Contract (Forge Script & Forge Create)
```bash
# Dry-run simulation (chưa ghi on-chain)
forge script script/DeploySimpleStorage.s.sol --rpc-url http://127.0.0.1:8545

# Broadcast deploy lên Anvil qua Keystore
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --account nvminh162-anvil \
  --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Deploy dùng biến môi trường từ .env
forge script script/DeploySimpleStorage.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn \
  --broadcast
```

---

## 7. Tương tác với Contract (Cast Send & Call)
```bash
# Gửi transaction (thay đổi state)
cast send 0x366deB9ED54445E596306D6715913a9A03ab8aF3 "setNumber(uint256)" 16022004 \
  --rpc-url $SEPOLIA_RPC_URL \
  --account foundry-learn

# Đọc dữ liệu (read-only)
cast call 0x366deB9ED54445E596306D6715913a9A03ab8aF3 "number()" --rpc-url $SEPOLIA_RPC_URL

# Chuyển Hex sang Thập phân (Decimal)
cast --to-base 0x0000000000000000000000000000000000000000000000000000000000f479f4 dec
```

---

## 8. Khắc phục lỗi (Troubleshooting)
| Lỗi | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| `export: The term 'export' is not recognized` | Gõ lệnh `export` của Bash trực tiếp trên PowerShell | Trong PowerShell dùng: `$env:PATH += ";C:\Users\nvmin\.foundry\bin"` |
| `anvil: The term 'anvil' is not recognized` | PATH chưa được nạp trong terminal | Chạy câu lệnh nạp PATH tương ứng với Shell đang dùng |
| `unrecognized subcommand 'comlile'` | Gõ sai chính tả | Dùng `forge compile` |
| `contract source info format must be...` | Dùng dấu gạch ngược `\` | Dùng dấu gạch xuôi `/`: `script/DeploySimpleStorage.s.sol` |
| `tcp connect error` | Anvil node chưa bật | Bật `anvil` ở terminal riêng |
| `Source "forge-std/Script.sol" not found` | Thiếu remappings | Tạo `remappings.txt` |
| `Detected artifacts built from source files that no longer exist` | Còn cache cũ | Dùng `forge clean` |
