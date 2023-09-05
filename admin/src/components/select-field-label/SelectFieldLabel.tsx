import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  CustomFormControl,
  CustomSelect,
} from "components/select-field-label/select-field-label.styles";
import React, { FunctionComponent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "utils";
import { SxProps } from "@mui/material";

interface ISelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | number | string[];
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  sx?: SxProps;
  disabled?: boolean;
  multiple?: boolean;
  size?: "small" | "medium";
  variant: "standard" | "outlined" | "filled";
  renderValue?: (value: any) => React.ReactNode;
  onChange?:
    | ((
        event: SelectChangeEvent<any>,
        child: React.ReactNode
      ) => void | Promise<void>)
    | undefined;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export const SelectFieldLabel: FunctionComponent<ISelectFieldProps> = ({
  id,
  name,
  label,
  placeholder,
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
  renderValue,
  multiple = false,
  sx,
}): React.ReactElement => {
  return (
    <CustomFormControl
      variant={variant}
      error={error}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      sx={sx}
    >
      <InputLabel shrink={true} id={id}>
        {label}
      </InputLabel>
      <CustomSelect
        multiple={multiple}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              marginTop: "8px",
              maxHeight: 250,
              border: `1px solid ${colors.nebula}`,
              borderRadius: "0",
            },
          },
        }}
        IconComponent={(props: any) => (
          <ExpandMoreIcon
            sx={{
              color: `${colors.nebula} !important`,
              opacity: `1 !important`,
            }}
            {...props}
          />
        )}
        labelId={id}
        id={id}
        placeholder={placeholder}
        name={name}
        value={value}
        label={label}
        renderValue={renderValue}
        onChange={onChange}
        onBlur={onBlur}
      >
        {children}
      </CustomSelect>
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </CustomFormControl>
  );
};
