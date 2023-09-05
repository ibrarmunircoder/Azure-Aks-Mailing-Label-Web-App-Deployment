import { useAuthContext } from "context";
import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
  const { isAuthenticated, getUser } = useAuthContext();

  return isAuthenticated && getUser() ? <Outlet /> : <Navigate to="/" />;
};
