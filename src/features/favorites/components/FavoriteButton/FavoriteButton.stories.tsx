import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { FavoriteButton } from "./FavoriteButton";

const meta = {
  title: "Components/FavoriteButton",
  component: FavoriteButton,
  args: { jobId: "story-1" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = { args: { size: "md" } };
export const Small: Story = { args: { size: "sm" } };

/**
 * クリックでお気に入り状態が切り替わることを検証する（インタラクションテスト）。
 * Storybook の UI でも、vitest（src/test/stories.test.tsx）でも同じ手順が実行される。
 */
export const Toggle: Story = {
  args: { size: "md" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("お気に入り済み")).toBeInTheDocument();

    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  },
};
