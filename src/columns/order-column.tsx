"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "@/components/order-row-action";
import { Order } from "@/types/order";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "orderCode",
    header: "Order Code",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "customerId",
    header: "Customer Id",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions
        data={row.original}
        onEdit={(p) => console.log("Edit:", p)}
        onDelete={(p) => {
          location.reload();
        }}
      />
    ),
  },
];
