import { cn } from "../lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const Button = ({
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-none",
        "bg-ink-900 px-5 py-2.5 text-sm font-medium tracking-wide text-white",
        "transition-all duration-300 hover:bg-ink-700 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "before:absolute before:inset-0 before:translate-x-[-120%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-[120%]",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
