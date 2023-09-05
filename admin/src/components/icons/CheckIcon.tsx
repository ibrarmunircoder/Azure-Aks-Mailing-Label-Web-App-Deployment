import { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as CheckIconSvg } from "components/icons/check.svg";

export const CheckIcon = (props: SvgIconProps): React.ReactElement => {
  return <CheckIconSvg {...props} />;
};
