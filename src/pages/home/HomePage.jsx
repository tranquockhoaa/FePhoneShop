import React from 'react';
import './HomePage.css';
import xiaomiLogo from '../../assets/iconBrand/milogo_1592402136_1592534441.png';
import logoRealme from '../../assets/iconBrand/apple_watch_menu-512_1592535236_1598409765.png';
import logoIqoo from '../../assets/iconBrand/logo_iqoo.png';
import logoIphone from '../../assets/iconBrand/logo_iphone.png';
import logoIpad from '../../assets/iconBrand/logo_ipad.png';
import logoInfo from '../../assets/iconBrand/icon_info.png';
import {
  Information,
  IphoneSearch,
  IqooSearch,
  RealmeSearch,
  SamsungSearch,
  XiaomiSearch,
  IpadSearch,
  OppoSearch,
} from '../../components/homeMenu/HoverMenu';

const brands = [
  { name: 'Xiao mi', logo: xiaomiLogo, component: <XiaomiSearch /> },
  { name: 'Real mi', logo: logoRealme, component: <RealmeSearch /> },
  { name: 'iQoo', logo: logoIqoo, component: <IqooSearch /> },
  { name: 'iPhone', logo: logoIphone, component: <IphoneSearch /> },
  { name: 'iPad', logo: logoIpad, component: <IpadSearch /> },
  { name: 'SamSung', logo: logoIphone, component: <SamsungSearch /> },
  { name: 'Oppo', logo: logoIphone, component: <OppoSearch /> },
  { name: 'Tin Tức', logo: logoInfo, component: <Information /> },
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
        <div className="item-store" id="item_store_xiaomi">
          <div className="title">
            <h2 className="title-name" id="title-name-xiaomi">
              XIAOMI NỔI BẬT
            </h2>
          </div>
        </div>
        <div className="item-store" id="item_store_xiaomi">
          <div className="title">
            <h2 className="title-name" id="xiaomi">
              Realmi
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
