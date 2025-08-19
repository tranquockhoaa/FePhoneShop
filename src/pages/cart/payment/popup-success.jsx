
import { Modal, Button } from "antd"

const OrderSuccessPopup = ({
  visible,
  onClose,
  onViewOrder,
  onGoHome,
  title = "Thông báo",
  message = "Đặt đơn hàng thành công",
}) => {
  const handleViewOrder = () => {
    onViewOrder?.()
    onClose?.()
  }

  const handleGoHome = () => {
    onGoHome?.()
    onClose?.()
  }

  return (
    <Modal title={title} open={visible} footer={null} closable={false} centered width={400} onCancel={onClose}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "48px", color: "#52c41a", marginBottom: "16px" }}>✓</div>
        <h3
          style={{
            color: "#52c41a",
            marginBottom: "24px",
            fontSize: "18px",
          }}
        >
          {message}
        </h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <Button type="primary" onClick={handleViewOrder} style={{ minWidth: "120px" }}>
            Xem đơn hàng
          </Button>
          <Button onClick={handleGoHome} style={{ minWidth: "120px" }}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default OrderSuccessPopup
