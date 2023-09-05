import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  CustomeFormControl,
  CustomeSelect,
} from "shared/components/select-field/select-field.styles";
import React, { FunctionComponent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "styles/vars";

interface ISelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  size?: "small" | "medium";
  variant: "standard" | "outlined" | "filled";
  onChange?:
    | ((
        event: SelectChangeEvent<unknown>,
        child: React.ReactNode
      ) => void | Promise<void>)
    | undefined;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export const SelectField: FunctionComponent<ISelectFieldProps> = ({
  id,
  name,
  label,
  onChange,
  onBlur,
  value,
  children,
  error,
  helperText,
  variant,
  fullWidth,
  disabled = false,
  size = "medium",
}): React.ReactElement => {
  return (
    <CustomeFormControl
      variant={variant}
      error={error}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <CustomeSelect
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 250,
            },
          },
        }}
        IconComponent={(props) => (
          <ExpandMoreIcon
            sx={{
              color: `${colors.darkGray} !important`,
              opacity: `1 !important`,
            }}
            {...props}
          />
        )}
        labelId={id}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
      >
        {children}
      </CustomeSelect>
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </CustomeFormControl>
  );
};
