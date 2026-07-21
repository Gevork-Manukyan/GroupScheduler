export default function BrandMark({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* A punch card with four holes. Three sit dark; the one where every
          card in the stack lines up is lit. */}
      <rect
        x="0.75"
        y="0.75"
        width="24.5"
        height="24.5"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="5.5" y="6" width="5" height="5" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="15.5" y="6" width="5" height="5" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="5.5" y="15" width="5" height="5" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="15.5" y="15" width="5" height="5" rx="1" fill="#ffc24b" />
    </svg>
  );
}
