import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { colors, fontsWeight } from "styles/vars";

export const CustomTextField = styled(TextField)({
  marginTop: 0,
  marginBottom: "20px",
  "& .MuiOutlinedInput-root": {
    marginTop: 0,
    border: `1px solid ${colors.lightMediumGray}`,
    height: "56px",
    borderRadius: "4px",
    // paddingLeft: "8px",
    backgroundColor: colors.colorWhite,
    "&.Mui-focused": {
      border: `1px solid ${colors.lightRed} !important`,
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
      height: "auto",
      fontSize: "14px",
      color: colors.colorBlack,
      boxShadow: "none",
      outline: "none",
      "&::placeholder": {
        fontWeight: fontsWeight.fontMedium,
        fontSize: "14px",
        lineHeight: "24px",
        opacity: 1,
        color: colors.mediumDarkGray,
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
    fontSize: "14px",
    lineHeight: "24px",
    opacity: 1,
    color: colors.mediumDarkGray,
    display: "block",
    paddingLeft: "6px",
    transition: "display 0.2s linear",
  },
  "& .MuiFormLabel-root.Mui-focused": {
    display: "none",
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
});
