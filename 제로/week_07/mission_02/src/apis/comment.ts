import { axiosInstance } from "./axios";



// 댓글 조회
export const getComments = async (
  lpid: number
) => {
  const { data } =
    await axiosInstance.get(
      `/v1/lps/${lpid}/comments`
    );

  return data;
};



// 댓글 생성
export const postComment = async ({
  lpid,
  content,
}: {
  lpid: number;
  content: string;
}) => {
  const { data } =
    await axiosInstance.post(
      `/v1/lps/${lpid}/comments`,
      {
        content,
      }
    );

  return data;
};



// 댓글 수정
export const patchComment = async ({
  lpid,
  commentId,
  content,
}: {
  lpid: number;
  commentId: number;
  content: string;
}) => {
  const { data } =
    await axiosInstance.patch(
      `/v1/lps/${lpid}/comments/${commentId}`,
      {
        content,
      }
    );

  return data;
};



// 댓글 삭제
export const deleteComment = async ({
  lpid,
  commentId,
}: {
  lpid: number;
  commentId: number;
}) => {
  const { data } =
    await axiosInstance.delete(
      `/v1/lps/${lpid}/comments/${commentId}`
    );

  return data;
};