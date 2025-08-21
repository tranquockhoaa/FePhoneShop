import { Button, Modal, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdClear } from "react-icons/md";

import adminAxios from "./adminAxios";

import { updateOrderStatusApi } from "../../api/order";
import "./AdminOrderList.css";

// Hàm định dạng ngày dd/mm/yyyy tiếng Việt
function formatVNDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const AdminOrderList = () => {
  // State chính
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // State phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
  });

  // Lấy danh sách đơn hàng
  const fetchOrders = async (page = 1, pageSize = 10) => {
    setPagination((prev) => ({ ...prev, loading: true }));
    try {
      let url = `/orders?page=${page}&limit=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      if (fromDate) url += `&dateFrom=${fromDate}`;
      if (toDate) url += `&dateTo=${toDate}`;
      if (paymentMethod) url += `&payment_method=${paymentMethod}`;

      const res = await adminAxios.get(url);
      setOrders(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: res.data.total || 0,
        loading: false,
      }));
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setPagination((prev) => ({ ...prev, loading: false }));
    }
  };

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(1, pagination.pageSize);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, fromDate, toDate, paymentMethod]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchOrders();
  }, []);

  // Xem chi tiết đơn hàng
  const handleShowDetail = async (orderId) => {
    setLoading(true);
    try {
      const res = await adminAxios.get(`/orders/${orderId}`);
      setSelectedOrder(res.data.data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus, orderCode) => {
    let vnStatus = "";
    if (newStatus === "PENDING") {
      vnStatus = "Chờ xử lý";
    } else if (newStatus === "CONFIRMED") {
      vnStatus = "Đã xác nhận";
    } else if (newStatus === "SHIPPED") {
      vnStatus = "Đang giao";
    } else if (newStatus === "DELIVERED") {
      vnStatus = "Đã giao";
    } else if (newStatus === "CANCELLED") {
      vnStatus = "Đã hủy";
    } else {
      vnStatus = newStatus;
    }

    if (
      !window.confirm(
        `Xác nhận chuyển trạng thái đơn hàng #${orderCode} sang "${vnStatus}"?`
      )
    ) {
      return;
    }

    setStatusUpdating(true);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      fetchOrders(pagination.current, pagination.pageSize);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Xóa đơn hàng
  // const handleDelete = async (orderId, orderCode) => {
  //   if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng #${orderCode}?`)) {
  //     return;
  //   }
  //   try {
  //     await deleteOrderApi(orderId);
  //     alert(`Đã xóa đơn hàng #${orderCode} thành công!`);
  //     fetchOrders(pagination.current, pagination.pageSize);
  //     setSelectedOrder(null);
  //   } catch (error) {
  //     console.error("Lỗi khi xóa đơn hàng:", error);
  //   }
  // };

  // Xử lý thay đổi trang
  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

  const handleClear = () => {
    setStatus("");
    setFromDate("");
    setToDate("");
    setPaymentMethod("");
    setSearch("");
  }

  // Cột cho bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (_, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Khách hàng",
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => text || record.name || "Không rõ",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "",
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => text || "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => (amount ? `${amount.toLocaleString()} đ` : "0 đ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          DELIVERED: { label: "Đã giao", color: "green" },
          CANCELLED: { label: "Đã hủy", color: "red" },
          SHIPPED: { label: "Đang giao", color: "blue" },
          CONFIRMED: { label: "Đã xác nhận", color: "orange" },
          PENDING: { label: "Chờ xử lý", color: "default" },
        };

        const { label, color } = statusMap[status] || {
          label: status,
          color: "default",
        };

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatVNDate(date),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<FaEye />}
            onClick={() => handleShowDetail(record.order_id)}
            size="small"
          />
          {/* <Button
            type="primary"
            danger
            icon={<FaTrash />}
            onClick={() => handleDelete(record.order_id, record.code)}
            size="small"
          /> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-order-page">
      <div className="admin-order-header">
        <h2>Quản lý đơn hàng</h2>
      </div>

      {/* Thanh công cụ */}
      <div className="admin-order-toolbar">
        <input
          placeholder="Tìm kiếm theo tên, SĐT, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-order-search"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-order-filter"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="SHIPPED">Đang giao</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="admin-order-filter"
        >
          <option value="">Tất cả phương thức</option>
          <option value="COD">COD</option>
          <option value="VNPAY">VNPAY</option>
        </select>

        <label className="date-filter-label">
          Từ ngày:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-filter-input"
          />
        </label>

        <label className="date-filter-label">
          Đến ngày:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="date-filter-input"
          />
        </label>

        <Button
          type="primary"
          onClick={handleClear}
          icon={<MdClear />}
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <div className="order-table-container">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="order_id"
          loading={pagination.loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.code || ""}`}
        visible={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedOrder(null)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="order-detail-content">
            <div className="order-detail-section">
              <h3>Thông tin khách hàng</h3>
              <p>
                <b>Tên:</b>{" "}
                {selectedOrder.full_name || selectedOrder.name || "Không rõ"}
              </p>
              <p>
                <b>SĐT:</b> {selectedOrder.phone_number || "Không có"}
              </p>
              <p>
                <b>Email:</b> {selectedOrder.email || "Không có"}
              </p>
              <p>
                <b>Địa chỉ:</b> {selectedOrder.address || "Không có"}
              </p>
            </div>

            <div className="order-detail-section">
              <h3>Thông tin đơn hàng</h3>
              <p>
                <b>Ngày tạo:</b> {formatVNDate(selectedOrder.createdAt)}
              </p>
              <p>
                <b>Phương thức thanh toán:</b>{" "}
                {selectedOrder.payment_method || "Không rõ"}
              </p>
              <p>
                <b>Tổng tiền:</b>{" "}
                {selectedOrder.total_amount?.toLocaleString() || 0} đ
              </p>
              <p>
                <b>Trạng thái:</b>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleUpdateStatus(
                      selectedOrder.order_id,
                      e.target.value,
                      selectedOrder.code
                    )
                  }
                  disabled={statusUpdating}
                  className="status-select"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="SHIPPED">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
                {statusUpdating && (
                  <span className="updating-text">Đang cập nhật...</span>
                )}
              </p>
            </div>

            {selectedOrder.order_items?.length > 0 && (
              <div className="order-detail-section">
                <h3>Danh sách sản phẩm</h3>
                <div className="order-items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tên sản phẩm</th>
                        <th>Thông số</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <b>
                              {item.product_details?.product?.name ||
                                item.productName ||
                                "Sản phẩm"}
                            </b>
                            {item.product_details?.product?.brand?.name && (
                              <div>
                                Thương hiệu:{" "}
                                {item.product_details.product.brand.name}
                              </div>
                            )}
                          </td>
                          <td>
                            <div>
                              Màu:{" "}
                              {item.product_details?.color?.name ||
                                item.color ||
                                "N/A"}
                            </div>
                            <div>
                              RAM:{" "}
                              {item.product_details?.memory?.ram_size ||
                                item.ram ||
                                "N/A"}
                            </div>
                            <div>
                              Bộ nhớ:{" "}
                              {item.product_details?.memory?.storage_size ||
                                item.storage ||
                                "N/A"}
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            {item.unit_price?.toLocaleString() ||
                              item.price?.toLocaleString() ||
                              0}{" "}
                            đ
                          </td>
                          <td>
                            <b>{item.total_price?.toLocaleString() || 0} đ</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrderList;
