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
import { DetailDialog } from "./detail-order-dialog";
import { api } from "@/lib/api";

interface RowActionsProps<TData extends { id: string }> {
  data: TData;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
}

export function RowActions<TData extends { id: string }>({
  data,
  onEdit,
  onDelete,
}: RowActionsProps<TData>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDetail = () => {
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    const id = data.id;
    if (!id) {
      console.error("Delete failed: no id on data", data);
      return;
    }

    setIsDeleting(true);
    try {
      await api.orders.delete(id);
      onDelete?.(data);
    } catch (err: Error | unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi xóa đơn hàng!";
      console.error("Error deleting order:", err);
      alert(message);
    } finally {
      setIsDeleting(false);
    }
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
          {onEdit && (
            <>
              <DropdownMenuItem
                onClick={handleDetail}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Detail</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              className="cursor-pointer focus:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>{isDeleting ? "Đang xóa..." : "Delete"}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={data}
      />
    </>
  );
}
