import { type SVGProps } from "react";

export function CashAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.23.06a4.5 4.5 0 0 0-3.18 7.68 4.5 4.5 0 0 0-7.68 3.18 4.5 4.5 0 0 0 3.18 7.68 4.5 4.5 0 0 0 7.68-3.18 4.5 4.5 0 0 0-3.18-7.68 4.5 4.5 0 0 0 3.18-7.68z" />
      <path d="M12 14.49a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" />
      <path d="M12 6.74v-1.5M12 18.74v-1.5M17.25 11.99h1.5M5.25 11.99h1.5" />
    </svg>
  );
}
