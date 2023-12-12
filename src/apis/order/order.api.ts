import axiosInstance from "../base.api";

import { searchOrderRequest } from "./request/searchOrder.request";

const searchOrders = async (params: searchOrderRequest = {}): Promise<any> => {
  try {
    const response = await axiosInstance.get("/orders", { params });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getOrderByOrderId = async (orderId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getOrderDetailByOrderDetailId = async (
  orderDetailId: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/orders/detail/${orderDetailId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateOrder = async (orderId: string, requestBody: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, requestBody);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteOrder = async (orderId: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

export default {
  searchOrders,
  getOrderByOrderId,
  getOrderDetailByOrderDetailId,
  updateOrder,
  deleteOrder,
};
