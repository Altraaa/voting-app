import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LeftSection from "../views/Auth/Sections/LeftSection";

interface StatItemProps {
  number: string;
  label: string;
}

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showStats?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ number, label }) => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 cursor-pointer">
    <CardContent className="p-4">
      <div className="text-xl sm:text-2xl font-bold mb-1 text-white">
        {number}
      </div>
      <div className="text-xs opacity-70 uppercase tracking-wider text-white">
        {label}
      </div>
    </CardContent>
  </Card>
);

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  description,
  children,
  showStats = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-5">
      <div className="flex max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px] flex-col lg:flex-row">
        <LeftSection title={title} description={description}>
          {showStats && (
            <div className="hidden lg:grid grid-cols-2 gap-5 w-full max-w-sm mx-auto">
              <StatItem number="25,847" label="Registered Voters" />
              <StatItem number="1,234" label="Active Polls" />
              <StatItem number="89%" label="Participation Rate" />
              <StatItem number="24/7" label="Platform Uptime" />
            </div>
          )}
        </LeftSection>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;