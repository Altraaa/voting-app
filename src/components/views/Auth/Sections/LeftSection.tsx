import { Card, CardContent } from "@/components/ui/card";
import { LeftSectionProps, StatItemProps } from "@/components/props/AuthProps";

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

const LeftSection: React.FC<LeftSectionProps> = ({ title, description }) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-black to-gray-800 p-4 sm:p-6 lg:p-10 flex flex-col justify-center items-center text-white relative order-1 lg:order-1 lg:min-h-0 min-h-[200px]">
      <div className="lg:absolute lg:top-10 lg:left-10 mb-2 lg:mb-0">
        <div className="flex items-center gap-3 text-base lg:text-xl font-semibold">
          <span>Exito</span>
        </div>
      </div>

      <div className="text-center max-w-xs sm:max-w-md w-full lg:block">
        <h1 className="text-lg lg:text-4xl md:text-3xl font-bold mb-2 lg:mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm lg:text-base opacity-80 lg:mb-10 leading-relaxed px-1 lg:px-0 lg:block">
          {description}
        </p>

        <div className="hidden lg:grid grid-cols-2 gap-5 w-full max-w-sm mx-auto sm:hidden">
          <StatItem number="25,847" label="Registered Voters" />
          <StatItem number="1,234" label="Active Polls" />
          <StatItem number="89%" label="Participation Rate" />
          <StatItem number="24/7" label="Platform Uptime" />
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
