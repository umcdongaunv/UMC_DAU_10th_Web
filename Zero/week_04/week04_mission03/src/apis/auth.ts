import { axiosInstance } from "./axios";
import type { ResponseMyInfoDto, RequestSignupDto, RequestSigninDto, ResponseSigninDto, ResponseSignupDto} from "../types/auth";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
   const {data} = await axiosInstance.post("/auth/signup", body);

   return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
   const {data} = await axiosInstance.post("/auth/signin", body);

   return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
   const {data} = await axiosInstance.get("/users/me");

   return data;
}
