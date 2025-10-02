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

  // State untuk upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    photo_url: "",
    eventId: "",
  });

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
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

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image preview
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  // Upload image handler
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

  // Delete image handler
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

  // Create Category Handler
  const handleCreate = async () => {
    try {
      // Validasi required fields
      if (!formData.name || !formData.eventId) {
        toast.error("Data tidak lengkap", {
          description: "Nama kategori dan event harus diisi",
        });
        return;
      }

      let photoUrl = "";

      // Upload image jika ada
      if (selectedFile) {
        photoUrl = await handleImageUpload();
      }

      // Create category
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

  // Edit Category Handler
  const handleEdit = async () => {
    if (!selectedCategory) return;

    try {
      let photoUrl = formData.photo_url;
      let shouldDeleteOldImage = false;

      // Jika ada file baru, upload dan tandai untuk hapus yang lama
      if (selectedFile) {
        const newPhotoUrl = await handleImageUpload();
        photoUrl = newPhotoUrl;
        shouldDeleteOldImage = true;
      }

      // Update category
      await mutations.updateMutation.mutateAsync({
        id: selectedCategory.id,
        name: formData.name,
        photo_url: photoUrl,
        eventId: formData.eventId,
      });

      // Hapus gambar lama setelah update berhasil
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

  // Delete Category Handler
  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      // Hapus gambar jika ada
      if (selectedCategory.photo_url) {
        await handleImageDelete(selectedCategory.photo_url);
      }

      // Hapus category
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

  // Get event name by ID untuk display di table
  const getEventNameById = (eventId: string) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.name : "Unknown Event";
  };

  // Loading state
  if (categoriesLoading || eventsLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600 mt-1">
              Organize events into categories
            </p>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
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
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Tidak ada event yang tersedia. Silahkan buat event terlebih dahulu
              sebelum membuat kategori.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
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
                  Image
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Category Name
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Event
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Candidates
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <Image
                        src={category.photo_url || "/placeholder.svg"}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {getEventNameById(category.eventId)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {category.candidates?.length || 0}
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
                          onClick={() => openViewDialog(category)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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
        </CardContent>
      </Card>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your events
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Category Name *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-event">Event *</Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="create-image">Category Image</Label>
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
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
                <p className="text-sm text-gray-500">Uploading image...</p>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-event">Event *</Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Category Image</Label>
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
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
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
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="grid gap-6 py-4">
              {selectedCategory.photo_url && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden">
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
                  <Label className="text-gray-600">Category Name</Label>
                  <p className="text-lg font-medium mt-1">
                    {selectedCategory.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Event</Label>
                    <p className="mt-1">
                      {getEventNameById(selectedCategory.eventId)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Candidates</Label>
                    <p className="text-2xl font-semibold mt-1">
                      {selectedCategory.candidates?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Created At</Label>
                    <p className="mt-1">
                      {new Date(selectedCategory.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Last Updated</Label>
                    <p className="mt-1">
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
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedCategory?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
