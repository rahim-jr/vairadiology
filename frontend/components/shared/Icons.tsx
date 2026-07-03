import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "activity"
  | "calendar"
  | "checkCircle"
  | "clipboard"
  | "clock"
  | "drag"
  | "image"
  | "layers"
  | "lock"
  | "polygon"
  | "spark"
  | "target"
  | "upload";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

const paths: Record<IconName, ReactNode> = {
  activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />,
  calendar: (
    <>
      <path d="M8 3v4M16 3v4M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 13h2M14 13h2M8 17h2M14 17h2" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.2 2.2 4.8-5.4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="16" rx="3" />
      <path d="M9 5.5A3 3 0 0 1 12 3a3 3 0 0 1 3 2.5V7H9V5.5ZM9 12h6M9 16h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  drag: (
    <>
      <path
        d="M8 5h.01M8 12h.01M8 19h.01M16 5h.01M16 12h.01M16 19h.01"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m6 17 4.2-4.2a1.4 1.4 0 0 1 2 0L14 14.6l1.2-1.2a1.4 1.4 0 0 1 2 0L20 16.2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" />
    </>
  ),
  polygon: (
    <>
      <path d="M7 5h10l4 7-4 7H7l-4-7 4-7Z" />
      <circle cx="7" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="21" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="7" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2l1.5 6.2L20 10l-6.5 1.8L12 18l-1.5-6.2L4 10l6.5-1.8L12 2Z" />
      <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 16v2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2" />
    </>
  ),
};

export function Icon({ name, size = 18, className, ...props }: Props) {
  return (
    <svg
      aria-hidden="true"
      className={className ? `icon ${className}` : "icon"}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
