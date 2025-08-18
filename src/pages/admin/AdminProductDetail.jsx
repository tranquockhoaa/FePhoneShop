import React, { useEffect, useState } from 'react';
import adminAxios from './adminAxios';
import './AdminProductDetail.css';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { Table, Button, Space, Tag } from 'antd';

const AdminProductDetail = () => {
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newDetail, setNewDetail] = useState({
    productId: '',
    colorName: '',
    ramSize: '',
    storageSize: '',
    price: '',
    quantity: '',
  });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  // Pagination + sorting state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    loading: false,
  });
  const [currentSort, setCurrentSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'ASC',
  });

  useEffect(() => {
    fetchDetails(
      1,
      pagination.pageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      ''
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDetails = (
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'ASC',
    keyword = ''
  ) => {
    setPagination((prev) => ({ ...prev, loading: true }));
    adminAxios
      .get('/product-detail', {
        params: {
          page,
          size: pageSize,
          sortBy,
          sortOrder,
          search: keyword || undefined,
        },
      })
      .then((res) => {
        const data = res?.data || {};
        const list = data.productDetails || data.products || data.data || [];
        const total = data.totalItems ?? list.length ?? 0;
        const currentPage = data.currentPage || page;
        setDetails(list || []);
        setPagination((prev) => ({
          ...prev,
          current: currentPage,
          total: total,
          loading: false,
          pageSize: pageSize,
        }));
      })
      .catch(() => {
        // Fallback to non-paginated endpoint
        adminAxios
          .get('/product-detail')
          .then((res2) => {
            const list = res2?.data?.data || [];
            setDetails(list);
            setPagination((prev) => ({
              ...prev,
              current: 1,
              total: list.length,
              loading: false,
              pageSize: pageSize,
            }));
          })
          .catch(() => {
            setPagination((prev) => ({ ...prev, loading: false }));
          });
      });
  };

  const handleSearch = () => {
    const keyword = search.trim();
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDetails(
      1,
      pagination.pageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      keyword
    );
  };

  const sortByQuantityAsc = () => {
    setCurrentSort({ sortBy: 'quantity', sortOrder: 'ASC' });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDetails(1, pagination.pageSize, 'quantity', 'ASC', search.trim());
  };

  const sortByQuantityDesc = () => {
    setCurrentSort({ sortBy: 'quantity', sortOrder: 'DESC' });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDetails(1, pagination.pageSize, 'quantity', 'DESC', search.trim());
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminAxios.post('/api/v1/productDetails', {
      ...newDetail,
      price: Number(newDetail.price),
      quantity: Number(newDetail.quantity),
      productId: newDetail.productId,
    });
    setShowCreate(false);
    setNewDetail({
      productId: '',
      colorName: '',
      ramSize: '',
      storageSize: '',
      price: '',
      quantity: '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDetails(
      1,
      pagination.pageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      search.trim()
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa biến thể này?')) {
      await adminAxios.delete(`product-details/${id}`);
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchDetails(
        1,
        pagination.pageSize,
        currentSort.sortBy,
        currentSort.sortOrder,
        search.trim()
      );
      alert('Xóa thành công!');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await adminAxios.put(`/product-details/${editDetail.product_detail_id}`, {
      colorName: editDetail.colorName,
      ramSize: editDetail.ramSize,
      storageSize: editDetail.storageSize,
      price: Number(editDetail.price),
      quantity: Number(editDetail.quantity),
    });
    setEditDetail(null);
    setSelectedDetail(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchDetails(
      1,
      pagination.pageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      search.trim()
    );
  };

  const handleEditClick = (item) => {
    setEditDetail({
      ...item,
      colorName: item.color?.name || '',
      ramSize: item.memory?.ram_size || '',
      storageSize: item.memory?.storage_size || '',
      price: item.price,
      quantity: item.quantity,
    });
  };

  // Ant Design Table columns
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 80,
      render: (_, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'ID biến thể',
      dataIndex: 'product_detail_id',
      key: 'product_detail_id',
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'product_name',
      width: 220,
      render: (name) => name || '',
    },
    {
      title: 'Màu',
      dataIndex: ['color', 'name'],
      key: 'color',
      width: 120,
      render: (val) => val || '',
    },
    {
      title: 'RAM',
      dataIndex: ['memory', 'ram_size'],
      key: 'ram_size',
      width: 100,
      render: (val) => val || '',
    },
    {
      title: 'Bộ nhớ',
      dataIndex: ['memory', 'storage_size'],
      key: 'storage_size',
      width: 120,
      render: (val) => val || '',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price) =>
        price != null ? `${Number(price).toLocaleString()} đ` : '',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => (
        <Tag color={status || record.quantity > 0 ? 'green' : 'red'}>
          {(status && status !== 'INACTIVE') || record.quantity > 0
            ? 'Đang bán'
            : 'Ngừng bán'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, _record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(_record);
            }}
            title="Sửa"
          />
          <Button
            type="primary"
            danger
            size="small"
            icon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(_record.product_detail_id);
            }}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const newPageSize = pageSize;
    const newCurrent = pagination.pageSize !== newPageSize ? 1 : current;
    setPagination((prev) => ({
      ...prev,
      current: newCurrent,
      pageSize: newPageSize,
    }));
    fetchDetails(
      newCurrent,
      newPageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      search.trim()
    );
  };

  return (
    <div
      className="admin-product-page"
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <div className="admin-product-header">
        <h2>Chi tiết sản phẩm</h2>
        <button
          className="admin-btn add-btn"
          onClick={() => setShowCreate(true)}
        >
          <FaPlus /> Thêm biến thể
        </button>
      </div>
      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo ID biến thể hoặc tên sản phẩm..."
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
        <button
          className="admin-btn"
          style={{ marginLeft: 8 }}
          onClick={sortByQuantityAsc}
          title="Tồn kho ít đến nhiều"
        >
          Tồn kho ↑
        </button>
        <button
          className="admin-btn"
          style={{ marginLeft: 4 }}
          onClick={sortByQuantityDesc}
          title="Tồn kho nhiều đến ít"
        >
          Tồn kho ↓
        </button>
      </div>
      {showCreate && (
        <div className="admin-product-create-modal">
          <form
            className="admin-product-create-form"
            onSubmit={handleCreate}
          >
            <h3>Thêm biến thể sản phẩm</h3>
            <input
              required
              placeholder="ID sản phẩm"
              value={newDetail.productId}
              onChange={(e) =>
                setNewDetail({ ...newDetail, productId: e.target.value })
              }
            />
            <input
              required
              placeholder="Màu"
              value={newDetail.colorName}
              onChange={(e) =>
                setNewDetail({ ...newDetail, colorName: e.target.value })
              }
            />
            <input
              required
              placeholder="RAM"
              value={newDetail.ramSize}
              onChange={(e) =>
                setNewDetail({ ...newDetail, ramSize: e.target.value })
              }
            />
            <input
              required
              placeholder="Bộ nhớ"
              value={newDetail.storageSize}
              onChange={(e) =>
                setNewDetail({ ...newDetail, storageSize: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Giá bán"
              value={newDetail.price}
              onChange={(e) =>
                setNewDetail({ ...newDetail, price: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Tồn kho"
              value={newDetail.quantity}
              onChange={(e) =>
                setNewDetail({ ...newDetail, quantity: e.target.value })
              }
            />
            <div style={{ marginTop: 8 }}>
              <button
                type="submit"
                className="admin-btn add-btn"
              >
                Tạo
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={() => setShowCreate(false)}
                style={{ marginLeft: 8 }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto', width: '100%' }}>
        <Table
          columns={columns}
          dataSource={details}
          rowKey="product_detail_id"
          loading={pagination.loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} biến thể`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          sticky={{ offsetHeader: 0 }}
          onRow={(record) => ({
            onClick: () => setSelectedDetail(record),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      {/* Modal xem chi tiết */}
      {selectedDetail && !editDetail && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Thông tin chi tiết sản phẩm</h3>
            <p>
              <b>Mã sản phẩm (sku):</b> {selectedDetail.sku || 'Trống'}
            </p>
            <p>
              <b>Tên sản phẩm:</b> {selectedDetail.product?.name}
            </p>
            <p>
              <b>Màu:</b> {selectedDetail.color?.name}
            </p>
            <p>
              <b>RAM:</b> {selectedDetail.memory?.ram_size}
            </p>
            <p>
              <b>Bộ nhớ:</b> {selectedDetail.memory?.storage_size}
            </p>
            <p>
              <b>Giá bán:</b> {selectedDetail.price?.toLocaleString()} đ
            </p>
            <p>
              <b>Tồn kho:</b> {selectedDetail.quantity}
            </p>
            <p>
              <b>Trạng thái:</b>
              {selectedDetail?.status}
            </p>
            <button
              className="admin-btn"
              onClick={() => setSelectedDetail(null)}
              style={{
                marginTop: 16,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* Modal sửa */}
      {editDetail && (
        <div
          className="modal-overlay"
          onClick={() => setEditDetail(null)}
        >
          <form
            className="modal-content"
            style={{ minWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleUpdate}
          >
            <h3>Sửa thông tin biến thể</h3>
            <p>
              <b>ID sản phẩm:</b> {editDetail.product_detail_id}
            </p>
            <p>
              <b>Tên sản phẩm:</b> {editDetail.product?.name}
            </p>
            <input
              value={editDetail.colorName}
              onChange={(e) =>
                setEditDetail({ ...editDetail, colorName: e.target.value })
              }
              placeholder="Màu"
              required
            />
            <input
              value={editDetail.ramSize}
              onChange={(e) =>
                setEditDetail({ ...editDetail, ramSize: e.target.value })
              }
              placeholder="RAM"
              required
            />
            <input
              value={editDetail.storageSize}
              onChange={(e) =>
                setEditDetail({ ...editDetail, storageSize: e.target.value })
              }
              placeholder="Bộ nhớ"
              required
            />
            <input
              value={editDetail.price}
              type="number"
              min={0}
              onChange={(e) =>
                setEditDetail({ ...editDetail, price: e.target.value })
              }
              placeholder="Giá bán"
              required
            />
            <input
              value={editDetail.quantity}
              type="number"
              min={0}
              onChange={(e) =>
                setEditDetail({ ...editDetail, quantity: e.target.value })
              }
              placeholder="Tồn kho"
              required
            />
            <div style={{ marginTop: 8 }}>
              <button
                type="submit"
                className="admin-btn add-btn"
              >
                Lưu
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={() => setEditDetail(null)}
                style={{ marginLeft: 8 }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetail;
