import React from "react";
import "./OrderItem.css";

const OrderItem = ({ item }) => {
  console.log("item", item);
  const { product_details } = item;
  const { product, memory, color } = product_details;

  const getUrlImage = () => {
    const colorName = item.product_details.color.name;
    const listColor = item.product_details.product.color;
    const matchedColor = listColor.find(
      (color) => color.color_name == colorName
    );
    return matchedColor?.images?.[0]?.link || null;
  };
  return (
    <div className="order-item">
      <div className="order-left">
        <img src={getUrlImage()} alt={product.name} className="product-img" />
        <div className="order-info">
          <h4>{product.name}</h4>
          <p>
            {memory.ram_size} / {memory.storage_size} / Màu: {color.name}
          </p>
          <p>Thương hiệu: {product.brand_id}</p>
        </div>
      </div>

      <div className="order-right">
        <div className="order-price">{item.unit_price?.toLocaleString()}₫</div>
        <div className="quantity-readonly">x{item.quantity}</div>
      </div>
    </div>
  );
};

export default OrderItem;
