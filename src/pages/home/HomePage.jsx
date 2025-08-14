import React, { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./HomePage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import xiaomiLogo from "../../assets/iconBrand/milogo_1592402136_1592534441.png";
import logoRealme from "../../assets/iconBrand/apple_watch_menu-512_1592535236_1598409765.png";
import logoIqoo from "../../assets/iconBrand/logo_iqoo.png";
import logoIphone from "../../assets/iconBrand/logo_iphone.png";
import logoInfo from "../../assets/iconBrand/icon_info.png";

const data_banner = [
  {
    url: "https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/redmi-turbo-4-pro_1751163164.jpg",
  },

  {
    url: "https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/z9-turbo_1751163651.jpg",
  },
  {
    url: "https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/z9-turbo_1751163651.jpg",
  },
  {
    url: "https://dienthoaihay.vn/images/banners/original/q5-pro_1736649129.jpg",
  },
];

const brands = [
  {
    name: "Realme",
    logo: logoRealme,
    title: "REALME",
  },
  {
    name: "Xiaomi",
    logo: xiaomiLogo,
    title: "XIAOMI NỔI BẬT",
  },
  {
    name: "Samsung",
    logo: logoIphone,
    title: "SAMSUNG",
  },
  { name: "iQOO", logo: logoIqoo, title: "IQOO" },
  {
    name: "iPhone",
    logo: logoIphone,
    title: "IPHONE",
  },

  { name: "Tin Tức", logo: logoInfo },
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [updatedBrands, setUpdatedBrands] = useState(brands);
  useEffect(() => {
    const fetchProductsForBrands = async () => {
      try {
        setIsLoading(true);
        const brandsWithProducts = [...brands];
        for (let i = 0; i < brandsWithProducts.length; i++) {
          const brand = brandsWithProducts[i];
          if (brand.name === "Tin Tức") continue;
          try {
            const response = await axios.get(
              `http://localhost:3000/api/v1/products/latest?brandName=${brand.name}`
            );
            brandsWithProducts[i] = {
              ...brand,
              data: response.data["data"],
            };
          } catch (error) {
            console.error(`Error fetching products for ${brand.name}:`, error);
            brandsWithProducts[i] = {
              ...brand,
              data: [],
              error: true,
            };
          }
        }

        setUpdatedBrands(brandsWithProducts);
        setFetchCompleted(true);
      } catch (error) {
        console.error("Overall fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsForBrands();
  }, []);

  useEffect(() => {
    console.log(updatedBrands);
  }, [updatedBrands]);
  return (
    <div className="homepage">
      <div className="homepage-container">
        <div className="block-top-home">
          <div className="wrap-menu">
            {brands.map((brand, index) => (
              <div className="menu" key={index}>
                <span className="icon">
                  <img src={brand.logo} alt={brand.name} />
                </span>
                {/* Nếu là Tin Tức thì không link */}
                {brand.name !== "Tin Tức" ? (
                  <Link
                    to={`/products/${brand.name}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {brand.name}
                  </Link>
                ) : (
                  brand.name
                )}
                <div className="option-list">{brand.component}</div>
              </div>
            ))}
          </div>
          <div className="banner">
            <Swiper
              pagination={{ type: "bullets", clickable: true }}
              autoplay={true}
              loop={true}
              modules={[Autoplay, Pagination]}
            >
              {data_banner?.map((data, id) => (
                <SwiperSlide key={id} autoplay={true}>
                  <img src={data.url} alt="banner-img" className="banner-img" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="store">
          {isLoading ? (
            <p>Đang tải dữ liệu sản phẩm...</p>
          ) : fetchCompleted ? (
            updatedBrands.map((brand, index) =>
              brand.name === "Tin Tức" ? null : (
                <div className="item-store" key={index}>
                  <div className="title">
                    <h2 className="title-name">
                      <p>{brand.title}</p>
                    </h2>
                  </div>
                  <div className="product-grid">
                    {brand.data?.data?.length > 0 ? (
                      brand.data.data.map((product, idx) => (
                        <div className="item" key={idx}>
                          <div className="frame_inner">
                            <div className="text_small">Mới nguyên SEAL</div>
                            <div className="image-product">
                              <Link to={`/product-detail/${product.code}`}>
                                <img
                                  src={encodeURI(
                                    `data/${brand.name}/${product.code}/image/${product.color_name}.jpg`
                                  )}
                                  alt="image-review"
                                  className="img-product"
                                />
                                <div className="name">{product.name}</div>
                              </Link>
                              <div>
                                RAM: {product.ram_size} | Storage:{" "}
                                {product.storage_size}
                              </div>
                              <div>Color: {product.color_name}</div>
                              <p className="price">
                                {product.price.toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Không có sản phẩm nào.</p>
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <p>Có lỗi xảy ra khi tải dữ liệu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
