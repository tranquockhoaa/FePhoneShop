import React from "react";
import { Link } from "react-router-dom";
import "./productItem.css";

export default function ProductItem({
  productCode,
  brandName,
  productColorName,
  productName,
  productRamSize,
  productStorageSize,
  productPrice,
}) {
  return (
    <div className="item">
      <div className="frame_inner">
        <div className="text_small">Mới nguyên SEAL</div>
        <div className="image-product">
          <Link to={`/product-detail/${productCode}`}>
            <img
              src={encodeURI(
                `data/${brandName}/${productCode}/image/${productColorName}.jpg`
              )}
              alt="image-review"
              className="img-product"
            />
            <div className="name">{productName}</div>
          </Link>
          <div>
            RAM: {productRamSize} | Storage: {productStorageSize}
          </div>
          <div>Color: {productColorName}</div>
          <p className="price">{productPrice.toLocaleString()}₫</p>
        </div>
      </div>
    </div>
  );
}
