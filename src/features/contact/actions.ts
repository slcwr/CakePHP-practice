"use server";

import { z } from "zod";
import { createContact } from "@/features/contact/api/contacts";

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

  try {
    const result = await createContact({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      jobId: parsed.data.jobId,
    });

    // サーバー側の検証で弾かれた場合（フロントの zod より厳しい条件があり得る）
    if (!result.ok) {
      const errors: Partial<Record<Fields, string>> = {};
      for (const field of ["name", "email", "message"] as const) {
        const message = result.errors[field];
        if (message) errors[field] = message;
      }
      return { status: "error", errors, values: raw };
    }
  } catch {
    return {
      status: "error",
      errors: { message: "送信に失敗しました。時間をおいて再度お試しください。" },
      values: raw,
    };
  }

  return {
    status: "success",
    message: `${parsed.data.name}様、お問い合わせありがとうございました。`,
  };
}
