import { useState } from "react";
const AdminManageBrand = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <h2>Danh sách brand</h2>
      <div className="admin-order-toolbar">
        <input placeholder="Tìm kiếm theo tên, SĐT, email..." />
        <button className="admin-btn">Tìm kiếm</button>
      </div>
      {loading && <div>Đang tải...</div>}
      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã </th>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>SĐT</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
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
    </div>
  );
};
