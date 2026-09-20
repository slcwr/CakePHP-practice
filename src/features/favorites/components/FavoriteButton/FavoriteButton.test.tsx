import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("クリックでお気に入り状態がトグルされ localStorage に保存される", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton jobId="1001" />);

    const button = screen.getByRole("button", { name: /お気に入り/ });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("お気に入り済み");
    expect(JSON.parse(window.localStorage.getItem("favorite-job-ids")!)).toEqual(["1001"]);

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("同じ求人のボタン同士で状態が同期する", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FavoriteButton jobId="1002" />
        <FavoriteButton jobId="1002" />
      </>,
    );
    const [first, second] = screen.getAllByRole("button");
    await user.click(first);
    expect(second).toHaveAttribute("aria-pressed", "true");
  });
});
