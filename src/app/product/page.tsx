"use client";

import { useState, useRef } from "react";
import { ProductTable } from "@/components/product-table";
import AddProductDialog from "@/components/add-product-dialog";

export default function ProductPage() {
  const [pageNo, setPageNo] = useState(0);
  const tableRef = useRef<{ refresh: () => void } | null>(null);

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  return (
    <div className="p-5">
      <AddProductDialog onSuccess={handleRefresh} />

      <ProductTable
        ref={tableRef}
        pageNo={pageNo}
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
