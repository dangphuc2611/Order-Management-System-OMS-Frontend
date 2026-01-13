"use client";

import { DataTable } from "@/components/table";
import { Customer } from "@/types/customer";
import AddCustomerDialog from "@/components/add-customer-dialog";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { createCustomerColumns } from "@/lib/column-factory";
import { useDebounce } from "@/hooks/useDebounce";

export default function CustomerPage() {
  const [pageNo, setPageNo] = useState(0);
  const [inputName, setInputName] = useState("");
  const debouncedName = useDebounce(inputName, 300);

  const query = new URLSearchParams();
  query.append("pageNo", pageNo.toString());
  if (debouncedName) {
    query.append("name", debouncedName);
  }

  const {
    data: customers,
    isLoading,
    mutate,
  } = useSWR<Customer[]>(`/api/customers?${query.toString()}`, fetcher);

  const columns = createCustomerColumns(() => mutate());

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
      <AddCustomerDialog onSuccess={() => mutate()} />
      <div className="py-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setPageNo(0); // Reset to first page when filtering
          }}
          className="px-3 py-2 border border-gray-300 rounded-md max-w-sm"
        />
      </div>
      <DataTable<Customer>
        data={customers || []}
        columns={columns}
        filterColumn={undefined}
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
