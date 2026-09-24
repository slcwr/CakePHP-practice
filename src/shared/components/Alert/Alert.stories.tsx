import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
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
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: { children: "テキスト" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "メンテナンスのお知らせ",
    children: "9月25日 2:00〜4:00 の間、求人検索がご利用いただけません。",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "応募が完了しました",
    children: "企業からの連絡をお待ちください。応募履歴はマイページで確認できます。",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "まもなく掲載終了",
    children: "この求人は 3 日後に掲載を終了します。",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "送信できませんでした",
    children: "通信エラーが発生しました。時間をおいて再度お試しください。",
  },
};

/** タイトルなし。0件表示などで使う */
export const WithoutTitle: Story = {
  args: {
    variant: "info",
    children: "検索条件に一致する求人が 0 件でした。条件を変えてお試しください。",
  },
};

/** action あり。error.tsx の再試行ボタンを想定 */
export const WithAction: Story = {
  args: {
    variant: "error",
    title: "コラムを取得できませんでした",
    children: "WordPress に接続できません。",
    action: <Link href="/columns">再試行する</Link>,
  },
};

/** 長い文章でも折り返して崩れないことの確認 */
export const LongText: Story = {
  args: {
    variant: "warning",
    title: "とても長いタイトルが入った場合の表示確認用のお知らせです",
    children:
      "本文が長い場合の折り返しを確認します。アイコンの位置が上揃えのまま、本文だけが折り返されること、左の太い線が高さいっぱいに伸びることを確認してください。",
  },
};
