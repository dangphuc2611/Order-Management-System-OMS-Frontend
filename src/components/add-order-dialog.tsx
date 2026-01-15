"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { api, fetcher } from "@/lib/api";
import { toast } from "sonner";

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderDialogProps {
  onSuccess?: () => void;
}

export function OrderDialog({ onSuccess }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch customers and products using API service
  const { data: customers, isLoading: customersLoading } = useSWR<Customer[]>(
    "/api/customers/all",
    fetcher
  );
  const { data: products, isLoading: productsLoading } = useSWR<Product[]>(
    "/api/products",
    fetcher
  );

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customerId: Number.parseInt(customerId),
        items: items.map((item) => ({
          productId: Number.parseInt(item.productId),
          quantity: item.quantity,
        })),
      };

      await api.orders.create(orderData);
      toast.success("Order successfully");
      setOpen(false);
      // Reset form
      setCustomerId("");
      setItems([{ productId: "", quantity: 1 }]);
      onSuccess?.();
    } catch (error: Error | unknown) {
      const message =
        error instanceof Error ? error.message : "Đặt hàng thất bại!";
      console.error("Error:", error);
      toast.error("Order unsuccessfully");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="mb-3">
        <Button>Create Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose customer..." />
              </SelectTrigger>
              <SelectContent>
                {customersLoading ? (
                  <SelectItem value="_loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  customers?.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Products</label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  {/* Quantity Input */}
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      placeholder="Quantity"
                    />
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <Button
              variant="outline"
              onClick={handleAddItem}
              className="w-full gap-2 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add Products
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !customerId ||
                items.some((item) => !item.productId) ||
                isSubmitting
              }
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt Hàng"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
