"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Invalid Product's Name"),
  price: z
    .string()
    .min(1, "Invalid Product's price")
    .regex(/^\d+(\.\d+)?$/, "Price must be a number"),
  stock: z
    .string()
    .min(1, "Invalid Product's stock")
    .regex(/^\d+$/, "Stock must be a number"),
});
type ProductForm = z.infer<typeof productSchema>;

interface AddProductDialogProps {
  onSuccess?: () => void;
}

export default function AddProductDialog({ onSuccess }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
    },
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      await api.products.create(data);
      toast.success("Create product successfully");
      reset();
      setOpen(false);
      await onSuccess?.();
    } catch (error) {
      console.log(error);
      toast.error("Create product unsuccessfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="bg-black text-white">
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <div>
            <Label className="mb-2">Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Price</Label>
            <Input {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">Stock</Label>
            <Input {...register("stock")} />
            {errors.stock && (
              <p className="text-sm text-red-500 mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
