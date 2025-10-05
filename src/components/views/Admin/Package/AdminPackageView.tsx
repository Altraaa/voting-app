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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { IEvent } from "@/config/models/EventModel";
import { toast } from "sonner";
import { useEvent } from "@/config/hooks/EventHook/useEvent";
import { useUploadMutations } from "@/config/hooks/UploadImageHook/uploadImageMutation";
import { StatusEvent } from "@/generated/prisma";
import { extractPathFromUrl } from "@/config/utils/extractUrl";

export default function AdminEventView() {
  const { queries, mutations } = useEvent();
  const { uploadSingleMutation, deleteSingleMutation } = useUploadMutations();

  const { data: events = [], isLoading } = queries.useGetAllEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  // State untuk upload - disederhanakan
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    photo_url: string;
    status: StatusEvent;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>({
    name: "",
    description: "",
    photo_url: "",
    status: StatusEvent.upcoming,
    startDate: "",
    endDate: "",
    isActive: true,
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

  // Remove image preview
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  // Upload image handler yang lebih sederhana
  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      return "";
    }

    try {
      const result = await uploadSingleMutation.mutateAsync({
        file: selectedFile,
        folder: "events",
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

  // Create Event Handler - disederhanakan
  const handleCreate = async () => {
    try {
      let photoUrl = "";

      if (selectedFile) {
        photoUrl = await handleImageUpload();
      }

      await mutations.createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        photo_url: photoUrl,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Create event error:", error);
    }
  };

  // Edit Event Handler - disederhanakan
  const handleEdit = async () => {
    if (!selectedEvent) return;

    try {
      let photoUrl = formData.photo_url;
      let shouldDeleteOldImage = false;

      // Jika ada file baru, upload dan tandai untuk hapus yang lama
      if (selectedFile) {
        const newPhotoUrl = await handleImageUpload();
        photoUrl = newPhotoUrl;
        shouldDeleteOldImage = true;
      }

      // Update event
      await mutations.updateMutation.mutateAsync({
        id: selectedEvent.id,
        name: formData.name,
        description: formData.description,
        photo_url: photoUrl,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      });

      // Hapus gambar lama setelah update berhasil
      if (shouldDeleteOldImage && selectedEvent.photo_url) {
        await handleImageDelete(selectedEvent.photo_url);
      }

      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Update event error:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      if (selectedEvent.photo_url) {
        await handleImageDelete(selectedEvent.photo_url);
      }

      await mutations.removeMutation.mutateAsync(selectedEvent.id);

      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Delete event error:", error);
    }
  };

  const openEditDialog = (event: IEvent) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      photo_url: event.photo_url || "",
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      isActive: event.isActive,
    });
    setImagePreview(event.photo_url || "");
    setSelectedFile(null); // Reset selected file
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (event: IEvent) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (event: IEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      photo_url: "",
      status: StatusEvent.upcoming,
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setSelectedFile(null);
    setImagePreview("");
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format status untuk display
  const getStatusDisplay = (status: StatusEvent) => {
    switch (status) {
      case StatusEvent.upcoming:
        return { label: "Upcoming", class: "bg-blue-100 text-blue-700" };
      case StatusEvent.live:
        return { label: "Live", class: "bg-green-100 text-green-700" };
      case StatusEvent.ended:
        return { label: "Ended", class: "bg-gray-100 text-gray-700" };
      default:
        return { label: status, class: "bg-gray-100 text-gray-700" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Event Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage voting events
            </p>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
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
                  Event Name
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Description
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Start Date
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  End Date
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                const statusDisplay = getStatusDisplay(
                  event.status as StatusEvent
                );
                return (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={event.photo_url || "/placeholder.svg"}
                          alt={event.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {event.description}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(event.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(event.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusDisplay.class}
                      >
                        {statusDisplay.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openViewDialog(event)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteDialog(event)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new voting event to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Event Name</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter event name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-start-date">Start Date</Label>
                <Input
                  id="create-start-date"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-end-date">End Date</Label>
                <Input
                  id="create-end-date"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusEvent) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StatusEvent.upcoming}>Upcoming</SelectItem>
                  <SelectItem value={StatusEvent.live}>Live</SelectItem>
                  <SelectItem value={StatusEvent.ended}>Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="create-image">Event Image</Label>
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
                uploadSingleMutation.isPending
              }
            >
              {mutations.createMutation.isPending
                ? "Creating..."
                : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG - Sama seperti CREATE tapi dengan data yang sudah ada */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form fields sama seperti create dialog */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Event Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter event name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input
                  id="edit-end-date"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusEvent) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StatusEvent.upcoming}>Upcoming</SelectItem>
                  <SelectItem value={StatusEvent.live}>Live</SelectItem>
                  <SelectItem value={StatusEvent.ended}>Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Event Image</Label>
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
                uploadSingleMutation.isPending
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
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-6 py-4">
              {selectedEvent.photo_url && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden">
                    <Image
                      src={selectedEvent.photo_url}
                      alt={selectedEvent.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-4">
                <div>
                  <Label className="text-gray-600">Event Name</Label>
                  <p className="text-lg font-medium mt-1">
                    {selectedEvent.name}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant="secondary"
                        className={
                          getStatusDisplay(selectedEvent.status as StatusEvent)
                            .class
                        }
                      >
                        {
                          getStatusDisplay(selectedEvent.status as StatusEvent)
                            .label
                        }
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Active</Label>
                    <p className="mt-1">
                      {selectedEvent.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Start Date</Label>
                    <p className="mt-1">
                      {new Date(selectedEvent.startDate).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(selectedEvent.startDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">End Date</Label>
                    <p className="mt-1">
                      {new Date(selectedEvent.endDate).toLocaleDateString()} at{" "}
                      {new Date(selectedEvent.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Created At</Label>
                    <p className="mt-1">
                      {new Date(selectedEvent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Last Updated</Label>
                    <p className="mt-1">
                      {new Date(selectedEvent.updatedAt).toLocaleDateString()}
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
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedEvent?.name}
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
