import axios from "axios";

export const AxiosClient = axios.create({
  baseURL: process.env.REACT_APP_MAILING_BACKEND,
});
