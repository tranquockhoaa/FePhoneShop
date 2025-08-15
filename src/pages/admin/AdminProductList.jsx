import React, { useState, useEffect } from "react";
import adminAxios from "./adminAxios";
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import "./AdminProduct.css";
import "./AdminProductList.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState("");

  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    brandName: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

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
    setProducts(
      allProducts.filter(
        (sp) =>
          sp.product_id.toString().includes(keyword) ||
          sp.code.toLowerCase().includes(keyword) ||
          sp.name.toLowerCase().includes(keyword) ||
          (sp.brand &&
            sp.brand.name &&
            sp.brand.name.toLowerCase().includes(keyword)) ||
          (sp.brandName && sp.brandName.toLowerCase().includes(keyword))
      )
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminAxios.post("/products", {
      code: newProduct.code,
      name: newProduct.name,
      brandName: newProduct.brandName,
    });
    setShowCreate(false);
    setNewProduct({ code: "", name: "", brandName: "" });
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
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await adminAxios.put(`/products/${editProduct.product_id}/name`, {
      name: editProduct.name,
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

  const handleChangeBrandName = (event) => {
    setBrandName(event.target.value);
  };

  const brands = [
    {
      name: "Realme",
    },
    {
      name: "Xiaomi",
    },
    {
      name: "Samsung",
    },
    {
      name: "iQoo",
    },
    {
      name: "iPhone",
    },
  ];

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
          placeholder="Tìm kiếm theo ID, mã, tên hoặc thương hiệu..."
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
              value={newProduct.code}
              onChange={(e) =>
                setNewProduct({ ...newProduct, code: e.target.value })
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
            <FormControl fullWidth style={{ marginTop: 8, height: 45 }}>
              <InputLabel sx={{ height: 40, lineHeight: "35px" }}>
                {brandName}
              </InputLabel>
              <Select
                value={brandName}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, brandName: e.target.value });
                  handleChangeBrandName(e);
                }}
                required
              >
                {brands?.map((brand, id) => (
                  <MenuItem key={id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
            <h3>Sửa tên sản phẩm</h3>
            <form onSubmit={handleUpdate}>
              <input
                required
                placeholder="Tên sản phẩm"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
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
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                STT
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Mã sản phẩm
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Tên sản phẩm
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Thương hiệu
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Tổng tồn kho
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Ngày nhập
              </th>
              <th style={{ position: "sticky", top: 0, background: "#fff" }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((sp, idx) => (
              <tr
                key={sp.product_id}
                onClick={() => setSelectedProduct(sp)}
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td>
                <td>{sp.product_id}</td>
                <td>{sp.name}</td>
                <td>{sp.brand?.name || ""}</td>
                <td>{sp.totalQuantity}</td>
                <td>
                  {sp.createdAt
                    ? new Date(sp.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                </td>
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
              <b>Mã sản phẩm:</b> {selectedProduct.product_id}
            </p>
            <p>
              <b>Tên sản phẩm:</b> {selectedProduct.name}
            </p>
            <p>
              <b>Thương hiệu:</b> {selectedProduct.brand?.name || ""}
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
