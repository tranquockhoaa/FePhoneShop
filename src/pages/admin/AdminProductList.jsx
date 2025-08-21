import React, { useState, useEffect, useCallback, useMemo } from "react";
import adminAxios from "./adminAxios";
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { Table, Button, Space, Tag, notification } from "antd";
import ProductForm from "./ProductForm";

import "./AdminProduct.css";
import "./AdminProductList.css";
import AdminPageHeader from "../../components/admin/PageHeader";
import { useSelector, useDispatch } from "react-redux";
import { getAllAdminBrandApiRq } from "../../store/brands/brands.action";
import { getColorListApiRq } from "../../store/color-list/color-list.action";
import { searchProductByApi } from "../../api/productlist";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    initialValues: null,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    loading: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
    dispatch(getColorListApiRq());
  }, []);

  const listBrands = useSelector((state) => state.listBrands.listBrand);
  const { listColor } = useSelector((state) => state.listColors);

  const optionColors = useMemo(
    () =>
      listColor?.map((item) => ({
        value: item.color_id.toString(),
        label: item.name,
      })) || [],
    [listColor]
  );

  const fetchProducts = useCallback(
    (
      page = 1,
      pageSize = 20,
      sortBy = "createdAt",
      sortOrder = "ASC",
      search = ""
    ) => {
      setPagination((prev) => ({ ...prev, loading: true }));

      adminAxios
        .get("http://localhost:3000/api/v1/admin/products", {
          params: {
            page,
            size: pageSize,
            sortBy,
            sortOrder,
            search,
          },
        })
        .then((res) => {
          const { data, totalItems, currentPage } = res.data;
          setProducts(data || []);
          setPagination((prev) => ({
            ...prev,
            current: currentPage || page,
            total: totalItems || 0,
            loading: false,
          }));
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setPagination((prev) => ({ ...prev, loading: false }));
        });
    },
    []
  );

  useEffect(() => {
    fetchProducts(1, pagination.pageSize, "createdAt", "ASC");
  }, [pagination.pageSize]);

  const handleSearch = async () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      // Reset to first page when clearing search
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProducts(1, pagination.pageSize, "createdAt", "ASC");
      return;
    }

    // Reset to page 1 when searching
    setPagination((prev) => ({ ...prev, loading: true }));
    try {
      const params = {
        search: keyword,
        page: 1,
        size: pagination.pageSize,
      };
      const response = await searchProductByApi(params);
      setProducts(response.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        total: Number(response.headers["x-total-count"]) || 0,
        loading: false,
      }));
    } catch (error) {
      console.error("Error searching products:", error);
      setPagination((prev) => ({ ...prev, loading: false }));
    }
  };

  const refreshAfterMutation = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, "createdAt", "ASC");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await adminAxios.delete(`products/${id}`);
      // Reset to page 1 when deleting product and sort by creation date
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProducts(1, pagination.pageSize, "createdAt", "ASC");
      api.success({
        message: "Thành công",
        description: "Xóa sản phẩm thành công!",
      });
    }
  };

  // Sửa chỉ cho phép sửa tên sản phẩm
  const handleEdit = (product) => {
    setFormState({
      open: true,
      mode: "edit",
      initialValues: {
        product_id: product.product_id,
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        brand_id: product.brand?.brand_id || "",
        status: product.status || "ACTIVE",
        color: product.color,
      },
    });
  };

  const closeFormAndRefresh = () => {
    setFormState((prev) => ({ ...prev, open: false }));
    refreshAfterMutation();
  };

  // Sắp xếp tồn kho tăng dần
  const sortByQuantityAsc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, "totalQuantity", "ASC", search);
  };

  // Sắp xếp tồn kho giảm dần
  const sortByQuantityDesc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, "totalQuantity", "DESC", search);
  };

  // Sắp xếp ngày nhập tăng dần
  const sortByDateAsc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, "createdAt", "ASC", search);
  };

  // Sắp xếp ngày nhập giảm dần
  const sortByDateDesc = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(1, pagination.pageSize, "createdAt", "DESC", search);
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
    fetchProducts(newCurrent, newPageSize, "createdAt", "ASC");
  };

  // Định nghĩa cột cho Ant Design Table
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "ID Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      width: 100,
    },
    {
      title: "Mã sản phẩm (SKU)",
      dataIndex: "sku",
      key: "sku",
      width: 150,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "name"],
      key: "brand",
      width: 150,
      render: (brandName) => brandName || "",
    },
    {
      title: "Tổng tồn kho",
      dataIndex: "total_quantity",
      key: "total_quantity",
      width: 120,
    },
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
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
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {contextHolder}
      <AdminPageHeader
        title="Danh sách sản phẩm"
        rightContent={
          <button
            className="admin-btn add-btn"
            onClick={() =>
              setFormState({ open: true, mode: "create", initialValues: null })
            }
          >
            <FaPlus /> Thêm sản phẩm
          </button>
        }
      />
      <div className="admin-product-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo mã sp (sku), tên sản phẩm hoặc thương hiệu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-btn search-btn" onClick={handleSearch}>
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
      <ProductForm
        open={formState.open}
        mode={formState.mode}
        brands={listBrands || []}
        optionColors={optionColors}
        initialValues={formState.initialValues || {}}
        onCancel={() => setFormState((prev) => ({ ...prev, open: false }))}
        onSuccess={closeFormAndRefresh}
      />

      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
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
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          sticky={{ offsetHeader: 0 }}
        />
      </div>
    </div>
  );
};

export default AdminProductList;
