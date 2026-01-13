"use client";

import { DataTable } from "@/components/table";
import { Order } from "@/types/order";
import { OrderDialog } from "@/components/add-order-dialog";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { createOrderColumns } from "@/lib/column-factory";

export default function OrderPage() {
  const [pageNo, setPageNo] = useState(0);
  const [status, setStatus] = useState("");

  const query = new URLSearchParams();
  query.append("pageNo", pageNo.toString());
  if (status) {
    query.append("status", status);
  }

  const {
    data: orders,
    isLoading,
    mutate,
  } = useSWR<Order[]>(`/api/orders?${query.toString()}`, fetcher);

  const columns = createOrderColumns(() => mutate());

  if (isLoading) {
    return (
      <div className="p-5 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <OrderDialog onSuccess={() => mutate()} />
      <div className="py-4 flex gap-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPageNo(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Status</option>
          <option value="NEW">New</option>
          <option value="PAID">Paid</option>
          <option value="CANCEL">Cancel</option>
        </select>
      </div>
      <DataTable<Order>
        data={orders || []}
        columns={columns}
        onPageChange={(direction) => {
          if (direction === "next") {
            setPageNo((prev) => prev + 1);
          } else {
            setPageNo((prev) => Math.max(0, prev - 1));
          }
        }}
      />
    </div>
  );
}
