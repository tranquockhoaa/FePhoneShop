import "./search.css";
import React, { useState, useEffect, useRef } from "react";

const SearchBranch = ({ searchTerm, onClose }) => {
  const [filteredData, setFilteredData] = useState([]);
  const searchRef = useRef(null);

  const data = [
    { brand: "Xiaomi", name: "Xiaomi Redmi 13C", price: "2.490.000đ" },
    { brand: "Samsung", name: "Samsung Galaxy S23", price: "21.990.000đ" },
    { brand: "Apple", name: "iPhone 15 Pro Max", price: "34.990.000đ" },
    { brand: "Oppo", name: "Oppo Reno 10", price: "9.990.000đ" },
    { brand: "Realme", name: "Realme C55", price: "4.490.000đ" },
    { brand: "Xiaomi", name: "Xiaomi 13T", price: "12.990.000đ" },
    { brand: "Samsung", name: "Samsung Galaxy Z Flip5", price: "25.990.000đ" },
    { brand: "Apple", name: "iPhone 14", price: "19.990.000đ" },
    { brand: "Oppo", name: "Oppo Find N2 Flip", price: "18.990.000đ" },
    { brand: "Realme", name: "Realme 11 Pro", price: "8.490.000đ" },
  ];

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="search-branch" ref={searchRef}>
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <div key={index} className="search-item">
            <p className="item-brand">{item.brand}</p>
            <div>
              <a href="/" className="item-details">
                <img
                  src="https://dienthoaihay.vn/images/products/2025/08/16/resized/redmi-13c-den_1755308054.jpg"
                  alt=""
                  className="item-image"
                />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">{item.price}</p>
                </div>
              </a>
            </div>
          </div>
        ))
      ) : (
        <div className="search-item">
          <p className="item-name" style={{ padding: "10px" }}>
            Không tìm thấy sản phẩm phù hợp
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBranch;
