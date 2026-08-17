import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"section"> & {
  shadow?: "card" | "pop";
};

export function Card({ className, shadow = "card", ...props }: CardProps) {
  return <section className={cn("rounded-lg border border-line bg-card shadow-card", shadow === "pop" && "shadow-pop", className)} {...props} />;
}
