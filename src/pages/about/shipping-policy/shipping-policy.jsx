import React from "react";
import "./shipping-policy.css";

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy">
      <h1>Chính Sách Vận Chuyển</h1>

      <section>
        <h2>1. Phạm vi áp dụng</h2>
        <p>
          Chính sách vận chuyển này áp dụng cho tất cả các đơn hàng được đặt mua
          tại cửa hàng hoặc website của chúng tôi trên toàn quốc.
        </p>
      </section>

      <section>
        <h2>2. Thời gian giao hàng</h2>
        <ul>
          <li>
            Khu vực nội thành: 1 - 2 ngày làm việc kể từ khi xác nhận đơn hàng.
          </li>
          <li>
            Khu vực ngoại thành và tỉnh: 3 - 5 ngày làm việc tùy theo địa chỉ
            nhận hàng.
          </li>
          <li>Các đơn hàng ở vùng xa, hải đảo: 5 - 7 ngày làm việc.</li>
        </ul>
      </section>

      <section>
        <h2>3. Phí vận chuyển</h2>
        <ul>
          <li>Miễn phí giao hàng cho đơn hàng từ 2.000.000 VNĐ trở lên.</li>
          <li>Đơn hàng dưới 2.000.000 VNĐ sẽ tính phí theo khu vực.</li>
        </ul>
      </section>

      <section>
        <h2>4. Quy định nhận hàng</h2>
        <p>
          Quý khách vui lòng kiểm tra kỹ sản phẩm khi nhận hàng. Nếu phát hiện
          hư hỏng hoặc sai sản phẩm, xin liên hệ ngay với chúng tôi để được hỗ
          trợ đổi/trả.
        </p>
      </section>

      <section>
        <h2>5. Liên hệ hỗ trợ</h2>
        <p>
          📞 Hotline: 0345697125 <br />
          📧 Email: support@buynewphone.com <br />
          🏢 Địa chỉ: Số 123, Đường ABC, Quận XYZ, TP. HCM
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
