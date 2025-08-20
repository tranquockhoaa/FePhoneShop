import authorizedRequest from '../config/axios';

export const searchProductByBrandName = async (brandName, page, sortOrder) => {
  const PAGE_SIZE = 10;
  try {
    const response = await authorizedRequest.get('/products/search', {
      params: {
        brandName: brandName,
        _page: page,
        _limit: PAGE_SIZE,
        ...(sortOrder && { sortPrice: sortOrder }), // chỉ thêm nếu có sortOrder
      },
    });
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const searchProductByApi = async (params) => {
  try {
    const response = await authorizedRequest.get('/products', {
      params,
    });
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
