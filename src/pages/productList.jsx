import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./productList.css";

const PAGE_SIZE = 20;

const ProductList = ({ brandName }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4); // mặc định 4 trang
  const [sortOrder, setSortOrder] = useState(""); // mặc định không sort  const navigate = useNavigate();
  const navigate = useNavigate();
  useEffect(() => {
    if (!brandName) return;
    setIsLoading(true);
    axios;
    axios
      .get(
        `http://localhost:3000/api/v1/products/search?brandName=${brandName}&_page=${page}&_limit=${PAGE_SIZE}${
          sortOrder ? `&sortPrice=${sortOrder}` : ""
        }`
      )
      .then((res) => {
        console.log("API response:", res.data);
        // Lấy đúng key mới từ backend: res.data.products và res.data.total
        const arr = Array.isArray(res?.data?.products) ? res.data.products : [];
        console.log("FE products:", arr, Array.isArray(arr), arr.length);
        setProducts(arr);
        if (res?.data?.total) {
          setTotalPages(Math.ceil(Number(res.data.total) / PAGE_SIZE));
        } else {
          setTotalPages(1);
        }
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => setIsLoading(false));
  }, [brandName, page, sortOrder]);

  if (isLoading) return <div>Loading...</div>;
  if (!products.length) return <div>No products found.</div>;

  return (
    <div className="product-list-page">
      <div className="product-list-container">
        <div className="product-list-title">
          {brandName} - Danh sách sản phẩm
        </div>
        <div
          style={{
            margin: "0 32px 16px 32px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className={
              sortOrder === "" ? "pagination-btn active" : "pagination-btn"
            }
            onClick={() => setSortOrder("")}
          >
            Mặc định
          </button>
          <button
            className={
              sortOrder === "desc" ? "pagination-btn active" : "pagination-btn"
            }
            onClick={() => setSortOrder("desc")}
          >
            Giá cao đến thấp
          </button>

          <button
            className={
              sortOrder === "asc" ? "pagination-btn active" : "pagination-btn"
            }
            onClick={() => setSortOrder("asc")}
          >
            Giá thấp đến cao
          </button>
        </div>
        <div className="product-list-grid-homepage">
          {products.map((product) => (
            <div
              className="item"
              key={product.product_id}
              onClick={() => navigate(`/product-detail/${product.code}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="frame_inner">
                <img
                  src={encodeURI(
                    `/data/${product.brand_name}/${product.code}/image/${product.color_name}.jpg`
                  )}
                  alt={product.name}
                  className="img-product"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div className="name">{product.name}</div>
                <div style={{ fontSize: 13, color: "#333" }}>
                  RAM: {product.ram_size} | Storage: {product.storage_size}
                </div>
                <div style={{ fontSize: 13, color: "#333" }}>
                  Color: {product.color_name}
                </div>
                <p className="price">{product.price?.toLocaleString()} VND</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
