import React from "react";

interface LeftSectionProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const LeftSection: React.FC<LeftSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-[#4c2200] to-primary p-4 sm:p-6 lg:p-10 flex flex-col justify-center items-center text-white relative order-1 lg:order-1 lg:min-h-0 min-h-[200px]">
      <div className="lg:absolute lg:top-10 lg:left-10 mb-2 lg:mb-0">
        <div className="flex items-center gap-3 text-base lg:text-xl font-semibold">
          <span>Seraphic</span>
        </div>
      </div>

      <div className="text-center max-w-xs sm:max-w-md w-full">
        <h1 className="text-lg lg:text-4xl md:text-3xl font-bold mb-2 lg:mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm lg:text-base opacity-80 lg:mb-10 leading-relaxed px-1 lg:px-0">
          {description}
        </p>

        {children}
      </div>
    </div>
  );
};

export default LeftSection;