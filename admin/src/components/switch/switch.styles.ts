import { styled } from "@mui/material/styles";
import { colors } from "utils";

export const SwitchWrapper = styled("div")<{ disabled: boolean }>(
  ({ theme, disabled }) => ({
    width: "49px",
    height: "27px",
    position: "relative",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.2 : 1,
    pointerEvents: disabled ? "none" : "all",
  })
);

export const SwitchSlider = styled("div")<{ checked: boolean }>(
  ({ theme, checked }) => ({
    width: "100%",
    height: "100%",
    backgroundColor: colors.colorWhite,
    transition: ".4s",
    borderRadius: "30px",
    border: `1px solid ${colors.nebula}`,

    "&:before": {
      content: `""`,
      position: "absolute",
      width: "15px",
      height: "15px",
      borderRadius: "100%",
      left: "8px",
      top: "6px",
      transform: checked ? "translateX(18px)" : "translateX(0)",
      background: checked ? colors.lochinvar : colors.opal,
    },
  })
);
