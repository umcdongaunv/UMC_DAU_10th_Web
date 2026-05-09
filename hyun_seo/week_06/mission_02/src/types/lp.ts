import type { CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
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
}

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