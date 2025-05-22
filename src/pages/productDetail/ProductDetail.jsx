import React from "react";
import "./ProductDetail.css";
import { useState } from "react";
import xiaomiLogo from "../../assets/iconBrand/milogo_1592402136_1592534441.png";
import logoRealme from "../../assets/iconBrand/apple_watch_menu-512_1592535236_1598409765.png";
import logoIqoo from "../../assets/iconBrand/logo_iqoo.png";
import logoIphone from "../../assets/iconBrand/logo_iphone.png";
import logoIpad from "../../assets/iconBrand/logo_ipad.png";
import logoInfo from "../../assets/iconBrand/icon_info.png";
import Header from "../../components/Header";
import TableInfor from "./TableInfor";

const images = [
  "image/imageProduct/xiaomi/iqoo.jpg",
  "image/imageProduct/xiaomi/ioqq_black.jpg",
];

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="product-detail-body">
        <div className="container">
          <div className="megamenu">
            <p>Danh mục sản phẩm</p>
          </div>
        </div>

        <p className="product-name">
          Xiaomi Redmi Note14 Pro 5G{" "}
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
                  {images.map((image, index) => (
                    <div
                      className={`small-frame ${
                        selectedImage === image ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img className="image" src={image} alt="img-review" />
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
                <form action="" className="buy-simple-form" method="post">
                  <div className="price" name="price">
                    4.600.000₫ <span className="small-price">3.000.000₫</span>
                  </div>

                  <strong className="label">Lựa chọn phiên bản </strong>
                  <p className="pr-available">{`Tình trạng: Còn hàng`}</p>

                  <div className="storage-grid">
                    <div className="grid-item">
                      <div className="extend-name">8GB/128GB</div>
                      <div className="price">4.600.000₫</div>
                    </div>
                    <div className="grid-item">item2</div>
                    <div className="grid-item">item3</div>
                    <div className="grid-item">item4</div>
                  </div>

                  <strong className="label">Lựa chọn màu</strong>

                  <div className="color-grid">
                    <div className="grid-item">
                      <div className="extend-name">8GB/128GB</div>
                    </div>
                    <div className="grid-item">item2</div>
                    <div className="grid-item">item3</div>
                    <div className="grid-item">item4</div>
                  </div>

                  <div className="order-box">
                    <div className="add-cart-eventory">
                      <img
                        className="cart-icon"
                        src="image/common/cart.png"
                        alt=""
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
                  src="image/banner/warranty.gif"
                  alt="gif"
                />
              </div>
            </div>

            <div className="frame-right">
              <div className="table-info-title">Thông số chi tiết</div>
              <div className="infor-detail">
                <TableInfor />
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
              {" "}
              <div className="table-info-title">Thông số chi tiết</div>
              <button onClick={toggleInfo} className="button-close">
                <img src="/image/common/icon-close.png" alt="" />
              </button>
              <div className="show-table-info-detail">
                <TableInfor />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
