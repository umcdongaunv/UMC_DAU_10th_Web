import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth.ts";
import { axiosInstance } from "./axios.ts";


export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
  const {data} = await axiosInstance.post("/v1/auth/signup", body);


  return data;
};

export const postSignin = async (body: RequestSigninDto):Promise<ResponseSigninDto> => {
  const {data} = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
  const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = storedToken? JSON.parse(storedToken): null;
  const {data} = await axiosInstance.get("v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const postLogout = async () => {
  const {data} = await axiosInstance.post("/v1/auth/logout");
  return data;
};