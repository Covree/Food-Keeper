import { statusTone } from "../../utils/formatters";
import "./Badge.css";

export function Badge({ label, tone }) {
  const resolvedTone = tone || statusTone(label);
  return <span className={`badge badge--${resolvedTone}`}>{label}</span>;
}
