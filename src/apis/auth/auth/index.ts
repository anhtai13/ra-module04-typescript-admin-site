import { AxiosResponse } from "axios";

import axiosInstance from "../../base.api";
import { LoginRequest } from "./requests/login-request";
import { LoginResponse } from "./responses/login.response";

const getAuth = async (): Promise<any> => {
  return axiosInstance
    .get("/auth")
    .then((response: any) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const loginApi = async (requestBody: LoginRequest): Promise<LoginResponse> => {
  return axiosInstance
    .post("/login", requestBody)
    .then((response: AxiosResponse<LoginResponse>) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const logoutApi = async () => {
  return axiosInstance
    .post("/logout", {})
    .then((response: AxiosResponse<void>) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export default { loginApi, logoutApi, getAuth };
