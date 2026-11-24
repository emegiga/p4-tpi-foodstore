import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-lg bg-white p-4 shadow ${className}`}>{children}</div>;
}

export default Card;