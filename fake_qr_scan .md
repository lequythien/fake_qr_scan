**ĐỀ TÀI: HỆ THỐNG FAKE QR PAYMENT**

**I. Mô tả bài toán**

Trong quá trình phát triển các hệ thống tích hợp thanh toán QR code, cần có một công cụ để mô phỏng việc quét mã QR và xử lý thanh toán trong môi trường thử nghiệm.

Hệ thống cần cho phép:

- Tạo một QR code từ clientId.
- Người dùng quét mã → mở một liên kết.
- Liên kết tạo ra một pending payment trên hệ thống.
- Admin có thể cập nhật trạng thái giao dịch.
- Khi trạng thái thay đổi, hệ thống callback đến callbackUrl của client.

**II. Hoạt động & Yêu cầu chức năng**

1. **Đăng ký callback Url**

`	`**Hoạt động:** Mỗi hệ thống client muốn sử dụng dịch vụ cần đăng ký trước với một callbackUrl – nơi nhận kết quả thanh toán khi có thay đổi trạng thái.

`	`**Chức năng hệ thống**:

- Nhận callbackUrl từ client.
- Sinh clientId duy nhất và trả về.
- Lưu thông tin client gồm clientId và callbackUrl
1. **Tạo QR thanh toán**

`	`**Hoạt động**: Client gửi yêu cầu tạo QR cho một giao dịch cụ thể (số tiền, clientId). Server tạo ra paymentId và trả về link chứa mã QR (URL).

**Chức năng hệ thống**:

- Nhận amount, clientId từ client.
- Tạo paymentId, lưu giao dịch với trạng thái ban đầu là pending.
- Trả về URL để client tạo mã QR.
1. **Người dùng quét mã QR**

`	`**Hoạt động**: Khi người dùng quét mã QR, trình duyệt mở URL từ link. Hệ thống đánh dấu giao dịch là “đã được quét” và đang chờ xử lý.

`	`**Chức năng hệ thống:**

- Tiếp nhận yêu cầu GET theo URL QR.
- Hiển thị trang chờ xử lý và cập nhật trạng thái giao dịch nếu cần
1. **Admin xử lý giao dịch**

`	`**Hoạt động**: Đăng nhập Admin vào hệ thống để xử lý giao dịch, có thể chọn trạng thái success hoặc failed.

`	`**Chức năng hệ thống:**

- Cho phép cập nhật trạng thái giao dịch dựa trên paymentId.
- Chỉ admin được phép thực hiện thao tác này.
1. **Gửi callback đến client**

**Hoạt động**: Khi giao dịch được xử lý, hệ thống sẽ tự động gửi đến callbackUrl của client, báo trạng thái mới của giao dịch.

**Chức năng hệ thống**: Truy xuất callbackUrl dựa trên clientId trong giao dịch.



**III. Sơ Dồ Use Case**

![Mô tả ảnh](https://github.com/TrungNguyen0304/fake_qr_scan/blob/main/images/be389ec2-8752-41b6-b1f5-ccd759e463e6.jpg)

**1. Mô tả sơ đồ use:**

**1.1. Đăng ký callback URL:**

**-** Tác nhân chính: **Client**

**-** Điều kiện tiên quyết:** Client cung cấp callback URL hợp lệ.

**-** Luồng sự kiện chính:

- Client gửi POST /register với callbackUrl.
- Hệ thống kiểm tra callbackUrl.
- Hệ thống sinh clientId duy nhất.
- Hệ thống lưu clientId và callbackUrl.
- Hệ thống trả về clientId và thông báo thành công.

\- Kết quả mong đợi:

- Client nhận clientId.
- Thông tin client được lưu trữ.
- Hệ thống sẵn sàng gửi callback.

\- Luồng sự kiến thay thế:

- Callback URL không hợp lệ
  - Hệ thống trả lỗi 400: "Invalid callback URL".
  - Client cần kiểm tra và gửi lại URL chuẩn.
- Callback URL bị trùng
  - Trả HTTP 409: “Callback URL already registered”
  - Client cần: dùng callback URL khác hoặc lấy lại clientId cũ.

**1.2. Tạo mã QR thanh toán**:

\- Tác nhân chính: **Client**

**-** Điều kiện tiên quyết: 

- Client đã đăng ký và có **clientId** hợp lệ.
- Client cung cấp **amount** hợp lệ (số tiền không âm).

\- Luồng sự kiện chính:

- Client gửi yêu cầu POST /create-qr với **amount** và **clientId.**
- Hệ thống kiểm tra tính hợp lệ của **clientId** và **amount**.
- Hệ thống tạo **paymentId** duy nhất và lưu giao dịch với trạng thái **pending**.
- Hệ thống sinh URL chứa thông tin giao dịch (bao gồm paymentId).
- Hệ thống trả về URL cho client để tạo mã QR.

\- Kết quả mong đợi:

- Client nhận được URL để tạo mã QR.
- Giao dịch được lưu trong hệ thống với trạng thái **pending**.
- URL sẵn sàng để người dùng cuối quét và thực hiện thanh toán.

\- Luồng sự kiện thay thế:

- clientId không tồn tại: 
  - Trả về HTTP 404 với "Client ID not found".
  - Client cần: đăng ký lại và lấy đúng clientId.
- Amount không hợp lệ: 
  - Trả về HTTP 400 với "Invalid amount".
  - Client cần: kiểm tra dữ liệu form gửi lên.
- Lỗi tạo paymentId hoặc DB:
  - ` `Trả về HTTP 500 với "Failed to create payment".

**1.3. Người dùng quét mã QR**

\- Tác nhân chính: **User**

\- Điều kiện tiên quyết: 

- Mã QR đã được tạo với URL hợp lệ chứa **paymentId**.
- Giao dịch với **paymentId** tồn tại trong hệ thống, trạng thái ban đầu là **pending**.

\- Luồng sự kiện chính:

- Thiết bị mở URL được nhúng trong mã QR
- Hệ thống nhận yêu cầu GET, xác minh **paymentId** hợp lệ.
- Hệ thống cập nhật trạng thái giao dịch thành **đã quét**.

\- Kết quả mong đợi:

- Trang chờ xử lý hiển thị trên thiết bị người dùng.
- Giao dịch được cập nhật trạng thái **đã quét** trong hệ thống.
- Hệ thống sẵn sàng cho bước xử lý giao dịch tiếp theo (bởi admin).

\- Luồng sự kiện thay thế:

- URL hoặc paymentId không hợp lệ:
  - HTTP 404: "Payment not found"
  - Client cần: tạo lại QR hợp lệ.
- Giao dịch đã hết hạn
  - HTTP 410: "Payment expired"
  - Client cần: tạo QR mới cho giao dịch.
- Giao dịch đã được xử lý trước
  - Hiển thị trang: "Giao dịch đã hoàn tất."
  - User không cần thực hiện gì thêm.

**1.4. Admin cập nhật trạng thái giao dịch:**

\- Tác nhân chính: **Admin**

\- Điều kiện tiên quyết: 

- Admin  quyền truy cập giao diện quản trị.
- Giao dịch tồn tại trong hệ thống với **paymentId** và trạng thái **pending** hoặc **đã quét**.

\- Luồng sự kiện chính:

- Admin truy cập giao diện quản trị.
- Admin tìm giao dịch theo **paymentId**.
- Admin chọn trạng thái mới (**success** hoặc **failed**).
- Hệ thống cập nhật trạng thái giao dịch.
- Hệ thống lưu trạng thái mới vào cơ sở dữ liệu.

\- Kết quả mong đợi:

- Trạng thái giao dịch được cập nhật thành **success** hoặc **failed**.
- Hệ thống sẵn sàng gửi callback đến client

\- Luồng sự kiện thay thế:

- Chưa đăng nhập / hết phiên
  - HTTP 401: "Unauthorized"
  - Admin cần: đăng nhập lại.
- Không có quyền admin: 
  - HTTP 403: "Forbidden"
  - Admin cần: dùng tài khoản có quyền admin.
- paymentId không hợp lệ
  - HTTP 404: "Payment not found"
  - Admin cần: kiểm tra đúng paymentId.

**1.5. Nhận callback kết quả thanh toán** 

\- Tác nhân chính: **Client**

\- Điều kiện tiên quyết:

- Giao dịch đã được cập nhật trạng thái mới (**success** hoặc **failed**).
- **clientId** của giao dịch tồn tại và liên kết với **callbackUrl** hợp lệ trong hệ thống.

\- Luồng sự kiện chính:

- Hệ thống phát hiện trạng thái giao dịch thay đổi (success/failed).
- Hệ thống lấy **callbackUrl** từ **clientId** liên quan.
- Hệ thống gửi HTTP POST đến **callbackUrl**, chứa **paymentId** và trạng thái mới.
- Client nhận và xử lý thông báo callback.

\- Kết quả mong đợi:

- Client nhận thông báo trạng thái giao dịch qua **callbackUrl**.
- Hệ thống ghi nhận gửi callback thành công.

\- Luồng sự kiện thay thế:

- callbackUrl không phản hồi: 
  - Retry gửi callback tối đa 3 lần. Nếu vẫn lỗi, lưu log "Callback failed"
- clientId không hợp lệ hoặc không có callbackUrl:
  - ` `Ghi log lỗi "Callback URL not found for client" và bỏ qua gửi.
- Phản hồi lỗi từ client (500, 404): 
  - Lưu log phản hồi và báo lỗi trong dashboard admin 

**IV. Sơ đồ lớp** \


![Mô tả ảnh](https://github.com/TrungNguyen0304/fake_qr_scan/blob/main/images/56cfe30c-50f2-44e3-a09d-0157d9e90ff9.jpg)
