import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
