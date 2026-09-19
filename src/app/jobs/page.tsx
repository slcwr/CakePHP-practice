import type { Metadata } from "next";
import { searchJobs } from "@/lib/jobs";
import { buildJobsUrl, parseJobSearchParams } from "@/lib/search-params";
import { JobCard } from "@/components/JobCard/JobCard";
import { JobSearchForm } from "@/components/JobSearchForm/JobSearchForm";
import { Pagination } from "@/components/Pagination/Pagination";

export const metadata: Metadata = {
  title: "求人一覧",
};

// searchParams を読むのでリクエストごとに SSR（動的レンダリング）になる
export default async function JobsPage({ searchParams }: PageProps<"/jobs">) {
  const params = parseJobSearchParams(await searchParams);
  const result = await searchJobs(params);

  return (
    <div className="container">
      <h1 className="pageTitle">求人一覧</h1>
      {/* key を変えて、URL が変わったときにフォームの defaultValue を反映させる */}
      <JobSearchForm key={JSON.stringify(params)} defaultValues={params} />

      <p className="muted" style={{ margin: "20px 0 12px" }} aria-live="polite">
        {result.total}件中 {result.items.length}件を表示
      </p>

      {result.items.length === 0 ? (
        <p>条件に合う求人が見つかりませんでした。</p>
      ) : (
        <ul className="stack">
          {result.items.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        current={result.page}
        totalPages={result.totalPages}
        hrefFor={(page) => buildJobsUrl(params, page)}
      />
    </div>
  );
}
