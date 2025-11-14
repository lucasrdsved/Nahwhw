
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactElement; // Expect a Lucide icon component e.g. <Users />
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-dark-card/50 backdrop-blur-md border border-dark-border rounded-2xl p-6 flex flex-col justify-between hover:border-gray-500/50 transition-all duration-300">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-dark-text-secondary">{title}</span>
        <div className={`${colorClass} p-2 rounded-lg`}>
          {React.cloneElement(icon, { className: 'w-5 h-5 text-white' })}
        </div>
      </div>
      <p className="text-4xl font-bold mt-4">{value}</p>
    </div>
  );
};

export default DashboardCard;
