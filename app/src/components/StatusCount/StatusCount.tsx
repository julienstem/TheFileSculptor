import type { ConversionStatus } from "../../types/Conversion";
import "./StatusCount.css";

interface StatusCountProps {
  count: number;
  status: ConversionStatus;
}

export default function StatusCount({ count, status }: StatusCountProps) {
  return (
    <div className={`status-count status-badge status-badge--${status}`}>
      <span className="status-count__number status-badge__label">{count}</span>
    </div>
  );
}
