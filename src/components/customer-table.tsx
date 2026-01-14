"use client";

import { DataTable } from "@/components/table";
import { Customer } from "@/types/customer";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { createCustomerColumns } from "@/lib/column-factory";
import React from "react";

interface CustomerTableProps {
  pageNo: number;
  onPageChange: (direction: "next" | "prev") => void;
  debouncedName: string;
}

export const CustomerTable = React.memo(
  ({ pageNo, onPageChange, debouncedName }: CustomerTableProps) => {
    const query = new URLSearchParams();
    query.append("pageNo", pageNo.toString());
    if (debouncedName) {
      query.append("name", debouncedName);
    }

    const { data, isLoading, mutate } = useSWR<{
      content: Customer[];
      totalPages: number;
    }>(`/api/customers?${query.toString()}`, fetcher);

    const columns = createCustomerColumns(() => mutate());

    if (isLoading) {
      return <Skeleton className="h-64 w-full" />;
    }

    return (
      <DataTable<Customer>
        data={data?.content || []}
        columns={columns}
        currentPage={pageNo}
        totalPages={data?.totalPages || 0}
        onPageChange={onPageChange}
      />
    );
  }
);

CustomerTable.displayName = "CustomerTable";
