"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Subcategory } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().min(1),
});

type SubcategoryFormValues = z.infer<typeof formSchema>;

interface SubcategoryFormProps {
  initialData: Subcategory | null;
  categories: Category[];
}

export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar subcategoría" : "Crear subcategoría";
  const description = initialData
    ? "Editar la subcategoría."
    : "Añadir nueva subcategoría.";
  const toastMessage = initialData
    ? "Subcategoría actualizada."
    : "Subcategoría creada";
  const action = initialData ? "Guardar cambios" : "Crear";

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        name: "",
        categoryId: "",
      };

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: SubcategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/subcategories/${params.subcategoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/subcategories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/subcategories`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/subcategories/${params.subcategoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/subcategories`);
      toast.success("Subcategoría eliminada.");
    } catch (error: any) {
      toast.error(
        "Primero asegúrese de eliminar todos los productos que utilizan esta subcategoría."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre de la subcategoría"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { Trash } from "lucide-react";
// import { Category, Subcategory } from "@prisma/client";
// import { useParams, useRouter } from "next/navigation";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Separator } from "@/components/ui/separator";
// import { Heading } from "@/components/ui/heading";
// import { AlertModal } from "@/components/modals/alert-modal";

// const formSchema = z.object({
//   name: z.string().min(2),
//   categoryId: z.string().min(1),
// });

// type SubcategoryFormValues = z.infer<typeof formSchema>;

// interface SubcategoryFormProps {
//   initialData: Subcategory | null;
//   categories: Category[];
// }

// export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
//   initialData,
//   categories,
// }) => {
//   const params = useParams();
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const title = initialData ? "Edit subcategory" : "Create subcategory";
//   const description = initialData
//     ? "Edit a subcategory."
//     : "Add a new subcategory";
//   const toastMessage = initialData
//     ? "Subcategory updated."
//     : "Subcategory created.";
//   const action = initialData ? "Save changes" : "Create";

//   const defaultValues = initialData
//     ? {
//         ...initialData,
//       }
//     : {
//         name: "",
//         categoryId: "",
//       };

//   const form = useForm<SubcategoryFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues,
//   });

//   const onSubmit = async (data: SubcategoryFormValues) => {
//     try {
//       setLoading(true);
//       if (initialData) {
//         await axios.patch(
//           `/api/${params.storeId}/subcategories/${params.subcategoryId}`,
//           data
//         );
//       } else {
//         await axios.post(`/api/${params.storeId}/subcategories`, data);
//       }
//       router.refresh();
//       router.push(`/${params.storeId}/subcategories`);
//       toast.success(toastMessage);
//     } catch (error: any) {
//       toast.error("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(
//         `/api/${params.storeId}/subcategories/${params.subcategoryId}`
//       );
//       router.refresh();
//       router.push(`/${params.storeId}/subcategories`);
//       toast.success("Subcategory deleted.");
//     } catch (error: any) {
//       toast.error(
//         "Make sure you removed all products using this subcategory first."
//       );
//     } finally {
//       setLoading(false);
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       <AlertModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onDelete}
//         loading={loading}
//       />
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={loading}
//             variant="destructive"
//             size="sm"
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-8 w-full"
//         >
//           <div className="md:grid md:grid-cols-3 gap-8">
//             <FormField
//               control={form.control}
//               name="categoryId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Category ID</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={loading}
//                       placeholder="Category ID"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={loading}
//                       placeholder="Subcategory name"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <Button disabled={loading} className="ml-auto" type="submit">
//             {action}
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };
