import type { Preview } from "@storybook/nextjs-vite";
import { Noto_Sans_JP } from "next/font/google";
import "../src/app/globals.css";

// Storybook は app/layout.tsx を使わないので、フォントはここで適用する
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-base",
});

const preview: Preview = {
  parameters: {
    // next/navigation を使うコンポーネント用
    nextjs: { appDirectory: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  decorators: [
    (Story) => (
      <div className={notoSansJP.variable} style={{ fontFamily: "var(--font-base)" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
