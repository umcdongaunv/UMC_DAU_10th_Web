import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <h1 className="text-red-600 text-6xl font-black">
        Welcome, {data.data?.name}!
      </h1>
      <button
        onClick={handleLogout}
        className="cursor-pointer mt-10 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all">Log out</button>
    </div>
  );
};