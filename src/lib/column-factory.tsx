import { ColumnDef, Row } from "@tanstack/react-table";
import { RowActions } from "@/components/row-action";
import { CustomerRowActions } from "@/components/customer-row-action";
import { Order } from "@/types/order";
import { Customer } from "@/types/customer";

export function createOrderColumns(onDelete?: () => void): ColumnDef<Order>[] {
  return [
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
      cell: ({ row }: { row: Row<Order> }) => (
        <RowActions
          data={row.original}
          onEdit={(p) => console.log("Edit:", p)}
          onDelete={(p) => {
            onDelete?.();
          }}
        />
      ),
    },
  ];
}

export function createCustomerColumns(
  onDelete?: () => void
): ColumnDef<Customer>[] {
  return [
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
        <CustomerRowActions
          customer={row.original}
          onDelete={() => {
            onDelete?.();
          }}
        />
      ),
    },
  ];
}
