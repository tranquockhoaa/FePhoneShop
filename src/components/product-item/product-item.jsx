import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./product-item.css";

export default function ProductItem({
  productCode,
  brandName,
  productColorName,
  productName,
  productRamSize,
  productStorageSize,
  productPrice,
  product,
  isShowInfo,
  isDraggingRef,
}) {
  const colorVariant = useMemo(() => {
    const color = product?.color?.find(
      (item) =>
        item.color?.color_id === product?.productDetails?.[0]?.color?.color_id,
    );

    return color || product?.color?.[0]?.images?.[0]?.link || "";
  }, [product]);

  const productVariant = useMemo(() => product?.productDetails?.[0], [product]);

  const priceText = useMemo(
    () => product?.productDetails?.[0]?.price || productPrice?.toLocaleString(),
    [product, productPrice],
  );

  const handleLinkClick = (event) => {
    if (isDraggingRef?.current) {
      event.preventDefault();
      event.stopPropagation();
      isDraggingRef.current = false;
    }
  };

  return (
    <Link
      to={`/product-detail/${product?.product_id}`}
      className="product-item-link"
      onClick={handleLinkClick}
    >
      <div className="product-item">
        <div className="frame_inner">
          <div className="text_small">Mới nguyên SEAL</div>
          <div className="image-product">
            <img
              src={colorVariant?.images?.[0]?.link}
              alt="image-review"
              className="img-product"
            />
            <div className="name">{productName}</div>

            <div>
              RAM: {productVariant?.memory?.ram_size} | Storage:{" "}
              {productVariant?.memory?.storage_size}
            </div>
            <div>Color: {colorVariant?.color?.name}</div>
            {priceText && (
              <p className="price">{priceText.toLocaleString("vi-VN")}₫</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
