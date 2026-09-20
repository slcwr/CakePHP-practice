import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { JobCard } from "./JobCard";
import { jobs } from "@/features/jobs/fixtures";

const meta = {
  title: "Components/JobCard",
  component: JobCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: { job: jobs[0] },
} satisfies Meta<typeof JobCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Onsite: Story = {
  args: { job: { ...jobs[1], remote: false } },
};

export const ManySkills: Story = {
  args: {
    job: {
      ...jobs[5],
      title:
        "とても長い求人タイトルが入った場合の表示確認用テックリード（React/TypeScript/GraphQL）",
      skills: [
        "React",
        "TypeScript",
        "Storybook",
        "GraphQL",
        "Vitest",
        "Playwright",
        "AWS",
        "Terraform",
      ],
    },
  },
};
