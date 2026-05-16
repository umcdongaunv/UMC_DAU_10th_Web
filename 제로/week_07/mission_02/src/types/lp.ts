import type { CursorBasedResponse } from "./common";
import type { CommonResponse } from "./common";

export type Tag = {
   id: number;
   name: string;
}

export type Likes = {
   id: number;
   userId: number;
   lpId: number;
}

export type Lp = {
      id: number;
      title: string;
      content: string;
      thumbnail: string;
      published: boolean;
      authorId: number;
      createdAt: Date;
      updatedAt: Date;
      tags: Tag[];
      likes: Likes[];
}

export type ResponseLpListDto = CursorBasedResponse<Lp[]>

export type RequestLpDto = {
   lpid: number;
}

export type ResponseLikeLpDto = CommonResponse<{
   id: number;
   userId: number;
   lpId: number;
}>

export interface RequestPostLpDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}