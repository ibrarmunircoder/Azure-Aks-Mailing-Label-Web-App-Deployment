import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { colors } from "utils";

export const InputCheckbox = styled("input")(({ theme }) => ({
  "&:checked + svg": {
    display: "block",
  },
}));

export const CheckboxWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  border: `2px solid ${colors.nebula}`,
  marginRight: "10px",
}));
