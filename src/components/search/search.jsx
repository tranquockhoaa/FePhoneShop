import "./search.css";
import React from "react";

const SearchBranch = () => {
  const data = [
    { brand: "Xiaomi", name: "Xiaomi Redmi 13C" },
    { brand: "Samsung", name: "Xiaomi Redmi 13C" },
    { brand: "Apple", name: "Xiaomi Redmi 13C" },
    { brand: "Oppo", name: "Xiaomi Redmi 13C" },
    { brand: "Realme", name: "Xiaomi Redmi 13C" },
    { brand: "Xiaomi", name: "Xiaomi Redmi 13C" },
    { brand: "Samsung", name: "Xiaomi Redmi 13C" },
    { brand: "Apple", name: "Xiaomi Redmi 13C" },
    { brand: "Oppo", name: "Xiaomi Redmi 13C" },
    { brand: "Realme", name: "Xiaomi Redmi 13C" },
  ];
  return (
    <div className="search-branch">
      {data.map((item, index) => {
        return (
          <div key={index} className="search-item">
            <p className="item-brand">{item.brand}</p>
            <div className="item-details">
              <img
                src="https://dienthoaihay.vn/images/products/2025/08/16/resized/redmi-13c-den_1755308054.jpg"
                alt=""
                className="item-image"
              />
              <p className="item-name">{item.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchBranch;
