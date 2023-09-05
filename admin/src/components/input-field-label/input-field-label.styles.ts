import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { colors, fontsWeight } from "utils";

export const CustomInputFieldLabel = styled(TextField)({
  marginTop: 0,
  marginBottom: "20px",
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
      padding: "17px 20px",
      height: "auto",
      fontSize: "14px",
      color: colors.colorBlack,
      boxShadow: "none",
      outline: "none",
      "&::placeholder": {
        fontWeight: fontsWeight.fontNormal,
        fontSize: "15px",
        lineHeight: "20px",
        opacity: 1,
        color: colors.edward,
      },
      "&.Mui-disabled": {
        "-webkit-text-fill-color": "rgba(15, 23, 42, 0.38)",
      },
    },
    "& .MuiInputBase-input[type=number]::-webkit-inner-spin-button, .MuiInputBase-input[type=number]::-webkit-inner-spin-button":
      {
        webkitAppearance: "none",
        mozAppearance: "none",
        appearance: "none",
        margin: 0,
      },
  },
  "& .MuiFormLabel-root": {
    fontWeight: fontsWeight.fontMedium,
    fontSize: "15px",
    lineHeight: "20px",
    opacity: 1,
    color: colors.colorBlack,
    display: "block",
    paddingLeft: "8px",
    transition: "display 0.2s linear",
    transform: "translate(-9px, -24px)",
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: colors.colorBlack,
  },
  "& .MuiFormLabel-root.MuiFormLabel-filled": {
    color: colors.colorBlack,
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
});
