import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";

import { LOCAL_STORAGE_KEY } from "../constants/key";

import { postLogout } from "../apis/auth";

interface User {
  id: number;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;

  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;

  isLoggedIn: boolean;

  setAuth: (data: any) => void;

  clearAuth: () => void;
}

export const AuthContext =
  createContext<AuthContextType>({
  user: null,

  setUser: () => {},

  isLoggedIn: false,

  setAuth: () => {},

  clearAuth: () => {},
});


export const AuthProvider = ({
  children,
}: PropsWithChildren) => {

  const {
    getItem: getAccessTokenFromStorage,

    setItem: setAccessTokenInStorage,

    removeItem:
      removeAccessTokenFromStorage,
  } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );

  const {
    getItem: getRefreshTokenFromStorage,

    setItem:
      setRefreshTokenFromStorage,

    removeItem:
      removeRefreshTokenFromStorage,
  } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  const {
    getItem: getUserFromStorage,

    setItem: setUserInStorage,

    removeItem: removeUserFromStorage,
  } = useLocalStorage("user");

  const [accessToken, setAccessToken] =
    useState<string | null>(
      getAccessTokenFromStorage()
    );

  const [refreshToken, setRefreshToken] =
    useState<string | null>(
      getRefreshTokenFromStorage()
    );

  const [user, setUser] =
    useState<User | null>(() => {
      const savedUser =
        getUserFromStorage();

      return savedUser ?? null;
    });

  const isLoggedIn =
    !!accessToken ||
    !!getAccessTokenFromStorage();

  const setAuth = (data: any) => {

    const newAccessToken =
      data.accessToken;

    const newRefreshToken =
      data.refreshToken;

    setAccessTokenInStorage(
      newAccessToken
    );

    setRefreshTokenFromStorage(
      newRefreshToken
    );

    setAccessToken(newAccessToken);

    setRefreshToken(newRefreshToken);

    const userData = {
      id: data.id,
      name: data.name,
      avatar: data.avatar,
    };

    setUser(userData);

    setUserInStorage(userData);
  };

  const clearAuth = () => {

  removeAccessTokenFromStorage();

  removeRefreshTokenFromStorage();

  removeUserFromStorage();

  setAccessToken(null);

  setRefreshToken(null);

  setUser(null);
};

  const logout = async () => {
  try {
    await postLogout();

    clearAuth();

    alert("로그아웃 성공");

  } catch (error) {
    console.error(
      "로그아웃 오류",
      error
    );

    alert("로그아웃 실패");
  }
};

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        setAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "AuthContext를 찾을 수 없습니다."
    );
  }

  return context;
};