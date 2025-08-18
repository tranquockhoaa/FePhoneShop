import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getAllAdminBrandApiRq } from "../../../../store/admin-list-brand/admin-list-brand.action";
import adminAxios from "../../adminAxios";
import "./index.css";

const AdminManageBrand = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    infomation: "",
    icon: "",
  });
  const [editBrand, setEditBrand] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
  }, [dispatch]);
  const listBrands = useSelector((state) => state.listBrands.listBrand);

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return;
    return listBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword) ||
        b.brand_id.toString().includes(keyword)
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAxios.post("brand", newBrand);
      setShowCreate(false);
      setNewBrand({ name: "", infomation: "", icon: "" });

      dispatch(getAllAdminBrandApiRq());
    } catch (error) {
      console.error("Lỗi tạo brand:", error);
      alert("Tạo brand thất bại!");
    }
  };

  const handleEdit = (brand) => setEditBrand({ ...brand });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAxios.put(`brands/${editBrand.brand_id}`, editBrand);
      setEditBrand(null);
      dispatch(getAllAdminBrandApiRq());
    } catch (error) {
      console.error("Lỗi cập nhật brand:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (brandId) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      try {
        await adminAxios.delete(`brands/${brandId}`);
        dispatch(getAllAdminBrandApiRq());
      } catch (error) {
        console.error("Lỗi xóa brand:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredBrands = search ? handleSearch() : listBrands;

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <h2>Quản lý thương hiệu</h2>

      <div className="admin-order-toolbar">
        <input
          className="admin-product-search"
          placeholder="Tìm kiếm theo mã hoặc tên thương hiệu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-btn search-btn" onClick={handleSearch}>
          <FaSearch />
        </button>
        <button
          className="admin-btn add-btn"
          onClick={() => setShowCreate(true)}
          style={{ marginLeft: 8 }}
        >
          <FaPlus /> Thêm brand mới
        </button>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Thêm thương hiệu mới</h3>
            <form
              onSubmit={handleCreate}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                required
                placeholder="Tên thương hiệu"
                value={newBrand.name}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, name: e.target.value })
                }
              />
              <input
                placeholder="Thông tin"
                value={newBrand.infomation}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, infomation: e.target.value })
                }
              />
              <input
                placeholder="Icon URL"
                value={newBrand.icon}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, icon: e.target.value })
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
        </div>
      )}

      {editBrand && (
        <div className="modal-overlay" onClick={() => setEditBrand(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Sửa thương hiệu</h3>
            <form
              onSubmit={handleUpdate}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <label>
                Tên thương hiệu:
                <input
                  required
                  placeholder="Tên thương hiệu"
                  value={editBrand.name}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, name: e.target.value })
                  }
                />
              </label>

              <label>
                Thông tin:
                <input
                  placeholder="Thông tin"
                  value={editBrand.infomation}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, infomation: e.target.value })
                  }
                />
              </label>

              <label>
                Icon URL:
                <input
                  placeholder="Icon URL"
                  value={editBrand.icon}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, icon: e.target.value })
                  }
                />
              </label>

              <label>
                Trạng thái:
                <select
                  value={editBrand.status || "ACTIVE"}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Đang bán</option>
                  <option value="INACTIVE">Ngừng bán</option>
                </select>
              </label>

              <div style={{ marginTop: 8 }}>
                <button type="submit" className="admin-btn add-btn">
                  Lưu
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => setEditBrand(null)}
                  style={{ marginLeft: 8 }}
                >
                  d sadasHủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBrand && (
        <div className="modal-overlay" onClick={() => setSelectedBrand(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: 400 }}
          >
            <h3>Chi tiết thương hiệu</h3>
            <p>
              <b>Mã thương hiệu:</b> {selectedBrand.brand_id}
            </p>
            <p>
              <b>Tên thương hiệu:</b> {selectedBrand.name}
            </p>
            <p>
              <b>Thông tin:</b>{" "}
              {selectedBrand.infomation || "Không có thông tin"}
            </p>
            <p>
              <b>Icon:</b>{" "}
              {selectedBrand.icon ? (
                <img
                  src={selectedBrand.icon}
                  alt="icon"
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                "Không có icon"
              )}
            </p>
            <p>
              <b>Trạng thái:</b>{" "}
              {selectedBrand.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
            </p>
            {selectedBrand.createdAt && (
              <p>
                <b>Ngày tạo:</b>{" "}
                {new Date(selectedBrand.createdAt).toLocaleDateString("vi-VN")}
              </p>
            )}
            {selectedBrand.updatedAt && (
              <p>
                <b>Ngày cập nhật:</b>{" "}
                {new Date(selectedBrand.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
            <button
              className="admin-btn"
              onClick={() => setSelectedBrand(null)}
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

      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã thương hiệu</th>
              <th>Tên</th>
              <th>Thông tin</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands?.map((brand, idx) => (
              <tr
                key={brand.brand_id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedBrand(brand)}
              >
                <td>{idx + 1}</td>
                <td>{brand.brand_id}</td>
                <td>{brand.name}</td>
                <td>{brand.infomation || ""}</td>
                <td>{brand.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}</td>
                <td>
                  <button
                    className="admin-btn edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(brand);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(brand.brand_id);
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
    </div>
  );
};

export default AdminManageBrand;
