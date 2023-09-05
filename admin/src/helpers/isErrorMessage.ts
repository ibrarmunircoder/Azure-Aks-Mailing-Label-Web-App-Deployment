import { FormikErrors, getIn } from "formik";

export const isErrorMessage = (
  field: string,
  errors: FormikErrors<unknown>
): string => getIn(errors, field);
