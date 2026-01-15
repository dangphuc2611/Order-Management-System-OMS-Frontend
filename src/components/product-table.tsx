"use client";

import { DataTable } from "@/components/table";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { createProductColumns } from "@/lib/column-factory";
import React, { forwardRef, useImperativeHandle } from "react";
import { Product } from "@/types/product";

interface ProductTableProps {
  pageNo: number;
  onPageChange: (direction: "next" | "prev") => void;
}

export const ProductTable = React.memo(
  forwardRef<{ refresh: () => void }, ProductTableProps>(
    ({ pageNo, onPageChange }, ref) => {
      const query = new URLSearchParams();
      query.append("pageNo", pageNo.toString());

      const { data, isLoading, mutate } = useSWR<{
        content: Product[];
        totalPages: number;
      }>(`/api/products?${query.toString()}`, fetcher);

      useImperativeHandle(ref, () => ({
        refresh: () => {
          mutate();
        },
      }));

      const columns = createProductColumns(() => mutate());

      if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
      }

      return (
        <DataTable<Product>
          data={data?.content || []}
          columns={columns}
          currentPage={pageNo}
          totalPages={data?.totalPages || 0}
          onPageChange={onPageChange}
        />
      );
    }
  )
);

ProductTable.displayName = "ProductTable";
