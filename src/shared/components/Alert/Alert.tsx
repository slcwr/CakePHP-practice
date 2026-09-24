import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

/** variant ごとのアイコン。fill="currentColor" なので色は CSS から与える */
const icons: Record<AlertVariant, React.ReactElement> = {
  info: (
    <path d="M10 1.667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 10 1.667Zm.833 12.5H9.167V9.167h1.666v5Zm0-6.667H9.167V5.833h1.666V7.5Z" />
  ),
  success: (
    <path d="M10 1.667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 10 1.667Zm-1.667 12.5L4.167 10l1.175-1.175 2.991 2.983 6.325-6.325 1.175 1.184-7.5 7.5Z" />
  ),
  warning: (
    <path d="M.833 17.5h18.334L10 1.667.833 17.5Zm10-2.5H9.167v-1.667h1.666V15Zm0-3.333H9.167V8.333h1.666v3.334Z" />
  ),
  error: (
    <path d="M10 1.667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 10 1.667Zm.833 12.5H9.167V12.5h1.666v1.667Zm0-3.334H9.167v-5h1.666v5Z" />
  ),
};

type Props = {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  /** 「再試行する」などのリンクやボタン */
  action?: React.ReactNode;
};

export function Alert({ variant = "info", title, children, action }: Props) {
  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      // エラーはすぐ読み上げ、それ以外は他の読み上げの区切りを待つ
      role={variant === "error" ? "alert" : "status"}
    >
      <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        {icons[variant]}
      </svg>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <p className={styles.desc}>{children}</p>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
