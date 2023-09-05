import {
  SidebarContainerCustom,
  CustomList,
} from "components/sidebar/navigation-sidebar/navigation-sidebar.styles";
import { useOnClickOutside, useSidebar } from "hooks";
import { SidebarTypeEnum } from "hooks/useSidebar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { LogoIcon } from "components/icons/LogoIcon";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export const NavigationSidebar = () => {
  const sidebarStore = useSidebar();
  const navigate = useNavigate();
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside<HTMLDivElement>(sidebarContainerRef, () => {
    sidebarStore.onClose();
  });

  const handleAddressClick = () => {
    navigate("/addresses");
    sidebarStore.onClose();
  };

  const handleUsersClick = () => {
    navigate("/users");
    sidebarStore.onClose();
  };

  return (
    <SidebarContainerCustom
      showSidebar={sidebarStore.showModal === SidebarTypeEnum.NAVIGATION}
      ref={sidebarContainerRef}
    >
      <CloseIcon
        onClick={sidebarStore.onClose}
        sx={{
          position: "absolute",
          right: "10px",
          top: "15px",
          cursor: "pointer",
        }}
      />
      <Box display="flex" justifyContent="center">
        <LogoIcon
          style={{
            width: "80px",
          }}
        />
      </Box>
      <CustomList>
        <ListItemButton onClick={handleAddressClick}>
          <ListItemText primary="Addresses" />
        </ListItemButton>

        <ListItemButton onClick={handleUsersClick}>
          <ListItemText primary="Users" />
        </ListItemButton>
      </CustomList>
    </SidebarContainerCustom>
  );
};
