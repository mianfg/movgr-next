type LineBadgeProps = {
  id: string;
  color?: string;
  textColor?: string;
  size?: "sm" | "md";
};

export function LineBadge({ id, color, textColor, size = "md" }: LineBadgeProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-border`}
      style={{
        backgroundColor: color ? `#${color}` : "hsl(var(--muted))",
        color: textColor ? `#${textColor}` : "hsl(var(--muted-foreground))",
      }}
    >
      {id}
    </div>
  );
}
