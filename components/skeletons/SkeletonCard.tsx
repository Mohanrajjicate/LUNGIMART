import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="group block bg-white rounded-xl overflow-hidden">
      <div className="relative overflow-hidden pt-[100%] bg-slate-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
        <div className="mt-3 flex items-center justify-between">
            <div className="h-7 bg-slate-200 rounded w-1/3 animate-pulse"></div>
            <div className="w-9 h-9 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;