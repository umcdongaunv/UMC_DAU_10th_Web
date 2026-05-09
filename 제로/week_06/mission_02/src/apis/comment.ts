import { axiosInstance } from "./axios";
import type { CommentListResponse } from "../types/comment";

export const getComments = async (
  lpId: string,
  cursor: number,
  limit: number,
  order: string
): Promise<{ data: CommentListResponse }> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};


export const postComment = async (lpId: string, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};