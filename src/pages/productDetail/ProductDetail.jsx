import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import TableInfor from "./TableInfor";
import "./ProductDetail.css";
import ButtonGoHome from "../../components/button/button-gohome/button-gohome";
import { getProductById } from "../../api/product";
import Recommend from "../../components/recommend/recommend";

const ProductDetail = () => {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [productDetail, setProductDetail] = useState();
  const [product, setProduct] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [showInfo, setShowInfo] = useState(false);

  const [selectedMemoryId, setSelectedMemoryId] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [infoProductDetail, setInfoProductDetail] = useState([]);

  // const selectedVariant = productDetail[selectedMemoryId];
  // const selectedOption = selectedVariant?.options?.[selectedColorIndex];

  // const imagePaths =
  //   selectedVariant?.options?.map((option) =>
  //     encodeURI(
  //       `/data/${option.brandName}/${option.code}/image/${option.color}.jpg`
  //     )
  //   ) || [];

  const images = useMemo(
    () => product?.color?.flatMap((item) => item.images),
    [product],
  );

  const colorOptions = useMemo(() => product?.color || [], [product]);
  const memoryOptions = useMemo(() => {
    const allMemory =
      product?.productDetails?.flatMap((item) => item.memory) || [];
    // Loại bỏ các phần tử trùng lặp dựa trên memory_id
    const uniqueMemory = allMemory.filter(
      (item, index, self) =>
        index === self.findIndex((m) => m.memory_id === item.memory_id),
    );
    return uniqueMemory;
  }, [product]);

  // useEffect(() => {
  //   if (images?.length > 0) {
  //     setSelectedImage(images[0]);
  //   }
  // }, [images]);

  useEffect(() => {
    if (product?.productDetails?.length) {
      setProductDetail(product?.productDetails[0]);
      setSelectedColorId(product?.productDetails[0]?.color_id);
      setSelectedMemoryId(product?.productDetails[0]?.memory_id);
      const colors = product?.color?.find(
        (item) => item.color.color_id === product?.productDetails[0]?.color_id,
      );

      setSelectedImage(colors?.images?.[0]);
    }
  }, [product]);

  useEffect(() => {
    if (productDetail?.specifications) {
      setInfoProductDetail(JSON.parse(productDetail?.specifications));
    } else {
      setInfoProductDetail([]);
    }
  }, [productDetail]);

  const toggleInfo = () => setShowInfo(!showInfo);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [code]);

  useEffect(() => {
    const getInfoDetailByCodeName = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(`${encodeURIComponent(code)}`);

        // setProductDetail(response.data?.data?.productDetails || []);
        setProduct(response.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getInfoDetailByCodeName();
  }, [code]);

  const handleChangeVariant = ({ color_id, memory_id }) => {
    const newProductDetail = product?.productDetails?.find(
      (item) => item.color_id === color_id && item.memory_id === memory_id,
    );

    if (newProductDetail) {
      setProductDetail(newProductDetail);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const product = productDetail[0]?.options?.[0];
  //     if (!product) return;

  //     const { brandName, name } = product;
  //     const jsonPath = encodeURI(
  //       `/data/${brandName}/${code}/information/${code}.json`
  //     );
  //     console.log(jsonPath);
  //     try {
  //       const response = await fetch(jsonPath);
  //       if (!response.ok) throw new Error('File not found');

  //       const jsonData = await response.json();
  //       setInfoProductDetail(jsonData);
  //     } catch (err) {
  //       console.error('Failed to load JSON', err);
  //     }
  //   };

  //   if (productDetail.length > 0) {
  //     fetchData();
  //   }
  // }, [productDetail]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
        return;
      }
      const productDetailId = productDetail.product_detail_id;
      if (!productDetailId) {
        alert("Vui lòng chọn phiên bản/màu sắc!");
        return;
      }
      await axios.post(
        "http://localhost:3000/api/v1/cart-detail/add-to-card",
        {
          product_detail_id: productDetailId,
          quantity: 1,
          unit_price: productDetail.price,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.location.href = "/cart";
    } catch (err) {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };
  return (
    <div>
      <Header />

      <div className="product-detail-body">
        <ButtonGoHome />
        <p className="product-name">
          {product?.name || code}{" "}
          <span className="name-small">
            Tặng gói BHV bảo hành cả nguồn, màn hình, vân tay
          </span>
        </p>
        <div className="product-normal">
          <div className="product-normal-wrap1">
            <div className="left-frame">
              <div className="frame-img">
                <div className="frame-img-inner">
                  <img src={selectedImage?.link} alt="img-review" />
                </div>
              </div>

              <div className="thumbs">
                <div className="frame-img-list">
                  {images?.map((imagePath, index) => (
                    <div
                      key={index}
                      className={`small-frame ${
                        selectedImage?.id === imagePath.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(imagePath)}
                    >
                      <img
                        className="image"
                        src={imagePath.link}
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
                    {productDetail?.price?.toLocaleString("vi-VN")}₫
                  </div>

                  <strong className="label">Lựa chọn phiên bản</strong>
                  <p className="pr-available">
                    {" "}
                    Tình trạng:{" "}
                    {productDetail?.quantity > 0 ? "Còn hàng " : "Hết hàng"}
                  </p>

                  <div className="storage-grid">
                    {memoryOptions.map((memory, index) => (
                      <div
                        key={index}
                        className={`grid-item ${
                          selectedMemoryId === memory.memory_id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedMemoryId(memory.memory_id);

                          handleChangeVariant({
                            color_id: selectedColorId,
                            memory_id: memory.memory_id,
                          });
                          // setSelectedColorIndex(0);
                        }}
                      >
                        {memory.ram_size ? `${memory.ram_size}/` : ""}
                        {memory.storage_size}
                        {/* <div className="price">
                          {memory.options?.[0]?.price?.toLocaleString('vi-VN')}
                          ₫
                        </div> */}
                      </div>
                    ))}
                  </div>

                  <strong className="label">Lựa chọn màu</strong>
                  <div className="color-grid">
                    {colorOptions?.map((option, index) => (
                      <div
                        key={index}
                        className={`grid-item ${
                          option?.color?.color_id === selectedColorId
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          const color_id = option?.color?.color_id;
                          setSelectedColorId(color_id);
                          setSelectedImage(option.images[0]);

                          handleChangeVariant({
                            color_id,
                            memory_id: selectedMemoryId,
                          });
                        }}
                      >
                        <div className="extend-name">
                          {option.color.name} <br />
                          {/* <span className="price">
                            {option.price.toLocaleString('vi-VN')}₫
                          </span> */}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-box">
                    <div
                      className="add-cart-eventory"
                      onClick={handleAddToCart}
                    >
                      <img
                        className="cart-icon"
                        src="/image/common/cart.png"
                        alt="cart"
                      />
                    </div>

                    <div className="order-button" onClick={handleAddToCart}>
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
        )}{" "}
        <Recommend code={code} />
      </div>
    </div>
  );
};

export default ProductDetail;
