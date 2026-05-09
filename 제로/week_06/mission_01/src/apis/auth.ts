import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth.ts";
import { axiosInstance } from "./axios.ts";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  console.log("postSignin 응답:", data);
  console.log("accessToken:", data.data?.accessToken);

  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");
  return data;
};

export const postLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")?.replace(/"/g, "");

    const response = await axiosInstance.post("/v1/auth/signout", {
      refreshToken: refreshToken || null,
    });

    return response.data;
  } catch (error) {
    console.error("API 로그아웃 요청 실패:", error);
    throw error;
  }
};