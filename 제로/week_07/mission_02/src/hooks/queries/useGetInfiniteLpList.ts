import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";
import { useInfiniteQuery } from "@tanstack/react-query";

function useGetInfiniteLpList(
    limit: number, search: string, order: PAGINATION_ORDER  // ← typeof 제거
) {
   return useInfiniteQuery({
      queryFn: ({ pageParam }) => getLpList({ cursor: pageParam, limit, search, order }),
      queryKey: [QUERY_KEY.lps, search, order],
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
      }
   });
}

export default useGetInfiniteLpList;