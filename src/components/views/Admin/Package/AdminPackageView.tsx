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

  const { formData, searchQuery, setFormData, setSearchQuery, resetForm } =
    usePackageFormStore();

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

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : ("outline" as const);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading packages...</p>
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
            Package Management
          </h1>
          <p className="text-muted-foreground">
            Manage voting point packages and pricing
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          onClick={() => {
            resetForm();
            openCreateDialog();
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search packages..."
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

      {/* Cards Grid for Mobile, Table for Desktop */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className="border-border bg-card hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {pkg.name}
                      </h3>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 hover:bg-muted"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-card border-border"
                    >
                      <DropdownMenuItem
                        onClick={() => openViewDialog(pkg.id)}
                        className="text-card-foreground hover:bg-muted cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenEditDialog(pkg.id)}
                        className="text-card-foreground hover:bg-muted cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        className="text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => openDeleteDialog(pkg.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {pkg.description}
                </p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Points
                    </span>
                    <span className="font-semibold text-primary">
                      {pkg.points} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-semibold text-card-foreground">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Support
                    </span>
                    <span className="text-sm font-medium text-card-foreground">
                      {pkg.supportType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Badge variant={getStatusVariant(pkg.isActive)}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Rp{" "}
                    {Math.round(pkg.price / pkg.points).toLocaleString("id-ID")}
                    /point
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Table for Desktop */}
      <Card className="border-border bg-card hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted hover:bg-muted border-b border-border">
                  <th className="font-medium text-card-foreground text-left p-4">
                    Package
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4">
                    Points
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4">
                    Price
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4">
                    Support Type
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4">
                    Validity
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4">
                    Status
                  </th>
                  <th className="font-medium text-card-foreground text-left p-4 w-12">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-muted/50 border-b border-border last:border-b-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Coins className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-card-foreground">
                            {pkg.name}
                          </span>
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {pkg.description}
                          </span>
                          {pkg.earlyAccess && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-700 text-xs mt-1 w-fit"
                            >
                              Early Access
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-primary">
                        {pkg.points}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-card-foreground">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Rp{" "}
                          {Math.round(pkg.price / pkg.points).toLocaleString(
                            "id-ID"
                          )}
                          /point
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-card-foreground">
                        {pkg.supportType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-card-foreground">
                        {pkg.validityDays} days
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(pkg.isActive)}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
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
                            onClick={() => openViewDialog(pkg.id)}
                            className="text-card-foreground hover:bg-muted cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenEditDialog(pkg.id)}
                            className="text-card-foreground hover:bg-muted cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => openDeleteDialog(pkg.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No packages found</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Create New Package
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new voting points package
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name" className="text-card-foreground">
                Package Name
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter package name"
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
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter package description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-points" className="text-card-foreground">
                  Voting Points
                </Label>
                <Input
                  id="create-points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ points: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-price" className="text-card-foreground">
                  Price (IDR)
                </Label>
                <Input
                  id="create-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ price: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="create-validity"
                  className="text-card-foreground"
                >
                  Validity Days
                </Label>
                <Input
                  id="create-validity"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) =>
                    setFormData({ validityDays: Number(e.target.value) })
                  }
                  placeholder="30"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="create-support"
                  className="text-card-foreground"
                >
                  Support Type
                </Label>
                <Select
                  value={formData.supportType}
                  onValueChange={(value: SupportType) =>
                    setFormData({ supportType: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem
                      value={SupportType.BASIC}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Basic
                    </SelectItem>
                    <SelectItem
                      value={SupportType.PRIORITY}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Priority
                    </SelectItem>
                    <SelectItem
                      value={SupportType.PREMIUM}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Premium
                    </SelectItem>
                    <SelectItem
                      value={SupportType.VIP}
                      className="text-card-foreground hover:bg-muted"
                    >
                      VIP
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-bonus" className="text-card-foreground">
                  Bonus Percentage
                </Label>
                <Input
                  id="create-bonus"
                  type="number"
                  value={formData.bonusPercentage}
                  onChange={(e) =>
                    setFormData({ bonusPercentage: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="create-original"
                  className="text-card-foreground"
                >
                  Original Price (IDR)
                </Label>
                <Input
                  id="create-original"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ originalPrice: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-early"
                checked={formData.earlyAccess}
                onChange={(e) => setFormData({ earlyAccess: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Label
                htmlFor="create-early"
                className="cursor-pointer text-card-foreground"
              >
                Mark as early access package
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCreateDialog}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleCreate}
              disabled={mutations.createMutation.isPending}
            >
              {mutations.createMutation.isPending
                ? "Creating..."
                : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Edit Package
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update package information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-card-foreground">
                Package Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter package name"
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
                onChange={(e) => setFormData({ description: e.target.value })}
                placeholder="Enter package description"
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-points" className="text-card-foreground">
                  Voting Points
                </Label>
                <Input
                  id="edit-points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ points: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price" className="text-card-foreground">
                  Price (IDR)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ price: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-validity" className="text-card-foreground">
                  Validity Days
                </Label>
                <Input
                  id="edit-validity"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) =>
                    setFormData({ validityDays: Number(e.target.value) })
                  }
                  placeholder="30"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-support" className="text-card-foreground">
                  Support Type
                </Label>
                <Select
                  value={formData.supportType}
                  onValueChange={(value: SupportType) =>
                    setFormData({ supportType: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem
                      value={SupportType.BASIC}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Basic
                    </SelectItem>
                    <SelectItem
                      value={SupportType.PRIORITY}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Priority
                    </SelectItem>
                    <SelectItem
                      value={SupportType.PREMIUM}
                      className="text-card-foreground hover:bg-muted"
                    >
                      Premium
                    </SelectItem>
                    <SelectItem
                      value={SupportType.VIP}
                      className="text-card-foreground hover:bg-muted"
                    >
                      VIP
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-early"
                checked={formData.earlyAccess}
                onChange={(e) => setFormData({ earlyAccess: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Label
                htmlFor="edit-early"
                className="cursor-pointer text-card-foreground"
              >
                Mark as early access package
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditDialog}
              className="border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleEdit}
              disabled={mutations.updateMutation.isPending}
            >
              {mutations.updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Package Details
            </DialogTitle>
          </DialogHeader>
          {(selectedPackageDetail || selectedPackage) && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Coins className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">
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
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-card-foreground">
                    {(selectedPackageDetail || selectedPackage)?.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Voting Points
                    </Label>
                    <p className="text-2xl font-semibold text-primary mt-1">
                      {(selectedPackageDetail || selectedPackage)?.points}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Price</Label>
                    <p className="text-2xl font-semibold text-card-foreground mt-1">
                      Rp{" "}
                      {(
                        selectedPackageDetail || selectedPackage
                      )?.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Support Type
                    </Label>
                    <p className="text-xl font-semibold mt-1 text-card-foreground">
                      {(selectedPackageDetail || selectedPackage)?.supportType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Validity</Label>
                    <p className="text-xl font-semibold mt-1 text-card-foreground">
                      {(selectedPackageDetail || selectedPackage)?.validityDays}{" "}
                      days
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Price per Point
                    </Label>
                    <p className="text-xl font-semibold mt-1 text-card-foreground">
                      Rp{" "}
                      {Math.round(
                        (selectedPackageDetail || selectedPackage)!.price /
                          (selectedPackageDetail || selectedPackage)!.points
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bonus</Label>
                    <p className="text-xl font-semibold mt-1 text-card-foreground">
                      {(selectedPackageDetail || selectedPackage)
                        ?.bonusPercentage || 0}
                      %
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {(selectedPackageDetail || selectedPackage)?.isActive ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Delete Package
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{selectedPackage?.name}
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