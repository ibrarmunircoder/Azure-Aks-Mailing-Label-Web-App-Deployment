import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as DownloadIconSvg } from "components/icons/download.svg";

export const DownloadIcon = (props: SvgIconProps): React.ReactElement => {
  return (
    <SvgIcon viewBox="0 0 15 20" {...props}>
      <DownloadIconSvg />
    </SvgIcon>
  );
};
