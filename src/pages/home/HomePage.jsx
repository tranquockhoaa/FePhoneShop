import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import axios from "axios";

import xiaomiLogo from "../../assets/iconBrand/milogo_1592402136_1592534441.png";
import logoRealme from "../../assets/iconBrand/apple_watch_menu-512_1592535236_1598409765.png";
import logoIqoo from "../../assets/iconBrand/logo_iqoo.png";
import logoIphone from "../../assets/iconBrand/logo_iphone.png";
import logoInfo from "../../assets/iconBrand/icon_info.png";
import {
  Information,
  IphoneSearch,
  IqooSearch,
  RealmeSearch,
  SamsungSearch,
  XiaomiSearch,
} from "../../components/homeMenu/HoverMenu";
import ProductItem from "../../components/productItem/productItem";

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

  { name: "Dịch vụ", logo: logoInfo, component: <Information /> },
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
          if (brand.name === "Dịch vụ") continue;
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
                {/* Nếu là Dịch vụ thì không link */}
                {brand.name !== "Dịch vụ" ? (
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
        </div>
        <div className="store">
          {isLoading ? (
            <p>Đang tải dữ liệu sản phẩm...</p>
          ) : fetchCompleted ? (
            updatedBrands.map((brand, index) =>
              brand.name === "Dịch vụ" ? null : (
                <div className="item-store" key={index}>
                  <div className="title">
                    <h2 className="title-name">
                      <p>{brand.title}</p>
                    </h2>
                  </div>
                  <div className="product-grid">
                    {brand.data?.data?.length > 0 ? (
                      brand.data.data.map((product, idx) => (
                        <ProductItem
                          productCode={product.code}
                          brandName={brand.name}
                          productColorName={product.color_name}
                          productName={product.name}
                          productRamSize={product.ram_size}
                          productStorageSize={product.storage_size}
                          productPrice={product.price}
                          key={idx}
                        />
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
