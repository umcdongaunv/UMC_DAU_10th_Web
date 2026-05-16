import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpDetail = (lpid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.lp, String(lpid)],

    queryFn: () => getLpDetail(lpid!),

    enabled: !!lpid,

    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });
};