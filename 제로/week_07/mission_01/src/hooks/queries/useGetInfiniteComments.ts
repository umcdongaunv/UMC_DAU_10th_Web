import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

export const useGetInfiniteComments = (lpId: string, order: string) => {
  return useInfiniteQuery({
    queryKey: [
      QUERY_KEY.lpComments,
      lpId,
      order,
    ],
    queryFn: ({ pageParam }) => getComments(lpId, pageParam, 10, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!lpId,
  });
};