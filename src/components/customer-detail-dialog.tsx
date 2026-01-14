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

interface CustomerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  onDelete?: (id: string) => void;
}

export function CustomerDetailDialog({
  open,
  onOpenChange,
  customer,
  onDelete,
}: CustomerDetailDialogProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = async () => {
    if (!customer?.id) return;

    setIsLoading(true);
    try {
      await api.customers.update(customer.id, formData);
      toast.success("Customer Updated successfully");
      onOpenChange(false);
    } catch (error: Error | unknown) {
      const message =
        error instanceof Error ? error.message : "Error while update customer";
      console.error("Error updating customer:", error);
      toast.error("Update customer unsuccessfully");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer?.id) return;

    if (!confirm("Are you sure to delete this customer?")) return;

    setIsLoading(true);
    try {
      await api.customers.delete(customer.id);
      toast.success("Customer deleted successfully");
      onOpenChange(false);
      onDelete?.(customer.id);
    } catch (error: Error | unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Delete customer unsuccessfully";
      console.error("Error deleting customer:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
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
