import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import { colors } from "utils";

const dimensionStyle = {
  width: "13.46px",
  height: "18px",
};

export const ColumnSortedAscendingIcon = () => (
  <Box display="flex" flexDirection="column">
    <ArrowDropUpIcon
      sx={{
        color: colors.mediumDarkGray,
        transform: "translateY(6px)",
        ...dimensionStyle,
      }}
    />
    <ArrowDropDownIcon
      sx={{
        color: colors.mediumDarkGray,
        transform: "translateY(-6px)",
        ...dimensionStyle,
      }}
    />
  </Box>
);
