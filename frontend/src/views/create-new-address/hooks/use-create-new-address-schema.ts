import * as Yup from "yup";

export const useCreateNewAddressSchema = () => {
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
    addressLine1: Yup.string()
      .required("Address Line 1 is required!")
      .max(32, "Address Line must be equal or less than 32 characters"),
    addressLine2: Yup.string().max(
      32,
      "Address Line 2 must be equal or less than 32 characters"
    ),
    city: Yup.string().required("City is required!"),
    state: Yup.string()
      .required("State is required!")
      .length(2, "Enter the two digits state code"),
    zipcode: Yup.string()
      .required("Zipcode is required!")
      .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, {
        message: "Zip code is not valid",
      }),
  });
};
