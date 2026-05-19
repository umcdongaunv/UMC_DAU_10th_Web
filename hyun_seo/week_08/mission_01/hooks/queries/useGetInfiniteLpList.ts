import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER,
  enabled: boolean
) {
    return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: ({pageParam}) => 
    getLpList({cursor:pageParam, limit, search, order}),
    enabled: enabled,
    initialPageParam: 0, 
    getNextPageParam: (lastPage: any) => {
      return lastPage.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteLpList