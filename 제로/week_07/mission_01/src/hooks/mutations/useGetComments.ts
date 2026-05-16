import { useQuery } from "@tanstack/react-query";

import { getComments } from "../../apis/comment";

import { QUERY_KEY } from "../../constants/key";

const useGetComments = (
  lpid: number
) => {
  return useQuery({
    queryKey: [
      QUERY_KEY.comments,
      lpid,
    ],

    queryFn: () =>
      getComments(lpid),
  });
};

export default useGetComments;