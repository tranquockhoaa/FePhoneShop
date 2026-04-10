import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { getRecommendProduct } from "../../api/recommend";
import { getProductById } from "../../api/product";
import ProductItem from "../product-item/product-item";
import { Flex } from "antd";

const Recommend = ({ code }) => {
  //   const dispatch = useDispatch();

  //   const { recommendProducts, loading } = useSelector(
  //     (state) => state.recommend,
  //   );

  //   useEffect(() => {
  //     if (!code) return;

  //     dispatch(code);
  //   }, [code]);

  //   if (loading) return <p>Loading...</p>;

  const [recommendProducts, setRecommendProducts] = useState([]);

  const [recommendProductDetails, setRecommendProductDetail] = useState([]);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (event) => {
    isDraggingRef.current = false;
    const touch = event.targetTouches?.[0];
    if (touch) {
      startXRef.current = touch.clientX;
      startYRef.current = touch.clientY;
    }
  };

  const handleTouchMove = (event) => {
    const touch = event.targetTouches?.[0];
    if (!touch) return;
    if (
      Math.abs(touch.clientX - startXRef.current) > 10 ||
      Math.abs(touch.clientY - startYRef.current) > 10
    ) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerDown = (event) => {
    isDraggingRef.current = false;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
  };

  const handlePointerMove = (event) => {
    if (
      Math.abs(event.clientX - startXRef.current) > 10 ||
      Math.abs(event.clientY - startYRef.current) > 10
    ) {
      isDraggingRef.current = true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;

      try {
        const response = await getRecommendProduct(code);
        console.log("recommend");
        setRecommendProducts(response.recommendations);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [code]);

  useEffect(() => {
    const handleRecomendProductDetails = async () => {
      if (recommendProducts.length === 0) return;

      const data = await Promise.all(
        recommendProducts.map((item) => {
          const data = getProductById(item.product_id);
          return data;
        }),
      );
      setRecommendProductDetail(data);
    };
    handleRecomendProductDetails();
  }, [recommendProducts]);
  useEffect(() => {
    console.log("recommendProducts:", recommendProductDetails);
  }, [recommendProductDetails]);
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <p
        style={{
          backgroundColor: "red",
          fontSize: 28,
          padding: "5px",
          textAlign: "center",
          borderRadius: "10px",
          marginBottom: "10px",
          fontWeight: 500,
          color: "#fff",
        }}
      >
        Có thể bạn quan tâm
      </p>
      <>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={1}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation]}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="mySwiper"
          style={{
            backgroundColor: "#fff",
          }}
        >
          {recommendProductDetails.map((product, idx) => (
            <SwiperSlide
              key={idx}
              style={{ backgroundColor: "#fff", width: "20%" }}
            >
              <ProductItem
                productCode={product.data.data.code}
                brandName={product.data.data.brand.name}
                productColorName={product.data.data.color_name}
                productName={product.data.data.name}
                productRamSize={product.data.data.ram_size}
                productStorageSize={product.data.data.storage_size}
                productPrice={product.data.data.price}
                product={product.data.data}
                isDraggingRef={isDraggingRef}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    </div>
  );
};

export default Recommend;
