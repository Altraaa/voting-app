import { create } from "zustand";
import { DialogState } from "../types/StateType/dialogStateType";

export const useDialogStore = create<DialogState>((set) => ({
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  isViewDialogOpen: false,
  selectedId: null,

  openCreateDialog: () =>
    set({
      isCreateDialogOpen: true,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      isViewDialogOpen: false,
    }),
  closeCreateDialog: () =>
    set({
      isCreateDialogOpen: false,
      selectedId: null,
    }),

  openEditDialog: (id) =>
    set({
      isEditDialogOpen: true,
      isCreateDialogOpen: false,
      isDeleteDialogOpen: false,
      isViewDialogOpen: false,
      selectedId: id || null,
    }),
  closeEditDialog: () =>
    set({
      isEditDialogOpen: false,
      selectedId: null,
    }),

  openDeleteDialog: (id) =>
    set({
      isDeleteDialogOpen: true,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      isViewDialogOpen: false,
      selectedId: id || null,
    }),
  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      selectedId: null,
    }),

  openViewDialog: (id) =>
    set({
      isViewDialogOpen: true,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      selectedId: id || null,
    }),
  closeViewDialog: () =>
    set({
      isViewDialogOpen: false,
      selectedId: null,
    }),

  closeAllDialogs: () =>
    set({
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      isViewDialogOpen: false,
      selectedId: null,
    }),

  setSelectedId: (id) => set({ selectedId: id }),
}));
