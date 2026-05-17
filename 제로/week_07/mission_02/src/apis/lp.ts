import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto, RequestLpDto } from "../types/lp";
import { axiosInstance } from "./axios";
import { type RequestPostLpDto } from "../types/lp";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
   const {data} = await axiosInstance.get("/v1/lps", {
      params:paginationDto,
   });
   return data;
}

export const getLpDetail = async (lpid: string) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data.data;
};

export const postLike = async ({lpid} : RequestLpDto):Promise<ResponseLpListDto> => {
   const {data} = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

      return data;
   }

export const deleteLike = async ({lpid}: RequestLpDto):Promise<ResponseLpListDto> => {
   const {data} = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

   return data;
}

export const postLp = async (
  body: RequestPostLpDto
) => {
  const { data } =
    await axiosInstance.post(
      "/v1/lps",
      body
    );

  return data;
};

export const uploadImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } =
    await axiosInstance.post(
      "/v1/uploads",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return data;
};

interface PatchLpParams {
  lpid: number;
  title: string;
  content: string;
}

export const patchLp =
  async ({
    lpid,
    title,
    content,
  }: PatchLpParams) => {

    const { data } =
      await axiosInstance.patch(
        `/v1/lps/${lpid}`,
        {
          title,
          content,
        }
      );

    return data;
  };

  export const deleteLp =
  async (lpid: number) => {

    const { data } =
      await axiosInstance.delete(
        `/v1/lps/${lpid}`
      );

    return data;
  };