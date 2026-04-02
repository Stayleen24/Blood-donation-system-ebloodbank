import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, delay = 0 }: StatCardProps) => {
  return (
    <div
      className="flex flex-col items-center p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary mb-3">
        <Icon className="h-7 w-7 text-secondary-foreground" />
      </div>
      <span className="text-3xl font-heading font-bold text-primary">{value}</span>
      <span className="text-sm text-muted-foreground mt-1 text-center">{label}</span>
    </div>
  );
};

export default StatCard;
