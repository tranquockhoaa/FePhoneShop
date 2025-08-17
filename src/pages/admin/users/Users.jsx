import React, { useState, useEffect } from "react";
import adminAxios from "../adminAxios";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { ImOpt } from "react-icons/im";
import "./AdminUsers.css";
import { useSelector, useDispatch } from "react-redux";
import { getListUserApiRequest } from "../../../store/admin-list-user/admin-list-user.action";

const AdminUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListUserApiRequest());
  }, [dispatch]);
  const listUsers = useSelector((state) => state.listUser);

  const [selectedUser, setselectedUser] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandTab, setBrandTab] = useState("info");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    price: "",
    stock: "",
    brand: "",
    status: "Đang bán",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Lấy 2 số cuối
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    adminAxios
      .get("http://localhost:3000/api/v1/admin/product-details")
      .then((res) => {
        setAllProducts(res.data.productDetails || []);
        setProducts(res.data.productDetails || []);
      })
      .catch(() => {
        setAllProducts([]);
        setProducts([]);
      });
  }, []);

  const handleSearch = () => {
    const keyword = search.trim();
    setProducts(
      allProducts.filter((sp) => String(sp.product_detail_id).includes(keyword))
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newItem = {
      product_detail_id: Date.now(),
      price: Number(newProduct.price),
      quantity: Number(newProduct.stock),
      createdAt: new Date().toISOString(),
      product: {
        code: newProduct.code,
        name: newProduct.name,
        brand: { name: newProduct.brand },
      },
      color: { name: "" },
      memory: { ram_size: "", storage_size: "" },
      status: newProduct.status,
    };
    setAllProducts([...allProducts, newItem]);
    setProducts([...products, newItem]);
    setShowCreate(false);
    setNewProduct({
      code: "",
      name: "",
      price: "",
      stock: "",
      brand: "",
      status: "Đang bán",
      createdAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="admin-product-page">
      <div className="admin-product-header">
        <h2>Quản lý sản phẩm</h2>
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
          placeholder="Tìm kiếm theo mã sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-btn search-btn" onClick={handleSearch}>
          <FaSearch />
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
            <input
              required
              type="number"
              placeholder="Giá bán"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Tồn kho"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <input
              required
              placeholder="Thương hiệu"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />
            <select
              value={newProduct.status}
              onChange={(e) =>
                setNewProduct({ ...newProduct, status: e.target.value })
              }
            >
              <option>Đang bán</option>
              <option>Ngừng bán</option>
            </select>
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
      <div className="admin-product-table-wrapper">
        <table className="admin-product-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>STT</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {listUsers.listUser?.map((listUser, idx) => (
              <tr
                key={idx}
                onClick={() => {
                  setselectedUser(listUser);
                  setBrandTab("info");
                  setShowBrandModal(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <td style={{ width: 50 }}>{idx + 1}</td>
                <td>{listUser.full_name}</td>
                <td>{listUser.email}</td>
                <td>{listUser.phone_number}</td>
                <td>{listUser?.gender || ""}</td>
                <td>{listUser.birth_date || "Chưa cập nhật"}</td>
                <td>{listUser.address || "Chưa cập nhật"}</td>
                <td>{listUser.role}</td>
                <td>{formatDate(listUser.createdAt)}</td>
                <td>{listUser.createdAt}</td>
                <td>
                  <button
                    className="admin-btn edit-btn"
                    title="Sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    title="Xóa"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 10 - products.length) }).map(
              (_, i) => (
                <tr key={`empty-${i}`}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <td key={j} style={{ height: 52, background: "#fff" }}></td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {showBrandModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowBrandModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", minWidth: 500 }}
          >
            <div className="brand-modal-sidebar">
              <div
                className={
                  brandTab === "info" ? "brand-tab active" : "brand-tab"
                }
                onClick={() => setBrandTab("info")}
              >
                Quản lý sản phẩm
              </div>
              <div
                className={
                  brandTab === "brand" ? "brand-tab active" : "brand-tab"
                }
                onClick={() => setBrandTab("brand")}
              >
                Quản lý thương hiệu
              </div>
            </div>
            <div className="brand-modal-content">
              {brandTab === "info" && (
                <>
                  <h3>Thông tin khách hàng</h3>
                  <p>
                    <b>Tên khách hàng:</b> {selectedUser.full_name}
                  </p>
                  <p>
                    <b>Email: </b> {selectedUser.email}
                  </p>
                  <p>
                    <b>Số điện thoại: </b>

                    {selectedUser.phone_number || "Chưa cập nhật"}
                  </p>
                  <p>
                    <b>Giới tính: </b> {selectedUser.gender || "Chưa cập nhật"}
                  </p>
                  <p>
                    <b>Ngày sinh:</b>{" "}
                    {selectedUser.birth_date || "Chưa cập nhật"}
                  </p>
                  <p>
                    <b>Địa chỉ: </b> {selectedUser.address || "Chưa cập nhật"}
                  </p>
                  <p>
                    <b>Role:</b> {selectedUser.role} đ
                  </p>
                  <p>
                    <b>Trạng thái:</b> {selectedUser.role || "Chưa cập nhật"}
                  </p>
                  <p>
                    <b>Ngày tạo</b> {formatDate(selectedUser.createdAt)}
                  </p>
                </>
              )}
              {brandTab === "brand" && (
                <>
                  <h3>Quản lý thương hiệu</h3>
                  <p>Chức năng quản lý thương hiệu...</p>
                </>
              )}
              <button
                className="admin-btn"
                onClick={() => setShowBrandModal(false)}
                style={{ marginTop: 16 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
