import axiosInstance from "../base.api";

import { searchContactRequest } from "./request/searchContact.request";

const searchContacts = async (
  params: searchContactRequest = {}
): Promise<any> => {
  try {
    const response = await axiosInstance.get("/contacts", { params });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getContactByContactId = async (contactId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateContact = async (
  orderId: string,
  requestBody: any
): Promise<any> => {
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
  searchContacts,
  getContactByContactId,
  updateContact,
  deleteOrder,
};
