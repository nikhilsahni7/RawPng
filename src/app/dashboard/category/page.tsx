/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  _id: string;
  name: string;
  type: "png" | "vector" | "image";
  active: boolean;
  showInNavbar: boolean;
}

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("active");
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    type: "png" as "png" | "vector" | "image",
    showInNavbar: false,
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "png" as "png" | "vector" | "image",
    showInNavbar: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryForm.name.trim()) return;

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategoryForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add category");
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryForm({
        name: "",
        type: "png",
        showInNavbar: false,
      });
      toast.success("Category added successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add category"
      );
    }
  };

  const handleUpdateCategory = async (
    id: string,
    updates: Partial<Category>
  ) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          type: editForm.type as "png" | "vector" | "image",
          showInNavbar: editForm.showInNavbar,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      await fetchCategories();
      setIsEditDialogOpen(false);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    activeTab === "active" ? category.active : !category.active
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ">
      <DashboardHeader />

      <div className="container max-w-5xl mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-200 text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 ">
            Add New Category
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                value={newCategoryForm.name}
                onChange={(e) =>
                  setNewCategoryForm({
                    ...newCategoryForm,
                    name: e.target.value,
                  })
                }
                placeholder="Category name"
                className="w-full"
              />
              <Select
                value={newCategoryForm.type}
                onValueChange={(value: "png" | "vector" | "image") =>
                  setNewCategoryForm({ ...newCategoryForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="vector">Vector</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newCategoryForm.showInNavbar}
                  onCheckedChange={(checked) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      showInNavbar: checked,
                    })
                  }
                />
                <span>Show in navbar</span>
              </div>
              <Button type="submit">Add Category</Button>
            </div>
          </form>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>

          <Tabs
            defaultValue="active"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="active" className="flex-1 sm:flex-none">
                Active Categories
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex-1 sm:flex-none">
                Inactive Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-md space-y-4 sm:space-y-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="font-medium text-gray-800">
                        {category.name}
                      </span>
                      <Badge className="w-fit bg-blue-500 text-white">
                        {category.type}
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.showInNavbar}
                          onCheckedChange={async (checked) => {
                            try {
                              await handleUpdateCategory(category._id, {
                                showInNavbar: checked,
                              });
                              // Update local state immediately
                              setCategories(
                                categories.map((cat) =>
                                  cat._id === category._id
                                    ? { ...cat, showInNavbar: checked }
                                    : cat
                                )
                              );
                            } catch (error) {
                              toast.error("Failed to update navbar visibility");
                            }
                          }}
                        />
                        <span className="text-sm">Show in navbar</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.active}
                          onCheckedChange={async (checked) => {
                            try {
                              await handleUpdateCategory(category._id, {
                                active: checked,
                              });
                              // Update local state immediately
                              setCategories(
                                categories.map((cat) =>
                                  cat._id === category._id
                                    ? { ...cat, active: checked }
                                    : cat
                                )
                              );
                            } catch (error) {
                              toast.error("Failed to update active status");
                            }
                          }}
                        />
                        <span className="text-sm">Active</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setEditForm({
                            name: category.name,
                            type: category.type,
                            showInNavbar: category.showInNavbar,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow opacity-60"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{category.name}</span>
                      <Badge>{category.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.active}
                          onCheckedChange={async (checked) => {
                            try {
                              await handleUpdateCategory(category._id, {
                                active: checked,
                              });
                              // Update local state immediately
                              setCategories(
                                categories.map((cat) =>
                                  cat._id === category._id
                                    ? { ...cat, active: checked }
                                    : cat
                                )
                              );
                            } catch (error) {
                              toast.error("Failed to update active status");
                            }
                          }}
                        />
                        <span className="text-sm">Activate</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gray-800">Edit Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Category name"
              />
              <Select
                value={editForm.type}
                onValueChange={(value: "png" | "vector" | "image") =>
                  setEditForm({ ...editForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="vector">Vector</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.showInNavbar}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, showInNavbar: checked })
                  }
                />
                <span>Show in navbar</span>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
