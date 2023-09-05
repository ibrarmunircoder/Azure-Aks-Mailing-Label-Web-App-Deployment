import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { InputField, SelectField } from "shared/components";
import { colors, fontsWeight } from "styles/vars";
import { useFormik } from "formik";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  useCreateNewAddressSchema,
  useSubmit,
} from "views/create-new-address/hooks";
import { isError, isErrorMessage } from "shared/utils";
import USData from "data/us-states-cities.json";

const formHeaderTypographyStyles = {
  fontWeight: fontsWeight.fontMedium,
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center",
  color: colors.colorBlack,
};

export const CreateNewAddress = () => {
  const { initialValues, onSubmit, isShippingLabelSent } = useSubmit();
  const validationSchema = useCreateNewAddressSchema();
  const {
    handleSubmit,
    setFieldValue,
    getFieldProps,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const statesElement = USData.map(({ state_code, name }, index) => (
    <MenuItem key={index} value={state_code}>
      {name}
    </MenuItem>
  ));

  const handleStateOnChange = async (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const stateCode = event.target.value as string;
    setFieldValue("state", stateCode);
  };

  const shippingFormElement = (
    <>
      <Grid container spacing={4} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} sm={6} md={4}>
          <InputField
            fullWidth
            placeholder="First Name"
            variant="outlined"
            helperText={isErrorMessage("firstName", errors)}
            error={isError("firstName", errors, touched)}
            {...getFieldProps("firstName")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputField
            fullWidth
            placeholder="Last Name"
            variant="outlined"
            helperText={isErrorMessage("lastName", errors)}
            error={isError("lastName", errors, touched)}
            {...getFieldProps("lastName")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputField
            fullWidth
            placeholder="Email Address"
            variant="outlined"
            helperText={isErrorMessage("email", errors)}
            error={isError("email", errors, touched)}
            {...getFieldProps("email")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            fullWidth
            placeholder="Address Line 1"
            variant="outlined"
            helperText={isErrorMessage("addressLine1", errors)}
            error={isError("addressLine1", errors, touched)}
            {...getFieldProps("addressLine1")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            fullWidth
            placeholder="Address Line 2"
            variant="outlined"
            helperText={isErrorMessage("addressLine2", errors)}
            error={isError("addressLine2", errors, touched)}
            {...getFieldProps("addressLine2")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputField
            fullWidth
            placeholder="City"
            variant="outlined"
            helperText={isErrorMessage("city", errors)}
            error={isError("city", errors, touched)}
            {...getFieldProps("city")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SelectField
            fullWidth
            label="State"
            variant="outlined"
            helperText={isErrorMessage("state", errors)}
            error={isError("state", errors, touched)}
            {...getFieldProps("state")}
            onChange={handleStateOnChange}
          >
            {statesElement}
          </SelectField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputField
            fullWidth
            placeholder="Zip Code"
            variant="outlined"
            helperText={isErrorMessage("zipcode", errors)}
            error={isError("zipcode", errors, touched)}
            {...getFieldProps("zipcode")}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            component="p"
            sx={{
              ...formHeaderTypographyStyles,
              textAlign: "center",
            }}
          >
            By submitting your data on this form, you acknowledge that Pact
            Collective will use the information provided in accordance with
            their{" "}
            <Typography
              component="a"
              href="https://www.pactcollective.org/terms-and-conditions"
              target="__blank"
              sx={{
                ...formHeaderTypographyStyles,
                color: colors.lightRed,
              }}
            >
              terms of use and privacy policy
            </Typography>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={false}
            loading={isSubmitting}
            sx={{
              background: colors.lightRed,
              borderRadius: "4px",
              fontWeight: fontsWeight.fontMedium,
              fontSize: "14px",
              lineHeight: "24px",
              height: "56px",
              padding: "16px 32px",
              minWidth: "300px",
              "&:hover": {
                background: colors.lightRed,
              },
            }}
          >
            <span>Get Your Free Mailing Label</span>
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );

  const shippingLabelSuccessMessageElement = (
    <Box
      sx={{
        width: "993px",
        maxWidth: "100%",
        height: "356px",
        margin: "0 auto",
        border: "1px solid #EBECF0",
        backdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        component="p"
        sx={{
          ...formHeaderTypographyStyles,
          fontWeight: fontsWeight.fontNormal,
          fontSize: "36px",
          fontFamily: "Abril Fatface, cursive",
          lineHeight: { xs: "1.2", sm: "24px" },
        }}
      >
        Thank you for recycling!
      </Typography>
      <Typography
        component="p"
        textTransform="uppercase"
        sx={{
          ...formHeaderTypographyStyles,
          marginTop: "30px",
        }}
      >
        your mailing label is in your inbox
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Card
        sx={{
          borderRadius: 0,
          width: "1200px",
          maxWidth: "100%",
          padding: { xs: "12px", sm: "45px 44px", md: "48px 74px 80px 74px" },
        }}
      >
        <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
          <Box
            sx={{
              maxWidth: "100%",
              marginBottom: "39px",
            }}
          >
            <Typography
              component="p"
              sx={{
                ...formHeaderTypographyStyles,
              }}
            >
              Boxes should be 6” x 6” x 3” or smaller. Envelopes should be 8” x
              12” or smaller.
            </Typography>
            <Typography
              component="p"
              sx={{
                ...formHeaderTypographyStyles,
              }}
            >
              Not sure if your beauty product is recyclable?{" "}
              <Typography
                component="a"
                href="https://www.pactcollective.org/guidelines"
                target="__blank"
                sx={{
                  ...formHeaderTypographyStyles,
                  color: colors.lightRed,
                }}
              >
                Check Pact's guidelines
              </Typography>
            </Typography>
            <Typography
              component="p"
              sx={{
                ...formHeaderTypographyStyles,
                marginTop: "20px",
              }}
            >
              Your shipping label will come to your email from{" "}
              <Typography
                component="a"
                href="mailto:mailback@pactcollective.org"
                sx={{
                  ...formHeaderTypographyStyles,
                  color: colors.lightRed,
                }}
              >
                mailback@pactcollective.org
              </Typography>
            </Typography>
            <Typography
              sx={{
                ...formHeaderTypographyStyles,
                marginTop: "20px",
              }}
            >
              Or, drop it off at a{" "}
              <Typography
                component="a"
                href="https://www.pactcollective.org/locations"
                target="__blank"
                sx={{
                  ...formHeaderTypographyStyles,
                  color: colors.lightRed,
                }}
              >
                Pact Bin near you.
              </Typography>
            </Typography>
          </Box>
          {isShippingLabelSent
            ? shippingLabelSuccessMessageElement
            : shippingFormElement}
        </CardContent>
      </Card>
    </Box>
  );
};
