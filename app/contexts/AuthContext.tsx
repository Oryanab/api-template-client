import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";
import { AuthProps } from "../../types";
import axios from "axios";

const JWT_TOKEN = process.env.JWT_TOKEN;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authStart, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const register = async (email: string, password: string) => {
    try {
      return;
    } catch (e) {}
  };

  const value = {};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
