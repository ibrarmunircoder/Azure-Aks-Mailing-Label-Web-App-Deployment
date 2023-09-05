import { User } from "interfaces";

export interface AuthInterface {
  isAuthenticated: boolean;
  authenticateUser: (token: string) => void;
  logoutUser: () => void;
  getUser: () => User | undefined;
}

export const defaultAuthContext: AuthInterface = {
  isAuthenticated: false,
  getUser: () => undefined,
  authenticateUser: () => {},
  logoutUser: () => {},
};
