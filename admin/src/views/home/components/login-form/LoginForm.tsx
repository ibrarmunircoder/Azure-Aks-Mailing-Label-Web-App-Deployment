import { useState } from "react";
import { InputField } from "components";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { isError, isErrorMessage } from "helpers";
import { useLoginFormSchema, useSubmit } from "views/home/hooks";
import Button from "@mui/material/Button";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginFormSchema = useLoginFormSchema();
  const { initialValues, onSubmit } = useSubmit();

  const {
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    isValid,
    isSubmitting,
    dirty,
  } = useFormik({
    initialValues,
    validationSchema: loginFormSchema,
    onSubmit,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      component="form"
      sx={{
        padding: { xs: "0 30px", md: "0 40px" },
      }}
      onSubmit={handleSubmit}
    >
      <InputField
        fullWidth
        label="Email"
        variant="outlined"
        helperText={isErrorMessage("email", errors)}
        error={isError("email", errors, touched)}
        {...getFieldProps("email")}
      />

      <InputField
        fullWidth
        type={showPassword ? "text" : "password"}
        label="Password"
        variant="outlined"
        helperText={isErrorMessage("password", errors)}
        error={isError("password", errors, touched)}
        {...getFieldProps("password")}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                sx={{ marginRight: "1px" }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ marginBottom: { xs: "13px", md: "28px" } }}
        disabled={!(isValid && dirty) || isSubmitting}
      >
        Submit
      </Button>
    </Box>
  );
};
