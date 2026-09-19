"use server";

import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(50, "50文字以内で入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  message: z.string().trim().max(1000, "1000文字以内で入力してください"),
  jobId: z.string().optional(),
});

type Fields = "name" | "email" | "message";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      errors: Partial<Record<Fields, string>>;
      values: Partial<Record<Fields, string>>;
    };

/** useActionState から呼ばれる Server Action */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    jobId: formData.get("jobId")?.toString() || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<Fields, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Fields;
      errors[key] ??= issue.message;
    }
    return { status: "error", errors, values: raw };
  }

  // 実案件ではここでバックエンド API に POST する
  await new Promise((r) => setTimeout(r, 800));
  console.log("[contact] received", parsed.data);

  return {
    status: "success",
    message: `${parsed.data.name}様、お問い合わせありがとうございました。`,
  };
}
