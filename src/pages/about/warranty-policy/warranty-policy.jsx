import React from "react";
import "./warranty-policy.css";

const WarrantyPolicy = () => {
  return (
    <div className="warranty-policy">
      <h1>Chính Sách Bảo Hành</h1>
      <p>
        Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi. Chúng tôi
        luôn mong muốn mang đến cho khách hàng những sản phẩm chất lượng cùng
        dịch vụ hậu mãi tốt nhất. Chính sách bảo hành dưới đây giúp bạn nắm rõ
        quyền lợi và quy trình khi cần bảo hành sản phẩm.
      </p>

      <h2>1. Thời gian bảo hành</h2>
      <ul>
        <li>Thời gian bảo hành tiêu chuẩn: 12 tháng kể từ ngày mua hàng.</li>
        <li>
          Một số sản phẩm có thể có thời gian bảo hành dài hơn, tùy theo chính
          sách của nhà sản xuất.
        </li>
        <li>
          Ngày bắt đầu tính bảo hành được ghi trên hóa đơn hoặc phiếu bảo hành.
        </li>
      </ul>

      <h2>2. Điều kiện bảo hành</h2>
      <ul>
        <li>Sản phẩm còn trong thời gian bảo hành.</li>
        <li>Có phiếu bảo hành hoặc hóa đơn mua hàng hợp lệ.</li>
        <li>Lỗi do nhà sản xuất: lỗi phần cứng, linh kiện, hoặc kỹ thuật.</li>
        <li>Sản phẩm còn nguyên tem bảo hành, không bị rách, tẩy xóa.</li>
      </ul>

      <h2>3. Các trường hợp không được bảo hành</h2>
      <ul>
        <li>Sản phẩm hư hỏng do sử dụng sai cách, rơi vỡ, va đập mạnh.</li>
        <li>Sản phẩm bị vào nước, ẩm mốc, cháy nổ do điện áp không ổn định.</li>
        <li>
          Sản phẩm bị sửa chữa bởi đơn vị không thuộc hệ thống bảo hành của
          chúng tôi.
        </li>
        <li>Không có phiếu bảo hành hoặc hóa đơn mua hàng.</li>
      </ul>

      <h2>4. Quy trình bảo hành</h2>
      <ol>
        <li>
          Liên hệ với bộ phận chăm sóc khách hàng qua số điện thoại hoặc email.
        </li>
        <li>Cung cấp thông tin sản phẩm và tình trạng lỗi.</li>
        <li>Gửi sản phẩm đến trung tâm bảo hành hoặc cửa hàng gần nhất.</li>
        <li>Kỹ thuật viên kiểm tra, xác nhận tình trạng sản phẩm.</li>
        <li>Tiến hành sửa chữa hoặc đổi mới theo chính sách.</li>
      </ol>

      <h2>5. Thời gian xử lý bảo hành</h2>
      <p>
        Thời gian bảo hành tùy thuộc vào tình trạng sản phẩm và linh kiện thay
        thế, thông thường từ 3 - 7 ngày làm việc. Chúng tôi sẽ thông báo cụ thể
        cho bạn sau khi tiếp nhận sản phẩm.
      </p>

      <h2>6. Liên hệ hỗ trợ</h2>
      <p>
        📞 Hotline: 0345697125 <br />
        📧 Email: support@buynewphone.com <br />
        🏢 Địa chỉ: Số 123, Đường ABC, Quận XYZ, TP. HCM
      </p>
    </div>
  );
};

export default WarrantyPolicy;
