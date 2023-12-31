import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { colors, fontsWeight } from "utils";

export const CustomFormControl = styled(FormControl)(() => ({
  marginTop: 0,
  marginBottom: "20px",
  minWidth: "150px",
  "& .checkbox-custom": {
    display: "none",
  },
  "& .MuiOutlinedInput-root": {
    marginTop: 0,
    border: `1px solid ${colors.lightMediumGray}`,
    height: "50px",
    borderRadius: 0,
    // paddingLeft: "8px",
    backgroundColor: colors.colorWhite,
    "&.Mui-focused": {
      border: `1px solid ${colors.lochinvar} !important`,
    },
    "&.Mui-error": {
      border: `1px solid ${colors.lightRed} !important`,
    },
    "&.Mui-disabled": {
      backgroundColor: colors.lightGray,
    },
    "&.Mui-disabled fieldset": {
      borderColor: "rgba(15, 23, 42, 0.26)",
    },
    "& fieldset": {
      border: "none",
    },
    "& .MuiInputBase-input": {
      padding: "16px 20px",
      paddingRight: "10px",
      height: "auto",
      fontSize: "14px",
      lineHeight: "24px",
      color: colors.colorBlack,
      "&.Mui-disabled": {
        "-webkit-text-fill-color": "rgba(15, 23, 42, 0.38)",
      },
    },
  },
  "& .MuiFormLabel-root": {
    paddingLeft: "8px",
    fontWeight: fontsWeight.fontMedium,
    fontSize: "14px",
    lineHeight: "24px",
    color: colors.mediumDarkGray,
    opacity: 1,
    transform: "translate(12px, 13px) scale(1)",
  },
  "& .MuiFormLabel-root.Mui-focused": {
    transform: "translate(12px, 13px) scale(1)",
    color: colors.mediumDarkGray,
  },
  "& .MuiFormLabel-root.MuiFormLabel-filled": {
    display: "none",
  },
  "& legend": {
    maxWidth: 0,
  },
  "& .MuiFormLabel-root.Mui-error": {
    color: colors.error,
  },
  "& .MuiFormHelperText-root": {
    marginTop: "5px",
    marginLeft: "2px",
    fontWeight: 500,
    fontSize: "14px",
    color: `${colors.error} !important`,
  },
}));

export const CustomSelect = styled(Select)(() => ({
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#64748B",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.primary,
  },
  "& .MuiSelect-icon": {
    color: colors.colorBlack,
  },
}));
