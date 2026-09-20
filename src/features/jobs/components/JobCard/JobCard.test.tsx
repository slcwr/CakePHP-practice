import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JobCard } from "./JobCard";
import { jobs } from "@/features/jobs/fixtures";

describe("JobCard", () => {
  const job = jobs[0];

  it("求人の主要情報と詳細リンクを表示する", () => {
    render(<JobCard job={job} />);
    expect(screen.getByRole("link", { name: job.title })).toHaveAttribute(
      "href",
      `/jobs/${job.id}`,
    );
    expect(screen.getByText(job.company)).toBeInTheDocument();
    expect(screen.getByText("550万円〜850万円")).toBeInTheDocument();
    expect(screen.getByText("フルリモート可")).toBeInTheDocument();
    for (const skill of job.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("リモート不可の求人にはバッジを出さない", () => {
    render(<JobCard job={{ ...job, remote: false }} />);
    expect(screen.queryByText("フルリモート可")).not.toBeInTheDocument();
  });
});
