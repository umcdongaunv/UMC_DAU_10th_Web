import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Like[];
  author: Author;
};

export type RequestLpDto = {
  lpId: number;
};

export type ResponseLpDto = CommonResponse<Lp>;

export type Comment = {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseCommentDto = CursorBasedResponse<Comment[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;