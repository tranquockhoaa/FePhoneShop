import React from 'react';
import './modal-confirm.css';

const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa mục này?',
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  confirmButtonClass = 'btn-danger',
  cancelButtonClass = 'btn-secondary',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            className={`btn ${cancelButtonClass}`}
            onClick={handleClose}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${confirmButtonClass}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
