import "server-only";
import { z } from "zod";

const API_URL = process.env.JOBS_API_URL ?? "http://localhost:8765";

export class ContactApiError extends Error {}

/** 受付に成功したときのレスポンス（個人情報は返ってこない） */
const contactSchema = z.object({
  id: z.string(),
  status: z.string(),
  created: z.string().nullable(),
});

/** 422 のときに返る、項目ごとのエラー。CakePHP の getErrors() の形 */
const validationErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.record(z.string(), z.string())),
});

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  jobId?: string;
};

export type ContactResult =
  | { ok: true }
  /** サーバー側の検証エラー。キーは name / email / message */
  | { ok: false; errors: Record<string, string> };

/**
 * お問い合わせを CakePHP に保存する。
 * 通信できない場合は ContactApiError を投げる（呼び出し側でメッセージに変える）。
 */
export async function createContact(input: ContactInput): Promise<ContactResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        message: input.message,
        job_id: input.jobId ?? null,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (cause) {
    throw new ContactApiError("お問い合わせ API に接続できません", { cause });
  }

  if (res.status === 422) {
    const parsed = validationErrorSchema.safeParse(await res.json());
    if (!parsed.success) {
      throw new ContactApiError("お問い合わせ API のエラー形式が想定と異なります");
    }
    // {"name": {"maxLength": "50文字以内で..."}} → {"name": "50文字以内で..."}
    const errors: Record<string, string> = {};
    for (const [field, rules] of Object.entries(parsed.data.errors)) {
      const first = Object.values(rules)[0];
      if (first) errors[field] = first;
    }
    return { ok: false, errors };
  }

  if (!res.ok) {
    throw new ContactApiError(`お問い合わせ API がエラーを返しました: ${res.status}`);
  }

  const parsed = contactSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new ContactApiError("お問い合わせ API のレスポンス形式が想定と異なります");
  }
  return { ok: true };
}
