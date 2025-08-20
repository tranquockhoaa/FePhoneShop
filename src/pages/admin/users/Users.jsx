import React, { useState, useEffect } from 'react';
import UserFormModal from './user-form-modal';
import { Table, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import ModalConfirm from '../../../components/modal-confirm';

import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { getUsersRequest } from '../../../store/uses/users.action';
import { createUserApi, updateUserApi } from '../../../api/users.api';

import './AdminUsers.css';
import AdminPageHeader from '../../../components/admin/PageHeader';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { listUsers, loading: usersLoading } = useSelector(
    (state) => state.users
  );

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showUserModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState();
  const [formLoading, setFormLoading] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getUsersRequest({
        page: 1,
        limit: pagination.pageSize,
      })
    );
  }, [pagination.pageSize, dispatch]);

  useEffect(() => {
    if (!listUsers) return;
    const nextTotal = Number(listUsers?.total || 0);
    setPagination((prev) => ({
      ...prev,
      total: nextTotal,
      current: Number(listUsers?.page || 0),
    }));
  }, [listUsers]);

  const handleUserSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (userDetail) {
        await updateUserApi({ id: userDetail.user_id, body: formData });
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật người dùng thành công!',
        });
      } else {
        await createUserApi(formData);
        notification.success({
          message: 'Thành công',
          description: 'Tạo người dùng mới thành công!',
        });
      }

      dispatch(
        getUsersRequest({
          page: 1,
          limit: pagination.pageSize,
        })
      );

      setShowModal(false);
      setUserDetail(null);
    } catch (error) {
      console.error('Error submitting user:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra! Vui lòng thử lại.',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearch = () => {
    const keyword = search.trim();
    setPagination((prev) => ({ ...prev, current: 1 }));
    dispatch(
      getUsersRequest({
        page: 1,
        limit: pagination.pageSize,
        search: keyword || undefined,
      })
    );
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const newPageSize = pageSize;
    const newCurrent = pagination.pageSize !== newPageSize ? 1 : current;
    setPagination((prev) => ({
      ...prev,
      current: newCurrent,
      pageSize: newPageSize,
    }));
    dispatch(
      getUsersRequest({
        page: newCurrent,
        limit: newPageSize,
        search: search.trim() || undefined,
      })
    );
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'full_name',
      key: 'full_name',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SDT',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'role',
      key: 'role',
      dataIndex: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
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
          {/* <button
            className="admin-btn delete-btn"
            title="Xóa"
            onClick={() => {
              setIsModalConfirmOpen(true);
              setUserDetail(value);
            }}
          >
            <FaTrash />
          </button> */}
        </>
      ),
    },
  ];

  return (
    <div className="admin-product-page">
      <AdminPageHeader
        title="Quản lý người dùng"
        rightContent={
          <button
            className="admin-btn add-btn"
            onClick={() => {
              setShowModal(true);
              setUserDetail(null);
            }}
          >
            <FaPlus /> Thêm người dùng
          </button>
        }
      />
      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo mã sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="admin-btn search-btn"
          onClick={handleSearch}
        >
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
        loading={formLoading}
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
        <Table
          columns={columns}
          dataSource={listUsers?.users || []}
          rowKey="user_id"
          loading={usersLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
