import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import axios from "axios";

import xiaomiLogo from "../../assets/iconBrand/milogo_1592402136_1592534441.png";
import logoRealme from "../../assets/iconBrand/apple_watch_menu-512_1592535236_1598409765.png";
import logoIqoo from "../../assets/iconBrand/logo_iqoo.png";
import logoIphone from "../../assets/iconBrand/logo_iphone.png";
import logoIpad from "../../assets/iconBrand/logo_ipad.png";
import logoInfo from "../../assets/iconBrand/icon_info.png";
import {
  Information,
  IphoneSearch,
  IqooSearch,
  RealmeSearch,
  SamsungSearch,
  XiaomiSearch,
  IpadSearch,
  OppoSearch,
} from "../../components/homeMenu/HoverMenu";

const brands = [
  {
    name: "Realme",
    logo: logoRealme,
    title: "REALME",
    component: <RealmeSearch />,
  },
  {
    name: "Xiaomi",
    logo: xiaomiLogo,
    title: "XIAOMI NỔI BẬT",
    component: <XiaomiSearch />,
  },
  {
    name: "Samsung",
    logo: logoIphone,
    title: "SAMSUNG",
    component: <SamsungSearch />,
  },
  { name: "iQOO", logo: logoIqoo, title: "IQOO", component: <IqooSearch /> },
  {
    name: "iPhone",
    logo: logoIphone,
    title: "IPHONE",
    component: <IphoneSearch />,
  },
  { name: "iPad", logo: logoIpad, title: "IPAD", component: <IpadSearch /> },

  { name: "Oppo", logo: logoIphone, title: "OPPO", component: <OppoSearch /> },
  { name: "Tin Tức", logo: logoInfo, component: <Information /> },
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
      <div className="block-top-home">
        <div className="wrap-menu">
          {brands.map((brand, index) => (
            <div className="menu">
              <span className="icon" key={index}>
                <img src={brand.logo} alt={brand.name} />
              </span>
              {brand.name}
              <div className="option-list">{brand.component}</div>
            </div>
          ))}
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
                            <Link
                              to={`/product-detail/${product.code}`}
                              className="login-link"
                            >
                              <img
                                src={encodeURI(
                                  `data/${brand.name}/${product.code}/image/${product.color_name}.jpg`
                                )}
                                alt={"image-review"}
                                className="img-product"
                              />
                              {/* <h5 className="name">{product.name}</h5> */}
                            </Link>
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
  );
};

export default HomePage;
