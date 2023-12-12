import axiosInstance from "../base.api";
import searchUsersRequest from "./requests/searUsers.request";
import createUserResponse from "./responses/createUser.response";
import updateUserResponse from "./responses/updataUser.response";

const searchUsers = async (params: searchUsersRequest = {}): Promise<any> => {
  try {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createUser = async (requestBody: createUserResponse): Promise<any> => {
  try {
    const response = await axiosInstance.postForm("/users", requestBody);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getUserByUserId = async (userId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateUser = async (
  userId: string,
  requestBody: updateUserResponse
): Promise<any> => {
  try {
    const response = await axiosInstance.putForm(
      `/users/${userId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteUser = async (userId: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

export default {
  searchUsers,
  createUser,
  getUserByUserId,
  updateUser,
  deleteUser,
};
