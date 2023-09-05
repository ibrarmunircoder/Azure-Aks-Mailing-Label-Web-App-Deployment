import * as Yup from "yup";

export const useIframeValidationSchema = () => {
  return Yup.object().shape({
    width: Yup.string().required("Width is required"),
    height: Yup.string().required("Height is required"),
    borderWidth: Yup.string().required("Border Width is required"),
    url: Yup.string().required("Url is required"),
  });
};
