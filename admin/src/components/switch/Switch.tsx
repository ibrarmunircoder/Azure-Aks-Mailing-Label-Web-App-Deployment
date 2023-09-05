import { useCallback } from "react";
import { SwitchSlider, SwitchWrapper } from "components/switch/switch.styles";

interface SwitchProps {
  checked: boolean;
  disabled: boolean;
  onClick?: () => void;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  disabled = false,
  onClick = () => {},
}) => {
  const handleSwitched = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <SwitchWrapper disabled={disabled} onClick={handleSwitched}>
      <SwitchSlider checked={checked} />
    </SwitchWrapper>
  );
};
