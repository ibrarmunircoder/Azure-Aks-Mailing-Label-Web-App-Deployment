import { create } from "zustand";

export enum SidebarTypeEnum {
  IFRAME = "iframe",
  NAVIGATION = "navigation",
  NONE = "none",
}

interface SidebarStore {
  showModal: SidebarTypeEnum;
  onOpen: (modalType: SidebarTypeEnum) => void;
  onClose: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  showModal: SidebarTypeEnum.NONE,
  onOpen: (modalType: SidebarTypeEnum) => set({ showModal: modalType }),
  onClose: () => set({ showModal: SidebarTypeEnum.NONE }),
}));
