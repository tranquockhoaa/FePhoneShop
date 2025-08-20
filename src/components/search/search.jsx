import './search.css';
import React, { useEffect, useRef, useMemo } from 'react';

const SearchBranch = ({ onClose, products }) => {
  const searchRef = useRef(null);

  const dataShow = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    const groupedByBrand = new Map();
    for (const product of products) {
      const brandId = product?.brand?.brand_id;
      const brandName = product?.brand?.name ?? '';
      if (brandId == null) continue;
      if (!groupedByBrand.has(brandId)) {
        groupedByBrand.set(brandId, {
          brand_id: brandId,
          brand_name: brandName,
          products: [],
        });
      }
      groupedByBrand.get(brandId).products.push(product);
    }
    return Array.from(groupedByBrand.values());
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  console.log('dataShow', dataShow);

  return (
    <div
      className="search-branch"
      ref={searchRef}
    >
      {dataShow.length > 0 ? (
        dataShow.map((item, index) => (
          <div
            key={index}
            className="search-item"
          >
            <p className="item-brand">{item.brand_name}</p>
            {item?.products?.map((product, indexProduct) => (
              <div key={indexProduct}>
                <a
                  href={`/product-detail/${product?.product_id}`}
                  className="item-details"
                >
                  <img
                    src={product?.color?.[0]?.images?.[0]?.link}
                    alt=""
                    className="item-image"
                  />
                  <div>
                    <p className="item-name">{product.name}</p>
                    <p className="item-price">
                      {product?.productDetails?.[0]?.price.toLocaleString(
                        'vi-VN'
                      )}
                      ₫
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="search-item">
          <p
            className="item-name"
            style={{ padding: '10px' }}
          >
            Không tìm thấy sản phẩm phù hợp
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBranch;
