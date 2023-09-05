import { useAuthContext } from "context";
import { Navigate, Outlet } from "react-router-dom";

export const AuthRedirect = () => {
  const { isAuthenticated, getUser } = useAuthContext();

  return isAuthenticated && getUser() ? (
    <Navigate to="/addresses" />
  ) : (
    <Outlet />
  );
};
