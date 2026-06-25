import { jwtDecode, JwtPayload } from "jwt-decode";

export const decodeAuthToken = <T = JwtPayload>(token: string): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

