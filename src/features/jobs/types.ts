export const JOB_CATEGORIES = {
  engineer: "エンジニア",
  creator: "クリエイター",
  game: "ゲーム",
  marketing: "マーケティング",
} as const;

export type JobCategory = keyof typeof JOB_CATEGORIES;

export type Job = {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  location: string;
  remote: boolean;
  /** 年収（万円） */
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  description: string;
  publishedAt: string;
};

export type JobSearchParams = {
  keyword?: string;
  category?: JobCategory;
  remote?: boolean;
  page?: number;
};

export type JobSearchResult = {
  items: Job[];
  total: number;
  page: number;
  totalPages: number;
};
