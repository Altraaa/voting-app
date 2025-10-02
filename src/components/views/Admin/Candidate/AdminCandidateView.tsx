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

  // Multiple stores untuk concern yang berbeda
  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    selectedId,
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Candidate Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage candidates participating in voting events
            </p>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 bg-white border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-700">
                  Candidate
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Description
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Event
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Category
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Votes
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={candidate.photo_url || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{candidate.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {candidate.description}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getEventNameByCategoryId(candidate.categoryId)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getCategoryNameById(candidate.categoryId)}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {candidate.votes?.length || 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenViewDialog(candidate)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(candidate)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>
              Register a new candidate for voting events
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Full Name *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter candidate name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-description">Description *</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter candidate description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="create-image">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="create-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="flex-1"
                  disabled={uploadSingleMutation.isPending}
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview} />
                      <AvatarFallback>Preview</AvatarFallback>
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
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseCreateDialog}
              disabled={mutations.createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Update candidate information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter candidate name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter candidate description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="flex-1"
                  disabled={uploadSingleMutation.isPending}
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview} />
                      <AvatarFallback>Preview</AvatarFallback>
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
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={mutations.updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={selectedCandidate.photo_url || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl">
                    {selectedCandidate.name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label className="text-gray-600">Full Name</Label>
                  <p className="text-lg font-medium mt-1">
                    {selectedCandidate.name}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-1">{selectedCandidate.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Event</Label>
                    <p className="mt-1">
                      {getEventNameByCategoryId(selectedCandidate.categoryId)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Category</Label>
                    <p className="mt-1">
                      {getCategoryNameById(selectedCandidate.categoryId)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Total Votes</Label>
                  <p className="text-2xl font-semibold mt-1">
                    {selectedCandidate.votes?.length || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Created At</Label>
                    <p className="mt-1">
                      {new Date(selectedCandidate.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Last Updated</Label>
                    <p className="mt-1">
                      {new Date(selectedCandidate.updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedCandidate?.name}
              &ldquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={mutations.removeMutation.isPending}
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
