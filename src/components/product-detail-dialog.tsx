"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/types/customer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onDelete?: (id: string) => void;
  onSuccess?: () => void | Promise<void>;
}

export function ProductDetailDialog({
  open,
  onOpenChange,
  product,
  onDelete,
  onSuccess,
}: ProductDetailDialogProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = async () => {
    if (!product?.id) return;

    setIsLoading(true);
    try {
      await api.products.update(product.id, formData);
      toast.success("Product Updated successfully");
      onOpenChange(false);
      await onSuccess?.();
    } catch (error: Error | unknown) {
      const message =
        error instanceof Error ? error.message : "Error while update product";
      console.error("Error updating product:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;

    if (!confirm("Are you sure to delete this product?")) return;

    setIsLoading(true);
    try {
      await api.products.delete(product.id);
      toast.success("Product deleted successfully");
      onOpenChange(false);
      onDelete?.(product.id);
    } catch (error: Error | unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Delete product unsuccessfully";
      console.error("Error deleting product:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {/* <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button> */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button onClick={handleEdit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
