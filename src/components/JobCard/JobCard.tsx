import Link from "next/link";
import type { Job } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";
import { formatSalary } from "@/lib/format";
import { SkillTag } from "@/components/SkillTag/SkillTag";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import styles from "./JobCard.module.css";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <SkillTag label={JOB_CATEGORIES[job.category]} variant="highlight" />
        {job.remote && <SkillTag label="フルリモート可" variant="highlight" />}
        <time className={styles.date} dateTime={job.publishedAt}>
          {job.publishedAt}
        </time>
      </div>
      <h3 className={styles.title}>
        <Link href={`/jobs/${job.id}`} className={styles.link}>
          {job.title}
        </Link>
      </h3>
      <p className={styles.company}>{job.company}</p>
      <dl className={styles.detail}>
        <div>
          <dt>年収</dt>
          <dd>{formatSalary(job.salaryMin, job.salaryMax)}</dd>
        </div>
        <div>
          <dt>勤務地</dt>
          <dd>{job.location}</dd>
        </div>
      </dl>
      <ul className={styles.skills} aria-label="スキル">
        {job.skills.map((skill) => (
          <li key={skill}>
            <SkillTag label={skill} />
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <FavoriteButton jobId={job.id} size="sm" />
      </div>
    </article>
  );
}
