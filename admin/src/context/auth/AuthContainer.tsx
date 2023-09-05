import { useState, useContext, FC, useCallback } from "react";
import { AuthContext, AuthProvider } from "context/auth/AuthContext";
import { AuthInterface, defaultAuthContext } from "context/auth/AuthInterface";
import { User } from "interfaces";
import jwt_decode from "jwt-decode";

interface IAppContextContainerProps {
  children: React.ReactNode;
}
export const AuthContextContainer: FC<IAppContextContainerProps> = ({
  children,
}) => {
  const [state, setState] = useState<AuthInterface>(() => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_FIELD);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && Object.values(user).length) {
      return {
        ...defaultAuthContext,
        isAuthenticated: true,
      };
    }

    return defaultAuthContext;
  });

  const decodeJwt = useCallback((token: string) => {
    const decoded: any = jwt_decode(token, { header: false });
    const { iat, exp, ...user } = decoded;
    return user as User;
  }, []);

  const authenticateUser = useCallback(
    (token: string) => {
      const user = decodeJwt(token);
      localStorage.setItem(process.env.REACT_APP_TOKEN_FIELD, token);
      localStorage.setItem("user", JSON.stringify(user));
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
      }));
    },
    [decodeJwt]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem(process.env.REACT_APP_TOKEN_FIELD);
    localStorage.removeItem("user");
    setState((prevState) => ({
      ...prevState,
      isAuthenticated: false,
    }));
  }, []);

  const getUser = useCallback(
    (): User => JSON.parse(localStorage.getItem("user") || ""),
    []
  );

  return (
    <AuthProvider
      value={{
        isAuthenticated: state.isAuthenticated,
        authenticateUser,
        logoutUser,
        getUser,
      }}
    >
      {children}
    </AuthProvider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
