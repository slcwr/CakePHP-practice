import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillTag } from "./SkillTag";

const meta = {
  title: "Components/SkillTag",
  component: SkillTag,
  args: { label: "Next.js" },
} satisfies Meta<typeof SkillTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Highlight: Story = { args: { variant: "highlight", label: "フルリモート可" } };
