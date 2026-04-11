import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfoDto } from '../types/auth';

export const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white gap-4">
      <h1 className="text-red-600 text-5xl font-black">
        Welcome, {data.data.name}!
      </h1>
      <p className="text-gray-400">{data.data.email}</p>
    </div>
  );
};
