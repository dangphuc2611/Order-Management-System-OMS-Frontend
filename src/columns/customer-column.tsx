"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { RowActions } from "@/components/row-action";
import { CustomerRowActions } from "@/components/customer-row-action";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "customerActions",
    header: "Actions",
    cell: ({ row }: { row: Row<Customer> }) => (
      <CustomerRowActions customer={row.original} onDelete={() => {}} />
    ),
  },
];
