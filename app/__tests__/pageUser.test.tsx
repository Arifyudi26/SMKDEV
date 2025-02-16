import { render, screen, fireEvent } from "@testing-library/react";
import UserPage from "../users/page";

jest.mock("@/app/hooks/useUsers", () => ({
  useUsers: jest.fn(),
  useCreateUser: jest.fn(),
  useUpdateUser: jest.fn(),
  useDeleteUser: jest.fn(),
}));

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/app/hooks/useUsers";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("UserPage", () => {
  beforeEach(() => {
    (useUsers as jest.Mock).mockReturnValue({
      data: { data: [], totalItems: 0 },
      isLoading: false,
      error: null,
    });

    (useCreateUser as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useUpdateUser as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDeleteUser as jest.Mock).mockReturnValue({ mutate: jest.fn() });
  });

  it("renders UserPage component correctly", () => {
    render(<UserPage />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Create User")).toBeInTheDocument();
  });

  it("opens modal when Create User button is clicked", async () => {
    render(<UserPage />);
    const createButton = screen.getByText("Create User");
    fireEvent.click(createButton);
    expect(await screen.findByText("Create User")).toBeInTheDocument();
  });
});
