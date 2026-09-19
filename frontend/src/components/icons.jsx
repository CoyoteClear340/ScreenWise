// Minimal inline icon set (stroke-based, inherits currentColor) — avoids an icon-library dependency.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export function SparkleIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
    </svg>
  );
}

export function ChartIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </svg>
  );
}

export function ShieldIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

export function DeviceIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function HeartPulseIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 12h4l2-5 3 10 2-7 1.5 2H21" />
      <path d="M12 20.5C6 17 3 13.4 3 9.8 3 7.1 5.1 5 7.7 5c1.5 0 2.9.8 3.8 2 .9-1.2 2.3-2 3.8-2C17.9 5 20 7.1 20 9.8c0 3.6-3 7.2-8 10.7z" />
    </svg>
  );
}

export function MoonIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export function ActivityIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M22 12h-4l-3 8-6-16-3 8H2" />
    </svg>
  );
}

export function UsersIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      <path d="M16 6.2c1.7.4 3 1.9 3 3.8s-1.3 3.4-3 3.8" />
      <path d="M22 20c0-2.6-2-4.8-4.8-5.6" />
    </svg>
  );
}

export function ArrowRightIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckCircleIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5.1" />
    </svg>
  );
}

export function AlertIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v4M12 17.5v.01" />
    </svg>
  );
}

export function TrendIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
    </svg>
  );
}

export function LockIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DownloadIcon({ className }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}
