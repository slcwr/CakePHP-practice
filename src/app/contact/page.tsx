import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { getJob } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "無料転職相談",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { jobId } = await searchParams;
  const id = typeof jobId === "string" ? jobId : undefined;
  const job = id ? await getJob(id) : undefined;

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1 className="pageTitle">無料転職相談</h1>
      {job && (
        <p className="muted" style={{ marginBottom: 16 }}>
          対象求人：{job.title}（{job.company}）
        </p>
      )}
      <ContactForm jobId={job?.id} />
    </div>
  );
}
