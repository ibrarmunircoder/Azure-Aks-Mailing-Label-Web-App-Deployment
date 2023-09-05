import { IframeSidebar } from "components/sidebar/iframe-sidebar/IframeSidebar";
import { NavigationSidebar } from "./navigation-sidebar/NavigationSidebar";

export const SidebarRoot = () => {
  return (
    <>
      <IframeSidebar />
      <NavigationSidebar />
    </>
  );
};
