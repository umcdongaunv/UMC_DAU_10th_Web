// import { createContext, useContext, useState, type PropsWithChildren } from "react";
// import type { RequestSigninDto } from "../types/auth";
// import { useLocalStorage } from "../hooks/useLocalStorage";
// import { LOCAL_STORAGE_KEY } from "../constants/key";
// import { postLogout, postSignin } from "../apis/auth";


// interface AuthContextType {
//    accessToken: string | null;
//    refreshToken: string | null;
//    login: (signinData: RequestSigninDto) => Promise<void>;
//    logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//    accessToken: null,
//    refreshToken: null,
//    login: async() => {},
//    logout: async() => {},
// })

// export const AuthProvider = ({children}: PropsWithChildren) => {
//    const {
//       getItem: getAccessTokenFromStorage,
//       setItem: setAccessTokeninStorage,
//       removeItem: removeAccessTokenFromStorage,
//    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

//    const {
//       getItem: getRefreshTokenFromStorage,
//       setItem: setRefreshTokenFromStorage,
//       removeItem: removeRefreshTokenFromStorage,
//    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

//    const [accessToken, setAccessToken] = useState<string | null> (
//       getAccessTokenFromStorage(),
//    );
//    const [refreshToken, setRefreshToken] = useState<string | null> (
//       getRefreshTokenFromStorage(),
//    );


// const login = async (signinData: RequestSigninDto) => {
//   try {
//    const {data} = await postSignin(signinData);
//    if (data) {
//       const newAccessToken = data.accessToken;
//       const newRefreshToken = data.refreshToken;

//       setAccessTokeninStorage(newAccessToken);
//       setRefreshTokenFromStorage(newRefreshToken);

//       setAccessToken(newAccessToken);
//       setRefreshToken(newRefreshToken);
//       alert("로그인 성공");

//    }
//   } catch (error){
//    console.error("로그인 오류", error);
//    alert("로그인 실패");
//   }
// }

//    const logout = async() => {
//       try {
//          await postLogout();
//          removeAccessTokenFromStorage();
//          removeRefreshTokenFromStorage();

//          setAccessToken(null);
//          setRefreshToken(null);

//          alert("로그아웃 성공");
//       }catch (error) {
//          console.error("로그아웃 오류", error);
//          alert("로그아웃 실패");
//       }
//    }



//    return (
//       <AuthContext.Provider value = {{accessToken, refreshToken, login, logout}}>
//          {children}
//       </AuthContext.Provider>
//    );
// };

// export const useAuth = () => {
//    const context = useContext(AuthContext);
//    if (!context) {
//       throw new Error("AuthContext를 찾을 수 없습니다.");
//    }
//    return context;
// }

import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;

  isLoggedIn: boolean;
  user: User | null;

  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,

  isLoggedIn: false,
  user: null,

  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokeninStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenFromStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  // user 저장용 localStorage 추가
  const {
    getItem: getUserFromStorage,
    setItem: setUserInStorage,
    removeItem: removeUserFromStorage,
  } = useLocalStorage("user");

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = getUserFromStorage();

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = !!accessToken;

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);
      console.log("로그인 응답 데이터:", data);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokeninStorage(newAccessToken);
        setRefreshTokenFromStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

         const userData = {
         id: data.id,
         name: data.name,
         };

        setUser(userData);

        setUserInStorage(JSON.stringify(userData));

        alert("로그인 성공");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();

      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      removeUserFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      alert("로그아웃 성공");

      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,

        isLoggedIn,
        user,

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};