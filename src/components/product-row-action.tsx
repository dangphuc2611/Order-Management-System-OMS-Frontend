"use client";

import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CustomerDetailDialog } from "@/components/customer-detail-dialog";
import { Customer } from "@/types/customer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { ProductDetailDialog } from "./product-detail-dialog";

interface ProductRowActionsProps {
  product: Product;
  onDelete: (product: Product) => void;
  onSuccess?: () => void | Promise<void>;
}

export function ProductRowActions({
  product,
  onDelete,
  onSuccess,
}: ProductRowActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDetail = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleDetail} className="cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            <span>Detail</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              if (!confirm("Are you sure to delete this product?")) return;

              const id = product.id;
              if (!id) {
                console.error("Delete failed: no id on data", product);
                return;
              }

              setIsDeleting(true);
              try {
                await api.products.delete(id);
                onDelete(product);
              } catch (err: Error | unknown) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Delete product unsuccessfully";
                console.error("Error deleting product:", err);
                toast.error(message);
              } finally {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
            className="cursor-pointer focus:bg-destructive/10 text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={product}
        onSuccess={onSuccess}
      />
    </>
  );
}
