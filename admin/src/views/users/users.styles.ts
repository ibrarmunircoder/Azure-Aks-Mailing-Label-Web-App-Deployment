import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { colors, fontsWeight } from "utils";

export const StyledDataGrid = styled(DataGrid)((theme) => ({
  border: 0,
  "& > .MuiDataGrid-main": {
    "&>.MuiDataGrid-columnHeaders": {
      borderBottom: "1px solid #F5F5F5",
      fontWeight: fontsWeight.fontMedium,
      fontSize: "15px",
      lineHeight: "16px",
      fontFamily: "KeplerStdRegular",
      color: colors.edward,
    },

    "& div div div div > .MuiDataGrid-cell": {
      borderBottom: "none",
    },
  },

  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #F5F5F5",
    "& .MuiDataGrid-cell": {
      wordWrap: "break-word !important",
      whiteSpace: "normal !important",
      padding: "10px",
      fontWeight: fontsWeight.fontMedium,
      fontSize: "15px",
      lineHeight: "18px",
      fontFamily: "KeplerStdRegular",
      color: colors.edward,
    },
    "&.Mui-selected .MuiDataGrid-cell": {
      color: `${colors.colorBlack} !important`,
    },
  },

  "& .MuiDataGrid-sortIcon": {
    color: "white",
  },
  "& .MuiDataGrid-menuIconButton": {
    color: "white",
  },

  "& .MuiDataGrid-iconButtonContainer": {
    visibility: "visible !important",
  },
  "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
    width: "15px",
  },
  "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
    background: colors.colorWhite,
  },
  "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
    backgroundColor: colors.gray,
    borderRadius: "10px",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "flex",
    justifyContent: "center",
    border: "none",
  },
}));
