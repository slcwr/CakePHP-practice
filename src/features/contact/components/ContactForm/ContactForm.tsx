"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/features/contact/actions";
import styles from "./ContactForm.module.css";

const initialState: ContactState = { status: "idle" };

export function ContactForm({ jobId }: { jobId?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <p role="status" className={styles.success}>
        {state.message}
      </p>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} className={styles.form} noValidate>
      {jobId && <input type="hidden" name="jobId" value={jobId} />}

      <div className={styles.field}>
        <label htmlFor="name">お名前（必須）</label>
        <input
          id="name"
          name="name"
          defaultValue={values.name}
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
        />
        {errors.name && (
          <p id="name-error" className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">メールアドレス（必須）</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={values.email}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">ご相談内容</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values.message}
          aria-invalid={!!errors.message}
          aria-describedby="message-error"
        />
        {errors.message && (
          <p id="message-error" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
