import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Instance from "../lib/Instance";
import { User, UserData } from "../lib/type";

const useUsers = (currentPage: number, limit: number) => {
  return useQuery<UserData, Error>({
    queryKey: ["users", currentPage, limit],
    queryFn: async (): Promise<UserData> => {
      const param = {
        params: {
          _page: currentPage,
          _limit: limit,
        },
      };

      try {
        const res = await Instance.get<User[]>("users", param);

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Invalid response data");
        }

        return {
          data: res.data,
          totalItems: parseInt(res.headers["x-total-count"], 10) || 0,
        };
      } catch (err) {
        console.error("Fetching users failed:", err);
        throw new Error(
          err instanceof Error
            ? `Error loading users: ${err.message}`
            : "Unknown error occurred while fetching users."
        );
      }
    },
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({
    mutationFn: async (newUser) => {
      try {
        const res = await Instance.post<User>("users", newUser);
        return res.data;
      } catch (err) {
        console.error("Creating user failed:", err);
        throw new Error(
          err instanceof Error
            ? `Error creating user: ${err.message}`
            : "Unknown error occurred while creating user."
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>({
    mutationFn: async (updatedUser) => {
      try {
        const res = await Instance.put<User>(
          `users/${updatedUser.id}`,
          updatedUser
        );
        return res.data;
      } catch (err) {
        console.error("Updating user failed:", err);
        throw new Error(
          err instanceof Error
            ? `Error updating user: ${err.message}`
            : "Unknown error occurred while updating user."
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      try {
        await Instance.delete(`users/${userId}`);
      } catch (err) {
        console.error("Deleting user failed:", err);
        throw new Error(
          err instanceof Error
            ? `Error deleting user: ${err.message}`
            : "Unknown error occurred while deleting user."
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export { useUsers, useCreateUser, useUpdateUser, useDeleteUser };
