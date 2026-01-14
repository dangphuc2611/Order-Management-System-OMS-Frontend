"use client";

import { OrderDialog } from "@/components/add-order-dialog";
import { useState } from "react";
import { OrderTable } from "@/components/order-table";

export default function OrderPage() {
  const [pageNo, setPageNo] = useState(0);
  const [status, setStatus] = useState("");

  return (
    <div className="p-5">
      <OrderDialog onSuccess={() => {}} />
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
      <OrderTable
        pageNo={pageNo}
        status={status}
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
