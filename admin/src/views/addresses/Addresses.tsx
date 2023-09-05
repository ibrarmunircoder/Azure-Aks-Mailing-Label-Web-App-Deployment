import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridRowCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useAddressPagination } from "views/addresses/hooks";
import {
  Checkbox,
  ColumnSortedAscendingIcon,
  ColumnSortedDescendingIcon,
  InputField,
  LogoIcon,
  RBAC,
  SearchIcon,
} from "components";
import { StyledDataGrid } from "views/addresses/addresses.styles";
import { colors, fontsWeight } from "utils";
import { SelectField } from "components/select-field/SelectField";
import { SelectChangeEvent } from "@mui/material/Select";
import { ListItemText } from "@mui/material";
import USData from "data/us-states.json";
import { OrderEnum, UserRoleEnum } from "enums";
import DatePicker from "react-datepicker";
import { useAuthContext } from "context";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebar } from "hooks";
import { SidebarTypeEnum } from "hooks/useSidebar";
// import { TrackDetailModal } from './components/track-detail-modal/TrackDetailModal';

const programTypes = [
  "Mail Back-Brand Supported",
  "Mail Back-Customer Supported",
];

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

const ButtonStyles = {
  width: "188px",
  height: "50px",
  background: colors.lochinvar,
  color: colors.colorWhite,
  borderRadius: 0,
  fontWeight: fontsWeight.fontMedium,
  fontSize: "16px",
  lineHeight: "24px",
  outline: "none",
  border: "none",
  textTransform: "capitalize",
  "&.Mui-disabled,&.Mui-disabled:hover ": {
    background: colors.lightMediumGray,
    pointerEvents: "all",
    cursor: "progress",
  },
  "&:hover": {
    background: colors.lochinvar,
    border: "none",
  },
};

export const Addresses = () => {
  const {
    isLoading,
    rowCount,
    rows,
    setPaginationModel,
    paginationModel,
    columns,
    onSortChange,
    handleSearchTerm,
    onRowSelectionModelChange,
    handleBulkDownload,
    handleBrandSelections,
    handleSortChange,
    sort,
    handleStateChange,
    handleDateChange,
    startDate,
    endDate,
    state,
    selectedBrands,
    brands,
    selectAllBrandOption,
    handleProgramTypeChange,
    programType,
    // isOpen,
    // handleClose,
    // selectedTrackId,
  } = useAddressPagination();
  const { logoutUser } = useAuthContext();
  const sidebarStore = useSidebar();

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    logoutUser();
  };

  const statesElement = USData.map(({ state_code, name }, index) => (
    <MenuItem key={index} value={state_code}>
      {name}
    </MenuItem>
  ));

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
        <CardContent>
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: { xs: "20px 20px", md: "0 20px" },
              marginBottom: "20px",
            }}
          >
            <Box>
              <RBAC allowedRoles={[UserRoleEnum.SUPER_ADMIN]}>
                <MenuIcon
                  onClick={() =>
                    sidebarStore.onOpen(SidebarTypeEnum.NAVIGATION)
                  }
                />
              </RBAC>
            </Box>

            <LogoIcon />
            <Button
              onClick={handleLogout}
              sx={{
                ...ButtonStyles,
              }}
              variant="outlined"
            >
              Logout
            </Button>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
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
              Filters
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap={{ xs: "wrap", lg: "nowrap" }}
            marginBottom="20px"
            gap={{ xs: "20px" }}
          >
            <Box
              display="flex"
              gap={{ xs: "20px 20px", md: "0 20px" }}
              flexWrap={{ xs: "wrap", lg: "nowrap" }}
            >
              <InputField
                sx={{
                  width: { xs: "200px" },
                  marginBottom: 0,
                }}
                placeholder="Search"
                id="search-term"
                variant="outlined"
                onChange={handleSearchTerm}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        color: colors.mediumDarkGray,
                        width: "17px",
                        height: "17px",
                        marginRight: "-10px",
                      }}
                    />
                  ),
                }}
              />
              <SelectField
                onChange={handleBrandSelections}
                sx={{
                  width: { xs: "160px" },
                  marginBottom: 0,
                }}
                multiple
                value={
                  selectAllBrandOption && selectedBrands?.length
                    ? selectedBrands.concat(["select-all"])
                    : selectedBrands
                }
                label="Member"
                renderValue={(selected) =>
                  brands
                    .filter((brand) => selected.includes(brand.id))
                    .map((brand) => brand.name)
                    .join(", ")
                }
                variant="outlined"
              >
                <MenuItem
                  key="select-all"
                  value="select-all"
                  sx={{
                    "&.MuiMenuItem-root": {
                      background: "transparent",
                    },
                  }}
                >
                  <Checkbox checked={selectAllBrandOption} />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {brands.map(({ id, name }) => (
                  <MenuItem
                    key={id}
                    value={id}
                    sx={{
                      "&.MuiMenuItem-root": {
                        background: "transparent",
                      },
                    }}
                  >
                    <Checkbox checked={selectedBrands.indexOf(id) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </SelectField>
              <SelectField
                onChange={handleStateChange}
                value={state}
                label="State"
                variant="outlined"
                sx={{
                  width: { xs: "160px" },
                  marginBottom: 0,
                }}
              >
                <MenuItem sx={{ color: colors.edward }} value="">
                  Select
                </MenuItem>
                {statesElement}
              </SelectField>

              <DatePicker
                wrapperClassName="date-picker"
                calendarClassName="date-picker-calendar"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                placeholderText="Date Range"
              />
              <SelectField
                onChange={handleProgramTypeChange}
                value={programType}
                label="Program Type"
                variant="outlined"
                sx={{
                  width: { xs: "200px" },
                  marginBottom: 0,
                }}
              >
                <MenuItem sx={{ color: colors.edward }} value="">
                  Select
                </MenuItem>
                {programTypes.map((type) => (
                  <MenuItem
                    key={type}
                    sx={{ color: colors.edward }}
                    value={type}
                  >
                    {type}
                  </MenuItem>
                ))}
              </SelectField>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            gap={{ xs: "20px 20px", md: "15px 20px" }}
          >
            <Button
              onClick={handleBulkDownload}
              sx={{
                ...ButtonStyles,
              }}
              variant="outlined"
            >
              Download
            </Button>
            <SelectField
              onChange={handleSortChange}
              sx={{
                width: { xs: "188px" },
              }}
              value={sort}
              label="Sort"
              variant="outlined"
            >
              <MenuItem value={`firstName-${OrderEnum.ASC}`}>A to Z</MenuItem>
              <MenuItem value={`firstName-${OrderEnum.DESC}`}>Z to A</MenuItem>
              <MenuItem value={`createdAt-${OrderEnum.DESC}`}>
                Newest to Oldest
              </MenuItem>
              <MenuItem value={`createdAt-${OrderEnum.ASC}`}>
                Oldest to Newest
              </MenuItem>
            </SelectField>
          </Box>

          <div style={{ height: 500, width: "100%" }}>
            <StyledDataGrid
              getRowId={(row) => row.id}
              checkboxSelection
              rows={rows}
              rowCount={rowCount}
              loading={isLoading}
              columns={columns}
              pageSizeOptions={[10, 30, 100]}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowHeight={() => "auto"}
              filterMode="server"
              sortingMode="server"
              onSortModelChange={onSortChange}
              onRowSelectionModelChange={onRowSelectionModelChange}
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
      {/* {isOpen ? (
        <TrackDetailModal trackId={selectedTrackId} handleClose={handleClose} />
      ) : null} */}
    </Box>
  );
};
