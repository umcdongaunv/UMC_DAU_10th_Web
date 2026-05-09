import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpDetail = (lpid?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpid],

    queryFn: () => getLpDetail(lpid!),

    enabled: !!lpid, // lpid 없으면 호출 안 함

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};