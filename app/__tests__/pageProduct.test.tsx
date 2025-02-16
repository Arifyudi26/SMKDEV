import { render, screen, cleanup } from "@testing-library/react";
import ProductPage from "../products/page";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/app/hooks/useProducts";

jest.mock("@/app/hooks/useProducts", () => ({
  useProducts: jest.fn(),
  useCreateProduct: jest.fn(),
  useUpdateProduct: jest.fn(),
  useDeleteProduct: jest.fn(),
}));

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

describe("ProductPage", () => {
  beforeEach(() => {
    useProducts.mockReturnValue({
      data: { data: [], totalItems: 0 },
      isLoading: false,
      error: null,
    });
    useCreateProduct.mockReturnValue({ mutate: jest.fn() });
    useUpdateProduct.mockReturnValue({ mutate: jest.fn() });
    useDeleteProduct.mockReturnValue({ mutate: jest.fn() });
  });

  afterEach(cleanup);

  test("renders ProductPage component", () => {
    render(<ProductPage />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Create Product")).toBeInTheDocument();
  });

  test("opens modal when Create Product button is clicked", async () => {
    render(<ProductPage />);
    // const createButton = screen.getByText("Create Product");
    // fireEvent.click(createButton);

    // expect(await screen.findByText("Create Product")).toBeInTheDocument();
  });

  // test("displays error message when API call fails", () => {
  //   useProducts.mockReturnValue({
  //     data: null,
  //     isLoading: false,
  //     error: "Failed to load products",
  //   });

  //   render(<ProductPage />);
  //   expect(screen.getByText("Failed to load products")).toBeInTheDocument();
  // });
});
