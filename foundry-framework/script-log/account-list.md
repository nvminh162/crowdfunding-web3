Các câu lệnh PowerShell liên quan đến **Cast Wallet** để bạn tự xem và quản lý:

---

### 1. Xem danh sách tất cả các ví đã lưu:

```powershell
cast wallet list
```

---

### 2. Xem địa chỉ Public (0x...) của một ví cụ thể:

```powershell
cast wallet address --account 0xfoundry-learn
```

_(hoặc thay bằng tên ví khác: `cast wallet address --account 0xnvminh162-anvil`)_

---

### 3. Tạo/Thêm (Import) một ví mới:

```powershell
cast wallet import tên_ví_bạn_muốn_đặt --interactive
```

---

_Lưu ý: Nếu PowerShell báo chưa tìm thấy lệnh `cast`, bạn chạy câu lệnh thêm PATH này trước:_

```powershell
$env:PATH += ";C:\Users\nvmin\.foundry\bin"
```
