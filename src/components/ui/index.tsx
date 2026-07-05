import Link from "next/link";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

const variants = {
  primary:  "bg-gold text-navy hover:bg-gold-light font-semibold shadow-sm hover:shadow-md",
  secondary:"bg-navy text-white hover:bg-navy-light font-semibold shadow-sm hover:shadow-md",
  outline:  "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  ghost:    "text-navy hover:bg-gray-100",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg tracking-wide",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function SectionHeading({
  subtitle,
  title,
  description,
  centered = true,
  serif = false,
}: {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  serif?: boolean;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center")}>
      {subtitle && (
        <>
          <p className="label-eyebrow mb-3">{subtitle}</p>
          <div className={cn("divider-gold mb-4", centered && "mx-auto block")} />
        </>
      )}
      {serif ? (
        <h2 className={cn("text-serif-xl text-navy font-serif", centered && "mx-auto")}>
          {title}
        </h2>
      ) : (
        <h2 className="font-display text-display text-navy">{title}</h2>
      )}
      {description && (
        <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "gold" | "navy";
  className?: string;
}) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    gold: "bg-gold/10 text-gold border border-gold/20",
    navy: "bg-navy/10 text-navy border border-navy/20",
  };

  return (
    <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}

export function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-800">{label}</label>}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold",
          "transition-colors placeholder:text-gray-400",
          error && "border-red-400"
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-800">{label}</label>}
      <textarea
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white resize-none",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold",
          "transition-colors placeholder:text-gray-400",
          error && "border-red-400"
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-800">{label}</label>}
      <select
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold",
          error && "border-red-400"
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
