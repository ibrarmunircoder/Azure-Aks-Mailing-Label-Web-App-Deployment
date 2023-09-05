import { DatePickerSlotsComponentsProps } from "@mui/x-date-pickers/DatePicker";
import { CustomDatePicker } from "components/date-picker/date-picker.styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePickerIcon } from "components";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types";
import { DateValidationError } from "@mui/x-date-pickers";
import { SxProps } from "@mui/material";

interface props extends DatePickerSlotsComponentsProps<Date> {
  onChange?: (
    value: unknown,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => void;
  sx?: SxProps;
  defaultValue?: Date;
  value?: Date;
}

export const DatePicker: React.FC<props> = ({ ...rest }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-us">
      <CustomDatePicker
        label="Date"
        slots={{
          openPickerIcon: DatePickerIcon,
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};
