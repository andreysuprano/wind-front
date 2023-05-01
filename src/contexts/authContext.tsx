import React, { createContext, ReactNode, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";

interface UserContextProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user?: IUser;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export interface IUser {
  avatar: string;
  name: string;
  userType: string;
  username: string;
  sub: string | undefined;
}

export const UserContext = createContext({} as UserContextType);

function AuthContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<IUser>();
  const router = useRouter();

  const validUser = async () => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      try {
        const decoded = jwt.decode(token) as IUser;
        if (decoded) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  useEffect(() => {
    validUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthContextProvider;
