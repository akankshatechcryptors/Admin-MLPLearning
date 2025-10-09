import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, subtitle, icon, bgColor, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate(path)}
      className={`
        rounded-xl shadow-md p-4 sm:p-6 cursor-pointer 
        w-full xs:w-[250px] sm:w-[320px] md:w-[350px] lg:w-[400px] 
        min-h-[140px] sm:min-h-[160px] md:min-h-[180px] 
        ${bgColor} text-black transition
      `}
    >
      {/* Icon */}
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        {title}
      </h3>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm md:text-base lg:text-lg">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default DashboardCard;
