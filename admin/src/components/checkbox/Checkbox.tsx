import {
  InputCheckbox,
  CheckboxWrapper,
} from "components/checkbox/checkbox.styles";
import { CheckIcon } from "components";

interface CheckboxProps {
  checked: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked }) => {
  return (
    <CheckboxWrapper className="checkbox-custom">
      <InputCheckbox readOnly type="checkbox" hidden checked={checked} />
      <CheckIcon display="none" />
    </CheckboxWrapper>
  );
};
