"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import { useUploadMutations } from "@/config/hooks/UploadImageHook/uploadImageMutation";
import { extractPathFromUrl } from "@/config/utils/extractUrl";
import { ICategories } from "@/config/models/CategoriesModel";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useCategories } from "@/config/hooks/CategoryHook/useCategory";

export default function AdminCategoryView() {
  const { queries: categoryQueries, mutations } = useCategories();
  const { queries: eventQueries } = useEvent();
  const { uploadSingleMutation, deleteSingleMutation } = useUploadMutations();

  const { data: categories = [], isLoading: categoriesLoading } =
    categoryQueries.useGetAllCategories();
  const { data: events = [], isLoading: eventsLoading } =
    eventQueries.useGetAllSimpleEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategories | null>(
    null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    photo_url: "",
    eventId: "",
  });

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
        folder: "categories",
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

  const handleCreate = async () => {
    try {
      if (!formData.name || !formData.eventId) {
        toast.error("Data tidak lengkap", {
          description: "Nama kategori dan event harus diisi",
        });
        return;
      }

      let photoUrl = "";

      if (selectedFile) {
        photoUrl = await handleImageUpload();
      }

      await mutations.createMutation.mutateAsync({
        name: formData.name,
        photo_url: photoUrl,
        eventId: formData.eventId,
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Gagal membuat kategori");
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;

    try {
      let photoUrl = formData.photo_url;
      let shouldDeleteOldImage = false;

      if (selectedFile) {
        const newPhotoUrl = await handleImageUpload();
        photoUrl = newPhotoUrl;
        shouldDeleteOldImage = true;
      }

      await mutations.updateMutation.mutateAsync({
        id: selectedCategory.id,
        name: formData.name,
        photo_url: photoUrl,
        eventId: formData.eventId,
      });

      if (shouldDeleteOldImage && selectedCategory.photo_url) {
        await handleImageDelete(selectedCategory.photo_url);
      }

      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Gagal memperbarui kategori");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      if (selectedCategory.photo_url) {
        await handleImageDelete(selectedCategory.photo_url);
      }

      await mutations.removeMutation.mutateAsync(selectedCategory.id);

      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Gagal menghapus kategori");
    }
  };

  const openEditDialog = (category: ICategories) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      photo_url: category.photo_url || "",
      eventId: category.eventId,
    });
    setImagePreview(category.photo_url || "");
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (category: ICategories) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (category: ICategories) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      photo_url: "",
      eventId: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventNameById = (eventId: string) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.name : "Unknown Event";
  };

  if (categoriesLoading || eventsLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Category Management
          </h1>
          <p className="text-muted-foreground">
            Organize events into categories
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
          disabled={events.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {events.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Tidak ada event yang tersedia. Silahkan buat event terlebih dahulu
            sebelum membuat kategori.
          </p>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search categories..."
            className="pl-10 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-border hover:bg-muted">
          <Filter className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="font-medium text-card-foreground hidden sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground">
                    Category Name
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground hidden md:table-cell">
                    Event
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground">
                    Candidates
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-muted/50 border-border"
                  >
                    <TableCell className="hidden sm:table-cell">
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                        <Image
                          src={category.photo_url || "/placeholder.svg"}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold">{category.name}</span>
                        <span className="text-sm text-muted-foreground sm:hidden">
                          {getEventNameById(category.eventId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {getEventNameById(category.eventId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {category.candidates?.length || 0}
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
                            onClick={() => openViewDialog(category)}
                            className="text-card-foreground hover:bg-muted cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(category)}
                            className="text-card-foreground hover:bg-muted cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => openDeleteDialog(category)}
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
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No categories found</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Create New Category
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new category to organize your events
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-card-foreground">
                Category Name *
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-event" className="text-card-foreground">
                Event *
              </Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventId: value })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {events.map((event) => (
                    <SelectItem
                      key={event.id}
                      value={event.id}
                      className="text-card-foreground hover:bg-muted"
                    >
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-image" className="text-card-foreground">
                Category Image
              </Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
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
                !formData.eventId
              }
            >
              {mutations.createMutation.isPending
                ? "Creating..."
                : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update category information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-card-foreground">
                Category Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-event" className="text-card-foreground">
                Event *
              </Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventId: value })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {events.map((event) => (
                    <SelectItem
                      key={event.id}
                      value={event.id}
                      className="text-card-foreground hover:bg-muted"
                    >
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-card-foreground">
                Category Image
              </Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
              onClick={() => setIsEditDialogOpen(false)}
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
                !formData.eventId
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
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Category Details
            </DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="grid gap-6 py-4">
              {selectedCategory.photo_url && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={selectedCategory.photo_url}
                      alt={selectedCategory.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Category Name</Label>
                  <p className="text-lg font-medium mt-1 text-card-foreground">
                    {selectedCategory.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Event</Label>
                    <p className="mt-1 text-card-foreground">
                      {getEventNameById(selectedCategory.eventId)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Candidates</Label>
                    <p className="text-2xl font-semibold mt-1 text-card-foreground">
                      {selectedCategory.candidates?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedCategory.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedCategory.updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="border-border hover:bg-muted"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{selectedCategory?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
