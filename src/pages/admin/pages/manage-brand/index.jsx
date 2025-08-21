import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import ModalForm from "../../../../components/ModalForm";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getAllAdminBrandApiRq } from "../../../../store/brands/brands.action";
import adminAxios from "../../adminAxios";
import "../../AdminProduct.css";
import "./index.css";
import AdminPageHeader from "../../../../components/admin/PageHeader";

const AdminManageBrand = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [api, contextHolder] = notification.useNotification();

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Mã thương hiệu",
      dataIndex: "brand_id",
      key: "brand_id",
      width: 140,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng sản phẩm ",
      dataIndex: "productCount",
      key: "quantity",
    },
    {
      title: "Thông tin",
      dataIndex: "infomation",
      key: "infomation",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => (value === "ACTIVE" ? "Đang bán" : "Ngừng bán"),
      width: 160,
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_text, record) => (
        <div>
          <button
            className="admin-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            style={{ marginRight: 8 }}
          >
            <FaEdit />
          </button>
          {/* <button
            className="admin-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.brand_id);
            }}
          >
            <FaTrash />
          </button> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
  }, []);
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

  const handleEdit = (brand) => {
    setEditMode(true);
    setCurrentRecord({
      brand_id: brand.brand_id,
      name: brand.name || "",
      infomation: brand.infomation || "",
      status: brand.status || "ACTIVE",
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editMode) {
        await adminAxios.put(`brand/${currentRecord.brand_id}`, {
          name: values.name,
          infomation: values.infomation,
          status: values.status,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật thương hiệu thành công!",
        });
      } else {
        await adminAxios.post("brand", {
          name: values.name,
          infomation: values.infomation,
        });

        api.success({
          message: "Thành công",
          description: "Thêm thương hiệu thành công!",
        });
      }

      setModalVisible(false);
      setCurrentRecord({});
      dispatch(getAllAdminBrandApiRq());
    } catch (error) {
      console.error("Lỗi xử lý brand:", error);
      api.error({
        message: "Thất bại",
        description: "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCurrentRecord({});
  };

  // const handleDelete = async (brandId) => {
  //   if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
  //     try {
  //       await adminAxios.delete(`brands/${brandId}`);
  //       dispatch(getAllAdminBrandApiRq());
  //     } catch (error) {
  //       console.error('Lỗi xóa brand:', error);
  //       alert('Xóa thất bại!');
  //     }
  //   }
  // };

  const filteredBrands = search ? handleSearch() : listBrands;

  return (
    <div
      className="admin-product-page"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {contextHolder}

      <AdminPageHeader
        title="Quản lý thương hiệu"
        rightContent={
          <button
            className="admin-btn add-btn"
            onClick={() => {
              setEditMode(false);
              setCurrentRecord({ name: "", infomation: "", status: "ACTIVE" });
              setModalVisible(true);
            }}
            style={{ marginLeft: 8 }}
          >
            <FaPlus /> Thêm brand mới
          </button>
        }
      />

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
      </div>

      {/* ModalForm dùng chung cho thêm/sửa thương hiệu */}
      <ModalForm
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        title={editMode ? "Sửa thương hiệu" : "Thêm thương hiệu"}
        initialValues={currentRecord}
        loading={loading}
        isEdit={editMode}
        fields={[
          {
            name: "name",
            label: "Tên thương hiệu",
            type: "input",
            required: true,
            span: 24,
          },
          {
            name: "infomation",
            label: "Thông tin",
            type: "textarea",
            required: false,
            span: 24,
          },
          {
            name: "status",
            label: "Trạng thái",
            type: "select",
            required: false,
            span: 12,
            options: [
              { value: "ACTIVE", label: "Đang bán" },
              { value: "INACTIVE", label: "Ngừng bán" },
            ],
          },
        ]}
      />

      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <Table
          dataSource={filteredBrands || []}
          columns={columns}
          rowKey="brand_id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default AdminManageBrand;
