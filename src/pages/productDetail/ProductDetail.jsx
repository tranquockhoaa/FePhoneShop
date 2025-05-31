import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header";
import TableInfor from "./TableInfor";
import "./ProductDetail.css";
import js from "@eslint/js";

const ProductDetail = () => {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [productDetail, setProductDetail] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [infoProductDetail, setInfoProductDetail] = useState({});

  const selectedVariant = productDetail[selectedVersionIndex];
  const selectedOption = selectedVariant?.options[selectedColorIndex];

  const imagePaths =
    selectedVariant?.options.map((option) =>
      encodeURI(
        `/data/${option.brandName}/${option.name}/image/${option.color}.jpg`
      )
    ) || [];

  useEffect(() => {
    if (imagePaths.length > 0) {
      setSelectedImage(imagePaths[selectedColorIndex]);
    }
  }, [selectedColorIndex, selectedVariant]);

  const toggleInfo = () => setShowInfo(!showInfo);

  useEffect(() => {
    const getInfoDetailByCodeName = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v1/products/getInfoDetail?codeProduct=${code}`
        );
        setProductDetail(response.data.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getInfoDetailByCodeName();
  }, [code]);

  useEffect(() => {
    const fetchData = async () => {
      const product = productDetail[0]?.options?.[0];
      if (!product) return;

      const { brandName, name } = product;
      const jsonPath = encodeURI(
        `/data/${brandName}/${name}/information/${name}.json`
      );
      console.log(jsonPath);
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("File not found");

        const jsonData = await response.json();
        setInfoProductDetail(jsonData);
      } catch (err) {
        console.error("Failed to load JSON", err);
      }
    };

    if (productDetail.length > 0) {
      fetchData();
    }
  }, [productDetail]);

  return (
    <div>
      <Header />

      <div className="product-detail-body">
        <div className="container">
          <div className="megamenu">
            <p>Danh mục sản phẩm</p>
          </div>
        </div>

        <p className="product-name">
          {code}
          <span className="name-small">
            Tặng gói BHV bảo hành cả nguồn, màn hình, vân tay
          </span>
        </p>

        <div className="product-normal">
          <div className="product-normal-wrap1">
            <div className="left-frame">
              <div className="frame-img">
                <div className="frame-img-inner">
                  <img src={selectedImage} alt="img-review" />
                </div>
              </div>

              <div className="thumbs">
                <div className="frame-img-list">
                  {imagePaths.map((imagePath, index) => (
                    <div
                      key={index}
                      className={`small-frame ${
                        selectedImage === imagePath ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(imagePath)}
                    >
                      <img
                        className="image"
                        src={imagePath}
                        alt={`img-${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="all-des-other-pr">
                <div className="title-allbox">Mô tả sản phẩm</div>
                <div className="des-pr">
                  Máy mới nguyên seal 100% chưa qua sử dụng. Bộ phụ kiện chuẩn
                  bao gồm thân máy, sạc, cáp, que chọc sim và sách hướng dẫn sử
                  dụng. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP
                  toàn diện cả nguồn, màn hình, vân tay
                </div>
              </div>
            </div>

            <div className="frame-center">
              <div className="product-base">
                <form className="buy-simple-form">
                  <div className="price" name="price">
                    {selectedOption?.price.toLocaleString("vi-VN")}₫
                  </div>

                  <strong className="label">Lựa chọn phiên bản</strong>
                  <p className="pr-available">
                    {" "}
                    Tình trạng:{" "}
                    {selectedOption?.quantity > 0 ? "Còn hàng " : "Hết hàng"}
                  </p>

                  <div className="storage-grid">
                    {productDetail.map((variant, index) => (
                      <div
                        key={index}
                        className={`grid-item ${
                          selectedVersionIndex === index ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedVersionIndex(index);
                          setSelectedColorIndex(0);
                        }}
                      >
                        {variant.ram ? `${variant.ram}/` : ""}
                        {variant.storage}
                        <div className="price">
                          {variant.options[0]?.price.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    ))}
                  </div>

                  <strong className="label">Lựa chọn màu</strong>
                  <div className="color-grid">
                    {selectedVariant?.options.map((option, index) => (
                      <div
                        key={index}
                        className={`grid-item ${
                          selectedColorIndex === index ? "selected" : ""
                        }`}
                        onClick={() => setSelectedColorIndex(index)}
                      >
                        <div className="extend-name">
                          {option.color} <br />
                          <span className="price">
                            {option.price.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-box">
                    <div className="add-cart-eventory">
                      <img
                        className="cart-icon"
                        src="/image/common/cart.png"
                        alt="cart"
                      />
                    </div>

                    <div className="order-button">
                      <strong>MUA NGAY </strong>
                      <span>Giao hàng tận nơi hoặc mua tại cửa hàng</span>
                    </div>
                  </div>
                </form>
              </div>

              <div className="hotline-call">
                Gọi <span className="phone-number">01234567890</span> hoặc{" "}
                <span className="phone-number">01234567890</span> để được tư vấn
              </div>

              <div className="banner">
                <img
                  className="img-banner"
                  src="/image/banner/warranty.gif"
                  alt="gif"
                />
              </div>
            </div>

            <div className="frame-right">
              <div className="table-info-title">Thông số chi tiết</div>
              <div className="infor-detail">
                <TableInfor data={infoProductDetail} />
              </div>
              <div className="show-full-info">
                <button className="button-show-info" onClick={toggleInfo}>
                  Xem thêm thông tin
                </button>
              </div>
            </div>
          </div>
        </div>

        {showInfo && (
          <div className="overlay">
            <div className="content">
              <div className="table-info-title">Thông số chi tiết</div>
              <button onClick={toggleInfo} className="button-close">
                <img src="/image/common/icon-close.png" alt="close" />
              </button>
              <div className="show-table-info-detail">
                <TableInfor data={infoProductDetail} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
