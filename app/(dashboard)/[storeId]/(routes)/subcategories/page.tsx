import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SubcategoryColumn } from "./components/columns";
import { SubcategoriesClient } from "./components/client";

const SubcategoriesPage = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  const subcategories = await prismadb.subcategory.findMany({
    where: {
      category: {
        storeId: params.storeId,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSubcategories: SubcategoryColumn[] = subcategories.map(
    (item) => ({
      id: item.id,
      category: item.category.name,
      name: item.name,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubcategoriesClient data={formattedSubcategories} />
      </div>
    </div>
  );
};

export default SubcategoriesPage;
