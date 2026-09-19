import styles from "./SkillTag.module.css";

type Props = {
  label: string;
  variant?: "default" | "highlight";
};

export function SkillTag({ label, variant = "default" }: Props) {
  return <span className={`${styles.tag} ${styles[variant]}`}>{label}</span>;
}
