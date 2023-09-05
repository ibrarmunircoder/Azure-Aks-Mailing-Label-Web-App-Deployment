import { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as DatePickerSvgIcon } from "components/icons/date-picker.svg";

export const DatePickerIcon = (props: SvgIconProps): React.ReactElement => {
  return <DatePickerSvgIcon {...props} />;
};
