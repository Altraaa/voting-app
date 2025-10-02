"use client";

import type React from "react";

import { useState } from "react";
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
import { Candidate, initialCandidates } from "./MockData";

export default function AdminCandidateView() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    event: "",
    category: "",
    status: "active" as "active" | "inactive" | "winner",
    image: "",
  });

  const handleCreate = () => {
    const newCandidate: Candidate = {
      id: Math.max(...candidates.map((c) => c.id)) + 1,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      event: formData.event,
      category: formData.category,
      status: formData.status,
      votes: 0,
      image: imagePreview || "/placeholder.svg?height=100&width=100",
    };
    setCandidates([...candidates, newCandidate]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCandidate) return;
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === selectedCandidate.id
          ? {
              ...candidate,
              name: formData.name,
              email: formData.email,
              bio: formData.bio,
              event: formData.event,
              category: formData.category,
              status: formData.status,
              image: imagePreview || candidate.image,
            }
          : candidate
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedCandidate) return;
    setCandidates(
      candidates.filter((candidate) => candidate.id !== selectedCandidate.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedCandidate(null);
  };

  const openEditDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      bio: candidate.bio,
      event: candidate.event,
      category: candidate.category,
      status: candidate.status,
      image: candidate.image || "",
    });
    setImagePreview(candidate.image || "");
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      bio: "",
      event: "",
      category: "",
      status: "active",
      image: "",
    });
    setImagePreview("");
    setSelectedCandidate(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>

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
                  Email
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
                <TableHead className="font-medium text-gray-700">
                  Status
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
                          src={candidate.image || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {candidate.bio}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.email}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.event}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.category}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {candidate.votes}
                  </TableCell>
                  <TableCell>
                    {candidate.status === "active" && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Active
                      </Badge>
                    )}
                    {candidate.status === "inactive" && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                      >
                        Inactive
                      </Badge>
                    )}
                    {candidate.status === "winner" && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        Winner
                      </Badge>
                    )}
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
                          onClick={() => openViewDialog(candidate)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(candidate)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(candidate)}
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>
              Register a new candidate for voting events
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter candidate name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="candidate@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-bio">Biography</Label>
              <Textarea
                id="create-bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Enter candidate biography"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-event">Event</Label>
                <Input
                  id="create-event"
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                  placeholder="Event name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-category">Category</Label>
                <Input
                  id="create-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Category name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="winner">Winner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-image">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="create-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} />
                      <AvatarFallback>Preview</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => setImagePreview("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreate}
            >
              Add Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Update candidate information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter candidate name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="candidate@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bio">Biography</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Enter candidate biography"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-event">Event</Label>
                <Input
                  id="edit-event"
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                  placeholder="Event name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Category name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="winner">Winner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {imagePreview && (
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} />
                      <AvatarFallback>Preview</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => setImagePreview("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={selectedCandidate.image || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl">
                    {selectedCandidate.name
                      .split(" ")
                      .map((n) => n[0])
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
                  <Label className="text-gray-600">Email</Label>
                  <p className="mt-1">{selectedCandidate.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Biography</Label>
                  <p className="mt-1">{selectedCandidate.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Event</Label>
                    <p className="mt-1">{selectedCandidate.event}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Category</Label>
                    <p className="mt-1">{selectedCandidate.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Total Votes</Label>
                    <p className="text-2xl font-semibold mt-1">
                      {selectedCandidate.votes}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">
                      {selectedCandidate.status === "active" && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          Active
                        </Badge>
                      )}
                      {selectedCandidate.status === "inactive" && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          Inactive
                        </Badge>
                      )}
                      {selectedCandidate.status === "winner" && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700"
                        >
                          Winner
                        </Badge>
                      )}
                    </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
