import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("menampilkan teks Dashboard Page", () => {
    render(<Home />);
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });
});
