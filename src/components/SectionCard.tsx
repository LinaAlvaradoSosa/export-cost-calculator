import { ReactNode } from "react";

interface SectionCardProps {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <div className="section-card">
      <h3 className="section-title">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}
