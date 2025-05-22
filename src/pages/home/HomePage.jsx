import React from "react";
import "./HomePage.css";
import { Link } from "react-router";

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
    name: "Xiao mi",
    logo: xiaomiLogo,
    title: "XIAOMI NỔI BẬT",
    component: <XiaomiSearch />,
  },
  {
    name: "Real mi",
    logo: logoRealme,
    title: "REDMI",
    component: <RealmeSearch />,
  },
  { name: "iQoo", logo: logoIqoo, title: "IQOO", component: <IqooSearch /> },
  {
    name: "iPhone",
    logo: logoIphone,
    title: "IPHONE",
    component: <IphoneSearch />,
  },
  { name: "iPad", logo: logoIpad, title: "IPAD", component: <IpadSearch /> },
  {
    name: "SamSung",
    logo: logoIphone,
    title: "SAMSUNG",
    component: <SamsungSearch />,
  },
  { name: "Oppo", logo: logoIphone, title: "OPPO", component: <OppoSearch /> },
  { name: "Tin Tức", logo: logoInfo, component: <Information /> },
];

const HomePage = () => {
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
        {brands.map((brand, index) => (
          <div className="item-store">
            <div className="title">
              <h2 className="title-name">
                <p>{brand.title}</p>
              </h2>
            </div>
            <div className="product-grid">
              <div className="item">
                <div className="frame_inner">
                  <div className="text_small">Mới nguyên SEAL</div>
                  <div className="image-product">
                    <Link to="/product-detail" className="login-link">
                      <img
                        src="image/imageProduct/xiaomi/iqoo.jpg"
                        alt=""
                        className="img-product"
                      />
                      <h5 className="name">Iqoo neo10</h5>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item">item2</div>
              <div className="item">item3</div>
              <div className="item">item4</div>
              <div className="item">item5</div>
              <div className="item">item6</div>
              <div className="item">item7</div>
              <div className="item">item8</div>
              <div className="item">item9</div>
              <div className="item">item10</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
