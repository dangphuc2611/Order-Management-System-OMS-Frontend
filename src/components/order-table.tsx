"use client";

import { DataTable } from "@/components/table";
import { Order } from "@/types/order";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { createOrderColumns } from "@/lib/column-factory";
import React from "react";

interface OrderTableProps {
  pageNo: number;
  onPageChange: (direction: "next" | "prev") => void;
  status: string;
}

export const OrderTable = React.memo(
  ({ pageNo, onPageChange, status }: OrderTableProps) => {
    const query = new URLSearchParams();
    query.append("pageNo", pageNo.toString());
    if (status) {
      query.append("status", status);
    }

    const { data, isLoading, mutate } = useSWR<{
      content: Order[];
      totalPages: number;
    }>(`/api/orders?${query.toString()}`, fetcher);

    const columns = createOrderColumns(() => mutate());

    if (isLoading) {
      return <Skeleton className="h-64 w-full" />;
    }

    return (
      <DataTable<Order>
        data={data?.content || []}
        columns={columns}
        currentPage={pageNo}
        totalPages={data?.totalPages || 0}
        onPageChange={onPageChange}
      />
    );
  }
);

OrderTable.displayName = "OrderTable";
