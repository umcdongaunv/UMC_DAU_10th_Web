import { axiosInstance } from "./axios";

export const uploadImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } =
    await axiosInstance.post(
      "/v1/uploads",
      formData
    );

  return data;
};