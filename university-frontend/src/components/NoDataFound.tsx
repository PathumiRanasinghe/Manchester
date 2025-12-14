import React from 'react';

interface NoDataFoundProps {
  message?: string;
  subtext?: string;
  className?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  message = 'No Data Found',
  subtext = 'There is no data to show you right now',
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center mt-16 text-center ${className}`}>
    <img src="/no-data-found.png" alt="No Data Found" className="w-60 h-48 mb-4 opacity-80" />
    <div className="text-xl font-semibold text-gray-500 mb-2">{message}</div>
    <div className="text-gray-400">{subtext}</div>
  </div>
);

export default NoDataFound;
