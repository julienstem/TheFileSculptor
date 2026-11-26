import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  LuClock,
  LuLoader,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import "./ConversionStatusBadge.css";
import type { ConversionStatus } from "../../types/Conversion";

interface ConversionStatusBadgeProps {
  status: ConversionStatus;
}

const STATUS_CONFIG: Record<
  ConversionStatus,
  {
    icon: ReactNode;
    labelKey: string;
    fallback: string;
  }
> = {
  pending: {
    icon: <LuClock aria-hidden="true" />,
    labelKey: "status.pending",
    fallback: "En attente",
  },
  converting: {
    icon: <LuLoader className="status-badge__spinner" aria-hidden="true" />,
    labelKey: "status.converting",
    fallback: "Conversion...",
  },
  completed: {
    icon: <LuCircleCheck aria-hidden="true" />,
    labelKey: "status.completed",
    fallback: "Terminé",
  },
  failed: {
    icon: <LuCircleAlert aria-hidden="true" />,
    labelKey: "status.failed",
    fallback: "Échec",
  },
};

export function ConversionStatusBadge({ status }: ConversionStatusBadgeProps) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];

  return (
    <span className={`status-badge status-badge--${status}`} role="status">
      <span className="status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">
        {t(`conversionStatusBadge.${status}`, {
          defaultValue: config.fallback,
        })}
      </span>
    </span>
  );
}
