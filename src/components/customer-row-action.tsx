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

interface CustomerRowActionsProps {
  customer: Customer;
  onDelete: (customer: Customer) => void;
}

export function CustomerRowActions({
  customer,
  onDelete,
}: CustomerRowActionsProps) {
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
              if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

              const id = customer.id;
              if (!id) {
                console.error("Delete failed: no id on data", customer);
                return;
              }

              setIsDeleting(true);
              try {
                await api.customers.delete(id);
                onDelete(customer);
              } catch (err: Error | unknown) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Lỗi khi xóa khách hàng!";
                console.error("Error deleting customer:", err);
                alert(message);
              } finally {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
            className="cursor-pointer focus:bg-destructive/10 text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>{isDeleting ? "Đang xóa..." : "Delete"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomerDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={customer}
      />
    </>
  );
}
