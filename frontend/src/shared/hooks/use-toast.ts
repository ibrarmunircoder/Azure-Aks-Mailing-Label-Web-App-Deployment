import { toast, ToastOptions } from "react-hot-toast";
import { useMemo } from "react";

export const useToast = () => {
  return useMemo(
    () => ({
      success: (message: string, toastOptions?: ToastOptions) => {
        return toast.success(message, {
          ...toastOptions,
        });
      },
      error: (message: string, toastOptions?: ToastOptions) => {
        return toast.error(message, {
          ...toastOptions,
        });
      },
    }),
    []
  );
};
