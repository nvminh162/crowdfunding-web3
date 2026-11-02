import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "h-fit w-full border border-ink-200 bg-white/70 p-5 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
