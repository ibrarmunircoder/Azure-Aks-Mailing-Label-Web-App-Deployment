import { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as LogoSvgIcon } from "components/icons/logo.svg";

export const LogoIcon = (props: SvgIconProps): React.ReactElement => {
  return <LogoSvgIcon {...props} />;
};
