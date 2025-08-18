import React, { useEffect, useState } from "react";
import adminAxios from "./adminAxios";
import "./AdminProductDetail.css";
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getColorListApiRq } from "../../store/color-list/color-list.action";

const AdminProductDetail = () => {
  const [details, setDetails] = useState([]);
  const [allDetails, setAllDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newDetail, setNewDetail] = useState({
    productId: "",
    colorName: "",
    ramSize: "",
    storageSize: "",
    price: "",
    quantity: "",
  });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getColorListApiRq());
  }, [dispatch]);

  const listColors = useSelector((state) => state.listColors.listColor);
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = () => {
    adminAxios.get("/product-details").then((res) => {
      setDetails(res.data.productDetails || []);
      setAllDetails(res.data.productDetails || []);
    });
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setDetails(allDetails);
      return;
    }
    setDetails(
      allDetails.filter(
        (item) =>
          item.product_detail_id?.toString().includes(search) ||
          item.product?.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const sortByQuantityAsc = () => {
    const sorted = [...details].sort((a, b) => a.quantity - b.quantity);
    setDetails(sorted);
  };

  const sortByQuantityDesc = () => {
    const sorted = [...details].sort((a, b) => b.quantity - a.quantity);
    setDetails(sorted);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminAxios.post("/api/v1/productDetails", {
      ...newDetail,
      price: Number(newDetail.price),
      quantity: Number(newDetail.quantity),
      productId: newDetail.productId,
    });
    setShowCreate(false);
    setNewDetail({
      productId: "",
      colorName: "",
      ramSize: "",
      storageSize: "",
      price: "",
      quantity: "",
    });
    fetchDetails();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này?")) {
      await adminAxios.delete(`product-details/${id}`);
      fetchDetails();
      alert("Xóa thành công!");
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
    fetchDetails();
  };

  const handleEditClick = (item) => {
    setEditDetail({
      ...item,
      colorName: item.color?.name || "",
      ramSize: item.memory?.ram_size || "",
      storageSize: item.memory?.storage_size || "",
      price: item.price,
      quantity: item.quantity,
    });
  };

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
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
      </div>
      {showCreate && (
        <div className="admin-product-create-modal">
          <form className="admin-product-create-form" onSubmit={handleCreate}>
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
                ID sản phẩm
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
                Màu
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                RAM
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Bộ nhớ
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Giá bán
              </th>
              <th
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 2,
                }}
              >
                Tồn kho
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
            {details.map((item, idx) => (
              <tr
                key={item.product_detail_id}
                onClick={() => setSelectedDetail(item)}
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td>
                <td>{item.product_detail_id}</td>
                <td>{item.product?.name || ""}</td>
                <td>{item.color?.name || ""}</td>
                <td>{item.memory?.ram_size || ""}</td>
                <td>{item.memory?.storage_size || ""}</td>
                <td>{item.price?.toLocaleString()} đ</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    className="admin-btn"
                    title="Sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(item);
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
                      handleDelete(item.product_detail_id);
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
      {/* Modal xem chi tiết */}
      {selectedDetail && !editDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDetail(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Thông tin chi tiết sản phẩm</h3>
            <p>
              <b>Mã sản phẩm (sku):</b> {selectedDetail.sku || "Trống"}
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
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* Modal sửa */}
      {editDetail && (
        <div className="modal-overlay" onClick={() => setEditDetail(null)}>
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
              <button type="submit" className="admin-btn add-btn">
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
