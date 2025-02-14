import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Instance from "@/app/lib/Instance";
import { Product, ProductData } from "../lib/type";

const useProducts = (currentPage: number, limit: number) => {
  return useQuery<ProductData, Error>({
    queryKey: ["products", currentPage, limit],
    queryFn: async (): Promise<ProductData> => {
      const param = {
        params: {
          _page: currentPage,
          _limit: limit,
        },
      };

      try {
        const res = await Instance.get<Product[]>("products", param);

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Invalid response data");
        }

        return {
          data: res.data,
          totalItems: parseInt(res.headers["x-total-count"], 10) || 0,
        };
      } catch (err) {
        console.error("Fetching products failed:", err);
        throw new Error(
          err instanceof Error
            ? `Error loading product: ${err.message}`
            : "Unknown error occurred while fetching products."
        );
      }
    },
  });
};

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Product>({
    mutationFn: async (newProduct) => {
      try {
        const res = await Instance.post("products", newProduct);
        return res.data;
      } catch (err) {
        if (err instanceof Error) {
          throw new Error("Error creating product: " + err.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Product>({
    mutationFn: async (updatedProduct) => {
      try {
        const res = await Instance.put(
          `products/${updatedProduct.id}`,
          updatedProduct
        );
        return res.data;
      } catch (err) {
        if (err instanceof Error) {
          throw new Error("Error updating product: " + err.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (productId) => {
      try {
        await Instance.delete(`products/${productId}`);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error("Error deleting product: " + err.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct };
