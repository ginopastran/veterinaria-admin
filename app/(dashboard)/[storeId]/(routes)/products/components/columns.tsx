"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  nameTag: string;
  description: string;
  price: string;
  offerPrice: string | null;
  category: string;
  subcategory: string;
  // size: string;
  // color: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Marca",
  },
  {
    accessorKey: "nameTag",
    header: "Name Tag",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "offerPrice",
    header: "Offer Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
  },
  // {
  //   accessorKey: "size",
  //   header: "Size",
  // },
  // {
  //   accessorKey: "color",
  //   header: "Color",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-x-2">
  //       {row.original.color}
  //       <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
  //     </div>
  //   )
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
