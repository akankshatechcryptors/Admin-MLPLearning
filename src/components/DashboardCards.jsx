import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ title, subtitle, icon, bgColor, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate(path)}
      className={`rounded-xl shadow-md p-6 cursor-pointer w-full sm:w-[350px] min-h-[150px] ${bgColor} text-black transition`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm">{subtitle}</p>
    </motion.div>
  );
};

export default DashboardCard;
