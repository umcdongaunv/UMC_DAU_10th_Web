import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    getData();
  }, [navigate]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black overflow-hidden">
      <h1 className="text-red-600 text-4xl md:text-6xl font-black text-center">
        Welcome, {data.data?.name}!
      </h1>
    </div>
  );
};