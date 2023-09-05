import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { colors, fontsWeight } from "utils";
import { useSidebar } from "hooks";
import { SidebarTypeEnum } from "hooks/useSidebar";
import AddIcon from "@mui/icons-material/Add";
import { useUsersPagination } from "views/users/hooks";
import { StyledDataGrid } from "views/users/users.styles";
import { SelectField } from "components/select-field/SelectField";
import {
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridRowCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { SelectChangeEvent } from "@mui/material";
import {
  ColumnSortedAscendingIcon,
  ColumnSortedDescendingIcon,
} from "components";
import { useNavigate } from "react-router-dom";

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const pageCount = Math.ceil(rowCount / pageSize);

  const handlePageSize = async (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const pageSize = event.target.value as string;
    // @ts-expect-error
    apiRef.current.setPageSize(pageSize);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      marginTop="2px"
      alignItems="center"
      gap={{ xs: "10px", md: "30px" }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={{ xs: "10px", md: "30px" }}
      >
        <Typography
          sx={{ display: { xs: "none", sm: "block" }, fontSize: "13px" }}
        >
          Rows Per Page: {pageSize}
        </Typography>
        <SelectField
          value={pageSize}
          variant="standard"
          size="small"
          onChange={handlePageSize}
          sx={{
            minWidth: "80px !important",
          }}
        >
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
          <MenuItem value="ALL">ALL</MenuItem>
        </SelectField>
      </Box>
      <Pagination
        color="primary"
        page={page + 1}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event: React.ChangeEvent<unknown>, value: number) =>
          apiRef.current.setPage(value - 1)
        }
        sx={{
          "& .MuiPaginationItem-root": {
            color: colors.mediumDarkGray,
            "&.Mui-selected": {
              background: "transparent",
              color: colors.lochinvar,
            },
            "&.Mui-selected:hover": {
              background: "transparent",
            },
          },
        }}
      />
    </Box>
  );
}

export const Users = () => {
  const navigate = useNavigate();
  const sidebarStore = useSidebar();
  const {
    columns,
    paginationModel,
    rowCount,
    rows,
    setPaginationModel,
    onSortChange,
  } = useUsersPagination();
  return (
    <Box
      sx={{
        background: colors.nebula,
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "1200px",
          maxWidth: "100%",
          margin: "0 auto",
          background: colors.colorWhite,
          boxShadow: "0px 4px 100px rgba(18, 29, 71, 0.04)",
          padding: "62px 40px",
        }}
      >
        <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
          <Box
            sx={{
              cursor: "pointer",
              transform: "translateY(-30px)",
            }}
          >
            <MenuIcon
              onClick={() => sidebarStore.onOpen(SidebarTypeEnum.NAVIGATION)}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={{ xs: "20px 20px", md: "0 20px" }}
            marginBottom="20px"
          >
            <Typography
              component="div"
              sx={{
                fontWeight: fontsWeight.fontNormal,
                fontSize: "40px",
                lineHeight: "40px",
              }}
            >
              Users
            </Typography>
            <Button
              onClick={() => navigate("/create-user")}
              sx={{
                width: "188px",
                height: "50px",
                borderRadius: 0,
                textTransform: "unset",
                backgroundColor: "transparent",
                color: colors.lochinvar,
                fontWeight: fontsWeight.fontNormal,
                fontSize: "16px",
                lineHeight: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                "&.MuiButton-outlined": {
                  border: `1px solid ${colors.lochinvar}`,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              variant="outlined"
            >
              <AddIcon
                sx={{
                  transform: "translateY(-2px)",
                  color: colors.lochinvar,
                  strokeWidth: 1,
                  fontSize: "20px",
                }}
              />
              <span>Add User</span>
            </Button>
          </Box>
          <div style={{ height: 500, width: "100%" }}>
            <StyledDataGrid
              getRowId={(row) => row.id}
              rows={rows}
              rowCount={rowCount}
              loading={!Boolean(rows.length)}
              columns={columns}
              pageSizeOptions={[10, 30, 100]}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowHeight={() => "auto"}
              filterMode="server"
              sortingMode="server"
              onSortModelChange={onSortChange}
              slots={{
                columnSortedAscendingIcon: ColumnSortedAscendingIcon,
                columnSortedDescendingIcon: ColumnSortedDescendingIcon,
                pagination: CustomPagination,
                noRowsOverlay: () => (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    No Data
                  </Stack>
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};
