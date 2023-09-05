import Box from "@mui/material/Box";
import {
  Checkbox,
  InputFieldLabel,
  LogoIcon,
  SelectFieldLabel,
  Switch,
} from "components";
import { colors, fontsWeight } from "utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  useCreateUserValidationSchema,
  useSubmit,
} from "views/create-user/hooks";
import { useFormik } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { isError, isErrorMessage } from "helpers";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { UserRoleEnum } from "enums";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
  const { brands, isLoading, initialValues, onSubmit } = useSubmit();
  const validationSchema = useCreateUserValidationSchema();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    setFieldValue,
    getFieldProps,
    errors,
    touched,
    values,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  const navigate = useNavigate();

  const handleBrandSelections = (
    event: SelectChangeEvent<typeof values.assignedBrands>
  ) => {
    const {
      target: { value },
    } = event;
    const brandIds = value as number[];
    setFieldValue("assignedBrands", brandIds);
  };

  const handleRoleSelection = (
    event: SelectChangeEvent<typeof values.role>
  ) => {
    const {
      target: { value },
    } = event;
    setFieldValue("role", value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const switchUserStatus = () => {
    setFieldValue("active", !values.active);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        background: colors.nebula,
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        padding={{ xs: "57px 0 60px 0" }}
      >
        <LogoIcon />
      </Box>
      <Card
        sx={{
          width: "600px",
          maxWidth: "100%",
          margin: "0 auto",
          background: colors.colorWhite,
          boxShadow: "0px 4px 100px rgba(18, 29, 71, 0.04)",
          padding: "50px 40px",
        }}
      >
        <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                marginBottom: { xs: "30px", sm: "40px" },
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontWeight: fontsWeight.fontNormal,
                  fontSize: "40px",
                  lineHeight: "40px",
                  textAlign: "center",
                }}
              >
                Add User
              </Typography>
            </Box>
            <Grid
              container
              rowSpacing="24px"
              columnSpacing="40px"
              sx={{ marginTop: 0 }}
            >
              <Grid item xs={12} sm={6}>
                <InputFieldLabel
                  fullWidth
                  id="firstName"
                  label="First Name"
                  placeholder="First Name"
                  helperText={isErrorMessage("firstName", errors)}
                  error={isError("firstName", errors, touched)}
                  {...getFieldProps("firstName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputFieldLabel
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  helperText={isErrorMessage("lastName", errors)}
                  error={isError("lastName", errors, touched)}
                  {...getFieldProps("lastName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputFieldLabel
                  fullWidth
                  label="Email"
                  placeholder="Enter Email"
                  helperText={isErrorMessage("email", errors)}
                  error={isError("email", errors, touched)}
                  {...getFieldProps("email")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFieldLabel
                  {...getFieldProps("assignedBrands")}
                  variant="outlined"
                  fullWidth
                  label="Member"
                  multiple
                  placeholder="Select"
                  onChange={handleBrandSelections}
                  helperText={isErrorMessage("assignedBrands", errors)}
                  error={isError("assignedBrands", errors, touched)}
                  renderValue={(selected) =>
                    brands
                      .filter((brand) => selected.includes(brand.id))
                      .map((brand) => brand.name)
                      .join(", ")
                  }
                >
                  {brands.map(({ name, id }) => (
                    <MenuItem
                      sx={{
                        "&.MuiMenuItem-root": {
                          background: "transparent",
                        },
                      }}
                      disabled={values.role !== UserRoleEnum.USER}
                      key={id}
                      value={id}
                    >
                      <Checkbox
                        checked={
                          values.role === UserRoleEnum.USER
                            ? values.assignedBrands.indexOf(id) > -1
                            : true
                        }
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </SelectFieldLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputFieldLabel
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
                  helperText={isErrorMessage("password", errors)}
                  error={isError("password", errors, touched)}
                  {...getFieldProps("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          sx={{ marginRight: "1px" }}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFieldLabel
                  {...getFieldProps("role")}
                  onChange={handleRoleSelection}
                  variant="outlined"
                  fullWidth
                  label="Role"
                  placeholder="Select"
                  helperText={isErrorMessage("role", errors)}
                  error={isError("role", errors, touched)}
                >
                  <MenuItem value={UserRoleEnum.SUPER_ADMIN}>
                    Super Admin
                  </MenuItem>
                  <MenuItem value={UserRoleEnum.ADMIN}>Admin</MenuItem>
                  <MenuItem value={UserRoleEnum.USER}>User</MenuItem>
                </SelectFieldLabel>
              </Grid>
              <Grid item xs={12} display="flex" alignItems="center" gap="16px">
                <span>Active</span>
                <Switch
                  disabled={false}
                  checked={values.active}
                  onClick={switchUserStatus}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={() => navigate("/users")}
                  sx={{
                    width: "188px",
                    height: "50px",
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
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                  variant="outlined"
                >
                  Discard
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
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
                    "&.Mui-disabled ": {
                      opacity: 0.3,
                    },
                    "&:hover": {
                      background: colors.lochinvar,
                      border: "none",
                    },
                  }}
                  variant="outlined"
                >
                  {isSubmitting ? (
                    <CircularProgress sx={{ color: colors.colorWhite }} />
                  ) : (
                    "Create User"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Box height="50px" />
    </Box>
  );
};
