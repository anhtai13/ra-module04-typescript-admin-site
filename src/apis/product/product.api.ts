import axiosInstance from "../base.api";

import searchProductRequest from "./request/searchProduct.request";
import createProductRequest from "./request/createProduct.request";
import updateProductResponse from "./response/updateProduct.response";

const searchProducts = async (
  params: searchProductRequest = {}
): Promise<any> => {
  try {
    const response = await axiosInstance.get("/products", { params });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createProduct = async (
  requestBody: createProductRequest
): Promise<any> => {
  try {
    const response = await axiosInstance.postForm("/products", requestBody);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getProductByProductId = async (productId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateProduct = async (
  productId: string,
  requestBody: updateProductResponse
): Promise<any> => {
  try {
    const response = await axiosInstance.putForm(
      `/products/${productId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteProduct = async (productId: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

export default {
  searchProducts,
  createProduct,
  getProductByProductId,
  updateProduct,
  deleteProduct,
};
