import React, { useEffect, useState } from "react";
import adminAxios from "../../adminAxios";
import "./index.css";
import { FaPlus } from "react-icons/fa";

// Hàm định dạng ngày dd/mm/yyyy tiếng Việt
function formatVNDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const AdminManageBrand = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Thêm state cho lọc ngày
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Lấy toàn bộ đơn hàng (không phân trang)
  const fetchOrders = async () => {
    setLoading(true);
    let url = `/orders/search?`;
    if (search) url += `searchTerm=${encodeURIComponent(search)}&`;
    if (status) url += `status=${status}&`;
    if (fromDate) url += `fromDate=${fromDate}&`;
    if (toDate) url += `toDate=${toDate}&`;
    const res = await adminAxios.get(url);
    setOrders(res.data.data || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [status, fromDate, toDate]);

  // Tìm kiếm
  const handleSearch = () => {
    fetchOrders();
  };

  // Xem chi tiết đơn hàng
  const handleShowDetail = async (orderId) => {
    setLoading(true);
    const res = await adminAxios.get(`/orders/${orderId}`);
    setSelectedOrder(res.data.data);
    setLoading(false);
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    await adminAxios.put(`/orders/${orderId}/status`, {
      status: newStatus,
    });
    setStatusUpdating(false);
    setSelectedOrder(null); // Đóng modal sau khi cập nhật
    fetchOrders(); // Cập nhật lại danh sách ngoài bảng
  };

  // Xóa đơn hàng
  const handleDelete = async (orderId) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      await adminAxios.delete(`/orders/${orderId}`);
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <h2>Quản lý thương hiệu</h2>
      <div className="admin-order-toolbar">
        <input
          placeholder="Tìm kiếm theo mã, tên brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-btn" onClick={handleSearch}>
          Tìm kiếm
        </button>
        <button className="admin-btn add-btn">
          <FaPlus /> Thêm brand mới
        </button>
      </div>
      {loading && <div>Đang tải...</div>}
      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã thương hiệu</th>
              <th>Tên</th>
              <th>Tổng sản phẩm</th>
              <th>Trạng thái</th>
              <th>Ngày bắt đầu</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((order) => !status || order.status === status)
              .map((order, idx) => (
                <tr key={order.order_id}>
                  <td>{idx + 1}</td>
                  <td>{order.order_id}</td>
                  <td>{order.full_name || order.name || "Không rõ"}</td>
                  <td style={{ wordBreak: "break-all", maxWidth: 140 }}>
                    {order.email || ""}
                  </td>
                  <td>{order.phone_number || ""}</td>
                  <td>{order.total_amount?.toLocaleString() || ""}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.createdAt ? formatVNDate(order.createdAt) : ""}
                  </td>
                  <td>
                    <button
                      className="admin-btn"
                      onClick={() => handleShowDetail(order.order_id)}
                      style={{ marginRight: 8 }}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="admin-btn delete-btn"
                      onClick={() => handleDelete(order.order_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Chi tiết đơn hàng</h3>
            <p>
              <b>Mã đơn:</b> {selectedOrder.order_id}
            </p>
            <p>
              <b>Khách hàng:</b>{" "}
              {selectedOrder.full_name || selectedOrder.name || "Không rõ"}
            </p>
            <p>
              <b>SĐT:</b> {selectedOrder.phone_number || ""}
            </p>
            <p>
              <b>Email:</b> {selectedOrder.email || ""}
            </p>
            <p>
              <b>Địa chỉ:</b> {selectedOrder.address || ""}
            </p>
            <p>
              <b>Phương thức thanh toán:</b>{" "}
              {selectedOrder.payment_method || ""}
            </p>
            <p>
              <b>Tổng tiền:</b>{" "}
              {selectedOrder.total_amount?.toLocaleString() || ""} đ
            </p>
            <p>
              <b>Trạng thái:</b> {selectedOrder.status}
            </p>
            <p>
              <b>Ngày tạo:</b>{" "}
              {selectedOrder.createdAt
                ? formatVNDate(selectedOrder.createdAt)
                : ""}
            </p>
            {/* Hiển thị sản phẩm trong đơn nếu có */}
            {selectedOrder.order_items &&
              Array.isArray(selectedOrder.order_items) && (
                <>
                  <b>Sản phẩm:</b>
                  <ul>
                    {selectedOrder.order_items.map((item, i) => (
                      <li key={i}>
                        <div>
                          <b>
                            {item.product_detail?.product?.name ||
                              item.productName ||
                              "Sản phẩm"}
                          </b>
                          {" - "}
                          {item.product_detail?.product?.brand?.name || ""}
                        </div>
                        <div>
                          <b>Mã sản phẩm chi tiết:</b>{" "}
                          {item.product_detail?.product_detail_id ||
                            item.product_detail_id ||
                            "Không rõ"}
                        </div>
                        <div>
                          Màu: {item.product_detail?.color?.name || ""}
                          {" | "}RAM:{" "}
                          {item.product_detail?.memory?.ram_size || item.ram}
                          {" | "}Bộ nhớ:{" "}
                          {item.product_detail?.memory?.storage_size ||
                            item.storage}
                        </div>
                        <div>
                          Số lượng: {item.quantity} | Đơn giá:{" "}
                          {item.unit_price?.toLocaleString() ||
                            item.price?.toLocaleString()}{" "}
                          đ | Thành tiền: {item.total_price?.toLocaleString()} đ
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            {/* Cập nhật trạng thái */}
            <div style={{ margin: "12px 0" }}>
              <b>Cập nhật trạng thái: </b>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleUpdateStatus(selectedOrder.order_id, e.target.value)
                }
                disabled={statusUpdating}
                style={{ marginLeft: 8 }}
              >
                <option value="PENDING">Chờ xử lý</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPED">Đang giao</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
            <button
              className="admin-btn"
              onClick={() => setSelectedOrder(null)}
              style={{ marginTop: 16 }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageBrand;
