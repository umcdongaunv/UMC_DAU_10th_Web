import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment";

export const useGetInfiniteComments = (lpId: string, order: string) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) => getComments(lpId, pageParam, 10, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!lpId,
  });
};