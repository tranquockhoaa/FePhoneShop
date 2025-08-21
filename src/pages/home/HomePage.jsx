import React, { useEffect, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductItem from '../../components/product-item/product-item';
import './HomePage.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import xiaomiLogo from '../../assets/iconBrand/xiaomi.png';
import logoRealme from '../../assets/iconBrand/realme.png';
import logoIqoo from '../../assets/iconBrand/iqoo.png';
import logoIphone from '../../assets/iconBrand/iphone.png';
import logoInfo from '../../assets/iconBrand/icon_info.png';
import { searchProductByApi } from '../../api/productlist';

const data_banner = [
  {
    url: 'https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/redmi-turbo-4-pro_1751163164.jpg',
  },

  {
    url: 'https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/z9-turbo_1751163651.jpg',
  },
  {
    url: 'https://dienthoaihay.vn/images/slideshow/2025/06/29/compress/z9-turbo_1751163651.jpg',
  },
  {
    url: 'https://dienthoaihay.vn/images/banners/original/q5-pro_1736649129.jpg',
  },
];

const brands = [
  { name: 'iQOO', logo: logoIqoo, title: 'IQOO' },
  {
    name: 'Samsung',
    logo: logoIphone,
    title: 'SAMSUNG',
  },
  {
    name: 'Xiaomi',
    logo: xiaomiLogo,
    title: 'XIAOMI NỔI BẬT',
  },
  {
    name: 'iPhone',
    logo: logoIphone,
    title: 'IPHONE',
  },
  {
    name: 'Realme',
    logo: logoRealme,
    title: 'REALME',
  },
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [updatedBrands, setUpdatedBrands] = useState(brands);
  const { listBrandActive } = useSelector((state) => state.listBrands);

  const fetchProductsForBrands = async () => {
    try {
      setIsLoading(true);
      const brandsWithProducts = listBrandActive.map((item) => {
        const brand = brands.find(
          (brandItem) =>
            brandItem.name.toLowerCase() === item.name.toLowerCase()
        );

        return { ...brand, ...item, logo: brand?.logo || logoIphone };
      });

      for (let i = 0; i < brandsWithProducts.length; i++) {
        const brand = brandsWithProducts[i];
        if (brand.name === 'Dịch vụ') continue;
        try {
          const response = await searchProductByApi({
            brand_id: brand.brand_id,
            sortOrder: 'DESC',
          });

          brandsWithProducts[i] = {
            ...brand,
            data: response.data.data,
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
      console.error('Overall fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (listBrandActive?.length) {
      fetchProductsForBrands();
    }
  }, [listBrandActive]);

  return (
    <div className="homepage">
      <div className="homepage-container">
        <div className="block-top-home">
          <div className="wrap-menu">
            {updatedBrands.map((brand, index) => (
              <div
                className="menu"
                key={index}
              >
                <span className="homepage-icon">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                  />
                </span>
                {/* Nếu là Dịch vụ thì không link */}
                {brand.name !== 'Dịch vụ' ? (
                  <Link
                    to={`/products/${brand.name}-${brand.brand_id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
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
              pagination={{ type: 'bullets', clickable: true }}
              autoplay={true}
              loop={true}
              modules={[Autoplay, Pagination]}
            >
              {data_banner?.map((data, id) => (
                <SwiperSlide
                  key={id}
                  autoplay={true}
                >
                  <img
                    src={data.url}
                    alt="banner-img"
                    className="banner-img"
                  />
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
              brand.name === 'Dịch vụ' ? null : (
                <div
                  className="item-store"
                  key={index}
                >
                  <div className="title">
                    <h2 className="title-name">
                      <p>{brand.name}</p>
                    </h2>
                  </div>
                  <div className="product-grid">
                    {brand.data?.length > 0 ? (
                      brand.data.map((product, idx) => (
                        <ProductItem
                          productCode={product.code}
                          brandName={brand.name}
                          productColorName={product.color_name}
                          productName={product.name}
                          productRamSize={product.ram_size}
                          productStorageSize={product.storage_size}
                          productPrice={product.price}
                          key={idx}
                          product={product}
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
