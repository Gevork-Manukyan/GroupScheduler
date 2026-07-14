export default function BrandMark({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="brand-mark-gradient"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c26b16" />
          <stop offset="1" stopColor="#9a4f0d" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#brand-mark-gradient)" />
      <rect x="22" y="15" width="3.2" height="9" rx="1.6" fill="#7c3a08" />
      <rect x="38.8" y="15" width="3.2" height="9" rx="1.6" fill="#7c3a08" />
      <rect x="14" y="20" width="36" height="30" rx="5" fill="#ffffff" />
      <path d="M14 25a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v4H14z" fill="#92400e" />
      <circle cx="21" cy="37" r="2.3" fill="#decfb7" />
      <circle cx="32" cy="37" r="2.3" fill="#decfb7" />
      <circle cx="43" cy="37" r="2.3" fill="#decfb7" />
      <circle cx="21" cy="45" r="2.3" fill="#decfb7" />
      <circle cx="32" cy="45" r="2.3" fill="#136f3a" />
      <circle cx="43" cy="45" r="2.3" fill="#136f3a" />
    </svg>
  );
}
