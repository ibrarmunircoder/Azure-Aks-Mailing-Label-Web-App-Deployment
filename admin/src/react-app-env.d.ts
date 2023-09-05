/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PUBLIC_URL: string;
    REACT_APP_TOKEN_FIELD: string;
    REACT_APP_USER_FIELD: string;
    REACT_APP_REDUX_STATE_FIELD: string;
    REACT_APP_BACKEND_URL: string;
  }
}
