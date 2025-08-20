import React, { useEffect, useState, useMemo } from 'react';
import adminAxios from './adminAxios';
import { useSelector, useDispatch } from 'react-redux';
import { getColorListApiRq } from '../../store/color-list/color-list.action';
import './AdminProductDetail.css';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { Table, Button, Space, Tag, message } from 'antd';
import ModalForm from '../../components/ModalForm';

const AdminProductDetail = () => {
  const dispatch = useDispatch();
  const { listColor } = useSelector((state) => state.listColors);
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [selectedDetail, setSelectedDetail] = useState(null);

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

  const optionColors = useMemo(
    () =>
      listColor?.map((item) => ({
        value: item.color_id.toString(),
        label: item.name,
      })) || [],
    [listColor]
  );

  // Định nghĩa các trường form cho ModalForm
  const productDetailFields = [
    {
      name: 'productId',
      label: 'ID sản phẩm',
      type: 'input',
      required: true,
      span: 12,
    },
    {
      name: 'colorName',
      label: 'Màu sắc',
      type: 'select',
      required: true,
      span: 12,
      options: optionColors,
    },
    {
      name: 'ramSize',
      label: 'RAM',
      type: 'select',
      span: 12,
      options: [
        { value: '2GB', label: '2GB' },
        { value: '3GB', label: '3GB' },
        { value: '4GB', label: '4GB' },
        { value: '6GB', label: '6GB' },
        { value: '8GB', label: '8GB' },
        { value: '12GB', label: '12GB' },
        { value: '16GB', label: '16GB' },
      ],
    },
    {
      name: 'storageSize',
      label: 'Bộ nhớ',
      type: 'select',
      span: 12,
      options: [
        { value: '32GB', label: '32GB' },
        { value: '64GB', label: '64GB' },
        { value: '128GB', label: '128GB' },
        { value: '256GB', label: '256GB' },
        { value: '512GB', label: '512GB' },
        { value: '1TB', label: '1TB' },
      ],
    },
    {
      name: 'price',
      label: 'Giá bán (VNĐ)',
      type: 'number',
      required: true,
      span: 12,
      min: 0,
    },
    {
      name: 'quantity',
      label: 'Số lượng tồn kho',
      type: 'number',
      required: true,
      span: 12,
      min: 0,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: false,
      span: 12,
      options: [
        { value: 'ACTIVE', label: 'Đang bán' },
        { value: 'INACTIVE', label: 'Ngừng bán' },
      ],
    },
    {
      name: 'specifications',
      label: 'Thông số kỹ thuật',
      type: 'list',
      required: false,
    },
  ];

  useEffect(() => {
    fetchDetails(
      1,
      pagination.pageSize,
      currentSort.sortBy,
      currentSort.sortOrder,
      ''
    );

    dispatch(getColorListApiRq());
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

  const handleAdd = () => {
    setEditMode(false);
    setCurrentRecord({});
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setCurrentRecord({
      productId: record.product_id || '',
      product_detail_id: record.product_detail_id || '',
      colorName: record.color_id.toString(),
      ramSize: record.memory?.ram_size || '',
      storageSize: record.memory?.storage_size || '',
      price: record.price || 0,
      quantity: record.quantity || 0,
      status: record.status || 'ACTIVE',
      specifications: record.specifications || [],
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editMode) {
        // Cập nhật biến thể sản phẩm
        await adminAxios.put(
          `/product-detail/${currentRecord.product_detail_id}`,
          {
            color_id: Number(values.colorName),
            ramSize: values.ramSize,
            storageSize: values.storageSize,
            price: Number(values.price),
            quantity: Number(values.quantity),
            status: values.status,
            specifications: JSON.stringify(values?.specifications || ''),
          }
        );
        message.success('Cập nhật biến thể sản phẩm thành công!');
      } else {
        // Thêm biến thể sản phẩm mới
        await adminAxios.post('/product-detail/create', {
          ...values,
          color_id: Number(values.colorName),
          price: Number(values.price),
          quantity: Number(values.quantity),
          specifications: JSON.stringify(values.specifications || []),
        });
        message.success('Thêm biến thể sản phẩm thành công!');
      }

      setModalVisible(false);
      setCurrentRecord({});

      // Refresh data
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchDetails(
        1,
        pagination.pageSize,
        currentSort.sortBy,
        currentSort.sortOrder,
        search.trim()
      );
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCurrentRecord({});
  };

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`product-details/${id}`);
      message.success('Xóa biến thể thành công!');

      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchDetails(
        1,
        pagination.pageSize,
        currentSort.sortBy,
        currentSort.sortOrder,
        search.trim()
      );
    } catch {
      message.error('Có lỗi xảy ra khi xóa!');
    }
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
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
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
              handleDelete(record.product_detail_id);
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
        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={handleAdd}
          className="admin-btn add-btn"
        >
          Thêm biến thể
        </Button>
      </div>

      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo ID biến thể hoặc tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          type="primary"
          icon={<FaSearch />}
          onClick={handleSearch}
          className="admin-btn search-btn"
        />
        <Button
          className="admin-btn"
          style={{ marginLeft: 8 }}
          onClick={sortByQuantityAsc}
          title="Tồn kho ít đến nhiều"
        >
          Tồn kho ↑
        </Button>
        <Button
          className="admin-btn"
          style={{ marginLeft: 4 }}
          onClick={sortByQuantityDesc}
          title="Tồn kho nhiều đến ít"
        >
          Tồn kho ↓
        </Button>
      </div>

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
      {selectedDetail && (
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
            <Button
              type="primary"
              onClick={() => setSelectedDetail(null)}
              style={{
                marginTop: 16,
                width: '100%',
              }}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}

      {/* ModalForm cho thêm/sửa */}
      <ModalForm
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        title={editMode ? 'Sửa biến thể sản phẩm' : 'Thêm biến thể sản phẩm'}
        initialValues={currentRecord}
        loading={loading}
        fields={productDetailFields}
        isEdit={editMode}
      />
    </div>
  );
};

export default AdminProductDetail;
