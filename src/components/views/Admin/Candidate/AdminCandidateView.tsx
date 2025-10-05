"use client";

import { useUploadMutations } from "@/config/hooks/UploadImageHook/uploadImageMutation";
import { extractPathFromUrl } from "@/config/utils/extractUrl";
import { useCandidates } from "@/config/hooks/CandidateHook/useCandidate";
import { useCategoryQueries } from "@/config/hooks/CategoryHook/categoryQueries";
import { ICandidate } from "@/config/models/CandidateModel";
import { toast } from "sonner";

// Icons
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCandidateFormStore } from "@/config/stores/useCandidateStores";
import { useSearchStore } from "@/config/stores/useSearchStores";
import { useDialogStore } from "@/config/stores/useDialogStores";

export default function AdminCandidateView() {
  const { queries: candidateQueries, mutations } = useCandidates();
  const { uploadSingleMutation, deleteSingleMutation } = useUploadMutations();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoryQueries.useGetAllCategories();
  const { data: candidates = [], isLoading: candidatesLoading } =
    candidateQueries.useGetAllCandidates();

  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDialog,
    closeCreateDialog,
    closeEditDialog,
    closeDeleteDialog,
    closeViewDialog,
    setSelectedId,
  } = useDialogStore();

  const {
    formData,
    selectedFile,
    imagePreview,
    selectedCandidate,
    setFormData,
    setSelectedFile,
    setImagePreview,
    resetForm,
    initializeEditForm,
    setSelectedCandidate,
  } = useCandidateFormStore();

  const { searchQuery, setSearchQuery } = useSearchStore();

  // Handler functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak valid", {
        description: "Hanya file JPG, PNG, dan WEBP yang diperbolehkan",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File terlalu besar", {
        description: "Maksimal ukuran file adalah 2MB",
      });
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      return "";
    }

    try {
      const result = await uploadSingleMutation.mutateAsync({
        file: selectedFile,
        folder: "candidates",
      });

      if (result.success && result.url) {
        return result.url;
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Gagal upload gambar");
    }
  };

  const handleImageDelete = async (photoUrl: string): Promise<void> => {
    const path = extractPathFromUrl(photoUrl);
    if (path) {
      try {
        await deleteSingleMutation.mutateAsync({ path });
      } catch (error) {
        console.error("Delete image error:", error);
      }
    }
  };

  // Create Candidate Handler
  const handleCreate = async () => {
    try {
      if (!formData.name || !formData.description || !formData.categoryId) {
        toast.error("Data tidak lengkap", {
          description: "Nama, deskripsi, dan kategori harus diisi",
        });
        return;
      }

      let photoUrl = "";

      if (selectedFile) {
        photoUrl = await handleImageUpload();
      }

      await mutations.createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        photo_url: photoUrl,
        categoryId: formData.categoryId,
      });

      closeCreateDialog();
      resetForm();
    } catch (error) {
      console.error("Create candidate error:", error);
    }
  };

  // Edit Candidate Handler
  const handleEdit = async () => {
    if (!selectedCandidate) return;

    try {
      let photoUrl = formData.photo_url;
      let shouldDeleteOldImage = false;

      if (selectedFile) {
        const newPhotoUrl = await handleImageUpload();
        photoUrl = newPhotoUrl;
        shouldDeleteOldImage = true;
      }

      await mutations.updateMutation.mutateAsync({
        id: selectedCandidate.id,
        name: formData.name,
        description: formData.description,
        photo_url: photoUrl,
        categoryId: formData.categoryId,
      });

      if (shouldDeleteOldImage && selectedCandidate.photo_url) {
        await handleImageDelete(selectedCandidate.photo_url);
      }

      closeEditDialog();
      resetForm();
    } catch (error) {
      console.error("Update candidate error:", error);
    }
  };

  // Delete Candidate Handler
  const handleDelete = async () => {
    if (!selectedCandidate) return;

    try {
      if (selectedCandidate.photo_url) {
        await handleImageDelete(selectedCandidate.photo_url);
      }

      await mutations.removeMutation.mutateAsync(selectedCandidate.id);

      closeDeleteDialog();
      setSelectedCandidate(null);
    } catch (error) {
      console.error("Delete candidate error:", error);
    }
  };

  // Helper functions untuk open dialog dengan candidate data
  const handleOpenEditDialog = (candidate: ICandidate) => {
    setSelectedId(candidate.id);
    initializeEditForm(candidate);
    openEditDialog(candidate.id);
  };

  const handleOpenViewDialog = (candidate: ICandidate) => {
    setSelectedId(candidate.id);
    setSelectedCandidate(candidate);
    openViewDialog(candidate.id);
  };

  const handleOpenDeleteDialog = (candidate: ICandidate) => {
    setSelectedId(candidate.id);
    setSelectedCandidate(candidate);
    openDeleteDialog(candidate.id);
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    openCreateDialog();
  };

  const handleCloseCreateDialog = () => {
    closeCreateDialog();
    resetForm();
  };

  const handleCloseEditDialog = () => {
    closeEditDialog();
    resetForm();
  };

  // Filter candidates berdasarkan search query
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get category name by ID
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Get event name dari category
  const getEventNameByCategoryId = (categoryId: string) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.event?.name || "Unknown Event" : "Unknown Event";
  };

  // Loading state
  if (candidatesLoading || categoriesLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Candidate Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage candidates participating in voting events
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleOpenCreateDialog}
            disabled={categories.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {categories.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Tidak ada kategori yang tersedia. Silahkan buat kategori terlebih
              dahulu sebelum membuat kandidat.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 bg-background border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border hover:bg-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="font-medium text-card-foreground">
                  Candidate
                </TableHead>
                <TableHead className="font-medium text-card-foreground">
                  Description
                </TableHead>
                <TableHead className="font-medium text-card-foreground">
                  Event
                </TableHead>
                <TableHead className="font-medium text-card-foreground">
                  Category
                </TableHead>
                <TableHead className="font-medium text-card-foreground">
                  Votes
                </TableHead>
                <TableHead className="font-medium text-card-foreground w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className="hover:bg-muted/50 border-border"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage
                          src={candidate.photo_url || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-card-foreground">
                        {candidate.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {candidate.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getEventNameByCategoryId(candidate.categoryId)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCategoryNameById(candidate.categoryId)}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {candidate.votes?.length || 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 hover:bg-muted"
                        >
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenViewDialog(candidate)}
                          className="text-card-foreground hover:bg-muted cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(candidate)}
                          className="text-card-foreground hover:bg-muted cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => handleOpenDeleteDialog(candidate)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Add New Candidate
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Register a new candidate for voting events
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-card-foreground">
                Full Name *
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter candidate name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="create-description"
                className="text-card-foreground"
              >
                Description *
              </Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter candidate description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-category" className="text-card-foreground">
                Category *
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ categoryId: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="text-card-foreground hover:bg-muted focus:bg-muted"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="create-image" className="text-card-foreground">
                Profile Photo
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="create-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="flex-1 bg-background border-border text-foreground"
                  disabled={uploadSingleMutation.isPending}
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20 border border-border">
                      <AvatarImage src={imagePreview} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        Preview
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              {uploadSingleMutation.isPending && (
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseCreateDialog}
              disabled={mutations.createMutation.isPending}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleCreate}
              disabled={
                mutations.createMutation.isPending ||
                uploadSingleMutation.isPending ||
                !formData.name ||
                !formData.description ||
                !formData.categoryId
              }
            >
              {mutations.createMutation.isPending
                ? "Creating..."
                : "Add Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Edit Candidate
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update candidate information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-card-foreground">
                Full Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter candidate name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="edit-description"
                className="text-card-foreground"
              >
                Description *
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter candidate description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category" className="text-card-foreground">
                Category *
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ categoryId: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="text-card-foreground hover:bg-muted focus:bg-muted"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-card-foreground">
                Profile Photo
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="flex-1 bg-background border-border text-foreground"
                  disabled={uploadSingleMutation.isPending}
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20 border border-border">
                      <AvatarImage src={imagePreview} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        Preview
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              {uploadSingleMutation.isPending && (
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={mutations.updateMutation.isPending}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleEdit}
              disabled={
                mutations.updateMutation.isPending ||
                uploadSingleMutation.isPending ||
                !formData.name ||
                !formData.description ||
                !formData.categoryId
              }
            >
              {mutations.updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Candidate Details
            </DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <Avatar className="w-32 h-32 border border-border">
                  <AvatarImage
                    src={selectedCandidate.photo_url || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                    {selectedCandidate.name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="text-lg font-medium mt-1 text-card-foreground">
                    {selectedCandidate.name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-card-foreground">
                    {selectedCandidate.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Event</Label>
                    <p className="mt-1 text-card-foreground">
                      {getEventNameByCategoryId(selectedCandidate.categoryId)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="mt-1 text-card-foreground">
                      {getCategoryNameById(selectedCandidate.categoryId)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Votes</Label>
                  <p className="text-2xl font-semibold mt-1 text-card-foreground">
                    {selectedCandidate.votes?.length || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedCandidate.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedCandidate.updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeViewDialog}
              className="border-border hover:bg-muted"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Delete Candidate
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{selectedCandidate?.name}
              &ldquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={mutations.removeMutation.isPending}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={mutations.removeMutation.isPending}
            >
              {mutations.removeMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
