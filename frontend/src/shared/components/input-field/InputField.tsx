import { CustomTextField } from "shared/components/input-field/input-field.styles";
import { TextFieldProps } from "@mui/material";
import { FunctionComponent } from "react";

export const InputField: FunctionComponent<TextFieldProps> = ({
  id,
  name,
  type,
  value,
  label,
  onChange,
  onReset,
  onBlur,
  error,
  helperText,
  placeholder,
  fullWidth,
  disabled,
  size = "medium",
  ...rest
}) => {
  return (
    <CustomTextField
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      value={value}
      helperText={error && helperText}
      error={error}
      fullWidth={fullWidth}
      onChange={onChange}
      onReset={onReset}
      onBlur={onBlur}
      id={id}
      size={size}
      disabled={disabled}
      {...rest}
    />
  );
};
