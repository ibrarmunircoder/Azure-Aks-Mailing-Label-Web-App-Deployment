import { UserRoleEnum } from "enums";
import * as Yup from "yup";

const validateAssignedBrands = (
  value: (number | undefined)[] | undefined,
  context: Yup.TestContext
) => {
  if (value?.length === 0 && context.parent.role === UserRoleEnum.USER) {
    return false;
  }
  return true;
};

export const useCreateUserValidationSchema = () => {
  return Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required!")
      .max(14, "First Name must be equal or less than 14 characters")
      .matches(/^[a-zA-Z0-9\s]+$/, "Special characters are not allowed"),
    lastName: Yup.string()
      .required("Last name is required!")
      .max(14, "Last Name must be equal or less than 14 characters")
      .matches(/^[a-zA-Z0-9\s]+$/, "Special characters are not allowed"),
    email: Yup.string()
      .required("Email is required!")
      .email("Enter a valid email address!"),
    password: Yup.string().required("Password is required!"),
    role: Yup.string().required("Role is required!"),
    assignedBrands: Yup.array()
      .of(Yup.number())
      .test(
        "assignedBrands",
        "Please select at least one brand",
        validateAssignedBrands
      ),
  });
};
