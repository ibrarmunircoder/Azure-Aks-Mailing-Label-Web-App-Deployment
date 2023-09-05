import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import { colors } from "utils";

const dimensionStyle = {
  width: "13.46px",
  height: "17px",
};

export const ColumnSortedDescendingIcon = () => (
  <Box display="flex" flexDirection="column">
    <ArrowDropDownIcon
      sx={{
        color: colors.mediumDarkGray,
        transform: "translateY(5px)",
        ...dimensionStyle,
      }}
    />
    <ArrowDropUpIcon
      sx={{
        color: colors.mediumDarkGray,
        transform: "translateY(-5px)",
        ...dimensionStyle,
      }}
    />
  </Box>
);
