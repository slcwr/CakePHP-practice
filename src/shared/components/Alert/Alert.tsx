import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

type Props = {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function Alert({ variant = "info", title, children, action }: Props) {
  return (
    <div
    className={`${styles.alert} ${styles[variant]}`}
    role={variant === "error" ? "alert" : "status"}
    >
         {/* アイコンは後回しでよい */}
        <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <p>{children}</p>
        {action}
    </div>
    </div>
  );
}
