import React, { useState, useEffect } from "react";
import adminAxios from "./adminAxios";
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import "./AdminProduct.css";
import "./AdminProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllAdminBrandApiRq } from "../../store/admin-list-brand/admin-list-brand.action";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "code",
    description: "",
    brand_id: "",
    sku: "",
  });

  console.log(allProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
  }, [dispatch]);

  const listBrands = useSelector((state) => state.listBrands.listBrand?.data);
  console.log("listBrands", listBrands);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    adminAxios
      .get("http://localhost:3000/api/v1/admin/products-with-total-quantity")
      .then((res) => {
        setProducts(res.data.products || []);
        setAllProducts(res.data.products || []);
      });
  };

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      setProducts(allProducts);
      return;
    }
    console.log("allProducts", keyword);
    setProducts(
      allProducts.filter(
        (sp) =>
          sp.product_id.toString().includes(keyword) ||
          sp.name?.toLowerCase().includes(keyword) ||
          sp.sku?.toLowerCase().includes(keyword) ||
          (sp.brand &&
            sp.brand.name &&
            sp.brand.name.toLowerCase().includes(keyword)) ||
          (sp.brandName && sp.brandName.toLowerCase().includes(keyword))
      )
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminAxios.post("products/create", {
      sku: newProduct.sku,
      name: newProduct.name,
      brand_id: newProduct.brand_id,
      description: newProduct.description,
      code: newProduct.code,
    });
    setShowCreate(false);
    setNewProduct({ sku: "", name: "", brandName: "", description: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await adminAxios.delete(`products/${id}`);
      fetchProducts();
      alert("Xóa sản phẩm thành công!");
    }
  };

  // Sửa chỉ cho phép sửa tên sản phẩm
  const handleEdit = (product) => {
    setEditProduct({
      product_id: product.product_id,
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      brand_id: product.brand.brand_id || "",
      status: product.status || "ACTIVE",
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
    fetchProducts();
  };

  // Sắp xếp tồn kho tăng dần
  const sortByQuantityAsc = () => {
    const sorted = [...products].sort(
      (a, b) => a.totalQuantity - b.totalQuantity
    );
    setProducts(sorted);
  };

  // Sắp xếp tồn kho giảm dần
  const sortByQuantityDesc = () => {
    const sorted = [...products].sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );
    setProducts(sorted);
  };

  // Sắp xếp ngày nhập tăng dần
  const sortByDateAsc = () => {
    const sorted = [...products].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setProducts(sorted);
  };

  // Sắp xếp ngày nhập giảm dần
  const sortByDateDesc = () => {
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setProducts(sorted);
  };

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
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
      {showCreate && (
        <div className="admin-product-create-modal">
          <form className="admin-product-create-form" onSubmit={handleCreate}>
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
              style={{ width: "100%", height: 35, marginBottom: 14 }}
              required
              value={newProduct.brand_id}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand_id: e.target.value })
              }
            >
              <option value="">Chọn thương hiệu</option>
              {listBrands &&
                listBrands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
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
              <button type="submit" className="admin-btn add-btn">
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
        <div className="modal-overlay" onClick={() => setEditProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Cập nhật sản phẩm</h3>
            <form
              onSubmit={handleUpdate}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
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
                  style={{ width: "100%", height: 35, marginBottom: 14 }}
                  required
                  value={editProduct.brand_id}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand_id: e.target.value })
                  }
                >
                  <option value="">{editProduct.brand_id}</option>
                  {listBrands &&
                    listBrands.map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_id}>
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
                  style={{ width: "100%", height: 35, marginBottom: 14 }}
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
                <button type="submit" className="admin-btn add-btn">
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

      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                STT
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Mã sản phẩm (SKU)
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Tên sản phẩm
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Thương hiệu
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Tổng tồn kho
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Ngày nhập
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((sp, idx) => (
              <tr
                key={sp.product_id}
                onClick={() => setSelectedProduct(sp)}
                style={{ cursor: "pointer", width: 35 }}
              >
                <td>{idx + 1}</td>
                <td>{sp.sku}</td>
                <td>{sp.name}</td>
                <td>{sp.brand?.name || ""}</td>
                <td>{sp.totalQuantity}</td>
                <td>
                  {sp.createdAt
                    ? new Date(sp.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                </td>
                <td>{sp.status === "INACTIVE" ? "Ngừng bán" : "Đang bán"}</td>
                <td>
                  <button
                    className="admin-btn edit-btn"
                    title="Sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(sp);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    title="Xóa"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sp.product_id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Thông tin sản phẩm</h3>
            <p>
              <b>Mã sản phẩm:</b> {selectedProduct.sku}
            </p>
            <p>
              <b>Tên sản phẩm:</b> {selectedProduct.name}
            </p>
            <p>
              <b>Thương hiệu:</b> {selectedProduct.brand?.name || ""}
            </p>
            <p>
              <b>Mô tả:</b> {selectedProduct.description || "Không có mô tả"}
            </p>
            <p>
              <b>Tổng tồn kho:</b> {selectedProduct.totalQuantity}
            </p>
            <p>
              <b>Ngày nhập:</b>{" "}
              {selectedProduct.createdAt
                ? new Date(selectedProduct.createdAt).toLocaleDateString(
                    "vi-VN"
                  )
                : ""}
            </p>
            <p>
              <b>Trang thái:</b>{" "}
              {selectedProduct.status === "INACTIVE" ? "Ngừng bán" : "Đang bán"}
            </p>{" "}
            <button
              className="admin-btn"
              onClick={() => setSelectedProduct(null)}
              style={{ marginTop: 16 }}
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
