import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as SearchSvgIcon } from "components/icons/search.svg";

export const SearchIcon = (props: SvgIconProps): React.ReactElement => {
  return (
    <SvgIcon viewBox="0 0 15 20" {...props}>
      <SearchSvgIcon />
    </SvgIcon>
  );
};
