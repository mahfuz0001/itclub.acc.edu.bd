"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CTAProps {
  badge?: {
    text: string;
  };
  title: string;
  description?: string;
  action: {
    text: string;
    href: string;
    variant?: "default" | "glow";
  };
  withGlow?: boolean;
  className?: string;
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
}: CTAProps) {
  return (
    <section className={cn("pt-0 mb-16 md:pt-0", className)}>
      <div className="relative mx-auto flex max-w-container flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24">
        {/* Badge */}
        {badge && (
          <Badge
            variant="outline"
            className="opacity-0 animate-fade-in-up delay-100 border-green-400 text-green-300"
          >
            <span>{badge.text}</span>
          </Badge>
        )}

        {/* Title */}
        <h2 className="text-3xl font-semibold sm:text-5xl text-green-200 opacity-0 animate-fade-in-up delay-200">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-green-100/80 opacity-0 animate-fade-in-up delay-300">
            {description}
          </p>
        )}

        {/* Action Button */}
        <Button
          variant={action.variant === "glow" ? "default" : action.variant}
          size="lg"
          className={cn(
            "opacity-0 animate-fade-in-up delay-500",
            action.variant === "glow" &&
              "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_4px_rgba(34,197,94,0.6)]"
          )}
          asChild
        >
          <a href={action.href}>{action.text}</a>
        </Button>

        {/* Glow Effect */}
        {withGlow && (
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 animate-scale-in delay-700 shadow-[0_0_50px_10px_rgba(34,197,94,0.35)]" />
        )}
      </div>
    </section>
  );
}
