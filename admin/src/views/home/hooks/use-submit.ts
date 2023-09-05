import { useAuthContext } from "context";
import { FormikHelpers } from "formik";
import { AxiosClient } from "services";
import { ILoginInitialValues, ITokens } from "views/home/interfaces";
import { useToast } from "hooks";
import { transformError } from "helpers";

const initialValues: ILoginInitialValues = {
  email: "",
  password: "",
};

export const useSubmit = () => {
  const toast = useToast();
  const { authenticateUser } = useAuthContext();
  const onSubmit = async (
    values: ILoginInitialValues,
    actions: FormikHelpers<ILoginInitialValues>
  ) => {
    try {
      const result = await AxiosClient.post<ITokens>("auth/login", values);
      authenticateUser(result.data.access_token);
    } catch (err) {
      toast.error(transformError(err).message);
      actions.setSubmitting(false);
    }
  };

  return {
    initialValues,
    onSubmit,
  };
};
