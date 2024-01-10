"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Panel",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categorías",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/subcategories`,
      label: "Subcategorías",
      active: pathname === `/${params.storeId}/subcategories`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Productos",
      active: pathname === `/${params.storeId}/products`,
    },

    // {
    //   href: `/${params.storeId}/colors`,
    //   label: "Colors",
    //   active: pathname === `/${params.storeId}/colors`,
    // },
    // {
    //   href: `/${params.storeId}/sizes`,
    //   label: "Sizes",
    //   active: pathname === `/${params.storeId}/sizes`,
    // },
    {
      href: `/${params.storeId}/orders`,
      label: "Ordenes",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Configuración",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
