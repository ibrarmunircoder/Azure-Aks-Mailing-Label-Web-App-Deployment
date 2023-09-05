import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { InputField } from "components/input-field/InputField";
import { SelectField } from "components/select-field/SelectField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { colors } from "utils";
import { useFormik } from "formik";
import { SelectChangeEvent } from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CloseIcon from "@mui/icons-material/Close";
import { useIframeValidationSchema, useSidebar } from "hooks";
import { isError, isErrorMessage } from "helpers";
import { SidebarContainerCustom } from "components/sidebar/iframe-sidebar/iframe-sidebar.styles";
import { SidebarTypeEnum } from "hooks/useSidebar";

interface InitialValues {
  width: string;
  height: string;
  widthUnit: string;
  heightUnit: string;
  borderWidth: string;
  url: string;
}

const initialValues = {
  width: "",
  height: "",
  widthUnit: "%",
  heightUnit: "%",
  borderWidth: "",
  url: "",
};

export const IframeSidebar = () => {
  const sidebarStore = useSidebar();
  const validationSchema = useIframeValidationSchema();
  const [iframe, setIframe] = useState<string | null>(null);
  const { getFieldProps, setFieldValue, handleSubmit, errors, touched } =
    useFormik<InitialValues>({
      initialValues,
      validationSchema,
      onSubmit: (values, actions) => {
        const iframe = `<iframe src="${values.url}" name="Shipping Label" width="${values.width}${values.widthUnit}" height="${values.height}${values.heightUnit}" style="border:${values.borderWidth}px solid #000000;overflow:auto"></iframe>`;
        setIframe(iframe);
        actions.resetForm({
          values: initialValues,
        });
      },
    });

  const handleUnit =
    (field: string) =>
    async (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
      const unit = event.target.value as string;
      setFieldValue(field, unit);
    };

  return (
    <SidebarContainerCustom
      showSidebar={sidebarStore.showModal === SidebarTypeEnum.IFRAME}
    >
      <CloseIcon
        onClick={sidebarStore.onClose}
        sx={{
          position: "absolute",
          left: "25px",
          top: "25px",
          cursor: "pointer",
        }}
      />
      <Grid
        marginBottom="20px"
        container
        spacing={1}
        component="form"
        onSubmit={handleSubmit}
      >
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center">
            Settings
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <InputField
            placeholder="Width"
            fullWidth
            helperText={isErrorMessage("width", errors)}
            error={isError("width", errors, touched)}
            {...getFieldProps("width")}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectField
            sx={{ minWidth: "90px" }}
            variant="outlined"
            {...getFieldProps("widthUnit")}
            onChange={handleUnit("widthUnit")}
          >
            <MenuItem value="%">%</MenuItem>
            <MenuItem value="px">px</MenuItem>
          </SelectField>
        </Grid>
        <Grid item xs={9}>
          <InputField
            placeholder="Height"
            fullWidth
            helperText={isErrorMessage("height", errors)}
            error={isError("height", errors, touched)}
            {...getFieldProps("height")}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectField
            sx={{ minWidth: "80px" }}
            variant="outlined"
            {...getFieldProps("heightUnit")}
            onChange={handleUnit("heightUnit")}
          >
            <MenuItem value="%">%</MenuItem>
            <MenuItem value="px">px</MenuItem>
          </SelectField>
        </Grid>
        <Grid item xs={12}>
          <InputField
            placeholder="Border Width"
            fullWidth
            helperText={isErrorMessage("borderWidth", errors)}
            error={isError("borderWidth", errors, touched)}
            {...getFieldProps("borderWidth")}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            placeholder="Url"
            fullWidth
            helperText={isErrorMessage("url", errors)}
            error={isError("url", errors, touched)}
            {...getFieldProps("url")}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            sx={{
              minWidth: "190px",
              background: colors.lightRed,
              color: colors.colorWhite,
              padding: "13px 30px",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
              outline: "none",
              border: "none",
              "&:hover": {
                background: colors.lightRed,
                border: "none",
              },
              "& svg": {
                "& path": {
                  stroke: colors.colorWhite,
                },
                marginRight: "8px",
              },
            }}
            type="submit"
            variant="outlined"
          >
            Generate
          </Button>
        </Grid>
      </Grid>
      {iframe && (
        <SyntaxHighlighter wrapLongLines language="html" style={docco}>
          {iframe}
        </SyntaxHighlighter>
      )}
    </SidebarContainerCustom>
  );
};
