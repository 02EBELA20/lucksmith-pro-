"use client";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function CallButton({
  href,
  children,
  className = "btn btn-primary",
}: Props) {
  function handleClick() {
    try {
      (window as any).gtag?.("event", "click_call", { value: 1 });
    } catch {}
  }
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
