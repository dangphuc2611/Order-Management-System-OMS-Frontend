"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderItem } from "@/types/order-item";
import { api } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowLeftCircleIcon, ArrowUpIcon } from "lucide-react";

interface Order {
  id: number;
  orderCode: string;
  customerId: number;
  customerName: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api.orders.getById(orderId);
        setOrder(data as unknown as Order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="mx-auto my-6 max-w-(--breakpoint-xl)">
          <CardHeader>
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <Card className="mx-auto my-6 max-w-(--breakpoint-xl)">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500">Error</CardTitle>
            <CardDescription>{error || "Order not found"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalOrders = order.orderItems.length;
  const totalAmount = order.totalAmount;
  const lastOrder = order.createdAt;

  return (
    <div className="p-6">
      <Link href={"/order"} className="flex">
        <ArrowLeftCircleIcon className="mr-2" />
        Back to orders
      </Link>
      <Card className="mx-auto my-6 max-w-(--breakpoint-xl)">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:space-y-0 md:gap-x-6">
          <div>
            <CardTitle className="text-2xl">Order Details</CardTitle>
            <CardDescription className="text-balance">
              Order Code: {order.orderCode}
            </CardDescription>
          </div>
          <div className="text-muted-foreground text-end text-sm max-sm:text-start">
            <p>Total Items: {totalOrders}</p>
            <p>Order Date: {new Date(lastOrder).toLocaleDateString()}</p>
            <p>
              Status: <span className="font-semibold">{order.status}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p>
              <strong>Customer:</strong> {order.customerName}
            </p>
            <p>
              <strong>Customer ID:</strong> {order.customerId}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="text-end font-semibold">
                  Quantity
                </TableHead>
                <TableHead className="text-end font-semibold">Price</TableHead>
                <TableHead className="text-end font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={"/placeholder.svg"}
                      alt={item.productName}
                      width={100}
                      height={100}
                      className="size-16 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-end">{item.quantity}</TableCell>
                  <TableCell className="text-end">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-end">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="font-semibold hover:bg-transparent">
                <TableCell colSpan={3} className="text-end">
                  Total:
                </TableCell>
                <TableCell className="text-end">
                  ${totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4">
          <Button variant="secondary" className="cursor-pointer">
            Download Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
