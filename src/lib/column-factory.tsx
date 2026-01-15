import { ColumnDef, Row } from "@tanstack/react-table";
import { RowActions } from "@/components/order-row-action";
import { CustomerRowActions } from "@/components/customer-row-action";
import { Order } from "@/types/order";
import { Customer } from "@/types/customer";
import { Product } from "@/types/product";
import { ProductRowActions } from "@/components/product-row-action";

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

export function createProductColumns(
  onDelete?: () => void
): ColumnDef<Product>[] {
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
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      id: "productAction",
      header: "Actions",
      cell: ({ row }: { row: Row<Product> }) => (
        <ProductRowActions
          product={row.original}
          onDelete={() => {
            onDelete?.();
          }}
          onSuccess={() => onDelete?.()}
        />
      ),
    },
  ];
}
