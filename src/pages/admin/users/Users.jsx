import React, { useState, useEffect } from "react";
import UserFormModal from "./user-form-modal";
import { Table, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { getUsersRequest } from "../../../store/uses/users.action";
import { createUserApi, updateUserApi } from "../../../api/users.api";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { listUsers } = useSelector((state) => state.users);

  const [search, setSearch] = useState("");
  const [showUserModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getUsersRequest({
        page: 1,
        limit: 30,
      })
    );
  }, []);

  const handleSearch = () => {
    const keyword = search.trim();
  };

  const handleUserSubmit = async (formData) => {
    setLoading(true);
    try {
      if (userDetail) {
        await updateUserApi({ id: userDetail.user_id, body: formData });
        notification.success({
          message: "Thành công",
          description: "Cập nhật người dùng thành công!",
        });
      } else {
        await createUserApi(formData);
        notification.success({
          message: "Thành công",
          description: "Tạo người dùng mới thành công!",
        });
      }

      dispatch(
        getUsersRequest({
          page: 1,
          limit: 30,
        })
      );

      setShowModal(false);
      setUserDetail(null);
    } catch (error) {
      console.error("Error submitting user:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SDT",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "role",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, value) => (
        <>
          <button
            className="admin-btn edit-btn"
            title="Sửa"
            onClick={() => {
              setShowModal(true);
              setUserDetail(value);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="admin-btn delete-btn"
            title="Xóa"
            onClick={() => {
              setIsModalConfirmOpen(true);
              setUserDetail(value);
            }}
          >
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="admin-product-page">
      <div className="admin-product-header">
        <h2>Quản lý sản phẩm</h2>
        <button
          className="admin-btn add-btn"
          onClick={() => {
            setShowModal(true);
            setUserDetail(null);
          }}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>
      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo mã sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-btn search-btn" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      <UserFormModal
        visible={showUserModal}
        onCancel={() => {
          setShowModal(false);
          setUserDetail(null);
        }}
        onOk={handleUserSubmit}
        userData={userDetail}
        isEdit={!!userDetail}
        loading={loading}
      />

      <ModalConfirm
        isOpen={isModalConfirmOpen}
        onClose={() => {
          setIsModalConfirmOpen(false);
          setUserDetail(null);
        }}
        onConfirm={() => {}}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa "${userDetail?.full_name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <div className="admin-product-table-wrapper">
        <Table columns={columns} dataSource={listUsers?.users || []} />
      </div>
    </div>
  );
};

export default AdminUsers;
