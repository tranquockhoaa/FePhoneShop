import React, { useState, useEffect } from 'react';
import adminAxios from './adminAxios';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { Table, Button, Space, Tag } from 'antd';
import './AdminProduct.css';
import './AdminProductList.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAdminBrandApiRq } from '../../store/admin-list-brand/admin-list-brand.action';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: 'code',
    description: '',
    brand_id: '',
    sku: '',
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    loading: false,
  });

  console.log(allProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
  }, [dispatch]);

  const listBrands = useSelector((state) => state.listBrands.listBrand);
  console.log('listBrands', listBrands);
  useEffect(() => {
    fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
  }, []);

  const fetchProducts = (
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'ASC'
  ) => {
    setPagination((prev) => ({ ...prev, loading: true }));

    adminAxios
      .get('http://localhost:3000/api/v1/admin/products-with-total-quantity', {
        params: {
          page,
          size: pageSize,
          sortBy,
          sortOrder,
        },
      })
      .then((res) => {
        const { products: productList, total, currentPage } = res.data;
        setProducts(productList || []);
        setAllProducts(productList || []);
        setPagination((prev) => ({
          ...prev,
          current: currentPage || page,
          total: total || 0,
          loading: false,
        }));
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setPagination((prev) => ({ ...prev, loading: false }));
      });
  };

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      // Reset to first page when clearing search
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
      return;
    }

    // For now, we'll do client-side search on the current page
    // In a real implementation, you might want to send the search term to the API
    setProducts(
      allProducts.filter((sp) => {
        const productId = sp.product_id?.toString() ?? '';
        const name = sp.name ?? '';
        const sku = sp.sku ?? '';
        const brandName = sp.brand?.name ?? sp.brandName ?? '';

        return (
          productId.includes(keyword) ||
          name.toLowerCase().includes(keyword) ||
          sku.toLowerCase().includes(keyword) ||
          brandName.toLowerCase().includes(keyword)
        );
      })
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminAxios.post('products/create', {
      sku: newProduct.sku,
      name: newProduct.name,
      brand_id: newProduct.brand_id,
      description: newProduct.description,
      code: newProduct.code,
    });
    setShowCreate(false);
    setNewProduct({ sku: '', name: '', brandName: '', description: '' });
    // Reset to page 1 when creating new product and sort by creation date
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await adminAxios.delete(`products/${id}`);
      // Reset to page 1 when deleting product and sort by creation date
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
      alert('Xóa sản phẩm thành công!');
    }
  };

  // Sửa chỉ cho phép sửa tên sản phẩm
  const handleEdit = (product) => {
    setEditProduct({
      product_id: product.product_id,
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      brand_id: product.brand.brand_id || '',
      status: product.status || 'ACTIVE',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await adminAxios.put(`/products/${editProduct.product_id}`, {
      name: editProduct.name,
      sku: editProduct.sku,
      brand_id: editProduct.brand_id,
      description: editProduct.description,
      status: editProduct.status,
    });
    setEditProduct(null);
    // Reset to page 1 when updating product and sort by creation date
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
  };

  // Sắp xếp tồn kho tăng dần
  const sortByQuantityAsc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'totalQuantity', 'ASC');
  };

  // Sắp xếp tồn kho giảm dần
  const sortByQuantityDesc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'totalQuantity', 'DESC');
  };

  // Sắp xếp ngày nhập tăng dần
  const sortByDateAsc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'createdAt', 'ASC');
  };

  // Sắp xếp ngày nhập giảm dần
  const sortByDateDesc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, 'createdAt', 'DESC');
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const newPageSize = pageSize;
    const newCurrent = pagination.pageSize !== newPageSize ? 1 : current; // Reset to page 1 if page size changes

    setPagination((prev) => ({
      ...prev,
      current: newCurrent,
      pageSize: newPageSize,
    }));
    fetchProducts(newCurrent, newPageSize, 'createdAt', 'ASC');
  };

  // Định nghĩa cột cho Ant Design Table
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 80,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'ID Sản phẩm',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 100,
    },
    {
      title: 'Mã sản phẩm (SKU)',
      dataIndex: 'sku',
      key: 'sku',
      width: 150,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      key: 'brand',
      width: 150,
      render: (brandName) => brandName || '',
    },
    {
      title: 'Tổng tồn kho',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 120,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
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
              handleDelete(record.product_id);
            }}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      className="admin-product-page"
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <div className="admin-product-header">
        <h2>Danh sách sản phẩm</h2>
        <button
          className="admin-btn add-btn"
          onClick={() => setShowCreate(true)}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>
      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo mã sp (sku), tên sản phẩm hoặc thương hiệu"
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
        <button
          className="admin-btn"
          style={{ marginLeft: 8 }}
          onClick={sortByDateAsc}
          title="Ngày nhập cũ đến mới"
        >
          Ngày nhập ↑
        </button>
        <button
          className="admin-btn"
          style={{ marginLeft: 4 }}
          onClick={sortByDateDesc}
          title="Ngày nhập mới đến cũ"
        >
          Ngày nhập ↓
        </button>
      </div>
      {showCreate && (
        <div className="admin-product-create-modal">
          <form
            className="admin-product-create-form"
            onSubmit={handleCreate}
          >
            <h3>Thêm sản phẩm mới</h3>
            <input
              required
              placeholder="Mã sản phẩm"
              value={newProduct.sku}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sku: e.target.value })
              }
            />
            <input
              required
              placeholder="Tên sản phẩm"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <select
              style={{ width: '100%', height: 35, marginBottom: 14 }}
              required
              value={newProduct.brand_id}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand_id: e.target.value })
              }
            >
              <option value="">Chọn thương hiệu</option>
              {listBrands &&
                listBrands.map((brand) => (
                  <option
                    key={brand.brand_id}
                    value={brand.brand_id}
                  >
                    {brand.name}
                  </option>
                ))}
            </select>

            <input
              required
              placeholder="Mô tả"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
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
      {editProduct && (
        <div
          className="modal-overlay"
          onClick={() => setEditProduct(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Cập nhật sản phẩm</h3>
            <form
              onSubmit={handleUpdate}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div>
                <label>
                  <b>Tên sản phẩm</b>
                </label>
                <input
                  required
                  placeholder="Tên sản phẩm"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>
                  <b>Mã sản phẩm (SKU)</b>
                </label>
                <input
                  required
                  placeholder="Mã sản phẩm"
                  value={editProduct.sku}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sku: e.target.value })
                  }
                />
              </div>

              <div>
                <label>
                  <b>Thương hiệu</b>
                </label>
                <select
                  style={{ width: '100%', height: 35, marginBottom: 14 }}
                  required
                  value={editProduct.brand_id}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand_id: e.target.value })
                  }
                >
                  <option value="">{editProduct.brand_id}</option>
                  {listBrands &&
                    listBrands.map((brand) => (
                      <option
                        key={brand.brand_id}
                        value={brand.brand_id}
                      >
                        {brand.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label>
                  <b>Mô tả</b>
                </label>
                <input
                  placeholder="Mô tả"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>
                  <b>Trạng thái</b>
                </label>
                <select
                  style={{ width: '100%', height: 35, marginBottom: 14 }}
                  required
                  value={editProduct.status}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Đang bán</option>
                  <option value="INACTIVE">Ngừng bán</option>
                </select>
              </div>

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
                  onClick={() => setEditProduct(null)}
                  style={{ marginLeft: 8 }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', width: '100%' }}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="product_id"
          loading={pagination.loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          sticky={{ offsetHeader: 0 }}
          onRow={(record) => ({
            onClick: () => setSelectedProduct(record),
            style: { cursor: 'pointer' },
          })}
          // size="middle"
        />
      </div>
      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Thông tin sản phẩm</h3>
            <p>
              <b>ID phẩm:</b> {selectedProduct.product_id}
            </p>
            <p>
              <b>Mã sản phẩm:</b> {selectedProduct.sku}
            </p>
            <p>
              <b>Tên sản phẩm:</b> {selectedProduct.name}
            </p>
            <p>
              <b>Thương hiệu:</b> {selectedProduct.brand?.name || ''}
            </p>
            <p>
              <b>Mô tả:</b> {selectedProduct.description || 'Không có mô tả'}
            </p>
            <p>
              <b>Tổng tồn kho:</b> {selectedProduct.totalQuantity}
            </p>
            <p>
              <b>Ngày nhập:</b>{' '}
              {selectedProduct.createdAt
                ? new Date(selectedProduct.createdAt).toLocaleDateString(
                    'vi-VN'
                  )
                : ''}
            </p>
            <p>
              <b>Trang thái:</b>{' '}
              {selectedProduct.status === 'INACTIVE' ? 'Ngừng bán' : 'Đang bán'}
            </p>{' '}
            <button
              className="admin-btn"
              onClick={() => setSelectedProduct(null)}
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
    </div>
  );
};

export default AdminProductList;
