import { useAuthContext } from "context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosClient } from "services";

export const useAxios = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthContext();

  useEffect(() => {
    const requestInterceptor = AxiosClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_FIELD);
        if (!("Authorization" in config.headers) && token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = AxiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          logoutUser();
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AxiosClient.interceptors.request.eject(requestInterceptor);
      AxiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, logoutUser]);

  return AxiosClient;
};
