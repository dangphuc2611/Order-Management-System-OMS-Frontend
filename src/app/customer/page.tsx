"use client";

import AddCustomerDialog from "@/components/add-customer-dialog";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomerTable } from "@/components/customer-table";

export default function CustomerPage() {
  const [pageNo, setPageNo] = useState(0);
  const [inputName, setInputName] = useState("");
  const debouncedName = useDebounce(inputName, 300);

  return (
    <div className="p-5">
      <AddCustomerDialog onSuccess={() => {}} />
      <div className="py-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setPageNo(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md max-w-sm"
        />
      </div>
      <CustomerTable
        pageNo={pageNo}
        debouncedName={debouncedName}
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
