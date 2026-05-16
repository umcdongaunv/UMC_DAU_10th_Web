import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const MyPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (!storedToken) {
      navigate("/login");
      return;
    }

    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error(error);
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
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