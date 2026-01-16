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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order } from "@/types/order";
import { toast } from "sonner";
import Link from "next/link";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const STATUS_OPTIONS = [
  { label: "NEW", value: "NEW" },
  { label: "PAID", value: "PAID" },
  { label: "CANCEL", value: "CANCEL" },
];

export function DetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const [status, setStatus] = useState(order?.status || "pending");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input
              id="customer-name"
              value={order.customerName || ""}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Order Code */}
          <div className="space-y-2">
            <Label htmlFor="order-code">Order Code</Label>
            <Input
              id="order-code"
              value={order.id || ""}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Status - Editable */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Created At */}
          <div className="space-y-2">
            <Label htmlFor="created-at">Created At</Label>
            <Input
              id="created-at"
              value={new Date(order.createdAt).toLocaleString() || ""}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <Label htmlFor="total-amount">Total Amount</Label>
            <Input
              id="total-amount"
              value={`$${order.totalAmount?.toFixed(2) || "0.00"}`}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <DialogFooter>
          <Link
            href={`/order/order-detail/${order.id}`}
            className="border rounded-md inline-flex justify-center gap-2 whitespace-nowrap font-medium transition-all items-center text-sm text- py-2 px-4 shadow-xs"
          >
            Order Items
          </Link>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            className="h-full"
          >
            {isLoading ? "Updating..." : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
