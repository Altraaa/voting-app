export interface DialogState {
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isViewDialogOpen: boolean;
  selectedId: string | null;

  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (id?: string) => void;
  closeEditDialog: () => void;

  openDeleteDialog: (id?: string) => void;
  closeDeleteDialog: () => void;

  openViewDialog: (id?: string) => void;
  closeViewDialog: () => void;

  closeAllDialogs: () => void;
  setSelectedId: (id: string | null) => void;
}