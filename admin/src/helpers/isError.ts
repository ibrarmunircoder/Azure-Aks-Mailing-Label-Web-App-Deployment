import { FormikErrors, FormikTouched, getIn } from "formik";
import { isErrorMessage } from "helpers";

export const isError = (
  field: string,
  errros: FormikErrors<unknown>,
  touched: FormikTouched<unknown>
): boolean => getIn(touched, field) && Boolean(isErrorMessage(field, errros));
