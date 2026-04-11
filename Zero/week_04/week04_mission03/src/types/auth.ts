import { type CommonResponse } from "./common";

export type RequestSignupDto = {
   email: string;
   password: string;
   bio?: string;
   avatar?: string;
   name: string;
}

export type ResponseSignupDto = CommonResponse<{
   id: number;
   email: string;
   name: string;
   bio: string | null;
   avatar: string | null;
   createdAt: Date;
   updatedAt: Date;
}>

export type RequestSigninDto = {
   email: string;
   password: string;
}

export type ResponseSigninDto = CommonResponse<{
   id: number;
   name: string;
   accessToken: string;
   refreshToken: string;
}>

export type ResponseMyInfoDto = CommonResponse<{
   id: number;
   email: string;
   name: string;
   bio: string | null;
   avatar: string | null;
   createdAt: Date;
   updatedAt: Date;
}>