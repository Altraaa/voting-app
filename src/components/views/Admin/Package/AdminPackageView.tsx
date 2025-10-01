"use client";

import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { usePackage } from "@/config/hooks/PackageHook/usePackage";
import { useDialogStore } from "@/config/stores/useDialogStores";
import { usePackageFormStore } from "@/config/stores/usePackageStores";
import { SupportType } from "@/generated/prisma";

export default function AdminPackageView() {
  const { queries, mutations } = usePackage();
  const { data: packagesData, isLoading } = queries.useGetAllPackages();
  
  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    selectedId,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    openViewDialog,
    closeViewDialog,
  } = useDialogStore();

  const {
    formData,
    searchQuery,
    setFormData,
    setSearchQuery,
    resetForm,
  } = usePackageFormStore();

  const packages = packagesData || [];
  const selectedPackage = packages.find((pkg) => pkg.id === selectedId);

  const { data: selectedPackageDetail } = queries.useGetPackageById(
    selectedId || ""
  );

  const handleCreate = () => {
    mutations.createMutation.mutate(formData, {
      onSuccess: () => {
        closeCreateDialog();
        resetForm();
      },
    });
  };

  const handleEdit = () => {
    if (!selectedId) return;
    mutations.updateMutation.mutate(
      {
        id: selectedId,
        ...formData,
      },
      {
        onSuccess: () => {
          closeEditDialog();
          resetForm();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedId) return;
    mutations.removeMutation.mutate(selectedId, {
      onSuccess: () => {
        closeDeleteDialog();
      },
    });
  };

  const handleOpenEditDialog = (pkgId: string) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      points: pkg.points,
      price: pkg.price,
      originalPrice: pkg.originalPrice || pkg.price,
      validityDays: pkg.validityDays,
      supportType: pkg.supportType,
      bonusPercentage: pkg.bonusPercentage || 0,
      earlyAccess: pkg.earlyAccess,
    });
    openEditDialog(pkgId);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Package Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage voting point packages and pricing
            </p>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              resetForm();
              openCreateDialog();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Package
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search packages..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className="border-gray-200 hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    {pkg.earlyAccess && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-700 text-xs mt-1"
                      >
                        Early Access
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openViewDialog(pkg.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenEditDialog(pkg.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(pkg.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Voting Points</span>
                  <span className="font-semibold text-purple-600">
                    {pkg.points} points
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Support Type</span>
                  <span className="font-medium text-gray-900">
                    {pkg.supportType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Validity</span>
                  <span className="font-medium text-gray-900">
                    {pkg.validityDays} days
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  {pkg.isActive ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  Rp {Math.round(pkg.price / pkg.points).toLocaleString('id-ID')}/point
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
            <DialogDescription>
              Add a new voting points package
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Package Name</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ name: e.target.value })
                }
                placeholder="Enter package name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ description: e.target.value })
                }
                placeholder="Enter package description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-points">Voting Points</Label>
                <Input
                  id="create-points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ points: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-price">Price (IDR)</Label>
                <Input
                  id="create-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ price: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-validity">Validity Days</Label>
                <Input
                  id="create-validity"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) =>
                    setFormData({ validityDays: Number(e.target.value) })
                  }
                  placeholder="30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-support">Support Type</Label>
                <Select
                  value={formData.supportType}
                  onValueChange={(value: SupportType) =>
                    setFormData({ supportType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportType.BASIC}>Basic</SelectItem>
                    <SelectItem value={SupportType.PRIORITY}>Priority</SelectItem>
                    <SelectItem value={SupportType.PREMIUM}>Premium</SelectItem>
                    <SelectItem value={SupportType.VIP}>VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-bonus">Bonus Percentage</Label>
                <Input
                  id="create-bonus"
                  type="number"
                  value={formData.bonusPercentage}
                  onChange={(e) =>
                    setFormData({ bonusPercentage: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-original">Original Price (IDR)</Label>
                <Input
                  id="create-original"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ originalPrice: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-early"
                checked={formData.earlyAccess}
                onChange={(e) =>
                  setFormData({ earlyAccess: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <Label htmlFor="create-early" className="cursor-pointer">
                Mark as early access package
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCreateDialog}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreate}
              disabled={mutations.createMutation.isPending}
            >
              {mutations.createMutation.isPending ? "Creating..." : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update package information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Package Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ name: e.target.value })
                }
                placeholder="Enter package name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ description: e.target.value })
                }
                placeholder="Enter package description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-points">Voting Points</Label>
                <Input
                  id="edit-points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ points: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (IDR)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ price: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-validity">Validity Days</Label>
                <Input
                  id="edit-validity"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) =>
                    setFormData({ validityDays: Number(e.target.value) })
                  }
                  placeholder="30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-support">Support Type</Label>
                <Select
                  value={formData.supportType}
                  onValueChange={(value: SupportType) =>
                    setFormData({ supportType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportType.BASIC}>Basic</SelectItem>
                    <SelectItem value={SupportType.PRIORITY}>Priority</SelectItem>
                    <SelectItem value={SupportType.PREMIUM}>Premium</SelectItem>
                    <SelectItem value={SupportType.VIP}>VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-early"
                checked={formData.earlyAccess}
                onChange={(e) =>
                  setFormData({ earlyAccess: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <Label htmlFor="edit-early" className="cursor-pointer">
                Mark as early access package
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleEdit}
              disabled={mutations.updateMutation.isPending}
            >
              {mutations.updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          {(selectedPackageDetail || selectedPackage) && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Coins className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {(selectedPackageDetail || selectedPackage)?.name}
                  </h3>
                  {(selectedPackageDetail || selectedPackage)?.earlyAccess && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700 mt-1"
                    >
                      Early Access Package
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-1">{(selectedPackageDetail || selectedPackage)?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Voting Points</Label>
                    <p className="text-2xl font-semibold text-purple-600 mt-1">
                      {(selectedPackageDetail || selectedPackage)?.points}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Price</Label>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      Rp {(selectedPackageDetail || selectedPackage)?.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Support Type</Label>
                    <p className="text-xl font-semibold mt-1">
                      {(selectedPackageDetail || selectedPackage)?.supportType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Validity</Label>
                    <p className="text-xl font-semibold mt-1">
                      {(selectedPackageDetail || selectedPackage)?.validityDays} days
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Price per Point</Label>
                    <p className="text-xl font-semibold mt-1">
                      Rp {Math.round((selectedPackageDetail || selectedPackage)!.price / (selectedPackageDetail || selectedPackage)!.points).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Bonus</Label>
                    <p className="text-xl font-semibold mt-1">
                      {(selectedPackageDetail || selectedPackage)?.bonusPercentage || 0}%
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">
                    {(selectedPackageDetail || selectedPackage)?.isActive ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                      >
                        Inactive
                      </Badge>
                    )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedPackage?.name}&ldquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
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