"use client";

import { ColumnDef } from "@tanstack/react-table";

type FormData = {
  emailAddress: string;
  name: string;
  deliveryOption: string;
  phone: string;
  address: string;
};

export type OrderColumn = {
  id: string;
  name: string;
  emailAddress: string;
  phone: string;
  address: string;
  deliveryOption: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
  formData?: FormData;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "emailAddress",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "deliveryOption",
    header: "deliveryOption",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
];
