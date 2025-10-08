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

  const handleEdit = async () => {
    if (!selectedEvent) return;

    try {
      let photoUrl = formData.photo_url;
      let shouldDeleteOldImage = false;

      if (selectedFile) {
        const newPhotoUrl = await handleImageUpload();
        photoUrl = newPhotoUrl;
        shouldDeleteOldImage = true;
      }

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
    setSelectedFile(null);
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

  const getStatusDisplay = (status: StatusEvent) => {
    switch (status) {
      case StatusEvent.upcoming:
        return { label: "Upcoming", variant: "secondary" as const };
      case StatusEvent.live:
        return { label: "Live", variant: "default" as const };
      case StatusEvent.ended:
        return { label: "Ended", variant: "outline" as const };
      default:
        return { label: status, variant: "secondary" as const };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading events...</p>
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
            Event Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage voting events
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
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
                    Event Name
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground hidden lg:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground hidden md:table-cell">
                    Start Date
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground hidden md:table-cell">
                    End Date
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-card-foreground w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const statusDisplay = getStatusDisplay(
                    event.status as StatusEvent
                  );
                  return (
                    <TableRow
                      key={event.id}
                      className="hover:bg-muted/50 border-border"
                    >
                      <TableCell className="hidden sm:table-cell">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <Image
                            src={event.photo_url || "/placeholder.svg"}
                            alt={event.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-card-foreground">
                        <div className="flex flex-col">
                          <span className="font-semibold">{event.name}</span>
                          <span className="text-sm text-muted-foreground sm:hidden">
                            {new Date(event.startDate).toLocaleDateString()} -{" "}
                            {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate hidden lg:table-cell">
                        {event.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {new Date(event.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {new Date(event.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusDisplay.variant}>
                          {statusDisplay.label}
                        </Badge>
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
                              onClick={() => openViewDialog(event)}
                              className="text-card-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(event)}
                              className="text-card-foreground hover:bg-muted cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              className="text-destructive hover:bg-destructive/10 cursor-pointer"
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
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No events found</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs - Tetap sama seperti sebelumnya */}
      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Create New Event
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new voting event to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-card-foreground">
                Event Name
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter event name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="create-description"
                className="text-card-foreground"
              >
                Description
              </Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="create-start-date"
                  className="text-card-foreground"
                >
                  Start Date
                </Label>
                <Input
                  id="create-start-date"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="create-end-date"
                  className="text-card-foreground"
                >
                  End Date
                </Label>
                <Input
                  id="create-end-date"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-status" className="text-card-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusEvent) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem
                    value={StatusEvent.upcoming}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Upcoming
                  </SelectItem>
                  <SelectItem
                    value={StatusEvent.live}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Live
                  </SelectItem>
                  <SelectItem
                    value={StatusEvent.ended}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Ended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-image" className="text-card-foreground">
                Event Image
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

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Edit Event
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update event information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form fields sama seperti create dialog */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-card-foreground">
                Event Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter event name"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="edit-description"
                className="text-card-foreground"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="edit-start-date"
                  className="text-card-foreground"
                >
                  Start Date
                </Label>
                <Input
                  id="edit-start-date"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date" className="text-card-foreground">
                  End Date
                </Label>
                <Input
                  id="edit-end-date"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status" className="text-card-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusEvent) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem
                    value={StatusEvent.upcoming}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Upcoming
                  </SelectItem>
                  <SelectItem
                    value={StatusEvent.live}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Live
                  </SelectItem>
                  <SelectItem
                    value={StatusEvent.ended}
                    className="text-card-foreground hover:bg-muted"
                  >
                    Ended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-card-foreground">
                Event Image
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
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-6 py-4">
              {selectedEvent.photo_url && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden border border-border">
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
                  <Label className="text-muted-foreground">Event Name</Label>
                  <p className="text-lg font-medium mt-1 text-card-foreground">
                    {selectedEvent.name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-card-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          getStatusDisplay(selectedEvent.status as StatusEvent)
                            .variant
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
                    <Label className="text-muted-foreground">Active</Label>
                    <p className="mt-1 text-card-foreground">
                      {selectedEvent.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Start Date</Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedEvent.startDate).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(selectedEvent.startDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">End Date</Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedEvent.endDate).toLocaleDateString()} at{" "}
                      {new Date(selectedEvent.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="mt-1 text-card-foreground">
                      {new Date(selectedEvent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-card-foreground">
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
              Delete Event
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{selectedEvent?.name}
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