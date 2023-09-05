import { TextFieldProps } from "@mui/material";
import { CustomInputFieldLabel } from "components/input-field-label/input-field-label.styles";

export const InputFieldLabel: React.FC<TextFieldProps> = ({
  error,
  helperText,
  ...rest
}) => {
  return (
    <CustomInputFieldLabel
      {...rest}
      error={error}
      helperText={error && helperText}
      InputLabelProps={{ shrink: true }}
    />
  );
};
