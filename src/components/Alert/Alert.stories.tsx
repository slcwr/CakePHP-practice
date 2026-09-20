import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Uh2Vx34Gg5CouJVWRsVKcN/Untitled",
    },
  },
  args: { children: "テキスト" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { variant: "info", title: "メンテナンスのお知らせ" } };
export const Success: Story = { args: { variant: "success", title: "応募が完了しました" } };
export const Warning: Story = { args: { variant: "warning", title: "まもなく掲載終了" } };
export const Error: Story = { args: { variant: "error", title: "送信できませんでした" } };
export const WithoutTitle: Story = { args: { children: "検索条件に一致する求人が 0 件でした。" } };

