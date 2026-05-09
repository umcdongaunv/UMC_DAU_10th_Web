import { useQuery } from "@tanstack/react-query";

import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

function useGetLpList(
  limit: number,
  search: string,
  order: typeof PAGINATION_ORDER,
  cursor?: number,
  sort?: string,
) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, sort],

    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
        sort,
      }),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    select: (data) => data.data.data,
  });
}

export default useGetLpList;